# The Messi Timeline

An interactive, single-page career timeline for Lionel Messi (2004–2026). Every milestone is rendered from a single JavaScript data array — adding an event requires editing one file. Each card links to YouTube highlights and X/Twitter posts: inline embeds when a real ID is provided, targeted search fallbacks otherwise. Built with plain HTML, CSS, and vanilla JS — no build step, no framework.

---

## Run locally

**Node.js (recommended):**
```bash
npx serve . --listen 8000
```
Then open **http://localhost:8000**.

**Python:**
```bash
python3 -m http.server 8000
```

> The site uses ES modules (`type="module"`), so you must serve it over HTTP — opening `index.html` directly from the filesystem will not work.

---

## Add a milestone

Open `js/data.js` and append an object to the `EVENTS` array. The page re-renders automatically — no other files need changing.

```js
{
  id:            "unique-kebab-slug",   // must be unique
  year:          2025,
  date:          "1 Jan 2025",          // human-readable
  era:           "miami",               // "barca" | "psg" | "miami" | "argentina"
  title:         "Short headline",
  description:   "One to three sentences.",
  youtubeId:     "",                    // leave empty if unknown — never guess
  youtubeSearch: "Search terms for YouTube fallback",
  tweetUrl:      "",                    // leave empty if unknown — never guess
  xSearch:       "Search terms for X fallback",
}
```

**Era colours:** `barca` = garnet, `psg` = navy, `miami` = pink, `argentina` = sky blue.

---

## Upgrade a card to a real embed

**YouTube:** find the 11-character video ID in the URL
(`youtube.com/watch?v=`**`dQw4w9WgXcQ`**) and paste it into `youtubeId`.
The Watch button will then open an inline lightbox instead of a search tab.

**X / Twitter:** paste the full post URL
(`https://x.com/username/status/1234567890`) into `tweetUrl`.
The See on X button will embed the post in a modal via `widgets.js`.

> Never fabricate IDs or URLs. A wrong ID produces a broken embed with no visible error. Leave fields empty to use the reliable search fallback.

---

## Deploy

### GitHub Pages (free, recommended)

1. **Create a repository** on [github.com](https://github.com/new) — public, no template.

2. **Add the remote and push:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable Pages:** go to your repo → **Settings → Pages** → under *Source* choose **Deploy from a branch** → branch `main`, folder `/ (root)` → **Save**.

4. GitHub will publish at `https://YOUR_USERNAME.github.io/YOUR_REPO/` within ~60 seconds.

> On every subsequent `git push`, GitHub Pages redeploys automatically.

---

### Netlify (drag-and-drop, no account linking required)

1. Build nothing — the project is already static.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag the project folder onto the page.
4. Netlify gives you a live URL instantly.

To connect to GitHub for auto-deploy on push: **Sites → Add new site → Import an existing project → GitHub**.

---

## Project structure

```
/
├── index.html       # markup, font links, modal shell
├── css/
│   └── style.css    # all styling; design tokens as CSS custom properties
├── js/
│   ├── data.js      # EVENTS array — single source of content
│   └── app.js       # render, era filter, scroll reveal, media buttons
├── assets/          # local icons/images (currently empty)
├── SPEC.md          # original build specification
└── README.md
```
