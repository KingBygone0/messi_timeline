// Scheduled researcher: finds genuinely new Messi milestones via the Claude API
// (with server-side web search), then appends only valid, de-duplicated events to
// js/data.js. Designed to run unattended in CI — every safety check is deterministic
// code, not a judgment call, so a bad model response cannot corrupt the timeline.
//
// Env:
//   ANTHROPIC_API_KEY   (required)
//   ANTHROPIC_MODEL     (optional, default claude-sonnet-4-6)

import Anthropic from '@anthropic-ai/sdk';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(__dirname, '..', 'js', 'data.js');

const ERAS = new Set(['barca', 'psg', 'miami', 'argentina']);
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const TWEET_URL = /^https:\/\/(x|twitter)\.com\/[^/]+\/status\/\d+/i;
const INSTAGRAM_URL = /^https:\/\/(www\.)?instagram\.com\/(p|reel)\/[A-Za-z0-9_-]+/i;

// ── Load existing events ────────────────────────────────────────────────────────

const { EVENTS } = await import(pathToFileURL(DATA_PATH).href);
const existingIds = new Set(EVENTS.map(e => e.id));
const existingTitles = new Set(EVENTS.map(e => e.title.toLowerCase().trim()));
const latest = [...EVENTS].sort((a, b) => a.year - b.year).at(-1);
const today = new Date().toISOString().slice(0, 10);

// ── Ask Claude (with web search) for new milestones ─────────────────────────────

const client = new Anthropic(); // reads ANTHROPIC_API_KEY

const system = [
  {
    type: 'text',
    text:
      'You maintain a factual timeline of Lionel Messi\'s career. You only report ' +
      'milestones you can confirm via web search. You never invent video IDs, tweet ' +
      'URLs, or Instagram URLs — if you cannot find a real one, you leave that field "".',
    cache_control: { type: 'ephemeral' },
  },
];

const prompt = `Today is ${today}. The most recent milestone already in the timeline is:
"${latest.title}" (${latest.date}, ${latest.year}).

Existing event ids (do NOT duplicate any of these):
${[...existingIds].join(', ')}

Use web search to find any GENUINELY NEW major Messi milestones that have happened
AFTER the most recent one above and are not already listed. "Major" means: a trophy
won, an individual award (Ballon d'Or, MVP, Golden Boot), a record broken, a major
final, a retirement/transfer, or a historic individual moment. Routine league goals
do NOT count.

For EACH new milestone, output an object with these exact fields:
- id: unique kebab-case slug ending in the year, e.g. "some-event-2027"
- year: number
- date: human string, e.g. "14 Jul 2027"
- era: one of "barca" | "psg" | "miami" | "argentina"
- title: short headline
- description: 1-3 sentences
- youtubeId: a real 11-char YouTube video id you verified, else ""
- youtubeSearch: search terms (always filled)
- tweetUrl: a real full tweet/status URL you verified, else ""
- xSearch: search terms (always filled)
- instagramUrl: a real full instagram.com/p/... URL you verified, else ""
- instagramSearch: search terms (always filled)

Output ONLY the JSON array of new events between the markers below, nothing else.
If there are no new milestones, output an empty array [].

<<<JSON>>>
[ ... ]
<<<END>>>`;

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY is not set. Add it as a repo secret named ANTHROPIC_API_KEY.');
  process.exit(1);
}

let res;
try {
  res = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system,
    tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 8 }],
    messages: [{ role: 'user', content: prompt }],
  });
} catch (err) {
  const status = err?.status;
  let hint = '';
  const msg = err?.message || '';
  if (/credit balance|too low|billing|purchase credits/i.test(msg)) hint = 'No API credits. Go to console.anthropic.com -> Plans & Billing and add credits/a payment method. The API is pay-as-you-go and separate from any Claude.ai subscription.';
  else if (status === 401) hint = 'The API key is invalid or revoked. Create a new key at console.anthropic.com and update the ANTHROPIC_API_KEY secret.';
  else if (status === 403) hint = 'Access forbidden — usually no API credits. Add credits at console.anthropic.com -> Billing (the API is separate from a Claude.ai subscription).';
  else if (status === 400 && /web_search|tool/i.test(msg)) hint = 'The web_search tool was rejected. Your account may not have web search enabled, or the tool version string needs updating.';
  else if (status === 404 && /model/i.test(err?.message || '')) hint = `The model "${MODEL}" was not found. Set the ANTHROPIC_MODEL env in the workflow to a valid id.`;
  else hint = 'Unexpected API error. See the message above.';
  console.error(`API call failed (HTTP ${status ?? '?'}): ${err?.message ?? err}`);
  console.error(`HINT: ${hint}`);
  process.exit(1);
}

const text = res.content
  .filter(b => b.type === 'text')
  .map(b => b.text)
  .join('\n');

// ── Extract + parse the JSON payload ────────────────────────────────────────────

const match = text.match(/<<<JSON>>>([\s\S]*?)<<<END>>>/);
if (!match) {
  console.log('No JSON block returned; nothing to do.');
  process.exit(0);
}

let proposed;
try {
  proposed = JSON.parse(match[1].trim());
} catch (err) {
  console.error('Could not parse model JSON; aborting without changes.', err.message);
  process.exit(0);
}
if (!Array.isArray(proposed) || proposed.length === 0) {
  console.log('No new milestones proposed.');
  process.exit(0);
}

// ── Validate + sanitize each proposed event ─────────────────────────────────────

const REQUIRED = ['id', 'year', 'date', 'era', 'title', 'description', 'youtubeSearch', 'xSearch', 'instagramSearch'];

function clean(ev) {
  for (const f of REQUIRED) {
    if (ev[f] === undefined || ev[f] === null || String(ev[f]).trim() === '') return null;
  }
  if (typeof ev.year !== 'number' || !ERAS.has(ev.era)) return null;
  if (existingIds.has(ev.id) || existingTitles.has(ev.title.toLowerCase().trim())) return null;

  // No fabrication: discard any media value that isn't a real, well-formed reference.
  const youtubeId    = YOUTUBE_ID.test(ev.youtubeId || '')        ? ev.youtubeId    : '';
  const tweetUrl     = TWEET_URL.test(ev.tweetUrl || '')          ? ev.tweetUrl     : '';
  const instagramUrl = INSTAGRAM_URL.test(ev.instagramUrl || '')  ? ev.instagramUrl : '';

  return {
    id: ev.id, year: ev.year, date: ev.date, era: ev.era,
    title: ev.title, description: ev.description,
    youtubeId, youtubeSearch: ev.youtubeSearch,
    tweetUrl, xSearch: ev.xSearch,
    instagramUrl, instagramSearch: ev.instagramSearch,
  };
}

const accepted = [];
for (const ev of proposed) {
  const c = clean(ev);
  if (!c) { console.log(`Skipped (invalid/duplicate): ${ev?.id ?? '<no id>'}`); continue; }
  accepted.push(c);
  existingIds.add(c.id);
  existingTitles.add(c.title.toLowerCase().trim());
}

if (accepted.length === 0) {
  console.log('Nothing valid to add after validation.');
  process.exit(0);
}

// ── Render each event as a JS object literal matching the file's style ───────────

const q = s => JSON.stringify(s); // safe, double-quoted JS string

function literal(e) {
  return `  {
    id: ${q(e.id)},
    year: ${e.year}, date: ${q(e.date)}, era: ${q(e.era)},
    title: ${q(e.title)},
    description: ${q(e.description)},
    youtubeId: ${q(e.youtubeId)}, youtubeSearch: ${q(e.youtubeSearch)},
    tweetUrl: ${q(e.tweetUrl)}, xSearch: ${q(e.xSearch)},
    instagramUrl: ${q(e.instagramUrl)}, instagramSearch: ${q(e.instagramSearch)}
  }`;
}

// ── Splice into js/data.js before the closing `];` (append-only) ─────────────────

const src = await readFile(DATA_PATH, 'utf8');
const closeIdx = src.lastIndexOf('\n];');
if (closeIdx === -1) {
  console.error('Could not locate end of EVENTS array; aborting.');
  process.exit(1);
}

const block = accepted.map(literal).join(',\n');
const updated = src.slice(0, closeIdx) + ',\n' + block + src.slice(closeIdx);

await writeFile(DATA_PATH, updated, 'utf8');
console.log(`Added ${accepted.length} new milestone(s): ${accepted.map(e => e.id).join(', ')}`);
