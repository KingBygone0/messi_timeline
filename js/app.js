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
        <span class="card__era-label">${ERA_LABELS[event.era]}</span>
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
  const timeline = document.getElementById('timeline');
  timeline.innerHTML = sorted.map(buildCard).join('');
  console.log(`Messi Timeline — ${sorted.length} events loaded`);
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

  // ── Open / close ──────────────────────────────────────────────────────────

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    // Destroy iframe so video stops playing
    ytIframe.src = '';
    ytWrap.hidden = true;
    // Clear tweet embed
    tweetWrap.innerHTML = '';
    tweetWrap.hidden = true;
  }

  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  // ── YouTube ───────────────────────────────────────────────────────────────

  function openYouTube(youtubeId) {
    tweetWrap.hidden = true;
    ytWrap.hidden = false;
    ytIframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
    openModal();
  }

  // ── X / Twitter ───────────────────────────────────────────────────────────

  function loadTwitterWidgets(container) {
    if (twitterReady) {
      window.twttr?.widgets.load(container);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.onload = () => {
      twitterReady = true;
      window.twttr?.widgets.load(container);
    };
    document.head.appendChild(script);
  }

  function openTweet(tweetUrl) {
    ytWrap.hidden = true;
    // Build the blockquote Twitter widgets.js will hydrate
    tweetWrap.innerHTML = `
      <blockquote class="twitter-tweet" data-theme="dark" data-dnt="true">
        <a href="${tweetUrl}"></a>
      </blockquote>`;
    tweetWrap.hidden = false;
    openModal();
    loadTwitterWidgets(tweetWrap);
  }

  // ── Button delegation ─────────────────────────────────────────────────────

  document.getElementById('timeline').addEventListener('click', (e) => {
    const watchBtn = e.target.closest('.btn--watch');
    const xBtn     = e.target.closest('.btn--x');

    if (watchBtn) {
      const id = watchBtn.dataset.youtubeId;
      if (id) {
        openYouTube(id);
      } else {
        const q = encodeURIComponent(watchBtn.dataset.youtubeSearch);
        window.open(
          `https://www.youtube.com/results?search_query=${q}`,
          '_blank',
          'noopener,noreferrer'
        );
      }
    }

    if (xBtn) {
      const url = xBtn.dataset.tweetUrl;
      if (url) {
        openTweet(url);
      } else {
        const q = encodeURIComponent(xBtn.dataset.xSearch);
        window.open(
          `https://x.com/search?q=${q}`,
          '_blank',
          'noopener,noreferrer'
        );
      }
    }
  });
}

// ── Boot ──────────────────────────────────────────────────────────────────────

render();
initMedia();
