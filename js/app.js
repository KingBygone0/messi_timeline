import { EVENTS } from './data.js';

const sorted = [...EVENTS].sort((a, b) => a.year - b.year);

const ERA_LABELS = {
  barca:     'Barcelona',
  psg:       'PSG',
  miami:     'Inter Miami',
  argentina: 'Argentina',
};

// Achievement tags → user-facing labels, in the order they appear in the filter.
const TAG_LABELS = {
  'ballon-dor': "Ballon d'Or",
  'world-cup':  'World Cup',
  'trophy':     'Trophies',
  'record':     'Records',
};
const TAG_ORDER = ['ballon-dor', 'world-cup', 'trophy', 'record'];
const TOKEN_RE = /^[A-Za-z0-9-]+$/;
const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/;
const X_STATUS_URL_RE = /^https:\/\/(?:x|twitter)\.com\/[A-Za-z0-9_]{1,15}\/status\/\d+(?:[/?#].*)?$/i;

// Active filter state, shared between the era and achievement filters.
let activeEra = 'all';
let activeTag = 'all';

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function safeToken(value, fallback) {
  const token = String(value ?? '').trim();
  return TOKEN_RE.test(token) ? token : fallback;
}

function safeEra(value) {
  const era = String(value ?? '').trim();
  return Object.prototype.hasOwnProperty.call(ERA_LABELS, era) ? era : 'barca';
}

function buildCard(event, index) {
  const side = index % 2 === 0 ? 'left' : 'right';
  const id = safeToken(event.id, `milestone-${index + 1}`);
  const era = safeEra(event.era);
  const tags = (event.tags ?? []).map((tag) => safeToken(tag, '')).filter(Boolean).join(' ');
  return `
    <article
      class="card card--${side} card--${era}"
      data-era="${era}"
      data-tags="${esc(tags)}"
      id="event-${id}"
    >
      <div class="card__node" aria-hidden="true"></div>
      <div class="card__banner" aria-hidden="true">
        <span class="card__era-label">${ERA_LABELS[era]}</span>
      </div>
      <div class="card__body">
        <div class="card__meta">
          <span class="card__year">${event.year}</span>
          <time class="card__date">${esc(event.date)}</time>
        </div>
        <h2 class="card__title">${esc(event.title)}</h2>
        <p class="card__desc">${esc(event.description)}</p>
        <div class="card__actions">
          <button
            class="btn btn--watch"
            data-youtube-id="${esc(event.youtubeId)}"
            data-youtube-search="${esc(event.youtubeSearch)}"
            aria-label="Watch highlight: ${esc(event.title)}"
          >&#9654;&thinsp;Watch</button>
          <button
            class="btn btn--x"
            data-tweet-url="${esc(event.tweetUrl)}"
            data-x-search="${esc(event.xSearch)}"
            aria-label="See on X: ${esc(event.title)}"
          >&#120143;&thinsp;See on X</button>
          <button
            class="btn btn--share"
            data-event-id="${id}"
            aria-label="Copy a link to this milestone: ${esc(event.title)}"
          >&#128279;&thinsp;Share</button>
        </div>
      </div>
    </article>`;
}

// ── Year separator ────────────────────────────────────────────────────────────

function buildSeparator(year) {
  return `<div class="timeline__separator" aria-hidden="true">
    <span class="timeline__separator-year">${year}</span>
  </div>`;
}

// ── Render ────────────────────────────────────────────────────────────────────

function render() {
  // Guard: duplicate ids break deep-linking (two cards share one #event-… anchor).
  const seen = new Set();
  sorted.forEach((e, index) => {
    const id = safeToken(e.id, `milestone-${index + 1}`);
    if (seen.has(id)) {
      console.warn(`Messi Timeline — duplicate event id "${id}"; deep-links will only reach the first.`);
    }
    seen.add(id);
  });

  const items = [];
  sorted.forEach((event, index) => {
    // Inject a year marker whenever there is a gap of 2+ years
    if (index > 0 && event.year - sorted[index - 1].year >= 2) {
      items.push(buildSeparator(event.year));
    }
    items.push(buildCard(event, index));
  });
  document.getElementById('timeline').innerHTML = items.join('');
  console.log(`Messi Timeline — ${sorted.length} events loaded`);
}

// ── Era counts ────────────────────────────────────────────────────────────────

function initEraCounts() {
  const counts = {};
  sorted.forEach(e => {
    const era = safeEra(e.era);
    counts[era] = (counts[era] || 0) + 1;
  });

  document.querySelectorAll('.era-filter__btn[data-era]').forEach(btn => {
    const era = btn.dataset.era;
    if (era === 'all') return;
    const n = counts[era] || 0;
    btn.innerHTML =
      `${btn.textContent.trim()} <span class="era-filter__count" aria-hidden="true">${n}</span>`;
  });
}

// ── Filters: era + achievement (combined with AND logic) ───────────────────────

// Mark one button in a nav as the active selection.
function setActiveBtn(nav, activeBtn) {
  nav.querySelectorAll('button').forEach(b => {
    const on = b === activeBtn;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

function setCardInteractive(card, interactive) {
  card.toggleAttribute('inert', !interactive);
  card.querySelectorAll('button').forEach(btn => {
    btn.tabIndex = interactive ? 0 : -1;
  });
}

// Fade any card that fails the era OR the achievement filter.
function applyFilters() {
  document.querySelectorAll('.card').forEach(card => {
    const eraMatch = activeEra === 'all' || card.dataset.era === activeEra;
    const tags     = (card.dataset.tags || '').split(' ').filter(Boolean);
    const tagMatch = activeTag === 'all' || tags.includes(activeTag);
    const match    = eraMatch && tagMatch;
    card.classList.toggle('is-faded', !match);
    card.setAttribute('aria-hidden', match ? 'false' : 'true');
    setCardInteractive(card, match);
  });
  syncUrl();
}

// Reflect the active filters in the URL so a filtered view is shareable.
function syncUrl() {
  const params = new URLSearchParams(location.search);
  activeEra === 'all' ? params.delete('era') : params.set('era', activeEra);
  activeTag === 'all' ? params.delete('tag') : params.set('tag', activeTag);
  const qs = params.toString();
  history.replaceState(null, '', location.pathname + (qs ? `?${qs}` : '') + location.hash);
}

function initEraFilter() {
  const nav = document.querySelector('.era-filter');
  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('.era-filter__btn');
    if (!btn) return;
    activeEra = btn.dataset.era;
    setActiveBtn(nav, btn);
    applyFilters();
  });
}

// Build the achievement filter from the tags that actually appear in the data,
// so it stays correct as milestones are added (and shows nothing if none have tags).
function initTagFilter() {
  const nav = document.querySelector('.tag-filter');
  if (!nav) return;

  const counts = {};
  sorted.forEach(e => (e.tags ?? []).forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
  const present = TAG_ORDER.filter(t => counts[t]);
  if (!present.length) return;

  nav.innerHTML = [
    `<button class="tag-filter__btn active" data-tag="all" aria-pressed="true">All</button>`,
    ...present.map(t =>
      `<button class="tag-filter__btn" data-tag="${t}" aria-pressed="false">` +
      `${TAG_LABELS[t]} <span class="tag-filter__count" aria-hidden="true">${counts[t]}</span></button>`
    ),
  ].join('');
  nav.hidden = false;
  document.querySelector('.filters__divider')?.removeAttribute('hidden');

  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('.tag-filter__btn');
    if (!btn) return;
    activeTag = btn.dataset.tag;
    setActiveBtn(nav, btn);
    applyFilters();
  });
}

// Restore filters from ?era=…&tag=… on load so shared/bookmarked URLs work.
function initFiltersFromUrl() {
  const params = new URLSearchParams(location.search);
  const era = params.get('era');
  const tag = params.get('tag');

  if (era) {
    const btn = document.querySelector(`.era-filter__btn[data-era="${CSS.escape(era)}"]`);
    if (btn) { activeEra = era; setActiveBtn(document.querySelector('.era-filter'), btn); }
  }
  if (tag) {
    const btn = document.querySelector(`.tag-filter__btn[data-tag="${CSS.escape(tag)}"]`);
    if (btn) { activeTag = tag; setActiveBtn(document.querySelector('.tag-filter'), btn); }
  }
  applyFilters();
}

function resetFiltersToAll() {
  activeEra = 'all';
  activeTag = 'all';

  const eraNav = document.querySelector('.era-filter');
  const eraAll = eraNav?.querySelector('.era-filter__btn[data-era="all"]');
  if (eraNav && eraAll) setActiveBtn(eraNav, eraAll);

  const tagNav = document.querySelector('.tag-filter');
  const tagAll = tagNav?.querySelector('.tag-filter__btn[data-tag="all"]');
  if (tagNav && tagAll) setActiveBtn(tagNav, tagAll);

  applyFilters();
}

// ── Scroll reveal ─────────────────────────────────────────────────────────────

function initScrollReveal() {
  // Respect user's motion preference — skip animation entirely if reduced
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.card');
  cards.forEach(card => card.classList.add('card--hidden'));

  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting);
    visible.forEach((entry, i) => {
      const card = entry.target;
      card.style.animationDelay = `${i * 65}ms`;
      card.classList.remove('card--hidden');
      card.classList.add('card--visible');
      observer.unobserve(card);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  cards.forEach(card => observer.observe(card));
}

// ── Spine progress ────────────────────────────────────────────────────────────

function initSpineProgress() {
  const timeline = document.getElementById('timeline');

  const fill = document.createElement('div');
  fill.className = 'timeline__spine-fill';
  fill.setAttribute('aria-hidden', 'true');
  timeline.prepend(fill);

  function update() {
    const rect     = timeline.getBoundingClientRect();
    const progress = (window.innerHeight * 0.55 - rect.top) / rect.height;
    const pct      = Math.min(Math.max(progress, 0), 1);
    fill.style.clipPath = `inset(0 0 ${((1 - pct) * 100).toFixed(2)}% 0)`;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ── Media (Phase 4) ───────────────────────────────────────────────────────────

function initMedia() {
  const modal     = document.getElementById('media-modal');
  const closeBtn  = modal.querySelector('.modal__close');
  const backdrop  = modal.querySelector('.modal__backdrop');
  const ytWrap    = document.getElementById('modal-yt');
  const ytIframe  = document.getElementById('yt-iframe');
  const tweetWrap = document.getElementById('modal-tweet');

  let twitterReady = false;
  let lastFocus    = null;

  // Focus trap: keep Tab/Shift-Tab inside the modal
  function onTrapKeydown(e) {
    if (e.key !== 'Tab') return;
    const sel = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';
    const focusable = [...modal.querySelectorAll(sel)].filter(
      el => !el.closest('[hidden]') && getComputedStyle(el).display !== 'none'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  function openModal() {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.addEventListener('keydown', onTrapKeydown);
    closeBtn.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    modal.removeEventListener('keydown', onTrapKeydown);
    ytIframe.src = '';
    ytWrap.hidden = true;
    tweetWrap.replaceChildren();
    tweetWrap.hidden = true;
    // Return focus to the button that opened the modal
    lastFocus?.focus();
  }

  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  function openYouTube(youtubeId) {
    tweetWrap.replaceChildren();
    tweetWrap.hidden = true;
    ytWrap.hidden = false;
    ytIframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
    openModal();
  }

  function loadTwitterWidgets(container) {
    if (twitterReady) { window.twttr?.widgets.load(container); return; }
    const s = document.createElement('script');
    s.src   = 'https://platform.twitter.com/widgets.js';
    s.async = true;
    s.onload = () => { twitterReady = true; window.twttr?.widgets.load(container); };
    document.head.appendChild(s);
  }

  function openTweet(tweetUrl) {
    ytWrap.hidden = true;
    tweetWrap.replaceChildren();

    const quote = document.createElement('blockquote');
    quote.className = 'twitter-tweet';
    quote.dataset.theme = 'dark';
    quote.dataset.dnt = 'true';

    const link = document.createElement('a');
    link.href = tweetUrl;
    link.textContent = 'View post on X';

    quote.appendChild(link);
    tweetWrap.appendChild(quote);
    tweetWrap.hidden = false;
    openModal();
    loadTwitterWidgets(tweetWrap);
  }

  function openExternalSearch(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  document.getElementById('timeline').addEventListener('click', (e) => {
    const watchBtn = e.target.closest('.btn--watch');
    const xBtn     = e.target.closest('.btn--x');

    if (watchBtn) {
      const id = (watchBtn.dataset.youtubeId || '').trim();
      if (YOUTUBE_ID_RE.test(id)) {
        openYouTube(id);
      } else {
        openExternalSearch(
          `https://www.youtube.com/results?search_query=${encodeURIComponent(watchBtn.dataset.youtubeSearch || '')}`
        );
      }
    }

    if (xBtn) {
      const url = (xBtn.dataset.tweetUrl || '').trim();
      if (X_STATUS_URL_RE.test(url)) {
        openTweet(url);
      } else {
        openExternalSearch(
          `https://x.com/search?q=${encodeURIComponent(xBtn.dataset.xSearch || '')}`
        );
      }
    }

    const shareBtn = e.target.closest('.btn--share');
    if (shareBtn) {
      const id  = shareBtn.dataset.eventId;
      const url = buildShareUrl(id);
      copyShareLink(shareBtn, url);
    }
  });
}

function buildShareUrl(id) {
  const url = new URL(location.href);
  url.search = '';
  url.hash = `event-${id}`;
  return url.href;
}

// ── Share: copy a deep link to the clipboard, with a transient confirmation ─────

function copyShareLink(btn, url) {
  const confirm = () => {
    if (!btn.dataset.label) btn.dataset.label = btn.innerHTML;
    btn.classList.add('is-copied');
    btn.innerHTML = '&#10003;&thinsp;Copied';
    clearTimeout(btn._copyTimer);
    btn._copyTimer = setTimeout(() => {
      btn.innerHTML = btn.dataset.label;
      btn.classList.remove('is-copied');
    }, 1600);
  };

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(url).then(confirm).catch(() => fallbackCopy(url, confirm));
  } else {
    fallbackCopy(url, confirm);
  }
}

function fallbackCopy(text, onDone) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'absolute';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); onDone(); } catch { /* clipboard blocked */ }
  document.body.removeChild(ta);
}

// ── Stat strip count-up ─────────────────────────────────────────────────────────

function initStatCount() {
  // Numbers are already correct in the HTML; only animate when motion is allowed.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.stat-num').forEach(el => {
    const to = parseInt(el.dataset.to, 10);
    if (!Number.isFinite(to)) return;

    const duration = 1100;
    const start = performance.now();
    el.textContent = '0';

    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(to * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = String(to);
    }
    requestAnimationFrame(step);
  });
}

// ── Deep-link hashes ─────────────────────────────────────────────────────────

function initDeepLink() {
  const hash = location.hash;
  if (!hash.startsWith('#event-')) return;

  const target = document.getElementById(hash.slice(1));
  if (!target) return;

  if (target.classList.contains('is-faded')) {
    resetFiltersToAll();
  }

  // Force-reveal the card so the highlight isn't blocked by scroll-reveal
  target.style.animationDelay = '0ms';
  target.classList.remove('card--hidden');
  target.classList.add('card--visible');

  setTimeout(() => {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.add('is-highlighted');
  }, 350);
}

// ── Keyboard navigation ───────────────────────────────────────────────────────

function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    // Skip when typing, a modifier is held, or the modal is open
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (!document.getElementById('media-modal').hidden) return;

    const down = e.key === 'j' || e.key === 'J';
    const up   = e.key === 'k' || e.key === 'K';
    if (!down && !up) return;

    e.preventDefault();

    const visible = [...document.querySelectorAll('.card:not(.is-faded)')];
    if (!visible.length) return;

    // Determine which card currently "owns" focus
    const activeCard  = document.activeElement.closest('.card');
    const currentIdx  = activeCard ? visible.indexOf(activeCard) : -1;

    const nextIdx = down
      ? Math.min(currentIdx + 1, visible.length - 1)
      : Math.max(currentIdx - 1, 0);

    // If already at the edge, do nothing
    if (nextIdx === currentIdx && currentIdx !== -1) return;

    const target   = visible[nextIdx];
    const firstBtn = target.querySelector('.btn');
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    (firstBtn || target).focus({ preventScroll: true });
  });
}

// ── Back to top ───────────────────────────────────────────────────────────────

function initBackToTop() {
  const btn  = document.querySelector('.back-to-top');
  const hero = document.querySelector('.hero');

  function update() {
    const visible = hero.getBoundingClientRect().bottom < 0;
    btn.classList.toggle('is-visible', visible);
    btn.setAttribute('aria-hidden', visible ? 'false' : 'true');
    btn.tabIndex = visible ? 0 : -1;
  }

  window.addEventListener('scroll', update, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Boot ──────────────────────────────────────────────────────────────────────

render();
initEraCounts();
initEraFilter();
initTagFilter();
initFiltersFromUrl();   // must run after both filter rows exist
initStatCount();
initScrollReveal();
initSpineProgress();
initDeepLink();
initKeyboardNav();
initBackToTop();
initMedia();
