# The Messi Timeline

An interactive, single-page career timeline for Lionel Messi (2004–2026). Each milestone card links to YouTube highlights and X/Twitter posts — inline embeds when a real ID is available, targeted search fallbacks otherwise.

## Run locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Or with Node.js:

```bash
npx serve .
```

## Add a milestone

Open `js/data.js` and append an object to the `EVENTS` array:

```js
{
  id: "unique-slug",          // kebab-case, unique
  year: 2025,
  date: "1 Jan 2025",
  era: "miami",               // "barca" | "psg" | "miami" | "argentina"
  title: "Short headline",
  description: "One to three sentences describing the moment.",
  youtubeId: "",              // leave empty if you don't have a real ID
  youtubeSearch: "Search terms for YouTube fallback",
  tweetUrl: "",               // leave empty if you don't have a real URL
  xSearch: "Search terms for X fallback"
}
```

The page re-renders automatically — no other files need editing.

## Upgrade a card to a real embed

- **YouTube:** find the 11-character video ID in the URL (e.g. `dQw4w9WgXcQ` from `youtube.com/watch?v=dQw4w9WgXcQ`) and paste it into `youtubeId`.
- **X/Twitter:** paste the full post URL (e.g. `https://x.com/username/status/1234567890`) into `tweetUrl`.

Never guess IDs — a wrong ID breaks the embed silently. Leave fields empty to use the search fallback.

## Deploy

### GitHub Pages

1. Push the repository to GitHub.
2. Go to **Settings → Pages**, set source to the `main` branch, root folder.
3. GitHub will publish at `https://<user>.github.io/<repo>/`.

### Netlify

1. Drag and drop the project folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
2. Or connect the GitHub repo for automatic deploys on push.
