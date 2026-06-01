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
        </div>
      </div>
    </article>`;
}

// ── Render ────────────────────────────────────────────────────────────────────

function render() {
  document.getElementById('timeline').innerHTML = sorted.map(buildCard).join('');
  console.log(`Messi Timeline — ${sorted.length} events loaded`);
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
  });
}

// ── Boot ──────────────────────────────────────────────────────────────────────

render();
initEraFilter();
initScrollReveal();
initSpineProgress();
initMedia();
