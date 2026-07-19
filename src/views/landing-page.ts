import { FONT_FACE_CSS } from './font.js'

export function renderLandingPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Context Capsule — Coding handoffs that survive agent switches</title>
  <meta name="description" content="Use Context Capsule with your favourite coding agent to hand off a live coding task without starting over. Local-first, freshness-checked, and open source.">
  <meta name="keywords" content="coding agent handoff, Codex handoff, Claude Code handoff, Cursor handoff, Agent Skill, AI coding workflow, structured handoff">
  <meta name="robots" content="index, follow">
  <meta name="author" content="Z13Labs">
  <link rel="canonical" href="https://www.contextcapsule.ai">
  <meta property="og:title" content="Context Capsule — Switch coding agents without losing the thread">
  <meta property="og:description" content="A local-first Agent Skill for structured, freshness-checked coding handoffs.">
  <meta property="og:image" content="https://www.contextcapsule.ai/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="https://www.contextcapsule.ai">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Context Capsule">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Context Capsule — Switch coding agents without losing the thread">
  <meta name="twitter:description" content="Local-first coding handoffs for Codex, Claude Code, Cursor, and other skills-compatible agents.">
  <meta name="twitter:image" content="https://www.contextcapsule.ai/og-image.png">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='12' fill='%230a0a0a'/><text x='50' y='68' text-anchor='middle' font-size='52' font-family='monospace' fill='%23e0e0e0'>C</text></svg>">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Context Capsule",
    "description": "An open-source, local-first Agent Skill for structured coding handoffs between AI coding agents.",
    "url": "https://www.contextcapsule.ai",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "isAccessibleForFree": true,
    "codeRepository": "https://github.com/Johnny-Z13/context-capsule",
    "creator": {
      "@type": "Organization",
      "name": "Z13Labs",
      "url": "https://z13labs.com"
    }
  }
  </script>
  <style>
    ${FONT_FACE_CSS}
    :root {
      color-scheme: dark;
      --background: #0a0a0a;
      --panel: #101010;
      --line: #202020;
      --muted: #777;
      --quiet: #484848;
      --text: #e0e0e0;
      --green: #16a34a;
      --paper: #e8f5e8;
      --ink: #162016;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      background: var(--background);
      color: var(--text);
      font-family: 'Departure Mono', monospace;
      font-size: 16px;
      line-height: 1.6;
    }
    a { color: inherit; }
    button, code, pre { font: inherit; }
    .container {
      width: min(1120px, calc(100% - 2rem));
      margin: 0 auto;
      padding: 2rem 0 4rem;
    }
    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid #151515;
    }
    .wordmark {
      font-size: .76rem;
      letter-spacing: .16em;
      text-transform: uppercase;
      text-decoration: none;
    }
    .topnav { display: flex; align-items: center; gap: 1.25rem; }
    .topnav a, .footer-nav a {
      color: var(--muted);
      font-size: .72rem;
      text-decoration: none;
    }
    .topnav a:hover, .footer-nav a:hover { color: var(--text); }
    .topnav .top-cta {
      padding: .45rem .65rem;
      border: 1px solid #333;
      color: var(--text);
    }
    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(410px, 1fr);
      gap: clamp(2.5rem, 5vw, 4.5rem);
      align-items: center;
      min-height: 610px;
      margin-bottom: 0;
      padding: 3.5rem 0 4rem;
    }
    .eyebrow, .section-label {
      color: var(--green);
      font-size: .67rem;
      letter-spacing: .18em;
      text-transform: uppercase;
    }
    .hero h1 {
      max-width: 620px;
      margin: 1.2rem 0 1.4rem;
      font-size: clamp(2.2rem, 4.4vw, 3.8rem);
      font-weight: normal;
      letter-spacing: -.055em;
      line-height: 1.06;
    }
    .hero-copy {
      max-width: 590px;
      margin: 0;
      color: #9a9a9a;
      font-size: clamp(.9rem, 2vw, 1.02rem);
    }
    .hero-copy strong { color: var(--text); font-weight: normal; }
    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: .7rem;
      margin-top: 1.8rem;
    }
    .hero-note { margin-top: .85rem; color: var(--quiet); font-size: .67rem; }
    .agent-line {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: .5rem;
      margin-top: 1.2rem;
    }
    .agent-line > span:first-child {
      margin-right: .15rem;
      color: var(--quiet);
      font-size: .62rem;
      letter-spacing: .08em;
      text-transform: uppercase;
    }
    .agent-pill {
      padding: .3rem .48rem;
      border: 1px solid var(--line);
      color: var(--muted);
      font-size: .61rem;
    }
    .hero-result .section-label { margin-bottom: 1rem; text-align: left; }
    .install-card {
      max-width: 670px;
      margin: 0 auto 5rem;
      padding: 1.2rem;
      background: var(--panel);
      border: 1px solid var(--line);
    }
    .install-label {
      margin-bottom: .65rem;
      color: var(--quiet);
      font-size: .66rem;
      text-transform: uppercase;
      letter-spacing: .13em;
    }
    .install-row {
      display: flex;
      align-items: stretch;
      gap: 1px;
      background: var(--line);
      border: 1px solid var(--line);
    }
    .install-command {
      flex: 1;
      overflow-x: auto;
      padding: .95rem 1rem;
      background: #080808;
      color: #96c68a;
      font-size: .78rem;
      white-space: nowrap;
    }
    .copy-button, .primary-link, .secondary-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--green);
      padding: .8rem 1rem;
      background: var(--green);
      color: white;
      cursor: pointer;
      font-size: .72rem;
      text-decoration: none;
    }
    .copy-button:hover, .primary-link:hover { background: #15803d; }
    .install-actions {
      display: flex;
      justify-content: center;
      gap: .65rem;
      margin-top: 1rem;
    }
    .secondary-link {
      background: transparent;
      border-color: #333;
      color: #aaa;
    }
    .secondary-link:hover { border-color: #666; color: white; }
    .install-note {
      margin: .9rem 0 0;
      color: var(--quiet);
      font-size: .68rem;
      text-align: center;
    }
    section { margin-bottom: 5.5rem; }
    .section-label { margin-bottom: 1.5rem; text-align: center; }
    .section-heading {
      max-width: 780px;
      margin: 0 auto 1rem;
      font-size: clamp(1.75rem, 4vw, 3.2rem);
      font-weight: normal;
      letter-spacing: -.04em;
      line-height: 1.15;
      text-align: center;
    }
    .section-intro {
      max-width: 620px;
      margin: -0.5rem auto 1.8rem;
      color: var(--muted);
      font-size: .83rem;
      text-align: center;
    }
    .printout-shell {
      width: min(550px, 100%);
      margin: 0 auto;
      padding: .8rem 1rem;
      background: var(--paper);
      box-shadow: 0 24px 80px rgba(0, 0, 0, .35);
      color: var(--ink);
    }
    .printout-header, .printout-meta {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
    }
    .printout-header {
      padding-bottom: .75rem;
      border-bottom: 1px dashed #91a591;
      font-size: .78rem;
      text-transform: uppercase;
      letter-spacing: .1em;
    }
    .status { color: #16723b; }
    .printout-row { padding: .75rem 0; border-bottom: 1px dashed #b8c9b8; }
    .printout-key {
      margin-bottom: .2rem;
      color: #557055;
      font-size: .61rem;
      text-transform: uppercase;
      letter-spacing: .1em;
    }
    .printout-value { font-size: .72rem; }
    .printout-value ul { margin: .25rem 0 0; padding-left: 1.2rem; }
    .printout-meta { padding-top: .7rem; color: #668066; font-size: .58rem; }
    .steps, .card-grid, .pair-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: var(--line);
      border: 1px solid var(--line);
    }
    .step, .card, .pair {
      min-width: 0;
      padding: 1.25rem;
      background: var(--background);
    }
    .step-number { color: var(--green); font-size: .65rem; }
    .step h2, .card h2, .pair h2 {
      margin: .45rem 0 .55rem;
      font-size: .9rem;
      font-weight: normal;
    }
    .step p, .card p, .pair p {
      margin: 0;
      color: var(--muted);
      font-size: .72rem;
    }
    .onboarding-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      margin-top: 2.5rem;
      background: var(--line);
      border: 1px solid var(--line);
    }
    .onboarding-card {
      display: flex;
      min-width: 0;
      min-height: 360px;
      flex-direction: column;
      padding: 1.35rem;
      background: var(--background);
    }
    .onboarding-card .step-number { margin-bottom: 1.7rem; }
    .onboarding-card h2 { margin: 0 0 .6rem; font-size: .94rem; font-weight: normal; }
    .onboarding-card > p { margin: 0; color: var(--muted); font-size: .71rem; }
    .onboarding-card .install-row {
      flex-direction: column;
      margin-top: auto;
    }
    .onboarding-card .install-command { padding: .85rem; font-size: .63rem; }
    .onboarding-card .copy-button { min-height: 40px; }
    .setup-option {
      margin-top: .8rem;
      padding-top: .8rem;
      border-top: 1px solid var(--line);
    }
    .setup-label {
      display: block;
      margin-bottom: .45rem;
      color: var(--quiet);
      font-size: .59rem;
      letter-spacing: .06em;
      text-transform: uppercase;
    }
    .setup-prompt {
      display: block;
      max-height: 5.4rem;
      padding: .75rem;
      overflow: auto;
      border: 1px solid var(--line);
      background: #080808;
      color: var(--muted);
      font-size: .6rem;
      line-height: 1.55;
    }
    .setup-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: .7rem;
      margin-top: .55rem;
    }
    .setup-actions button {
      border: 1px solid #333;
      padding: .55rem .65rem;
      background: transparent;
      color: var(--text);
      font: .61rem 'Departure Mono', monospace;
      cursor: pointer;
    }
    .setup-actions button:hover { border-color: var(--green); }
    .setup-actions a { color: var(--muted); font-size: .59rem; }
    .prompt-box {
      margin-top: auto;
      padding: 1rem;
      border: 1px solid #333;
      background: #080808;
      color: #c2c2c2;
      font-size: .68rem;
      line-height: 1.7;
    }
    .prompt-box::before { content: '> '; color: var(--green); }
    .resume-result {
      margin-top: auto;
      padding: 1rem;
      border-left: 2px solid var(--green);
      background: #080808;
      color: #aaa;
      font-size: .67rem;
    }
    .resume-result strong { display: block; margin-bottom: .3rem; color: var(--green); font-weight: normal; }
    .start-note {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 1rem;
      color: var(--quiet);
      font-size: .66rem;
    }
    .start-note a { color: var(--muted); }
    .card-grid { grid-template-columns: 1fr 1fr; }
    .card code { color: #96c68a; font-size: .68rem; }
    .trust-box {
      padding: 1.4rem;
      border-left: 2px solid var(--green);
      background: var(--panel);
      color: #a0a0a0;
      font-size: .79rem;
    }
    .trust-box strong { color: var(--text); font-weight: normal; }
    .pair-grid { grid-template-columns: 1fr 1fr; }
    .pair-role {
      color: var(--green);
      font-size: .62rem;
      letter-spacing: .11em;
      text-transform: uppercase;
    }
    .pair-link {
      display: inline-block;
      margin-top: .85rem;
      color: #999;
      font-size: .68rem;
      text-decoration: none;
    }
    .pair-link:hover { color: white; }
    .hosted {
      display: grid;
      grid-template-columns: 1.2fr .8fr;
      gap: 1.5rem;
      align-items: start;
      padding: 1.4rem;
      border: 1px solid var(--line);
      background: var(--panel);
    }
    .hosted h2 { margin: 0 0 .6rem; font-size: .92rem; font-weight: normal; }
    .hosted p { margin: 0; color: var(--muted); font-size: .75rem; }
    .hosted-links { display: flex; flex-direction: column; gap: .55rem; }
    .hosted-links a { color: #aaa; font-size: .7rem; text-decoration: none; }
    .hosted-links a:hover { color: white; }
    footer {
      padding-top: 2rem;
      border-top: 1px solid #151515;
      text-align: center;
    }
    .footer-nav { display: flex; justify-content: center; flex-wrap: wrap; gap: 1.2rem; }
    .footer-note { margin-top: 1.25rem; color: #393939; font-size: .66rem; }
    @media (max-width: 700px) {
      .container { width: min(100% - 1.25rem, 1120px); }
      .topnav a:not(:last-child) { display: none; }
      .hero { grid-template-columns: 1fr; min-height: auto; padding: 4rem 0; }
      .hero h1 { font-size: clamp(2.45rem, 12vw, 4rem); }
      .hero-actions { align-items: stretch; flex-direction: column; }
      .hero-actions a { width: 100%; }
      .install-row { flex-direction: column; }
      .copy-button { width: 100%; }
      .install-actions { flex-direction: column; }
      .steps, .card-grid, .pair-grid, .hosted, .onboarding-grid { grid-template-columns: 1fr; }
      .onboarding-card { min-height: auto; }
      .start-note { align-items: flex-start; flex-direction: column; }
    }
  </style>
</head>
<body>
  <main class="container">
    <header class="topbar">
      <a class="wordmark" href="/">Context Capsule</a>
      <nav class="topnav" aria-label="Primary">
        <a href="#how-it-works">How it works</a>
        <a href="/docs">Hosted API</a>
        <a href="https://github.com/Johnny-Z13/context-capsule">GitHub</a>
        <a class="top-cta" href="#get-started">Get started</a>
      </nav>
    </header>

    <section class="hero">
      <div>
        <div class="eyebrow">Open-source Agent Skill</div>
        <h1>Switch coding agents without losing the thread.</h1>
        <p class="hero-copy">Context Capsule gives the next coding agent a <strong>small, checkable handoff</strong>—what changed, what matters, what was verified, and exactly what to do next.</p>
        <div class="hero-actions">
          <a class="primary-link" href="#get-started">Use with your coding agent</a>
          <a class="secondary-link" href="/example">See an example handoff</a>
        </div>
        <p class="hero-note">Install once · works locally · no account, API key, or upload</p>
        <div class="agent-line" aria-label="Compatible coding agents">
          <span>Works with</span>
          <span class="agent-pill">Codex</span>
          <span class="agent-pill">Claude Code</span>
          <span class="agent-pill">Cursor</span>
          <span class="agent-pill">Compatible agents</span>
        </div>
      </div>

      <div class="hero-result" aria-labelledby="example-label">
        <div class="section-label" id="example-label">What the next agent receives</div>
        <div class="printout-shell">
          <div class="printout-header"><span>Context Capsule / coding-handoff/v1</span><span class="status">Compatible</span></div>
          <div class="printout-row">
            <div class="printout-key">Objective</div>
            <div class="printout-value">Finish the refresh-token migration without breaking legacy consumers.</div>
          </div>
          <div class="printout-row">
            <div class="printout-key">Current status</div>
            <div class="printout-value">Implementation is complete. Production has not been checked.</div>
          </div>
          <div class="printout-row">
            <div class="printout-key">Decision</div>
            <div class="printout-value">Keep the legacy endpoint; three consumers still use it.</div>
          </div>
          <div class="printout-row">
            <div class="printout-key">Verification</div>
            <div class="printout-value"><code>npm test -- --run</code> — 71 passed — observed locally.</div>
          </div>
          <div class="printout-row">
            <div class="printout-key">Next action</div>
            <div class="printout-value">Run the staging smoke test, then ask before release.</div>
          </div>
          <div class="printout-meta"><span>HEAD 81d9c1a · dirty</span><span>expires in 24 hours</span></div>
        </div>
      </div>
    </section>

    <section id="get-started">
      <div class="section-label">Use the agent you already work with</div>
      <h2 class="section-heading">Hand off a live coding task in three steps.</h2>
      <p class="section-intro">No new app to learn. Add the skill, ask the current agent to package the useful state, then point the next agent at the handoff.</p>
      <div class="onboarding-grid">
        <article class="onboarding-card">
          <div class="step-number">01 / INSTALL</div>
          <h2>Add the skill once</h2>
          <p>The readable skill teaches your agent how to create and resume a safe local handoff.</p>
          <div class="install-row">
            <code class="install-command" id="install-command">npx skills add Johnny-Z13/context-capsule --skill contextcapsule-handoff</code>
            <button class="copy-button" id="copy-button" type="button" aria-live="polite" onclick="copyInstall()">Copy install command</button>
          </div>
          <div class="setup-option">
            <span class="setup-label">Or paste this into your agent</span>
            <code class="setup-prompt" id="setup-prompt">Install the contextcapsule-handoff skill from https://github.com/Johnny-Z13/context-capsule using the skills CLI. Then explain how to create and resume a local handoff in this repository. Do not write files yet.</code>
            <div class="setup-actions">
              <button id="copy-setup-button" type="button" aria-live="polite" onclick="copySetupPrompt()">Copy AI setup prompt</button>
              <a href="https://github.com/Johnny-Z13/context-capsule/tree/main/.agents/skills/contextcapsule-handoff">View on GitHub</a>
            </div>
          </div>
        </article>
        <article class="onboarding-card">
          <div class="step-number">02 / HAND OFF</div>
          <h2>Prompt your current agent</h2>
          <p>It inspects the repository, separates observed facts from claims, and asks before writing anything.</p>
          <div class="prompt-box">Create a Context Capsule handoff for this task. Keep it local and show me what will be written first.</div>
        </article>
        <article class="onboarding-card">
          <div class="step-number">03 / RESUME</div>
          <h2>Open your next agent</h2>
          <p>The receiving agent checks that the repository still matches before relying on the saved state.</p>
          <div class="prompt-box">Resume this task from .contextcapsule/latest.json. Check freshness before continuing.</div>
          <div class="resume-result"><strong>Compatible</strong>Objective, decisions, verification, blockers, and next action are ready.</div>
        </article>
      </div>
      <div class="start-note">
        <span>The handoff stays in your repository by default. No account, API key, or upload is required.</span>
        <a href="https://github.com/Johnny-Z13/context-capsule/tree/main/.agents/skills/contextcapsule-handoff">Read the skill source →</a>
      </div>
    </section>

    <section id="how-it-works">
      <div class="section-label">Capture, hand off, resume</div>
      <p class="section-intro">It carries the minimum useful state across tools without pretending that old context is current.</p>
      <div class="steps">
        <article class="step">
          <div class="step-number">01 / Capture</div>
          <h2>Inspect the repository</h2>
          <p>Record the remote, branch, HEAD, working-tree fingerprint, and changed filenames. Never copy source files into the capsule.</p>
        </article>
        <article class="step">
          <div class="step-number">02 / Author</div>
          <h2>Write the handoff</h2>
          <p>Separate observed verification from reported claims. Name decisions, blockers, and one concrete next action.</p>
        </article>
        <article class="step">
          <div class="step-number">03 / Resume</div>
          <h2>Check freshness first</h2>
          <p>Classify the capsule as compatible, stale, mismatched, or unverifiable before trusting repo-specific details.</p>
        </article>
      </div>
    </section>

    <section>
      <div class="section-label">What the author must make clear</div>
      <div class="card-grid">
        <article class="card"><h2>Objective</h2><p>The outcome, not a transcript of the session.</p></article>
        <article class="card"><h2>Status</h2><p>What is complete, partial, unverified, or explicitly out of scope.</p></article>
        <article class="card"><h2>Decisions</h2><p>Choices the next agent must preserve, with enough reason to avoid accidental reversal.</p></article>
        <article class="card"><h2>Verification</h2><p>The command, result, timestamp, and whether it was <code>observed</code> or merely <code>reported</code>.</p></article>
        <article class="card"><h2>Blockers</h2><p>Anything that needs authority, credentials, another person, or external state.</p></article>
        <article class="card"><h2>Next action</h2><p>One bounded step the receiving agent can actually take.</p></article>
      </div>
    </section>

    <section>
      <div class="section-label">Local first, trust bounded</div>
      <div class="trust-box"><strong>The default handoff stays in your repository.</strong> The helper excludes its own <code>.contextcapsule/</code> artifacts from freshness checks, records filenames rather than file contents, and rejects common credential patterns. The agent must ask before writing files, changing ignore rules, or uploading a capsule. A hosted capsule is public to anyone with its URL, so sharing is always an explicit choice.</div>
    </section>

    <section>
      <div class="section-label">How it works with ProofSlip</div>
      <p class="section-intro">They remain separate products with one clean connection: a capsule can point to proof when a handoff claim needs independent checking.</p>
      <div class="pair-grid">
        <article class="pair">
          <div class="pair-role">Navigation</div>
          <h2>Context Capsule</h2>
          <p>What is the situation, what matters, and what should the next coding agent do?</p>
        </article>
        <article class="pair">
          <div class="pair-role">Evidence</div>
          <h2>ProofSlip</h2>
          <p>What did the release environment actually attest, and can the next agent verify it?</p>
          <a class="pair-link" href="https://www.proofslip.ai">Check the release-proof product →</a>
        </article>
      </div>
    </section>

    <section>
      <div class="section-label">Open source first, hosted when useful</div>
      <div class="hosted">
        <div>
          <h2>The skill and local format are the product.</h2>
          <p>Read every instruction, run the bundled Node helper, adapt the format, or self-host the Hono/Postgres service. The hosted API remains available when you deliberately need a short-lived handoff URL for another machine or person.</p>
        </div>
        <div class="hosted-links">
          <a href="https://github.com/Johnny-Z13/context-capsule">Source and self-hosting →</a>
          <a href="/docs">Hosted API documentation →</a>
          <a href="https://www.npmjs.com/package/@contextcapsule/mcp-server">Optional MCP server →</a>
        </div>
      </div>
    </section>

    <footer>
      <nav class="footer-nav" aria-label="Footer">
        <a href="/docs">Hosted API</a>
        <a href="/llms.txt">llms.txt</a>
        <a href="https://www.proofslip.ai">ProofSlip</a>
        <a href="https://github.com/Johnny-Z13/context-capsule">GitHub</a>
        <a href="https://z13labs.com">Z13Labs</a>
      </nav>
      <div class="footer-note">Context expires. Decisions transfer.</div>
    </footer>
  </main>
  <script>
    function fallbackCopy(command, source) {
      var temporary = document.createElement('textarea');
      temporary.value = command;
      temporary.setAttribute('readonly', '');
      temporary.style.position = 'fixed';
      temporary.style.opacity = '0';
      document.body.appendChild(temporary);
      temporary.select();
      var copied = false;
      try { copied = document.execCommand('copy'); } catch (error) { copied = false; }
      temporary.remove();
      if (!copied) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(source);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      return copied;
    }
    async function copyText(sourceId, buttonId, resetLabel) {
      var source = document.getElementById(sourceId);
      var command = source.textContent;
      var button = document.getElementById(buttonId);
      var copied = false;
      if (navigator.clipboard && window.isSecureContext) {
        try { await navigator.clipboard.writeText(command); copied = true; } catch (error) { copied = false; }
      }
      if (!copied) copied = fallbackCopy(command, source);
      button.textContent = copied ? 'Copied' : 'Selected';
      setTimeout(function () { button.textContent = resetLabel; }, 2500);
    }
    function copyInstall() {
      return copyText('install-command', 'copy-button', 'Copy install command');
    }
    function copySetupPrompt() {
      return copyText('setup-prompt', 'copy-setup-button', 'Copy AI setup prompt');
    }
  </script>
</body>
</html>`
}
