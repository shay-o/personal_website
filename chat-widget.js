// ═══════════════════════════════════════════════════════════════
// Chat Widget — Vanilla JS, no dependencies
// ═══════════════════════════════════════════════════════════════
// Reads configuration from window.ChatConfig (set in chat-data.js).
// Calls /api/chat (your Vercel serverless proxy).
// Injects itself into the page — just add the <script> tags.
// ═══════════════════════════════════════════════════════════════

(function () {
  'use strict';

  // ── Wait for ChatConfig ──
  function getConfig() {
    return window.ChatConfig || {
      SYSTEM_PROMPT: '',
      SUGGESTED_QUESTIONS: [],
      name: 'Chat',
      initials: '?',
      tagline: 'Ask me anything',
    };
  }

  // ── State ──
  let isOpen = false;
  let messages = []; // { role: 'user'|'assistant', content: string }
  let isLoading = false;
  let sessionId = null; // generated on first message, ties API calls into one conversation record

  // ── DOM refs ──
  let root, panel, messagesEl, inputEl, sendBtn, welcomeEl;

  // ── Inject Styles ──
  function injectStyles() {
    if (document.getElementById('chat-widget-styles')) return;
    const style = document.createElement('style');
    style.id = 'chat-widget-styles';
    style.textContent = `
      /* ── Bubble ── */
      .cw-bubble {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9998;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        animation: cw-fadeUp 0.4s ease both;
      }
      .cw-bubble-label {
        background: #111;
        color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
        font-size: 13px;
        font-weight: 600;
        padding: 8px 14px;
        border-radius: 6px;
        white-space: nowrap;
        box-shadow: 0 2px 12px rgba(0,0,0,0.12);
        animation: cw-slideIn 0.4s ease 0.8s both;
      }
      .cw-bubble-label::after {
        content: '';
        position: absolute;
        right: -5px;
        top: 50%;
        transform: translateY(-50%);
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-left: 5px solid #111;
      }
      .cw-bubble-btn {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        border: 1.5px solid #ddd;
        background: #111;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 16px rgba(0,0,0,0.12);
        transition: transform 0.15s ease, box-shadow 0.15s ease;
        flex-shrink: 0;
        cursor: pointer;
      }
      .cw-bubble-btn:hover {
        transform: scale(1.06);
        box-shadow: 0 4px 24px rgba(0,0,0,0.18);
      }
      .cw-bubble-btn:active { transform: scale(0.96); }

      @keyframes cw-fadeUp {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes cw-slideIn {
        from { opacity: 0; transform: translateX(8px); }
        to { opacity: 1; transform: translateX(0); }
      }

      /* ── Panel ── */
      .cw-panel {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 400px;
        max-width: calc(100vw - 32px);
        height: min(620px, calc(100vh - 48px));
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 12px;
        box-shadow: 0 12px 48px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
        animation: cw-panelIn 0.3s cubic-bezier(0.34, 1.4, 0.64, 1);
      }
      .cw-panel[hidden] { display: none; }
      @keyframes cw-panelIn {
        from { opacity: 0; transform: translateY(12px) scale(0.97); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      @media (max-width: 480px) {
        .cw-panel {
          inset: 0;
          width: 100%;
          max-width: 100%;
          height: 100%;
          border-radius: 0;
          border: none;
        }
      }

      /* ── Header ── */
      .cw-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        border-bottom: 1px solid #eee;
        flex-shrink: 0;
      }
      .cw-avatar {
        width: 38px;
        height: 38px;
        border-radius: 8px;
        background: #111;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0.02em;
        flex-shrink: 0;
      }
      .cw-header-text {
        flex: 1;
        min-width: 0;
      }
      .cw-header-name {
        font-size: 15px;
        font-weight: 700;
        color: #111;
        line-height: 1.2;
        letter-spacing: -0.01em;
      }
      .cw-header-sub {
        font-size: 12px;
        color: #888;
        line-height: 1.3;
      }
      .cw-close-btn {
        width: 30px;
        height: 30px;
        border: 1px solid #eee;
        border-radius: 6px;
        background: transparent;
        color: #999;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: border-color 0.15s, color 0.15s;
        flex-shrink: 0;
      }
      .cw-close-btn:hover { border-color: #ccc; color: #333; }

      /* ── Welcome ── */
      .cw-welcome {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 32px 24px;
        text-align: center;
      }
      .cw-welcome h3 {
        font-size: 18px;
        font-weight: 700;
        color: #111;
        margin: 0 0 6px;
        letter-spacing: -0.01em;
      }
      .cw-welcome p {
        font-size: 14px;
        color: #666;
        margin: 0 0 24px;
        line-height: 1.5;
        max-width: 260px;
      }
      .cw-suggestions {
        display: flex;
        flex-direction: column;
        gap: 6px;
        width: 100%;
        max-width: 280px;
      }
      .cw-suggest-btn {
        background: #fff;
        border: 1.5px solid #eee;
        border-radius: 8px;
        padding: 10px 14px;
        font-family: inherit;
        font-size: 13px;
        color: #333;
        cursor: pointer;
        text-align: left;
        transition: border-color 0.15s, background 0.15s;
        line-height: 1.35;
      }
      .cw-suggest-btn:hover {
        background: #f8f8f8;
        border-color: #ccc;
      }

      /* ── Messages ── */
      .cw-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .cw-messages::-webkit-scrollbar { width: 3px; }
      .cw-messages::-webkit-scrollbar-track { background: transparent; }
      .cw-messages::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }

      .cw-msg {
        display: flex;
        animation: cw-msgIn 0.25s ease;
      }
      .cw-msg-user { justify-content: flex-end; }

      @keyframes cw-msgIn {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .cw-msg-bubble {
        max-width: 82%;
        padding: 10px 14px;
        border-radius: 10px;
        font-size: 14px;
        line-height: 1.55;
        color: #222;
        word-wrap: break-word;
      }
      .cw-msg-assistant .cw-msg-bubble {
        background: #f5f5f5;
        border-bottom-left-radius: 3px;
      }
      .cw-msg-user .cw-msg-bubble {
        background: #111;
        color: #fff;
        border-bottom-right-radius: 3px;
      }
      .cw-msg-bubble a {
        color: inherit;
        text-decoration: underline;
        text-underline-offset: 2px;
      }
      .cw-msg-user .cw-msg-bubble a { color: #ccc; }

      /* ── Typing dots ── */
      .cw-typing {
        display: flex;
        gap: 4px;
        padding: 12px 14px;
        align-items: center;
      }
      .cw-typing-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #bbb;
        animation: cw-bounce 1.2s ease-in-out infinite;
      }
      .cw-typing-dot:nth-child(2) { animation-delay: 0.15s; }
      .cw-typing-dot:nth-child(3) { animation-delay: 0.3s; }
      @keyframes cw-bounce {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-5px); opacity: 1; }
      }

      /* ── Input ── */
      .cw-input-area {
        padding: 12px 16px 14px;
        border-top: 1px solid #eee;
        flex-shrink: 0;
      }
      .cw-input-row {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        border: 1.5px solid #ddd;
        border-radius: 8px;
        padding: 4px 4px 4px 14px;
        transition: border-color 0.15s;
      }
      .cw-input-row:focus-within { border-color: #999; }

      .cw-input {
        flex: 1;
        border: none;
        outline: none;
        background: transparent;
        font-family: inherit;
        font-size: 14px;
        color: #111;
        resize: none;
        padding: 8px 0;
        max-height: 80px;
        line-height: 1.45;
      }
      .cw-input::placeholder { color: #aaa; }

      .cw-send-btn {
        width: 32px;
        height: 32px;
        border-radius: 6px;
        border: none;
        background: #111;
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: opacity 0.15s;
      }
      .cw-send-btn:disabled { opacity: 0.25; cursor: default; }
      .cw-send-btn:not(:disabled):hover { opacity: 0.85; }

      .cw-footer {
        text-align: center;
        font-size: 11px;
        color: #aaa;
        margin-top: 8px;
      }
    `;
    document.head.appendChild(style);
  }

  // ── SVG Icons ──
  const ICONS = {
    chat: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    close: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    send: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
  };

  // ── Simple Markdown → HTML (links, bold, line breaks) ──
  function formatMessage(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Markdown links [text](url)
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      // Bold **text**
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Bare URLs
      .replace(/(^|[^"'])(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')
      // Line breaks
      .replace(/\n/g, '<br>');
  }

  // ── Build DOM ──
  function createWidget() {
    injectStyles();
    root = document.createElement('div');
    root.id = 'chat-widget-root';
    document.body.appendChild(root);
    renderBubble();
  }

  function renderBubble() {
    const config = getConfig();
    root.innerHTML = `
      <div class="cw-bubble" id="cw-bubble">
        <div class="cw-bubble-label">Chat with Shay's AI assistant</div>
        <div class="cw-bubble-btn" role="button" tabindex="0" aria-label="Open chat">
          ${ICONS.chat}
        </div>
      </div>
    `;
    const bubble = root.querySelector('#cw-bubble');
    bubble.addEventListener('click', openPanel);
    bubble.addEventListener('keydown', (e) => { if (e.key === 'Enter') openPanel(); });
  }

  function openPanel() {
    isOpen = true;
    const config = getConfig();
    root.innerHTML = `
      <div class="cw-panel" id="cw-panel">
        <div class="cw-header">
          <div class="cw-avatar">${config.initials}</div>
          <div class="cw-header-text">
            <div class="cw-header-name">${config.name}</div>
            <div class="cw-header-sub">${config.tagline}</div>
          </div>
          <button class="cw-close-btn" aria-label="Close chat">${ICONS.close}</button>
        </div>
        <div class="cw-welcome" id="cw-welcome">
          <h3>Hi there</h3>
          <p>I'm an AI that can answer questions about Shay's experience, skills, and projects. What would you like to know?</p>
          <div class="cw-suggestions" id="cw-suggestions"></div>
        </div>
        <div class="cw-messages" id="cw-messages" style="display:none;"></div>
        <div class="cw-input-area">
          <div class="cw-input-row">
            <textarea class="cw-input" id="cw-input" rows="1" placeholder="Ask about experience, skills, projects…"></textarea>
            <button class="cw-send-btn" id="cw-send" disabled aria-label="Send">${ICONS.send}</button>
          </div>
          <div class="cw-footer">Powered by AI · Based on Shay's provided info</div>
        </div>
      </div>
    `;

    // Wire up refs
    panel = root.querySelector('#cw-panel');
    messagesEl = root.querySelector('#cw-messages');
    welcomeEl = root.querySelector('#cw-welcome');
    inputEl = root.querySelector('#cw-input');
    sendBtn = root.querySelector('#cw-send');

    // Close button
    root.querySelector('.cw-close-btn').addEventListener('click', closePanel);

    // Suggested questions
    const sugEl = root.querySelector('#cw-suggestions');
    config.SUGGESTED_QUESTIONS.forEach((q) => {
      const btn = document.createElement('button');
      btn.className = 'cw-suggest-btn';
      btn.textContent = q;
      btn.addEventListener('click', () => sendMessage(q));
      sugEl.appendChild(btn);
    });

    // Input handling
    inputEl.addEventListener('input', () => {
      sendBtn.disabled = !inputEl.value.trim() || isLoading;
      // Auto-resize
      inputEl.style.height = 'auto';
      inputEl.style.height = Math.min(inputEl.scrollHeight, 80) + 'px';
    });
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(inputEl.value);
      }
    });
    sendBtn.addEventListener('click', () => sendMessage(inputEl.value));

    // Restore messages if returning to an open chat
    if (messages.length > 0) {
      welcomeEl.style.display = 'none';
      messagesEl.style.display = 'flex';
      messages.forEach((m) => appendBubble(m.role, m.content));
    }

    inputEl.focus();
  }

  function closePanel() {
    isOpen = false;
    renderBubble();
  }

  // ── Message Rendering ──
  function appendBubble(role, content) {
    const row = document.createElement('div');
    row.className = `cw-msg cw-msg-${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'cw-msg-bubble';
    bubble.innerHTML = formatMessage(content);
    row.appendChild(bubble);
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping() {
    const row = document.createElement('div');
    row.className = 'cw-msg cw-msg-assistant';
    row.id = 'cw-typing';
    row.innerHTML = `
      <div class="cw-msg-bubble cw-typing">
        <div class="cw-typing-dot"></div>
        <div class="cw-typing-dot"></div>
        <div class="cw-typing-dot"></div>
      </div>
    `;
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById('cw-typing');
    if (el) el.remove();
  }

  // ── Send Message ──
  async function sendMessage(text) {
    text = (text || '').trim();
    if (!text || isLoading) return;

    const config = getConfig();

    // Switch from welcome → messages view
    if (messages.length === 0) {
      welcomeEl.style.display = 'none';
      messagesEl.style.display = 'flex';
      // Generate a session ID for this conversation
      sessionId = Date.now().toString(36) + Math.random().toString(36).slice(2);
    }

    // Add user message
    messages.push({ role: 'user', content: text });
    appendBubble('user', text);
    inputEl.value = '';
    inputEl.style.height = 'auto';
    sendBtn.disabled = true;
    isLoading = true;

    showTyping();

    try {
      // Build the messages array for the API (system prompt is enforced server-side)
      const apiMessages = messages.map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, sessionId }),
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json();

      // OpenRouter returns OpenAI-compatible format
      const reply =
        data.choices?.[0]?.message?.content ||
        "Sorry, I wasn't able to generate a response. Please try again.";

      messages.push({ role: 'assistant', content: reply });
      hideTyping();
      appendBubble('assistant', reply);

    } catch (err) {
      console.error('Chat error:', err);
      hideTyping();
      const errMsg = "Something went wrong connecting to the AI. Please try again in a moment.";
      messages.push({ role: 'assistant', content: errMsg });
      appendBubble('assistant', errMsg);
    } finally {
      isLoading = false;
      sendBtn.disabled = !inputEl.value.trim();
    }
  }

  // ── Init ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }

})();
