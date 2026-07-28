# Terminal Botanica Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign sbedell.github.io with the "Terminal Botanica" dark aesthetic (green-black + phosphor green, Martian Mono + Atkinson Hyperlegible) while removing legacy Bootstrap-era styling and the Vue/jQuery/toastr dependencies on the security page.

**Architecture:** All design tokens live as CSS variables in `css/mainStyles.css`, which is rewritten first with a temporary "LEGACY" block so unmigrated pages keep rendering. Pages are then migrated one task at a time to the new hero/card/button classes. The final task deletes the legacy block and dead files.

**Tech Stack:** Plain HTML/CSS/JS, no build step. Google Fonts CDN (Martian Mono, Atkinson Hyperlegible). GitHub Pages static hosting.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-18-terminal-botanica-redesign-design.md`
- No frameworks, no build tooling, no new JS libraries.
- Page URLs and structure unchanged. Existing element IDs and global JS function names unchanged (page scripts depend on them).
- Single dark theme; all colors via `:root` CSS variables. No hardcoded colors outside the token block (page CSS may use `var(...)` only).
- All animation wrapped in `@media (prefers-reduced-motion: no-preference)`.
- Every touched page gets: favicon link, `<meta charset="utf-8">`, Google Fonts links, `target="_blank" rel="noopener"` (never `target="blank"`).
- Keep the commented-out Steam Machine audio/button in soundboard.html. Remove the commented-out Soundcloud button in projects.html.
- soundboardPWA/ and soundcloud.html are out of scope (do not edit).
- No test framework exists: each task's verification is a manual browser check with `python3 -m http.server 8000` from the repo root, then visiting `http://localhost:8000/<page>`.
- Commit messages end with: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`

### Shared head snippet

Every page task inserts this block in `<head>` (before the page's stylesheet links). Referred to below as the **FONT+FAVICON block** — always paste this exact code:

```html
  <link href="/favicon.ico" rel="icon" type="image/x-icon">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Martian+Mono:wght@400;700&display=swap">
```

---

### Task 1: Design system — rewrite `css/mainStyles.css`

**Files:**
- Modify: `css/mainStyles.css` (full rewrite)

**Interfaces:**
- Produces (used by all later tasks): CSS classes `.hero`, `.centered` (modifier for `.hero` and `.page`), `.hero-prompt`, `.hero-tagline`, `.hero-nav`, `.page`, `.my-btn`, `.btn-accent`, `.btn-danger`, `.btn-block`, `.card-grid`, `.card`, `.card-title`, `.card-desc`, `.input-box`, `.status-text`, `.error-text`, `.main-footer`, `.img-responsive`, `.reveal` (with `--delay` custom property), plus a `/* LEGACY */` block keeping old pages alive until Task 8.

- [ ] **Step 1: Replace the entire contents of `css/mainStyles.css` with:**

```css
/* ==========================================================================
   Terminal Botanica — sbedell.github.io design system
   All colors and fonts flow through the :root tokens below.
   ========================================================================== */

:root {
    --bg: #0d120e;
    --surface: #151d16;
    --border: #2e3d2f;
    --text: lightgrey;
    --text-muted: #9cb29b;
    --accent: #8fd97a;
    --accent-glow: rgba(143, 217, 122, 0.35);
    --glow-ambient: rgba(143, 217, 122, 0.07);
    --grid-line: rgba(143, 217, 122, 0.045);
    --warn: #e8c468;
    --danger: #e08a68;
    --danger-glow: rgba(224, 138, 104, 0.35);
    --font-mono: "Martian Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;
    --font-body: "Atkinson Hyperlegible", "Helvetica Neue", Arial, sans-serif;
}

/* ---- Base ---- */

* {
    box-sizing: border-box;
    margin: 0;
}

body {
    background-color: var(--bg);
    background-image:
        radial-gradient(1100px 500px at 50% -10%, var(--glow-ambient), transparent 70%),
        repeating-linear-gradient(0deg, var(--grid-line) 0 1px, transparent 1px 36px),
        repeating-linear-gradient(90deg, var(--grid-line) 0 1px, transparent 1px 36px);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 1.0625rem;
    line-height: 1.65;
    min-height: 100vh;
}

h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-mono);
    font-weight: 700;
    line-height: 1.25;
    margin: 1.2em 0 0.5em;
}

h2 { font-size: 1.3rem; }
h3 { font-size: 1.05rem; }

p {
    margin-top: 10px;
    margin-bottom: 10px;
}

a {
    color: var(--accent);
    text-decoration: none;
}

a:hover,
a:focus {
    text-decoration: underline;
    text-underline-offset: 3px;
}

:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}

hr {
    border: 0;
    border-top: 1px solid var(--border);
    margin-top: 24px;
    margin-bottom: 24px;
}

img {
    max-width: 100%;
}

/* Reset button styles. */
button {
    padding: 0;
    border: none;
    font: inherit;
    color: inherit;
    background-color: transparent;
    cursor: pointer;
}

/* ---- Layout ---- */

.page {
    max-width: 860px;
    margin: 0 auto;
    padding: 0 20px 48px;
}

/* Opt-in modifier for pages that center their whole content column. */
.hero.centered,
.page.centered {
    text-align: center;
}

/* ---- Hero header ---- */

.hero {
    max-width: 860px;
    margin: 0 auto;
    padding: 30px 20px 8px;
}

.hero-prompt {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: var(--accent);
    letter-spacing: 0.4px;
    overflow-wrap: anywhere;
}

.hero-prompt::after {
    content: "▉";
    margin-left: 8px;
}

.hero h1 {
    font-size: clamp(1.9rem, 6vw, 3.1rem);
    letter-spacing: -0.03em;
    margin: 14px 0 4px;
}

.hero-tagline {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    color: var(--text-muted);
    margin: 0;
}

.hero-nav {
    margin-top: 16px;
}

.hero-nav a {
    font-family: var(--font-mono);
    font-size: 0.85rem;
}

/* ---- Buttons ---- */

.my-btn,
.btn-link {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    color: var(--text);
    background-color: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px 18px;
    margin: 8px 0;
    text-align: center;
    cursor: pointer;
    -webkit-user-select: none;
    user-select: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.my-btn:hover,
.my-btn:focus-visible,
.btn-link:hover,
.btn-link:focus-visible {
    border-color: var(--accent);
    box-shadow: 0 0 14px var(--accent-glow);
    text-decoration: none;
}

.my-btn:active,
.btn-link:active {
    transform: translateY(1px);
}

.btn-accent {
    border-color: var(--accent);
    color: var(--accent);
}

.btn-danger {
    border-color: var(--danger);
    color: var(--danger);
}

.btn-danger:hover,
.btn-danger:focus-visible {
    border-color: var(--danger);
    box-shadow: 0 0 14px var(--danger-glow);
}

.btn-block {
    display: block;
    width: 100%;
}

/* ---- Project cards ---- */

.card-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
    margin: 18px 0 28px;
}

.card {
    display: flex;
    align-items: center;
    gap: 14px;
    background-color: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px;
    color: var(--text);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.card:hover,
.card:focus-visible {
    border-color: var(--accent);
    box-shadow: 0 0 16px var(--accent-glow);
    text-decoration: none;
}

.card img {
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    filter: invert(0.9);
}

.card-title {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.92rem;
}

.card-desc {
    display: block;
    color: var(--text-muted);
    font-size: 0.9rem;
    margin-top: 2px;
}

@media (min-width: 640px) {
    .card-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* ---- Inputs ---- */

.input-box {
    background-color: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text);
    font-family: var(--font-mono);
    font-size: 0.95rem;
    padding: 8px 12px;
    width: 100%;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.input-box:focus {
    border-color: var(--accent);
    box-shadow: 0 0 10px var(--accent-glow);
    outline: none;
}

/* ---- Status / error text ---- */

.status-text {
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: 0.9rem;
}

.error-text {
    color: var(--warn);
    border: 1px solid var(--warn);
    border-radius: 6px;
    padding: 8px 12px;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    white-space: pre-line;
}

/* ---- Footer ---- */

.main-footer {
    margin-top: 40px;
    color: var(--text-muted);
    font-size: 0.9rem;
}

/* ---- Misc utilities ---- */

.img-responsive {
    display: block;
    height: auto;
    max-width: 100%;
}

/* ---- Motion (opt-in via reduced-motion preference) ---- */

@media (prefers-reduced-motion: no-preference) {
    .hero-prompt::after {
        animation: blink 1.1s steps(2, jump-none) infinite;
    }

    .reveal {
        opacity: 0;
        transform: translateY(10px);
        animation: rise 0.5s ease forwards;
        animation-delay: var(--delay, 0s);
    }

    @keyframes blink {
        50% { opacity: 0; }
    }

    @keyframes rise {
        to {
            opacity: 1;
            transform: none;
        }
    }
}

/* ==========================================================================
   LEGACY — keeps unmigrated pages rendering during the redesign.
   DELETE THIS ENTIRE BLOCK in the final cleanup task.
   ========================================================================== */

.container-flex {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
}

.info-para {
    margin: 5px 15px;
    text-align: center;
}

.jumbotron {
    background: linear-gradient(315deg, #8FCDFF 20%, #1A91ED 100%);
    color: #f4f4f4;
    text-align: center;
    padding-top: 30px;
    padding-bottom: 30px;
    margin-bottom: 30px;
}

.jumbotron h1 { font-size: 38px; }
.jumbotron p { font-size: 21px; }

.projects-link a,
.home-link a {
    font-size: 16px;
}

.main-container {
    margin: 10px auto 25px auto;
    padding: 5px 20px;
}

.my-svg {
    display: block;
    height: 35px;
    width: 35px;
    margin: 5px auto;
}

.btn-lrg {
    min-height: 40px;
    font-size: inherit;
}

.gradient-blue {
    background: linear-gradient(315deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%),
                linear-gradient(315deg, #3FC7FF 0%, #00A3E6 100%);
}

.gradient-purple {
    background: linear-gradient(315deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%), linear-gradient(315deg, #AF6AFF 0%, #6700DF 100%);
}

.gradient-orange {
    background: linear-gradient(315deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%), linear-gradient(315deg, rgb(250, 149, 90) 0%, rgb(250, 112, 21) 100%);
}

.gradient-green {
    background: linear-gradient(315deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%), linear-gradient(315deg, #20FFA7 0%, #00D67C 100%);
}

.gradient-red {
    background: linear-gradient(315deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%), linear-gradient(315deg, #FA5A5A 0%, #FF2F2F 100%);
    color: black;
}

.rainbow-anim {
    background: linear-gradient(124deg, #69c478, #2ba53f, #1ddde8, #4374be);
    background-size: 1800% 1800%;
    animation: rainbow 18s ease infinite;
}

@keyframes rainbow {
    0% { background-position: 0% 82% }
    50% { background-position: 100% 19% }
    100% { background-position: 0% 82% }
}

@media (min-width: 600px) {
    .container-flex { flex-direction: row; }
    .jumbotron { padding-top: 48px; padding-bottom: 48px; }
    .main-container { width: 60vw; }
    .my-btn, .btn-link { width: 45%; }
    .my-svg { height: 40px; width: 40px; }
}

@media (min-width: 1000px) {
    .container-flex { flex-direction: row; }
    .jumbotron h1 { font-size: 63px; }
    .main-container { width: 45vw; }
    .my-svg { height: 60px; width: 60px; }
    .my-btn, .btn-link { width: 30%; }
}
```

- [ ] **Step 2: Verify in browser**

Run: `python3 -m http.server 8000` (from repo root, leave running in background)
Visit `http://localhost:8000/` and `http://localhost:8000/projects.html`.
Expected: dark green-black background with faint grid on every page; old jumbotron/gradient buttons still visible (legacy block working); text readable (light on dark). Fonts still fall back to system (font links come with each page task).

- [ ] **Step 3: Commit**

```bash
git add css/mainStyles.css
git commit -m "Rewrite mainStyles.css as Terminal Botanica design system

Tokens, hero, cards, buttons, inputs, motion; legacy block retained
until all pages migrate.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: index.html redesign

**Files:**
- Modify: `index.html` (full rewrite)

**Interfaces:**
- Consumes: Task 1 classes (`.hero`, `.page`, `.reveal`, `.main-footer`).
- Produces: the canonical hero markup pattern sub-pages copy (prompt line → h1 → tagline → nav).

- [ ] **Step 1: Replace the entire contents of `index.html` with:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Steve Bedell's Homepage</title>
  <meta charset="utf-8">
  <meta name="description" content="Steve Bedell's github.io page. Contains information about Steve and various web projects he's made.">
  <meta name="keywords" content="Web Development, Javascript, OSU, Ohio State, CSE, Computer Science, Home page, Github">
  <meta name="author" content="Steve Bedell">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link href="/favicon.ico" rel="icon" type="image/x-icon">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Martian+Mono:wght@400;700&display=swap">
  <link rel="stylesheet" href="./css/mainStyles.css">
</head>
<body>
  <header class="hero">
    <p class="hero-prompt">~/steve-bedell $</p>
    <h1 class="reveal">Steve Bedell</h1>
    <p class="hero-tagline reveal" style="--delay: 0.1s">grows software &amp; gardens</p>
    <nav class="hero-nav reveal" style="--delay: 0.2s">
      <a href="projects.html">./projects &raquo;</a>
    </nav>
  </header>

  <main class="page">
    <section class="bio reveal" style="--delay: 0.3s">
      <p>Hey, I'm Steve Bedell! I'm a Software Developer with over 7 years of experience, specializing in building user-friendly web applications. My background also includes significant experience in software testing, technical writing, and cybersecurity, allowing me to contribute across the software development life cycle from initial design to final deployment.</p>
      <p>I have a Bachelor's Degree in Computer Science from the Ohio State University.</p>
      <p>Beyond the keyboard, I'm a lifelong learner with a passion for finding solutions to environmental issues like climate change and the biodiversity crisis, primarily through organic gardening and farming. I also enjoy exploring local parks via hiking and biking, finding inspiration and balance in nature.</p>
      <p>I'm a husband and proud father of energetic twin toddler boys.</p>
      <p>Feel free to connect with me through the links below!</p>
    </section>

    <section class="contact reveal" style="--delay: 0.4s">
      <h3>Connect with Me</h3>
      <p><a href="https://www.linkedin.com/in/stevebedell" target="_blank" rel="noopener">LinkedIn</a></p>
      <p><a href="https://github.com/sbedell" target="_blank" rel="noopener">GitHub</a></p>
    </section>

    <footer class="main-footer">
      <hr>
      <p>&copy; Steve Bedell 2013 - <span id="copyright-date"></span></p>
      <p>Hand-written HTML, CSS, and JavaScript — no frameworks, no build step.</p>
      <div>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons" rel="noopener">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon" rel="noopener">www.flaticon.com</a> is licensed by <a href="https://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank" rel="noopener">CC 3.0</a></div>
    </footer>
  </main>

  <script>
    document.getElementById("copyright-date").innerText = `${new Date().getFullYear()}`;
  </script>
</body>
</html>
```

Note: the old footer line bragging about removing Bootstrap/jQuery is replaced with the shorter "Hand-written…" line above.

- [ ] **Step 2: Verify in browser**

Visit `http://localhost:8000/`.
Expected: terminal prompt line with blinking block cursor, large Martian Mono "Steve Bedell", muted tagline, staggered fade-up of bio/contact on load. No blue jumbotron. Fonts are visibly mono (headings) + Atkinson (body). Toggle "Emulate CSS prefers-reduced-motion: reduce" in devtools Rendering tab → content appears instantly with no animation and nothing stays hidden.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Redesign index.html with Terminal Botanica hero and layout

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: projects.html card grid

**Files:**
- Modify: `projects.html` (full rewrite)

**Interfaces:**
- Consumes: Task 1 `.card-grid` / `.card` / `.card-title` / `.card-desc`, hero pattern from Task 2.

- [ ] **Step 1: Replace the entire contents of `projects.html` with:**

```html
<!DOCTYPE html>
<html lang="en-US">
<head>
  <title>Projects | Steve Bedell</title>
  <meta charset="utf-8">
  <meta name="author" content="Steve Bedell">
  <meta name="description" content="A handful of mini projects I've created, a bit of my portfolio.">
  <meta name="keywords" content="JavaScript, web development, UI, UX, portfolio, demos, projects">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link href="/favicon.ico" rel="icon" type="image/x-icon">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Martian+Mono:wght@400;700&display=swap">
  <link rel="stylesheet" href="./css/mainStyles.css">
</head>

<body>
  <header class="hero">
    <p class="hero-prompt">~/steve-bedell/projects $</p>
    <h1 class="reveal">Projects</h1>
    <p class="hero-tagline reveal" style="--delay: 0.1s">demos, experiments &amp; small tools</p>
    <nav class="hero-nav reveal" style="--delay: 0.2s">
      <a href="./">&laquo; cd ~ (go back)</a>
    </nav>
  </header>

  <main class="page">
    <section class="reveal" style="--delay: 0.3s">
      <h2>Progressive Web Apps</h2>
      <p><a href="https://en.wikipedia.org/wiki/Progressive_web_applications" target="_blank" rel="noopener">Progressive Web Apps</a> are installable to home screens of Android and iOS mobile devices.</p>

      <div class="card-grid">
        <a class="card" href="./soundboardPWA" target="_blank" rel="noopener">
          <img alt="" src="./img/pageIcons/music-player.svg">
          <span>
            <span class="card-title">Soundboard PWA</span>
            <span class="card-desc">Installable soundboard web app with offline support</span>
          </span>
        </a>
      </div>
    </section>

    <section class="reveal" style="--delay: 0.4s">
      <h2>Browser Extensions</h2>
      <div class="card-grid">
        <a class="card" href="https://addons.mozilla.org/en-US/firefox/addon/remove-fbclid-and-utm/" target="_blank" rel="noopener">
          <img alt="" src="img/pageIcons/cross.svg">
          <span>
            <span class="card-title">FBClid &amp; UTM Remover</span>
            <span class="card-desc">Firefox extension that strips tracking query params</span>
          </span>
        </a>
      </div>
    </section>

    <section class="reveal" style="--delay: 0.5s">
      <h2>Web Creations</h2>
      <div class="card-grid">
        <a class="card" href="./password-generator">
          <img alt="" src="img/pageIcons/pin-code-light.svg">
          <span>
            <span class="card-title">Secure Password Generator</span>
            <span class="card-desc">Random passwords + Have I Been Pwned breach check</span>
          </span>
        </a>
        <a class="card" href="./security">
          <img alt="" src="./img/pageIcons/shield.svg">
          <span>
            <span class="card-title">Security &amp; Privacy</span>
            <span class="card-desc">SANS ISC / DShield lookups and browser info</span>
          </span>
        </a>
        <a class="card" href="./soundboard">
          <img alt="" src="./img/pageIcons/music-player.svg">
          <span>
            <span class="card-title">Soundboard</span>
            <span class="card-desc">HTML5 Audio meme machine</span>
          </span>
        </a>
        <a class="card" href="./vibrate">
          <img alt="" src="./img/pageIcons/smartphone-call.svg">
          <span>
            <span class="card-title">Vibrate API Demo</span>
            <span class="card-desc">Buzz your phone from the browser</span>
          </span>
        </a>
        <a class="card" href="./storage-demo">
          <img alt="" src="./img/pageIcons/database.svg">
          <span>
            <span class="card-title">Web Storage Demo</span>
            <span class="card-desc">localStorage &amp; sessionStorage in action</span>
          </span>
        </a>
        <a class="card" href="./map" target="_blank" rel="noopener">
          <img alt="" src="./img/pageIcons/map-location.svg">
          <span>
            <span class="card-title">Leaflet Map Demo</span>
            <span class="card-desc">OpenStreetMap + Leaflet.js</span>
          </span>
        </a>
      </div>
    </section>

    <footer class="main-footer">
      <hr>
      <p>&copy; Steve Bedell 2013 - <span id="copyright-date"></span></p>
    </footer>
  </main>

  <script>
    document.getElementById("copyright-date").innerText = `${new Date().getFullYear()}`;
  </script>
</body>
</html>
```

Notes: the commented-out Soundcloud card is intentionally gone (spec). Icon `alt=""` because each card's text label sits next to the icon (decorative image).

- [ ] **Step 2: Verify in browser**

Visit `http://localhost:8000/projects.html`.
Expected: two-column card grid on desktop, single column below 640px; icons render near-white via invert filter; cards glow green on hover; all links navigate correctly.

- [ ] **Step 3: Commit**

```bash
git add projects.html
git commit -m "Redesign projects.html as Terminal Botanica card grid

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: password-generator page

**Files:**
- Modify: `password-generator.html`
- Modify: `css/password-styles.css` (full rewrite)
- Do NOT touch: `js/password-gen.js` (IDs `pw-length`, `uppercaseCb`, `lowercaseCb`, `numbersCb`, `specialCharsCb`, `ambiguous-cb`, `genPassBtn`, `check-pw-btn`, `password-box`, `api-output`, `error-output` must keep working; JS toggles `#error-output` via `style.display`)

**Interfaces:**
- Consumes: Task 1 classes; hero pattern from Task 2.

- [ ] **Step 1: Update `password-generator.html` `<head>`**

Replace the two existing `<link rel="stylesheet" ...>` lines with the FONT+FAVICON block followed by:

```html
    <link rel="stylesheet" href="./css/mainStyles.css">
    <link rel="stylesheet" href="./css/password-styles.css">
```

(`mainStyles.css` now loads first so the page stylesheet can override it.)

- [ ] **Step 2: Update `password-generator.html` `<body>`**

Replace `<main>` opening through the `<h1>` line:

```html
    <header class="hero centered">
      <p class="hero-prompt">~/steve-bedell/password-generator $</p>
      <h1 class="reveal">Password Generator</h1>
      <p class="hero-tagline reveal" style="--delay: 0.1s">random passwords, checked against known breaches</p>
    </header>

    <div class="page centered">
```

The hero-nav "cd ~" link is omitted here — the footer's "Back to Home page" link is the only back-nav on this page. The wrapper is a `<div>`, not `<main>`, because the page has no other landmark content.

Then inside the body:
- Delete the stray `<br>` after the opening wrapper.
- On the `#pw-length` input add `class="input-box"` and set `value="14"`.
- Change the generate button classes: `class="my-btn btn-lrg gradient-green"` → `class="my-btn btn-accent btn-block"`.
- Change the check button classes: `class="my-btn btn-lrg"` → `class="my-btn btn-block"`, and delete the `<br>` between the two buttons.
- On `#password-box` add `class="input-box"`.
- On `#error-output` add `class="error-text"` (JS shows/hides it via `style.display`; the default `display: none` moves to the page CSS below).
- Replace `<footer class="footer">` with `<footer class="main-footer">` and move it inside the wrapper so structure is `<div class="page centered"> ... <footer class="main-footer">...</footer></div>`.

- [ ] **Step 3: Replace the entire contents of `css/password-styles.css` with:**

```css
/* Centering comes from the global `.centered` modifier in mainStyles.css. */

.page > div:first-of-type {
  margin-top: 25px;
}

#pw-length {
  width: 90px;
  height: auto;
  text-align: center;
  margin-left: 8px;
}

#password-box {
  font-size: 1.15rem;
  margin-top: 12px;
}

#api-output {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  white-space: pre-line;
}

#error-output {
  display: none;
  margin: 12px auto;
}

#genPassBtn,
.checkboxes label {
  -webkit-user-select: none;
  user-select: none;
}

.checkboxes {
  display: inline-block;
  text-align: left;
  margin: 25px auto 20px;
}

.checkboxes > div {
  margin-bottom: 12px;
}

.checkboxes input[type="checkbox"] {
  accent-color: var(--accent);
}

.page-description {
  color: var(--text-muted);
  padding-top: 15px;
}

@media (min-width: 600px) {
  .page p {
    max-width: 60ch;
    margin-left: auto;
    margin-right: auto;
  }

  #password-box {
    width: 60%;
  }
}

/* Show abbr titles inline on narrow screens (no hover) */
@media (max-width: 800px) {
  abbr[title]:after {
    content: " (" attr(title) ")";
  }
}

@media (min-width: 760px) {
  .btn-block {
    width: 40%;
    margin: 10px auto;
  }
}
```

- [ ] **Step 4: Verify in browser**

Visit `http://localhost:8000/password-generator.html`.
Expected: hero with page path prompt; checkboxes with green accent; Generate fills `#password-box` (mono font); length < 12 triggers the amber-bordered warning box; "Check Pwned Passwords" on a common password (e.g. type `password123`) shows the PWNED warning; on a generated one shows "Good news! No Pwnage found!".

- [ ] **Step 5: Commit**

```bash
git add password-generator.html css/password-styles.css
git commit -m "Restyle password generator with Terminal Botanica system

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: soundboard page

**Files:**
- Modify: `soundboard.html`
- Modify: `css/soundboard-styles.css` (full rewrite)
- Do NOT touch: `soundboardPWA/soundboard.js` (globals `playAudio`, `playAllAudio`, `playRandomClips` used by inline onclick)

**Interfaces:**
- Consumes: Task 1 classes; hero pattern from Task 2.

- [ ] **Step 1: Update `soundboard.html`**

In `<head>`: add the FONT+FAVICON block before the stylesheet links (keep both stylesheet links, mainStyles first).

In `<body>`:
- Keep all `<audio>` elements exactly as-is, including the commented-out Steam Machine one (user wants it kept).
- Replace `<div class="main-container">` with `<div class="page">`.
- Insert the hero between `<main>`'s parent opening and `<main>`:

```html
    <header class="hero centered">
      <p class="hero-prompt">~/steve-bedell/soundboard $</p>
      <h1 class="reveal">Soundboard</h1>
      <p class="hero-tagline reveal" style="--delay: 0.1s">HTML5 Audio meme machine — sound on</p>
    </header>
```

The hero-nav "cd ~" link is omitted — the footer's "Back to Home page" link is the only back-nav.

and delete the old `<h1>Soundboard</h1>` inside `<main>`. Move the hero ABOVE the `.page` div so the structure matches other pages (hero, then `<div class="page"><main>…`).
- Replace every `class="btn btn-primary btn-lg btn-block"` with `class="my-btn btn-block"` (12 buttons + the 2 Jurassic Park ones = 14). Keep the commented-out Steam Machine button line, but update its classes the same way inside the comment.
- Replace the two `class="btn btn-lg btn-block gradient-red"` with `class="my-btn btn-danger btn-block"`.
- Remove all the `<br />` tags between buttons (button margin handles spacing now).
- Footer: keep, ensure it has `class="main-footer"`.

- [ ] **Step 2: Replace the entire contents of `css/soundboard-styles.css` with:**

```css
h2, h3 {
    text-align: center;
    margin-bottom: 15px;
}

main .my-btn {
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

main {
    margin-top: 25px;
}
```

- [ ] **Step 3: Verify in browser**

Visit `http://localhost:8000/soundboard.html`.
Expected: stacked full-width mono-font buttons that glow green on hover; the two "danger" buttons (PLAY ALL, 5 Random) in terracotta; every button plays its sound; Steam Machine button still present as a comment in source (view-source to confirm).

- [ ] **Step 4: Commit**

```bash
git add soundboard.html css/soundboard-styles.css
git commit -m "Restyle soundboard, replace dead Bootstrap classes

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: vibrate + storage-demo pages

**Files:**
- Modify: `vibrate.html`
- Modify: `css/vibrateStyles.css` (full rewrite)
- Modify: `storage-demo.html`
- Modify: `css/dom-storage-demo.css` (full rewrite)
- Do NOT touch: `js/html5-vibrate.js`, `js/dom-storage-demo.js` (IDs `viblen`, `vibinterval`, `pauselen`, `bgcolor`, `sessionstore`, `deleteButton` must survive)

**Interfaces:**
- Consumes: Task 1 classes; hero pattern from Task 2.

- [ ] **Step 1: Update `vibrate.html`**

In `<head>`: add the FONT+FAVICON block before the stylesheet links; add `<meta charset="utf-8">` as the first meta (replacing the `http-equiv` Content-Type line).

In `<body>`:
- Replace `<div class="main-container">` + `<h1>HTML 5 Vibration Demo</h1>` with:

```html
		<header class="hero">
			<p class="hero-prompt">~/steve-bedell/vibrate $</p>
			<h1 class="reveal">Vibration Demo</h1>
			<p class="hero-tagline reveal" style="--delay: 0.1s">navigator.vibrate() — phones only</p>
		</header>

		<div class="page">
```

The hero-nav "cd ~" link is omitted — the footer's "Back to Home" link is the only back-nav.

- Button classes: `my-btn btn-lrg gradient-green` → `my-btn btn-accent`; `my-btn btn-lrg gradient-red` → `my-btn btn-danger`.
- Footer keeps `class="main-footer"`.

- [ ] **Step 2: Replace the entire contents of `css/vibrateStyles.css` with:**

```css
.input-box {
    width: 120px;
    margin: 5px 0 12px;
}

label {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: var(--text-muted);
    display: block;
    margin-top: 10px;
}

@media (max-width: 400px) {
    .input-box {
        width: 100%;
    }

    .my-btn {
        width: 100%;
    }
}
```

- [ ] **Step 3: Update `storage-demo.html`**

In `<head>`: add the FONT+FAVICON block before the stylesheet links.

In `<body>`:
- Replace `<div class="wrapper">` + `<h1>Web Storage Demo</h1>` with:

```html
		<header class="hero">
			<p class="hero-prompt">~/steve-bedell/storage-demo $</p>
			<h1 class="reveal">Web Storage Demo</h1>
			<p class="hero-tagline reveal" style="--delay: 0.1s">localStorage &amp; sessionStorage, persisted live</p>
		</header>

		<div class="page wrapper">
```

- Add `class="input-box"` to the `#sessionstore` text input.
- Change delete button classes: `my-btn btn-lrg gradient-red` → `my-btn btn-danger`.
- Footer keeps `class="main-footer"`.

- [ ] **Step 4: Replace the entire contents of `css/dom-storage-demo.css` with:**

```css
.wrapper > div {
	display: flex;
	align-items: center;
	gap: 12px;
	flex-wrap: wrap;
	margin: 14px 0;
}

.wrapper label {
	font-family: var(--font-mono);
	font-size: 0.85rem;
	color: var(--text-muted);
}

.wrapper input[type="text"] {
	flex: 1;
	min-width: 200px;
}

input[type="color"] {
	background: var(--surface);
	border: 1px solid var(--border);
	border-radius: 6px;
	width: 55px;
	height: 38px;
	padding: 3px;
	cursor: pointer;
}

/* Keep the hero and content panel on the base background so the
   JS-driven body color only shows in the surrounding gutter. */
.page.wrapper {
	background-color: var(--bg);
	padding-top: 15px;
}

.hero {
	background-color: var(--bg);
}

@media (max-width: 900px) {
	.page.wrapper {
		margin: 15px;
	}
}
```

Note: `js/dom-storage-demo.js` sets `document.body.style.backgroundColor` from the color picker — leave the JS alone. The `.page.wrapper` / `.hero` rules above pin those regions to `--bg`, so the picked color reads as a colored frame around a dark content panel rather than washing out the whole page. Verify the picked color is clearly visible in the gutter.

- [ ] **Step 5: Verify in browser**

Visit `http://localhost:8000/vibrate.html` — inputs and buttons themed; on a phone (or just visually on desktop) buttons present; no layout break.
Visit `http://localhost:8000/storage-demo.html` — color picker changes background and persists on reload (localStorage); text persists in the tab session (sessionStorage); Clear button resets both.

- [ ] **Step 6: Commit**

```bash
git add vibrate.html css/vibrateStyles.css storage-demo.html css/dom-storage-demo.css
git commit -m "Restyle vibrate and storage-demo pages

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: security page — restyle and de-bloat

**Files:**
- Modify: `security.html` (full body rework)
- Modify: `js/security-scripts.js` (full rewrite, vanilla JS)
- Modify: `css/security-styles.css` (full rewrite)

**Interfaces:**
- Consumes: Task 1 classes (`.input-box`, `.my-btn`, `.btn-accent`, `.btn-danger`, `.status-text`, `.error-text`, `.img-responsive`), hero pattern from Task 2.
- Produces: element IDs consumed by the new script: `ipaddr`, `port`, `search-ip-btn`, `search-port-btn`, `clear-results-btn`, `lookup-status`, `ip-results`, `port-results`, `lookup-error`, `user-agent`, `monitor-res`, `browser-res`, `copyright-dates`.

- [ ] **Step 1: Replace the entire contents of `security.html` with:**

```html
<!DOCTYPE html>
<html lang="en-US">
<head>
	<title>Security</title>
	<meta charset="utf-8">
	<meta name="author" content="Steve Bedell">
	<meta name="description" content="Information security dashboard which pulls in content, news, and other information into one place.">
	<meta name="keywords" content="JavaScript, Information Security, web security, cyber, security">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link href="/favicon.ico" rel="icon" type="image/x-icon">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Martian+Mono:wght@400;700&display=swap">
	<link rel="stylesheet" href="./css/mainStyles.css">
	<link rel="stylesheet" href="./css/security-styles.css">
</head>
<body>
	<header class="hero centered">
		<p class="hero-prompt">~/steve-bedell/security $</p>
		<h1 class="reveal">Security &amp; Privacy</h1>
		<p class="hero-tagline reveal" style="--delay: 0.1s">SANS ISC lookups &amp; what your browser leaks</p>
	</header>

	<div class="page">
		<main>
			<a target="_blank" rel="noopener" href="https://isc.sans.edu">
				<img class="img-responsive" title="Internet Storm Center Infocon Status"
					alt="Internet Storm Center Infocon Status" src="https://isc.sans.edu/images/status.gif">
			</a>

			<h3>SANS DShield and ISC Data</h3>

			<section id="search-section">
				<p>Search IP address for potential attacks against that IP address.</p>
				<input id="ipaddr" class="input-box" type="text" placeholder="IP Address" aria-label="IP Address">
				<button id="search-ip-btn" class="my-btn btn-accent" type="button">Search IP Address</button>

				<p>Search for port numbers to find out more information on that port.</p>
				<input id="port" class="input-box" type="number" placeholder="Port Number" min="0" max="65535" aria-label="Port Number">
				<button id="search-port-btn" class="my-btn btn-accent" type="button">Search Ports</button>

				<div>
					<button id="clear-results-btn" class="my-btn btn-danger" type="button">Clear Results</button>
				</div>

				<p id="lookup-status" class="status-text" hidden></p>
				<section id="port-results" hidden></section>
				<section id="ip-results" hidden></section>
				<p id="lookup-error" class="error-text" hidden></p>
			</section>
			<hr>

			<div>
				<h3>Browser Info</h3>

				<div id="findipwidget"></div>
				<div class="findiplink" id="findipurl">
					Powered by <a href="https://www.find-ip.net/" target="_blank" rel="noopener">Find-IP.net</a>
				</div>
				<script defer src="https://api.find-ip.net/widget.js?width=240"></script>

				<section id="browser-section">
					<p><b>User Agent:</b> <span id="user-agent"></span></p>
					<p><b>Monitor Resolution:</b> <span id="monitor-res"></span></p>
					<p><b>Browser Resolution:</b> <span id="browser-res"></span></p>
				</section>

				<p><a href="https://arstechnica.com/tech-policy/2013/08/in-aclu-lawsuit-scientist-demolishes-nsa-its-just-metadata-excuse/" target="_blank" rel="noopener">"It's just metadata"</a>, right?</p>
			</div>
		</main>

		<footer class="main-footer">
			<hr>
			<p>&copy; Steve Bedell <span id="copyright-dates"></span>.</p>
			<p>Built with <a href="https://isc.sans.edu/api/" target="_blank" rel="noopener">Sans ISC / DShield</a> APIs.</p>
			<p class="home-link"><a href="./">Back to Home page</a></p>
		</footer>
	</div>

	<script src="js/security-scripts.js"></script>
</body>
</html>
```

Notes: jQuery, toastr, Vue, and the Find-IP.net third-party widget script are gone. Find-IP duplicate info (IP) is dropped — the DShield lookups and browser info section remain. "Monitor Resultion" typo is fixed. Toastr's "Searching…" toast becomes the inline `#lookup-status` line.

- [ ] **Step 2: Replace the entire contents of `js/security-scripts.js` with:**

```js
"use strict";

const el = (id) => document.getElementById(id);

const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

function clearResults() {
    for (const id of ["lookup-status", "port-results", "ip-results", "lookup-error"]) {
        el(id).hidden = true;
    }
    el("port-results").replaceChildren();
    el("ip-results").replaceChildren();
}

function showError(message) {
    clearResults();
    el("lookup-error").textContent = message;
    el("lookup-error").hidden = false;
}

function showStatus(message) {
    el("lookup-status").textContent = message;
    el("lookup-status").hidden = false;
}

function addRow(container, label, value) {
    if (!value) {
        return;
    }
    const row = document.createElement("p");
    const labelEl = document.createElement("b");
    labelEl.textContent = `${label}: `;
    row.append(labelEl, String(value));
    container.appendChild(row);
}

async function searchIpAddress() {
    clearResults();
    const ipAddress = el("ipaddr").value.trim();

    if (!IPV4_REGEX.test(ipAddress)) {
        showError("Error: Invalid IP (ipv4) address.");
        return;
    }

    showStatus("Searching IP address…");

    try {
        const response = await fetch(`https://www.dshield.org/api/ip/${ipAddress}?json`);
        if (!response.ok) {
            throw new Error(`DShield API returned ${response.status}`);
        }
        const { ip } = await response.json();

        const container = el("ip-results");
        addRow(container, "IP Address", ip.number);
        addRow(container, "Name", ip.asname);
        addRow(container, "Country", ip.ascountry);
        if (ip.attacks) {
            const dates = ip.mindate && ip.maxdate ? ` from ${ip.mindate} to ${ip.maxdate}` : "";
            addRow(container, "Security", `${ip.attacks} attacks against this IP addr${dates}`);
        } else {
            addRow(container, "Security", "No recorded / detected attacks against this IP address.");
        }
        addRow(container, "Abuse Contact", ip.asabusecontact);

        el("lookup-status").hidden = true;
        container.hidden = false;
    } catch (error) {
        console.error(error);
        showError(`Error: ${error.message}`);
    }
}

async function searchPort() {
    clearResults();
    const port = el("port").value.trim();

    if (!/^\d+$/.test(port) || parseInt(port, 10) > 65535) {
        showError("Error: Invalid port number. Valid ports are 0-65535.");
        return;
    }

    showStatus("Searching port…");

    try {
        const response = await fetch(`https://www.dshield.org/api/port/${port}?json`);
        if (!response.ok) {
            throw new Error(`DShield API returned ${response.status}`);
        }
        const data = await response.json();

        const container = el("port-results");
        addRow(container, "Port #", data.number);
        addRow(container, "TCP Port Name / Type", data.services?.tcp?.name);
        addRow(container, "TCP Service", data.services?.tcp?.service);
        addRow(container, "UDP Port Name / Type", data.services?.udp?.name);
        addRow(container, "UDP Service", data.services?.udp?.service);

        el("lookup-status").hidden = true;
        container.hidden = false;
    } catch (error) {
        console.error(error);
        showError(`Error: ${error.message}`);
    }
}

function initBrowserInfo() {
    el("user-agent").textContent = navigator.userAgent;
    el("monitor-res").textContent = `${window.screen.width} x ${window.screen.height}`;

    const updateBrowserSize = () => {
        el("browser-res").textContent = `${window.innerWidth} x ${window.innerHeight}`;
    };
    window.addEventListener("resize", updateBrowserSize);
    updateBrowserSize();
}

el("search-ip-btn").addEventListener("click", searchIpAddress);
el("search-port-btn").addEventListener("click", searchPort);
el("clear-results-btn").addEventListener("click", clearResults);
el("copyright-dates").textContent = `2013 - ${new Date().getFullYear()}`;
initBrowserInfo();
```

Note: the old code's port bound (`< 65536`) and error text ("0-65536") disagreed; both now use 65535, matching the input's `max`.

- [ ] **Step 3: Replace the entire contents of `css/security-styles.css` with:**

```css
main {
  text-align: center;
}

main .img-responsive {
  margin: 0 auto;
}

.hero {
  margin-bottom: 25px;
}

#search-section {
  margin: auto;
}

#search-section .input-box {
  max-width: 320px;
  margin: 4px auto 10px;
}

#port-results,
#ip-results {
  text-align: left;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 6px 16px;
  margin: 14px auto;
  max-width: 480px;
}

#lookup-error {
  max-width: 480px;
  margin: 14px auto;
}

#browser-section {
  margin-top: 20px;
  overflow-wrap: anywhere;
}

/* The find-ip.net widget ships its own light-theme inline styles;
   !important is the only lever that reaches them. */
a#findipinfo {
  background-color: var(--bg) !important;
  color: lightgrey !important;
  margin: auto;
}

#findipurl {
  margin: auto;
}
```

- [ ] **Step 4: Verify in browser**

Visit `http://localhost:8000/security.html`. Devtools console must show no errors (no missing Vue/jQuery/toastr).
- Search IP `8.8.8.8` → status line appears, then a surface-boxed result with Name/Country rows.
- Search port `443` → boxed TCP/UDP rows.
- Bad input (`999.1.1.1`, port `70000`) → amber inline error.
- Clear Results empties everything.
- Browser Info section shows UA + resolutions; resizing window updates browser resolution.
- Network tab: no requests to jsdelivr/cloudflare/jquery. The find-ip.net widget is deliberately kept (it is the one third-party script on this page) — confirm its box renders on the page background, not white.

- [ ] **Step 5: Commit**

```bash
git add security.html js/security-scripts.js css/security-styles.css
git commit -m "Restyle security page; replace Vue/jQuery/toastr with vanilla JS

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: Final cleanup — legacy CSS removal, map.html meta, dead files

**Files:**
- Modify: `css/mainStyles.css` (delete LEGACY block)
- Modify: `map.html` (favicon + charset only)
- Delete: `css/buttonStyles.css` (referenced by no page)

**Interfaces:**
- Consumes: all pages already migrated (Tasks 2–7). `soundcloud.html` still references legacy classes but is unlinked from navigation (its projects.html card was removed years ago) — visual degradation there is accepted; do not edit it.

- [ ] **Step 1: Delete the LEGACY block**

In `css/mainStyles.css`, delete everything from the comment line `/* ===== ... LEGACY — keeps unmigrated pages rendering ...` to the end of the file.

- [ ] **Step 2: Verify no live page still uses legacy classes**

Run:
```bash
grep -rn "jumbotron\|gradient-\|container-flex\|main-container\|my-svg\|btn-lrg\|rainbow-anim\|info-para" --include="*.html" . | grep -v soundboardPWA | grep -v soundcloud.html
```
Expected: no output. If any line prints, that page was missed — fix it before proceeding (replace the legacy class with its Task 1 equivalent).

- [ ] **Step 3: Update `map.html` head**

After the `<meta charset="utf-8">` line (already present), add:

```html
    <link href="/favicon.ico" rel="icon" type="image/x-icon">
```

No other changes — full-screen map page keeps its own styling.

- [ ] **Step 4: Delete dead stylesheet**

```bash
git rm css/buttonStyles.css
```

- [ ] **Step 5: Full site click-through**

With `python3 -m http.server 8000` running, visit every page: `/`, `/projects.html`, `/password-generator.html`, `/soundboard.html`, `/vibrate.html`, `/storage-demo.html`, `/security.html`, `/map.html`.
- Every page: dark theme, hero renders, fonts load (Network tab shows fonts.gstatic.com), no console errors.
- Narrow the window to ~375px: no horizontal scroll on any page.
- Devtools Rendering → emulate `prefers-reduced-motion: reduce`: reload index — content all visible, no animations, cursor doesn't blink.
- Exercise: generate password + pwned check, 2 soundboard buttons, storage persistence, security IP/port lookup, map pans.

- [ ] **Step 6: Commit**

```bash
git add css/mainStyles.css map.html
git commit -m "Remove legacy CSS block and dead buttonStyles.css; map.html favicon

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 9: Pre-merge follow-ups

Tasks 1–8 are implemented and committed on `redesign/terminal-botanica`, followed by five
hand-tweak commits (`7a9ddcb`..`a4473bd`) that the snippets above have been updated to match.
These are the loose ends found when auditing the branch against `master`.

**Fixed (one commit, "Consolidate centering modifier…"):**

- [x] **Two competing "centered" conventions.** `password-generator.html` used page-scoped
  `.hero-centered` / `.page-centered` while other pages used the global `.hero.centered`.
  Resolved by promoting `.centered` in `mainStyles.css` to a shared modifier
  (`.hero.centered, .page.centered`), deleting the page-scoped pair, and switching
  `password-generator.html` to `class="hero centered"` / `class="page centered"`.

- [x] **`rel="noopener"` and `https://` on the find-ip link.** The link was `http://www.find-ip.net/`
  with `target="_blank"` and no `rel`, violating the Global Constraint above and making a
  mixed-scheme navigation off an HTTPS Pages site.

- [x] **Over-broad selectors in `css/password-styles.css`.** `.page div:first-child` was a
  descendant selector, so its 25px top margin also landed on the first checkbox row; it is now
  `.page > div:first-of-type`. The 25px moved onto `.checkboxes`'s own top margin (`0px` → `25px`)
  so the rendered gap is unchanged. `div p { max-width: 60vw }` became `.page p { max-width: 60ch }`
  — scoped to the page, and back to a character-based measure instead of a viewport-based one.

**Decided — intentional, no action:**

- [x] **Hero back-nav removed from the four sub-pages.** password-generator, soundboard, vibrate,
  and storage-demo intentionally dropped their `« cd ~` nav; the footer "Back to Home page" link
  plus the browser back button are considered sufficient. index.html and projects.html keep
  `.hero-nav`. Do not "restore" these.

- [x] **find-ip.net widget on the security page.** Deliberately kept — Task 7's original removal
  was not wanted. The two `!important` overrides in `security-styles.css` are the accepted cost of
  dark-theming a third-party widget that ships its own inline light styles.

- [x] **`--text: lightgrey`.** Intentional. Named colors are fine in this codebase.

**Known and accepted (no action):**

- `soundcloud.html` is unlinked from navigation and still references `main-container`, `btn-lrg`,
  and `gradient-orange`, none of which exist in any stylesheet since the LEGACY block was deleted.
  It now renders essentially unstyled. Task 8 already accepted this and it stays as-is for now.
- `.home-link`, `.bio`, `.contact`, and `.findiplink` are used in HTML but defined in no
  stylesheet. They are semantic hooks only — harmless, but nothing styles them.

- [x] **Final check: Task 8 Step 5 click-through** completed 2026-07-28 against the branch tip
  (after `f42d591`), covering the tweak commits and the centering/selector consolidation. All
  pages verified — the redesign is done and the branch is ready to merge.
