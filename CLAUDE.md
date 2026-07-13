# Code78.net

Marketing/portfolio site for **Code78 LLC** — a full-stack development, software, and IT-support shop. Single-page React app with a retro-terminal / cyberpunk aesthetic.

## Where the code lives

The React app is in **`code78.net/`** (Create React App), not the repo root. Run all npm commands from there:

```bash
cd code78.net
npm install        # first time (add --legacy-peer-deps if you hit peer-dep errors)
npm start          # dev server on http://localhost:3000
npm run build      # production build
```

## Architecture

- **React 19 + react-router-dom**, single page. Routes in `src/App.js` (`/`, `/planner`, 404).
- **Home sections** (`src/pages/Home.js`): About → What We Do (Services) → Our Work (Portfolio) → Get In Touch. Each is a `Section` with a glitch `<h2>`.
- **Content is data-driven — edit JSON, not components:**
  - `src/data/services.json` — the "What We Do" cards.
  - `src/data/portfolio.json` — the "Our Work" cards (`title`, `status` `live|wip`, `statusLabel`, `description`, `stack[]`, `url`, `linkLabel`, `credit`). Set `url: null` to show a muted "details_soon" instead of a link.
  - `src/data/theme.json` — color palette, injected as CSS variables (`--color1`, `--terminal-bkg`, …) by `src/comp/ColorScheme.js`.
- **Layout**: components in `src/comp/`, pages in `src/pages/`, CSS Modules in `src/CSS/`, fonts/media in `src/media/`.
- **Aesthetic**: monospace (Kode Mono headings / Red Hat Mono body), amber-on-near-black, scanlines, glitch text, and `src/comp/CircuitBkg.js` — a hand-written procedural circuit-board canvas animation.

## Conventions

- Add a service → append to `services.json`. Add a portfolio project → append to `portfolio.json`.
- **Keep content honest** — only advertise capabilities the team has actually shipped.

## Workflow

- Development happens on **`c-dev`** / **`d-dev`** branches; changes reach **`main`** via pull request. Don't commit directly to `main`.

## Future work

- **Replace the embedded Google Forms.** The Contact section (`src/pages/Home.js`) and the Planner (`src/pages/Planner.js`) currently embed color-inverted `forms.gle` iframes, which read as unprofessional for a dev shop. Build a first-party contact solution instead — `emailjs-com` is already a dependency and a `ContactForm` component is stubbed/commented in `Home.js`, so finishing that (or another owned form) is the intended path.
