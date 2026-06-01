# SPEC.md — Lionel Messi Career Timeline

> A single-page, static website that presents Lionel Messi's football career as an
> interactive vertical timeline. Each milestone links out to (or embeds) the relevant
> YouTube video and X/Twitter post so a visitor can watch or read about that moment.

This file is the source of truth for the build. Follow it phase by phase. Commit after
every phase. Do not invent media IDs or URLs (see **Media Rules**).

---

## 1. Goals

- Present Messi's career (2004–2026) as a clean, scrollable vertical timeline.
- Every milestone card has a **Watch** button (YouTube) and a **See on X** button.
- Clicking a media button either opens an inline embed (if a real ID is supplied) or
  opens a targeted search on the platform in a new tab.
- Premium, editorial sports aesthetic — not a generic template.
- Fully responsive (mobile-first) and accessible.

## 2. Non-Goals

- No backend, database, or user accounts.
- No build step or framework for v1 (plain HTML/CSS/JS). React/Vite is a possible v2.
- No scraping or storing of third-party media; we only link/embed public content.

## 3. Tech Stack

- HTML5, modern CSS (custom properties, fl/grid, `@media`), vanilla JS (ES modules).
- Google Fonts via `<link>`.
- X embeds via official `https://platform.twitter.com/widgets.js`.
- YouTube embeds via standard `https://www.youtube.com/embed/{id}` iframe.
- No other runtime dependencies.

## 4. File Structure

```
/
├── index.html          # markup + font links + script/style includes
├── css/
│   └── style.css        # all styling, design tokens as CSS variables
├── js/
│   ├── data.js          # the timeline data array (single source of content)
│   └── app.js           # render + interactivity (ES module)
├── assets/              # any local icons/images (keep minimal)
├── SPEC.md
└── README.md            # how to run + how to deploy
```

## 5. Data Model

All content lives in `js/data.js` as an exported array `EVENTS`. The page renders
entirely from this array — no hardcoded content in the HTML.

Each event object:

| Field          | Type     | Required | Notes |
|----------------|----------|----------|-------|
| `id`           | string   | yes      | Unique slug, e.g. `"debut-2004"`. |
| `year`         | number   | yes      | Used for the year badge and sorting. |
| `date`         | string   | yes      | Human-readable, e.g. `"16 Oct 2004"`. |
| `era`          | enum     | yes      | One of `"barca" \| "psg" \| "miami" \| "argentina"`. Drives accent color. |
| `title`        | string   | yes      | Short headline. |
| `description`  | string   | yes      | 1–3 sentences. |
| `youtubeId`    | string   | no       | Real 11-char video ID → enables inline embed. Leave empty if unknown. |
| `youtubeSearch`| string   | yes      | Fallback search terms, always present. |
| `tweetUrl`     | string   | no       | Full real tweet/post URL → enables inline embed. Leave empty if unknown. |
| `xSearch`      | string   | yes      | Fallback search terms, always present. |

Example object:

```js
{
  id: "debut-2004",
  year: 2004,
  date: "16 Oct 2004",
  era: "barca",
  title: "La Liga debut",
  description: "A 17-year-old Messi comes on for Barcelona against Espanyol, becoming one of the club's youngest-ever league players.",
  youtubeId: "",                       // fill with real ID to embed
  youtubeSearch: "Messi first Barcelona appearance Espanyol 2004",
  tweetUrl: "",                        // fill with real URL to embed
  xSearch: "Messi debut Barcelona 2004"
}
```

Sort `EVENTS` chronologically (ascending) before rendering.

## 6. Media Rules (IMPORTANT — read before writing data.js)

- **Never fabricate `youtubeId` or `tweetUrl` values.** A guessed ID produces a dead
  link. If the real ID/URL is not known with certainty, leave the field as `""` and
  rely on the search fallback.
- The `youtubeSearch` and `xSearch` fields must always be filled — these power the
  reliable fallback links.
- Button behavior:
  - **Watch:** if `youtubeId` is non-empty → open an inline lightbox modal with
    `https://www.youtube.com/embed/{youtubeId}`. Else → open
    `https://www.youtube.com/results?search_query={encoded youtubeSearch}` in a new tab.
  - **See on X:** if `tweetUrl` is non-empty → render/open the embedded post (widgets.js).
    Else → open `https://x.com/search?q={encoded xSearch}` in a new tab.
- All external links: `target="_blank"` and `rel="noopener noreferrer"`.

## 7. Design System

Aesthetic direction: **dark editorial sports poster.** Bold condensed display type,
generous spacing, a colored timeline spine that shifts through Messi's career eras.
Avoid generic AI aesthetics (no Inter/Roboto, no purple-on-white gradients).

### Typography (Google Fonts)
- Display / big headings + year badges: **Anton**.
- Body text: a clean grotesk such as **Schibsted Grotesk** or **Hanken Grotesk**.
- Accent / pull-quotes: a serif such as **Fraunces** (italic).

### Color tokens (CSS variables in `:root`)
- `--bg`: near-black, e.g. `#0a0a0f`.
- `--surface`: slightly lifted card background, e.g. `#14141c`.
- `--text`: off-white, e.g. `#f4f4f0`.
- `--muted`: muted gray for dates/secondary text.
- Era accents (used for spine node, card border, badges):
  - `--barca`: garnet `#A50044`
  - `--psg`: navy `#0a1f44`
  - `--miami`: pink `#ff5ca8`
  - `--argentina`: sky blue `#6cace4`

### Layout
- **Hero:** large "MESSI" title, a one-line subtitle, and a stat strip
  (e.g. *8 Ballon d'Ors · 1 World Cup · 1 Copa América · 800+ career goals*).
- **Timeline:** vertical spine down the center on desktop, with cards alternating
  left/right. On mobile (`< 768px`), spine moves to the left and cards stack in a
  single column.
- Each card: era-colored node on the spine, year badge, date, title, description,
  and the two media buttons.

### Motion
- One orchestrated page-load reveal (staggered) for the hero.
- Scroll-reveal for timeline cards via `IntersectionObserver` (fade + slight translate).
- Timeline spine "fills" with color as the user scrolls down the page.
- Subtle hover states on cards and buttons. Keep it tasteful, CSS-first.

## 8. Features

1. **Render** all cards from `EVENTS`, sorted by date.
2. **Media buttons** per the Media Rules above (embed-or-search logic).
3. **Lightbox modal** for YouTube embeds: dark overlay, centered 16:9 iframe, close on
   ✕ / Esc / backdrop click; pause/destroy iframe on close.
4. **Era filter:** sticky button row — `All · Barcelona · PSG · Inter Miami · Argentina`.
   Selecting one fades (does not remove) non-matching cards. `All` resets.
5. **Scroll progress** on the timeline spine.
6. **Accessibility:** semantic landmarks, keyboard-operable buttons/modal, visible focus
   states, `alt`/`aria-label` where needed, color contrast AA.

## 9. Content — Verified Milestones

Seed `data.js` with these (facts verified). Fill `youtubeId`/`tweetUrl` later with real
links; always include search fallbacks.

| Year | Date         | Era       | Title |
|------|--------------|-----------|-------|
| 2004 | 16 Oct 2004  | barca     | La Liga debut vs Espanyol (age 17) |
| 2005 | 1 May 2005   | barca     | First senior goal, assisted by Ronaldinho |
| 2005 | Jun 2005     | argentina | FIFA U-20 World Cup win (Golden Ball + Golden Boot) |
| 2007 | 18 Apr 2007  | barca     | The "Maradona goal" vs Getafe |
| 2009 | May 2009     | barca     | First treble; UCL final header vs Man Utd; 1st Ballon d'Or |
| 2011 | 28 May 2011  | barca     | Champions League win vs Man Utd at Wembley |
| 2012 | Dec 2012     | barca     | Record 91 goals in a calendar year |
| 2012 | 2012         | barca     | 4th consecutive Ballon d'Or (first ever to do so) |
| 2014 | 13 Jul 2014  | argentina | World Cup final runner-up; wins Golden Ball |
| 2015 | Jun 2015     | barca     | Second treble; 5th Ballon d'Or |
| 2019 | 2019         | barca     | 6th Ballon d'Or (then a record) |
| 2021 | 10 Jul 2021  | argentina | Copa América title — first senior international trophy |
| 2021 | 8 Aug 2021   | psg       | Tearful Barcelona farewell; signs for Paris Saint-Germain |
| 2021 | Nov 2021     | argentina | 7th Ballon d'Or |
| 2022 | 18 Dec 2022  | argentina | Wins the FIFA World Cup in Qatar; scores in the final; 2nd Golden Ball |
| 2023 | 21 Jul 2023  | miami     | Inter Miami debut — free-kick winner vs Cruz Azul |
| 2023 | 19 Aug 2023  | miami     | Wins Leagues Cup — first Inter Miami trophy |
| 2023 | 30 Oct 2023  | miami     | Record-extending 8th Ballon d'Or |
| 2024 | 14 Jul 2024  | argentina | Copa América 2024 title (injured in the final) |
| 2024 | 2024         | miami     | Supporters' Shield + record points; first MLS MVP |
| 2025 | 18 Oct 2025  | miami     | MLS Golden Boot (29 goals) |
| 2025 | 6 Dec 2025   | miami     | First MLS Cup title (3–1 vs Vancouver); 2nd straight MLS MVP |
| 2026 | 2026         | argentina | Looking ahead: defending the World Cup in North America |

> Note: Ballon d'Or count = 8 (2009, 2010, 2011, 2012, 2015, 2019, 2021, 2023).
> Verify any stat strip numbers against a live source before finalizing.

## 10. Build Phases

Commit after each phase; review in the browser before continuing.

- **Phase 0 — Setup:** scaffold the file structure, init git, first commit.
- **Phase 1 — Data:** build `js/data.js` per the schema with all milestones from §9.
- **Phase 2 — Layout:** render the timeline from data (alternating desktop / stacked mobile).
- **Phase 3 — Styling:** apply the design system (§7), era color-coding, hero + stat strip.
- **Phase 4 — Media:** implement the Watch / See-on-X buttons + YouTube lightbox (§6).
- **Phase 5 — Interactivity:** era filter, scroll reveals, spine progress, hover states.
- **Phase 6 — Verify:** fact/link check, accessibility + responsive audit.
- **Phase 7 — Deploy:** GitHub Pages (or Netlify); document steps in README.

## 11. Acceptance Criteria

- [ ] Page renders entirely from `js/data.js`; adding an event requires no other edits.
- [ ] Every card shows year, date, title, description, and two working media buttons.
- [ ] Watch opens an inline embed when `youtubeId` is set, else a YouTube search tab.
- [ ] See on X embeds when `tweetUrl` is set, else opens an X search tab.
- [ ] No fabricated IDs/URLs anywhere in `data.js`.
- [ ] Timeline spine and accents are correctly color-coded by era.
- [ ] Era filter fades non-matching cards; `All` resets.
- [ ] Layout works at 360px, 768px, and 1280px widths with no overflow.
- [ ] Keyboard: all buttons and the modal are operable; focus is visible; Esc closes modal.
- [ ] Lighthouse: no critical accessibility violations.

## 12. README requirements

- One-paragraph project description.
- How to run locally (e.g. `python3 -m http.server` then open `localhost:8000`).
- How to add a milestone (point at the `EVENTS` schema).
- How to upgrade a card to a real embed (paste `youtubeId` / `tweetUrl`).
- Deployment steps.
