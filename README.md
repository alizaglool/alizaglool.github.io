<!-- Created by Ali Zaghloul on 16/09/2026 -->
# Ali Zaghloul — Portfolio

Personal portfolio site. Vanilla HTML/CSS/JS with ES modules — no frameworks, no build step.

**Live target:** https://alizaglool.github.io

## Structure

| Path | Purpose |
|---|---|
| `index.html` | Page markup (all sections, modal, terminal easter egg) |
| `assets/css/` | `tokens` (design tokens + themes) · `base` · `motion` (reveal system) · `components` · `sections` |
| `assets/js/main.js` | Entry module — boots every component |
| `assets/js/core/` | `env` (helpers, prefs) · `reveal` (IntersectionObserver reveal engine) |
| `assets/js/components/` | loader, nav, cursor, hero, interactions, projects (+case-study modal), skills, architecture, timeline, stats, github (live API + snapshot fallback), contact, terminal |
| `data/` | All content — `site.js`, `projects.js`, `skills.js`, `experience.js`. Edit these to update the site; no markup changes needed |
| `assets/img/` | Portrait card, project logos, avatar (all SVG) |
| `favicon.svg` | Tab icon |
| `Ali-Zaghloul-CV.pdf` | Résumé served by the "Résumé" buttons |

## Deploy to GitHub Pages (one-time setup)

1. Create a **public** repo named exactly `alizaglool.github.io` under the `alizaglool` GitHub account.
2. From this folder:
   ```bash
   git init
   git add index.html assets data favicon.svg Ali-Zaghloul-CV.pdf README.md
   git commit -m "Portfolio v1"
   git branch -M main
   git remote add origin git@github.com:alizaglool/alizaglool.github.io.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `/ (root)` → Save.
4. Wait ~1 minute → site is live at **https://alizaglool.github.io**.

## Updating content

- Text, projects, skills, jobs, links → edit the files in `data/` only.
- New project logo → drop an SVG in `assets/img/` and point the project's `logo` field at it.
- Swap the CV → replace `Ali-Zaghloul-CV.pdf` with a new file of the same name.
- Then: `git add -A && git commit -m "update" && git push` — Pages redeploys on every push to `main`.

## Notes

- Only external dependency is Google Fonts (Sora, Inter, JetBrains Mono).
- The GitHub section fetches the live API in the browser; when rate-limited or offline it renders a built-in snapshot.
- Local preview needs a static server because of ES modules: `python3 -m http.server` in this folder, then open http://localhost:8000.
- Custom domain later: add a `CNAME` file containing the domain, and point DNS `A`/`ALIAS` records per GitHub Pages docs.
