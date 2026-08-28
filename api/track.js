// ═══════════════════════════════════════════════════════════════
// Vercel Serverless Function — Page-view beacon
// ═══════════════════════════════════════════════════════════════
// Logs one Airtable record every time a tracked page is opened.
// Used by the unlinked outreach page (Propel_Jobs.html) so Shay can
// see when, and from where, someone follows a shared link.
//
// Reuses the chat widget's Airtable credentials:
//   AIRTABLE_API_KEY, AIRTABLE_BASE_ID   (already set in Vercel)
//   AIRTABLE_VISITS_TABLE_NAME           (optional; defaults below)
//
// Create an Airtable table (default name "Propel Visits") with these
// fields, all "Single line text" except User Agent = "Long text":
//   Timestamp · Page · Referrer · User Agent · Country · City · Region
// ═══════════════════════════════════════════════════════════════

const DEFAULT_TABLE = 'Propel Visits';

function firstHeader(req, name) {
  const v = req.headers[name];
  if (!v) return '';
  return Array.isArray(v) ? v[0] : v;
}

function safeDecode(s) {
  if (!s) return '';
  try { return decodeURIComponent(s); } catch (e) { return s; }
}

async function logVisit(fields) {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;
  const table = process.env.AIRTABLE_VISITS_TABLE_NAME || DEFAULT_TABLE;
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) return;

  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(table)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
      body: JSON.stringify({ records: [{ fields }] }),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable visits ${res.status}: ${body}`);
  }
}

export default async function handler(req, res) {
  // Accept POST (sendBeacon / fetch) and GET (pixel / manual test).
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Body may arrive parsed, as a string, or empty (sendBeacon Blob).
  let payload = {};
  try {
    if (typeof req.body === 'string' && req.body) payload = JSON.parse(req.body);
    else if (req.body && typeof req.body === 'object') payload = req.body;
  } catch (e) { /* ignore malformed body, still log the hit */ }

  // Where the visitor actually came from is only known client-side
  // (document.referrer); the request's own Referer header is the page
  // itself, so prefer the client-supplied value.
  const referrer = (payload.referrer || firstHeader(req, 'referer') || '').slice(0, 500);
  const page = (payload.page || firstHeader(req, 'referer') || 'Propel_Jobs').slice(0, 255);
  const userAgent = firstHeader(req, 'user-agent').slice(0, 500);

  const fields = {
    'Timestamp': new Date().toISOString(),
    'Page': page,
    'Referrer': referrer || '(none / direct)',
    'User Agent': userAgent,
    // Vercel adds coarse geo headers automatically. No raw IP is stored.
    'Country': firstHeader(req, 'x-vercel-ip-country'),
    'City': safeDecode(firstHeader(req, 'x-vercel-ip-city')),
    'Region': firstHeader(req, 'x-vercel-ip-country-region'),
  };

  try {
    await logVisit(fields);
  } catch (err) {
    console.error('Visit logging error:', err);
    // Never fail the beacon from the caller's perspective.
  }

  // 204: nothing to return, keep it cheap.
  return res.status(204).end();
}
