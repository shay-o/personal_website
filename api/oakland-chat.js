// ═══════════════════════════════════════════════════════════════
// Vercel Serverless Function — Oakland Open Data Chat
// ═══════════════════════════════════════════════════════════════
// Demonstrates a third-party app consuming the Oakland MCP server.
// On each request:
//   1. Connects to the deployed Oakland MCP over streamable HTTP
//      (using @modelcontextprotocol/sdk).
//   2. Calls tools/list to discover available tools dynamically.
//   3. Runs an OpenRouter tool-calling loop, executing tools via
//      the MCP client.
//   4. Logs the full transcript to Airtable.
//
// Required Vercel env vars:
//   OPENROUTER_API_KEY          — OpenRouter key
//   OAKLAND_MCP_URL             — e.g. https://oakland-mcp.vercel.app/mcp
//   OAKLAND_MCP_TOKEN           — bearer token configured on the MCP server
//
// Optional:
//   OPENROUTER_MODEL            — default 'anthropic/claude-sonnet-4'
//   AIRTABLE_API_KEY, AIRTABLE_BASE_ID,
//   OAKLAND_AIRTABLE_TABLE_NAME — transcript logging
// ═══════════════════════════════════════════════════════════════

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const MAX_TOOL_ROUNDS = 10;
const MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-sonnet-4';

const SYSTEM_PROMPT = `You are an Oakland Open Data assistant embedded on Shay O'Reilly's personal portfolio site. You help visitors explore and analyze public government data from Oakland, California's open data portal (data.oaklandca.gov) using tools backed by an MCP server.

SCOPE:
- Answer ONLY questions that can be answered using the Oakland open-data tools.
- If asked about anything else (Shay's resume, general knowledge, other cities, opinions, etc.) gently redirect: "I can only answer questions about Oakland's open data. What would you like to know about Oakland?"

TOOL USAGE:
- If the conversation already established a dataset ID or column names, go straight to query_dataset. Do NOT re-search or re-fetch metadata you already have.
- Use search_datasets only when you need to discover a new dataset.
- Use get_dataset_info only when you need column names or types you haven't seen yet.
- Prefer a single well-targeted query_dataset call over multiple exploratory calls.

You have a maximum of ${MAX_TOOL_ROUNDS} tool-calling rounds per response. Plan your tool usage to answer the question well within that budget. If you are unsure, prioritize answering with the data you have over making additional calls.

Always explain what data you found and what it means. If a query returns no results, suggest alternative approaches. Be specific about data limitations (e.g., date ranges, missing fields). Keep responses concise but informative. Format data clearly when presenting results.`;

// ── MCP client: connect on each invocation (Vercel functions are short-lived) ──
async function connectMcp() {
  const url = process.env.OAKLAND_MCP_URL;
  const token = process.env.OAKLAND_MCP_TOKEN;
  if (!url) throw new Error('OAKLAND_MCP_URL not configured');
  if (!token) throw new Error('OAKLAND_MCP_TOKEN not configured');

  const transport = new StreamableHTTPClientTransport(new URL(url), {
    requestInit: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });
  const client = new Client(
    { name: 'oakland-chat-web', version: '1.0.0' },
    { capabilities: {} },
  );
  await client.connect(transport);
  return { client, transport };
}

// Convert MCP tool descriptors → OpenAI/OpenRouter tool format.
function toOpenAiTools(mcpTools) {
  return mcpTools.map((t) => ({
    type: 'function',
    function: {
      name: t.name,
      description: t.description || '',
      parameters: t.inputSchema || { type: 'object', properties: {} },
    },
  }));
}

// Extract a plain string from an MCP tool result's `content` array.
function mcpResultToText(result) {
  if (!result?.content?.length) return '';
  return result.content
    .map((c) => (c.type === 'text' ? c.text : JSON.stringify(c)))
    .join('\n');
}

async function callOpenRouter(apiKey, body) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://shayoreilly.net',
      'X-Title': "Shay O'Reilly Portfolio — Oakland Data Chat",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${text}`);
  }
  return res.json();
}

// ── Airtable transcript logging (mirrors api/chat.js) ──
async function logToAirtable(sessionId, userMessages, reply, toolCalls) {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, OAKLAND_AIRTABLE_TABLE_NAME } = process.env;
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !OAKLAND_AIRTABLE_TABLE_NAME) return;

  const allMessages = [...userMessages, { role: 'assistant', content: reply }];
  const transcript = allMessages
    .map((m) => `[${m.role === 'user' ? 'Visitor' : 'Oakland Data AI'}]\n${m.content}`)
    .join('\n\n');

  const toolSummary = toolCalls.length
    ? toolCalls
        .map((t, i) => `${i + 1}. ${t.tool}(${JSON.stringify(t.input)})`)
        .join('\n')
    : '(no tool calls)';

  const userTurns = userMessages.filter((m) => m.role === 'user');
  const firstQuestion = userTurns[0]?.content ?? '';

  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(OAKLAND_AIRTABLE_TABLE_NAME)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
      body: JSON.stringify({
        performUpsert: { fieldsToMergeOn: ['Session ID'] },
        records: [
          {
            fields: {
              'Session ID': sessionId,
              'First Question': firstQuestion.slice(0, 255),
              'Message Count': userTurns.length,
              'Last Updated': new Date().toISOString(),
              'Transcript': transcript,
              'Tool Calls': toolSummary,
            },
          },
        ],
      }),
    },
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable ${res.status}: ${body}`);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured' });

  const { messages: incoming, sessionId } = req.body || {};
  if (!Array.isArray(incoming)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const userMessages = incoming.filter((m) => m.role !== 'system');

  let mcp;
  try {
    mcp = await connectMcp();
  } catch (err) {
    console.error('MCP connect error:', err);
    return res.status(502).json({ error: `MCP connection failed: ${err.message}` });
  }

  const allToolCalls = [];

  try {
    const toolList = await mcp.client.listTools();
    const tools = toOpenAiTools(toolList.tools || []);

    const apiMessages = [{ role: 'system', content: SYSTEM_PROMPT }, ...userMessages];

    let finalText = null;

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const data = await callOpenRouter(apiKey, {
        model: MODEL,
        max_tokens: 4096,
        tools,
        messages: apiMessages,
      });

      const choice = data.choices?.[0];
      const msg = choice?.message;
      if (!msg) throw new Error('No message in OpenRouter response');

      // Tool-call branch
      if (choice.finish_reason === 'tool_calls' && msg.tool_calls?.length) {
        // Push the assistant message *with* its tool_calls so subsequent tool
        // messages reference valid tool_call_ids.
        apiMessages.push({
          role: 'assistant',
          content: msg.content || '',
          tool_calls: msg.tool_calls,
        });

        for (const call of msg.tool_calls) {
          const name = call.function?.name;
          let args = {};
          try {
            args = call.function?.arguments ? JSON.parse(call.function.arguments) : {};
          } catch (e) {
            args = {};
          }

          let resultText;
          try {
            const result = await mcp.client.callTool({ name, arguments: args });
            resultText = mcpResultToText(result);
          } catch (e) {
            resultText = `Error executing ${name}: ${e.message}`;
          }

          allToolCalls.push({
            tool: name,
            input: args,
            result: resultText.length > 500 ? resultText.slice(0, 500) + '...' : resultText,
          });

          apiMessages.push({
            role: 'tool',
            tool_call_id: call.id,
            content: resultText,
          });
        }
        continue;
      }

      // Final answer
      finalText = msg.content || '';
      break;
    }

    // Graceful fallback: loop exhausted without a final answer.
    if (finalText === null) {
      apiMessages.push({
        role: 'user',
        content:
          'You have used all available tool-calling rounds. Based on the data you have gathered so far, please provide the best answer you can. Do not attempt any more tool calls.',
      });
      const fallback = await callOpenRouter(apiKey, {
        model: MODEL,
        max_tokens: 4096,
        messages: apiMessages,
      });
      finalText = fallback.choices?.[0]?.message?.content || 'Sorry, no answer could be generated.';
    }

    if (sessionId) {
      await logToAirtable(sessionId, userMessages, finalText, allToolCalls).catch((err) =>
        console.error('Airtable logging error:', err),
      );
    }

    return res.status(200).json({
      reply: finalText,
      tool_calls: allToolCalls,
    });
  } catch (err) {
    console.error('Oakland chat error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  } finally {
    try {
      await mcp.client.close();
    } catch (_) {}
  }
}
