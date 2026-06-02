// Parses a "New Messi milestone" issue-form submission (passed as ISSUE_BODY) and
// appends a validated, de-duplicated event to js/data.js. No AI, no network — just
// deterministic parsing + the same safety checks as the scheduled updater.
//
// Outputs (to $GITHUB_OUTPUT): status=added|skipped, id=<slug>, message=<one line>

import { readFile, writeFile, appendFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(__dirname, '..', process.env.DATA_FILE || 'js/data.js');

const ERAS = { barcelona: 'barca', psg: 'psg', 'inter miami': 'miami', argentina: 'argentina' };
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const TWEET_URL = /^https:\/\/(x|twitter)\.com\/[^/]+\/status\/\d+/i;

async function setOutput(obj) {
  const line = Object.entries(obj).map(([k, v]) => `${k}=${v}`).join('\n') + '\n';
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, line);
  else console.log(line.trim());
}

function fail(message) {
  return setOutput({ status: 'skipped', id: '', message }).then(() => process.exit(0));
}

// ── Parse the issue-form body into { label -> value } ────────────────────────────

function parseBody(body) {
  const out = {};
  let key = null, buf = [];
  for (const raw of (body || '').split(/\r?\n/)) {
    const m = raw.match(/^###\s+(.+?)\s*$/);
    if (m) {
      if (key) out[key] = buf.join('\n').trim();
      key = m[1].toLowerCase();
      buf = [];
    } else if (key) {
      buf.push(raw);
    }
  }
  if (key) out[key] = buf.join('\n').trim();
  for (const k of Object.keys(out)) {
    if (out[k] === '_No response_' || out[k] === '_No response_'.toLowerCase()) out[k] = '';
  }
  return out;
}

function slug(s) {
  return s.toLowerCase().normalize('NFKD')
    .replace(/[^\w\s-]/g, '').trim()
    .replace(/[\s_]+/g, '-').replace(/-+/g, '-')
    .replace(/^-|-$/g, '').slice(0, 50);
}

// Accept a raw 11-char id, or extract it from a pasted YouTube URL.
function youtubeId(v) {
  v = (v || '').trim();
  if (!v) return '';
  if (YOUTUBE_ID.test(v)) return v;
  const m = v.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : '';
}

// ── Main ─────────────────────────────────────────────────────────────────────

const f = parseBody(process.env.ISSUE_BODY);

const year = parseInt(f['year'], 10);
const date = (f['date'] || '').trim();
const eraRaw = (f['era'] || '').trim().toLowerCase();
const title = (f['title'] || '').trim();
const description = (f['description'] || '').trim();

if (!Number.isInteger(year)) await fail(`Year "${f['year'] ?? ''}" is not a valid number.`);
if (!date) await fail('Date is required.');
if (!title) await fail('Title is required.');
if (!description) await fail('Description is required.');
const era = ERAS[eraRaw];
if (!era) await fail(`Era "${f['era'] ?? ''}" is not one of Barcelona / PSG / Inter Miami / Argentina.`);

const id = (() => {
  const base = slug(title);
  return base.endsWith(String(year)) ? base : `${base}-${year}`;
})();

// Load existing events for dedup
const { EVENTS } = await import(pathToFileURL(DATA_PATH).href);
if (EVENTS.some(e => e.id === id)) await fail(`A milestone with id "${id}" already exists.`);
if (EVENTS.some(e => e.title.toLowerCase().trim() === title.toLowerCase())) {
  await fail(`A milestone titled "${title}" already exists.`);
}

const event = {
  id, year, date, era, title, description,
  youtubeId: youtubeId(f['youtube video id (optional)']),
  youtubeSearch: (f['youtube search terms (optional)'] || '').trim() || title,
  tweetUrl: TWEET_URL.test((f['tweet/x url (optional)'] || '').trim()) ? f['tweet/x url (optional)'].trim() : '',
  xSearch: (f['x search terms (optional)'] || '').trim() || title,
};

// ── Render literal + append before the closing `];` ─────────────────────────────

const q = s => JSON.stringify(s);
const literal = `  {
    id: ${q(event.id)},
    year: ${event.year}, date: ${q(event.date)}, era: ${q(event.era)},
    title: ${q(event.title)},
    description: ${q(event.description)},
    youtubeId: ${q(event.youtubeId)}, youtubeSearch: ${q(event.youtubeSearch)},
    tweetUrl: ${q(event.tweetUrl)}, xSearch: ${q(event.xSearch)}
  }`;

const src = await readFile(DATA_PATH, 'utf8');
const closeIdx = src.lastIndexOf('\n];');
if (closeIdx === -1) await fail('Could not locate the end of the EVENTS array in data.js.');

const updated = src.slice(0, closeIdx) + ',\n' + literal + src.slice(closeIdx);
await writeFile(DATA_PATH, updated, 'utf8');

await setOutput({ status: 'added', id, message: `Added ${id}` });
console.log(`Added milestone: ${id}`);
