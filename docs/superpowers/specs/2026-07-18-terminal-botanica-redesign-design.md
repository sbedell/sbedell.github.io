# Terminal Botanica Redesign — Design Spec

**Date:** 2026-07-18
**Branch:** `redesign/terminal-botanica`
**Status:** Approved direction; pending spec review

## Goal

Full visual redesign of sbedell.github.io: replace the 2013-era Bootstrap-ghost
aesthetic (Arial, glossy gradients, rainbow jumbotron) with a distinctive
"Terminal Botanica" identity — a dark theme merging the developer/security side
of the site with the gardening/nature side. No functional changes, no URL
changes, no build step introduced.

## Constraints

- Static GitHub Pages site: plain HTML/CSS/JS, no frameworks, no build tooling.
- Single committed dark theme. No light/dark toggle. All colors flow through
  CSS variables so a second theme remains cheap to add later, but none ships now.
- Keep page structure and URLs exactly as they are.
- Keep existing functionality intact (password generator, soundboard audio,
  storage demo, vibrate demo, security lookups, copyright-year scripts).

## Design System

All tokens defined as CSS variables on `:root` in `css/mainStyles.css`.
Per-page stylesheets consume tokens; no hardcoded colors outside the token block.

### Color tokens

| Token | Approx value | Use |
|---|---|---|
| `--bg` | `#0d120e` | page background (green-black) |
| `--surface` | `#141b15` | cards, inputs, code blocks |
| `--border` | muted sage, low opacity | card/input borders |
| `--text` | `#e4ece2` | body text (warm off-white) |
| `--text-muted` | desaturated sage | secondary text, footers |
| `--accent` | `~#8fd97a` | phosphor green: links, primary buttons, focus rings, hover glow |
| `--warn` | amber | warnings, error output (replaces `lightcoral`) |
| `--danger` | soft terracotta | destructive buttons (Clear, Stop) |

Exact hex values tuned during implementation for WCAG AA contrast against `--bg`
and `--surface`.

### Background atmosphere

Body background layers a faint CRT-style grid (repeating linear gradients) and
a soft radial vignette over `--bg`. Pure CSS, no images. Subtle — texture, not
decoration.

### Typography

- **Headings + UI labels:** Martian Mono (Google Fonts)
- **Body:** Atkinson Hyperlegible (Google Fonts)
- Loaded via Google Fonts CDN with `font-display: swap`; only needed weights.
- The `* { font-family }` reset is removed; fonts inherit from `body`, with
  headings/labels opting into the mono. Arial appears nowhere.

### Motion

- One orchestrated page-load reveal: hero elements first, content sections fade
  up with staggered `animation-delay`. CSS only.
- Micro-interactions: card border glow on hover, blinking block cursor in hero.
- All animation wrapped in `@media (prefers-reduced-motion: no-preference)`.
  The old 18s `rainbow` animation is deleted.

## Signature Elements

### Hero header (every page)

Replaces the rainbow jumbotron. Terminal-prompt styling:

```
~/steve-bedell $ ▉        ← prompt line, blinking cursor
STEVE BEDELL              ← large Martian Mono
grows software & gardens  ← tagline, muted
```

Sub-pages show the same pattern with the page name in the prompt path
(e.g. `~/steve-bedell/password-generator $`) and a link back home. Exact
tagline copy may be tweaked at implementation; placeholder above is acceptable.

### Project cards (projects.html)

Glossy `gradient-*` buttons become flat `--surface` cards: 1px `--border`
border, phosphor-green border glow on hover, existing SVG icon (recolored to
palette via CSS `filter` or inlined SVG), title, and a one-line description.
Grid layout via CSS grid, replacing `.container-flex` percentage widths.

## Page-by-Page Scope

| Page | Treatment |
|---|---|
| `index.html` | Full redesign: hero, bio, contact links. Inline `<style>` block deleted; spacing moves to shared CSS. |
| `projects.html` | Full redesign: hero + card grid. Inline `<style>` block deleted. |
| `password-generator.html` | Restyle with system (hero, tokens, buttons, inputs). Error output uses `--warn`. |
| `soundboard.html` | Restyle; dead Bootstrap classes (`btn btn-primary btn-lg btn-block`) replaced with real classes. Meme buttons get mono labels + green glow treatment. |
| `storage-demo.html` | Restyle with system. |
| `vibrate.html` | Restyle with system. |
| `security.html` | Restyle **and** de-bloat: remove Vue 2.6, jQuery, and toastr CDN scripts; reimplement the IP/port lookup and browser-info sections in ~80 lines of vanilla JS (`fetch` + DOM updates, inline error/status messages instead of toasts). Same visible behavior. |
| `map.html` | Untouched except favicon/meta consistency (full-screen map). |
| `soundboardPWA/` | **Out of scope.** Standalone installable app; possible follow-up. |

## Cleanup (same pass)

- `target="blank"` → `target="_blank" rel="noopener"` everywhere.
- Favicon link + consistent `<meta charset>` on every page (currently index-only).
- Typo fixes (e.g. "Monitor Resultion" in security.html).
- Consistent indentation (spaces) in touched files.
- Remove dead/commented markup where it is clearly abandoned (e.g. commented
  Soundcloud button stays only if the user wants to revive it — default: remove;
  the commented Steam Machine audio/button in soundboard.html: remove).
- Delete now-unused CSS (gradient classes, jumbotron, rainbow keyframes) after
  all pages are migrated.

## Error Handling

- Security page: failed API fetches show an inline `--warn` message in the
  results area (replacing toastr popups). Network errors and non-200s handled.
- Password generator: existing error paths keep working, restyled with `--warn`.
- Font CDN failure: `font-display: swap` + sans-serif/monospace fallback stacks.

## Testing / Verification

No test framework exists and none is added. Verification is manual:

- Serve locally (`python3 -m http.server`) and click through every page.
- Exercise each interactive feature: generate password, pwned-password check,
  soundboard buttons, storage demo persistence, security IP/port lookup.
- Check narrow (~375px), tablet, and desktop widths.
- Verify `prefers-reduced-motion: reduce` disables animations.
- Contrast-check token pairs against WCAG AA.
- A/B compare against `master` by switching branches.

## Out of Scope

- soundboardPWA restyle
- Light theme / theme toggle
- New content, new pages, URL changes
- Self-hosting fonts (CDN acceptable for now)
