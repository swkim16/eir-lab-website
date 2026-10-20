# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Homepage for EIR Lab (Embodied Intelligence and Robotics Laboratory) at SeoulTech. It is a plain static site: `index.html`, `style.css`, `script.js`. No build step, package manager, framework, linter, or tests.

- **Run locally:** open `index.html` in a browser, or serve the folder (e.g. `python -m http.server 8000`) and visit `http://localhost:8000`.
- **Remote:** `https://github.com/swkim16/eir-lab-website.git`.
- The repo lives on a Google Drive synced folder (`G:\내 드라이브\...`); the path contains Korean characters, so quote it in shell commands.

## Structure

- `index.html` is a summary home page with anchored sections: `#home` (hero), `#research`, `#publications` (three selected papers), `#news`, then the footer. Sections link to their own pages; People and Contact have no home section.
- Each header nav item is a separate page showing only that topic (modeled on rcilab.khu.ac.kr): `research.html` (anchors `#soft-robotics`, `#bio-inspired`, `#smart-materials`, `#wearables`), `people.html` (PI, graduate students, interns, alumni), `publications.html` (year sections `#y2026`…`#y2023`), `news.html`, `contact.html` (lab contact + open positions).
- Every page repeats the same header/footer markup (no templating); when changing nav or footer, update all six HTML files. The current page's nav link carries `aria-current="page"`.
- Much content is still placeholder: publication entries ("Replace this heading…", `https://doi.org/`), news headlines, people names/photos, research descriptions, phone/address, and the contact email `YOUR_EMAIL@seoultech.ac.kr` (used in the contact page and every footer).

## Styling conventions

- `style.css` is split into numbered sections marked by `/* ===== N. Name ===== */` banners (global, header, hero, section headings, research cards, people banner, publications, news, contact, footer, subpages, responsive). Add new rules in the matching section.
- Dark theme driven by CSS variables on `:root` (`--bg`, `--bg-soft`, `--card`, `--text`, `--muted`, `--accent` lime `#b8f36b`, `--border`, `--max-width`). Use these instead of hard-coded colors. `<meta name="theme-color">` in the HTML matches `--bg`.
- Layout width comes from `.container`. Repeated patterns are shared classes: `.eyebrow`, `.section-heading` + `.section-description`, `.section-footer`, `.button.button-primary` / `.button-outline`, `.text-link`.
- Responsive breakpoints are all at the end of the file: `max-width: 850px` and `620px`, plus a `prefers-reduced-motion` block.

## JavaScript

`script.js` also builds the email popup: any `[data-email]` button holds the address base64-encoded (`btoa`/`atob`) and opens a `<dialog>` on click, so the address is never plain text in the HTML (anti-scraping). Use this for any new email display instead of `mailto:` links or literal addresses. It also fills each `.group-count` on the People page with the number of `.member-card`s in the grid below its group title, so just add or remove cards. On the Publications page it drives the type filter (`.chip-filter.pub-filter` buttons with `data-filter`; each `.publication-item` needs `data-type="journal|conference|patent"`, each year section `data-year`) and renumbers the visible entries. The News page works the same way (`.chip-filter.news-filter`; each `.news-row` needs `data-category="publication|award|grant|people|etc"`). Besides that, it handles the mobile menu: `.menu-toggle` toggles `.is-open` on `.navigation` and keeps `aria-expanded` in sync; clicking a nav link or pressing Escape closes it. Keep this ARIA state in sync if the nav markup changes.
