import { EVENTS } from './data.js';

const sorted = [...EVENTS].sort((a, b) => a.year - b.year);

const ERA_LABELS = {
  barca:     'Barcelona',
  psg:       'PSG',
  miami:     'Inter Miami',
  argentina: 'Argentina',
};

function esc(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildCard(event, index) {
  const side = index % 2 === 0 ? 'left' : 'right';
  return `
    <article
      class="card card--${side} card--${event.era}"
      data-era="${event.era}"
      id="event-${event.id}"
    >
      <div class="card__node" aria-hidden="true"></div>
      <div class="card__body">
        <span class="card__era-label" aria-hidden="true">${ERA_LABELS[event.era]}</span>
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
            class="btn btn--instagram"
            data-instagram-url="${esc(event.instagramUrl)}"
            data-instagram-search="${esc(event.instagramSearch)}"
            aria-label="See on Instagram: ${esc(event.title)}"
          >&#128247;&thinsp;Instagram</button>
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
  sorted.forEach(e => { counts[e.era] = (counts[e.era] || 0) + 1; });

  document.querySelectorAll('.era-filter__btn[data-era]').forEach(btn => {
    const era = btn.dataset.era;
    if (era === 'all') return;
    const n = counts[era] || 0;
    btn.innerHTML =
      `${btn.textContent.trim()} <span class="era-filter__count" aria-hidden="true">${n}</span>`;
  });
}

// ── Era filter ────────────────────────────────────────────────────────────────

function initEraFilter() {
  const nav = document.querySelector('.era-filter');

  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('.era-filter__btn');
    if (!btn) return;

    const era = btn.dataset.era;

    nav.querySelectorAll('.era-filter__btn').forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
    });

    document.querySelectorAll('.card').forEach(card => {
      const match = era === 'all' || card.dataset.era === era;
      card.classList.toggle('is-faded', !match);
      // Hide faded cards from screen readers too
      card.setAttribute('aria-hidden', match ? 'false' : 'true');
    });
  });
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
    tweetWrap.innerHTML = '';
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
    tweetWrap.innerHTML = `
      <blockquote class="twitter-tweet" data-theme="dark" data-dnt="true">
        <a href="${tweetUrl}">View post on X</a>
      </blockquote>`;
    tweetWrap.hidden = false;
    openModal();
    loadTwitterWidgets(tweetWrap);
  }

  document.getElementById('timeline').addEventListener('click', (e) => {
    const watchBtn = e.target.closest('.btn--watch');
    const xBtn     = e.target.closest('.btn--x');

    if (watchBtn) {
      const id = watchBtn.dataset.youtubeId;
      if (id) {
        openYouTube(id);
      } else {
        window.open(
          `https://www.youtube.com/results?search_query=${encodeURIComponent(watchBtn.dataset.youtubeSearch)}`,
          '_blank', 'noopener,noreferrer'
        );
      }
    }

    if (xBtn) {
      const url = xBtn.dataset.tweetUrl;
      if (url) {
        openTweet(url);
      } else {
        window.open(
          `https://x.com/search?q=${encodeURIComponent(xBtn.dataset.xSearch)}`,
          '_blank', 'noopener,noreferrer'
        );
      }
    }

    const igBtn = e.target.closest('.btn--instagram');
    if (igBtn) {
      const url = igBtn.dataset.instagramUrl;
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        // Search Instagram via Google (no login required)
        const q = encodeURIComponent(
          `site:instagram.com ${igBtn.dataset.instagramSearch}`
        );
        window.open(
          `https://www.google.com/search?q=${q}`,
          '_blank', 'noopener,noreferrer'
        );
      }
    }
  });
}

// ── Deep-link hashes ─────────────────────────────────────────────────────────

function initDeepLink() {
  const hash = location.hash;
  if (!hash.startsWith('#event-')) return;

  const target = document.getElementById(hash.slice(1));
  if (!target) return;

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
initScrollReveal();
initSpineProgress();
initDeepLink();
initKeyboardNav();
initBackToTop();
initMedia();
