import { EVENTS } from './data.js';

// Sort chronologically; stable sort preserves insertion order within the same year
const sorted = [...EVENTS].sort((a, b) => a.year - b.year);

function esc(str) {
  return str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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

function render() {
  const timeline = document.getElementById('timeline');
  timeline.innerHTML = sorted.map(buildCard).join('');
  console.log(`Messi Timeline — ${sorted.length} events loaded`);
}

render();
