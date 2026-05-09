# UI/UX Pro + 21st.dev Magic — Claude Code Setup Guide
### Build Framer-quality animated websites with AI. The no-BS developer guide.

---

## What This Is

This guide walks you through setting up a **production-grade AI-assisted UI/UX workflow** using:
- **Claude Code** — Anthropic's terminal-based AI coding agent
- **Framer Motion** — animation library for React
- **UI/UX Pro Max Skills** — design intelligence context for Claude
- **21st.dev Magic MCP** — AI component generator inside your terminal

The result: you can build visually stunning, animated websites through plain English — the kind that previously required a senior front-end engineer or cost ₹3–4 lakhs from an agency.

> **Prerequisites:** Node.js installed, a terminal, and a Claude Pro/Max account ($20/month at claude.ai).

---

## Step 1 — Install Claude Code

Claude Code is Anthropic's AI agent that runs in your terminal. It reads your codebase, writes files, edits across multiple components, and takes instructions in plain English.

### Install

**Mac / Linux / WSL:**
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows (PowerShell):**
```powershell
irm https://claude.ai/install.ps1 | iex
```

### Verify
```bash
claude --version
```

### First-time login
```bash
claude
```
This opens your browser to authenticate with your Anthropic account.

> **Important:** The free Claude.ai plan does NOT include Claude Code. You need **Claude Pro ($20/month) or Max**.

---

## Step 2 — Set Up Your React Project with Framer Motion

If you already have a React/Vite project, skip to the install step.

### Create a new project
```bash
npm create vite@latest my-website -- --template react-ts
cd my-website
npm install
```

### Install Framer Motion
```bash
npm install framer-motion
```

### Also recommended
```bash
npm install lucide-react        # icon library
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Verify
```bash
npm run dev
```

> Framer Motion works with React, Next.js, Remix, and Vite. Same install command for all.

---

## Step 3 — Install the UI/UX Pro Max Skills Package

This is the most important step most guides skip. The UI/UX Pro Max skill gives Claude a deep design knowledge base — covering UI styles, color palettes, typography pairings, layout patterns, and UX best practices — loaded at the start of every session.

**Without it:** Claude generates average-looking UI.
**With it:** Claude follows professional design principles, produces consistent components, and understands context like "glassmorphism" or "brutalist layout" out of the box.

### Install via CLI (recommended — no manual file copying needed)

```bash
npx uipro-cli@latest init
```

This installs the skill into your project's `.claude/skills/` folder automatically. It will ask you to choose your stack (react, nextjs, etc.).

### Manual install (alternative)

1. Download the ZIP from: `https://github.com/nextlevelbuilder/ui-ux-pro-max-skill`
2. Extract it — you'll get a folder called `ui-ux-pro-max-skill-main`
3. Copy ONLY the `.claude` folder into your project root:

```bash
# From inside your project directory:
cp -r path/to/ui-ux-pro-max-skill-main/.claude/skills ./.claude/skills
```

> **Note:** If your project already has a `.claude` folder (Claude Code creates one with `settings.local.json`), copy only the `skills` subfolder — don't overwrite the whole `.claude` directory.

### Verify
```
your-project/
└── .claude/
    └── skills/
        ├── ui-ux-pro-max/     ← This is the main one
        ├── ui-styling/
        ├── design-system/
        ├── brand/
        ├── design/
        ├── slides/
        └── banner-design/
```

Claude Code automatically reads `.claude/skills/` at the start of every session. No additional configuration needed.

### Available skills you can now invoke in Claude Code

| Skill | What it does |
|-------|-------------|
| `ui-ux-pro-max` | Master UI/UX skill — styles, palettes, typography, layouts |
| `ui-styling` | Component-level styling guidance |
| `design-system` | Design tokens, component specs, Tailwind integration |
| `brand` | Brand guidelines, consistency checks |
| `design` | Logo, icon, CIP, slides design context |
| `banner-design` | Banner sizes, styles, ad formats |
| `slides` | Presentation layout and copywriting |

---

## Step 4 — Add the 21st.dev Magic MCP

21st.dev Magic is an MCP (Model Context Protocol) server that connects Claude Code to a library of production-ready UI components. Think of it as v0.dev built directly into your terminal — you describe a UI element and it generates clean TypeScript/React code matching your project style.

### Get your API key

1. Go to **21st.dev/magic**
2. Create a free account
3. Copy your API key from the dashboard

### Add to Claude Code

Run this once in your terminal (outside Claude Code):

```bash
claude mcp add magic --scope user --env API_KEY="your-api-key-here" -- npx -y @21st-dev/magic@latest
```

- `--scope user` means it's available across ALL your projects, not just this one
- This modifies `~/.claude.json` (your global Claude Code config)

### Verify it was added
```bash
claude mcp list
```
You should see `magic` in the list.

### How to use it inside Claude Code

Once inside a Claude Code session (`claude` in terminal), you can use the `/ui` command:

```
/ui create a hero section with animated gradient background and floating cards
/ui build a pricing table with 3 tiers and monthly/annual toggle
/ui make a glassmorphism navbar that becomes solid on scroll
/ui design a testimonial section with infinite scroll marquee
```

> 21st.dev generates components that follow your existing code style — it reads your project files to match conventions.

---

## Step 5 — Write a `CLAUDE.md` for Your Project (Optional but Powerful)

A `CLAUDE.md` file in your project root acts as a permanent brief that Claude reads at the start of every session. Use it to lock in your design system, brand rules, and code conventions.

### Create `CLAUDE.md` in your project root

```markdown
# Project Brief for Claude Code

## Stack
React 19 + Vite + TypeScript + Tailwind CSS v3 + Framer Motion v12

## Brand
- Primary color: #f97316 (orange-500) — use sparingly as accent
- Background: #0a0a0a
- Font style: Bold, tracking-tighter headings. Mono labels.
- Tone: Minimal, premium, dark

## Animation Rules
- Use framer-motion for ALL animations
- whileInView with viewport={{ once: true }} for scroll reveals
- Spring physics for interactive hover states
- No CSS keyframe animations unless absolutely necessary

## Component Rules
- Functional components with TypeScript
- No class components
- Tailwind only — no inline styles
- lucide-react for icons
```

The more specific you are, the more consistent Claude's output will be across sessions.

---

## How to Use It All Together

### Start a session
```bash
cd your-project
claude
```

### Example prompt to build a full section
```
Build me a hero section for a SaaS landing page.
- Dark background (#0a0a0a)
- Large animated headline that reveals word by word using Framer Motion
- 2-3 floating UI cards/badges that gently oscillate
- Gradient orbs in background (orange top-right, purple bottom-left)
- Scroll indicator at bottom
- Fully responsive
```

### Use /ui for specific components
```
/ui create a testimonial card with quote, author avatar, and name.
Dark card, subtle border, hover glow effect.
```

### Tips for better output

1. **Be specific about animations** — describe the motion, not just "add animation"
2. **Reference real sites** — "make it look like Linear.app" or "Framer.com-style hero"
3. **Give it your brand context** — always mention your colors and fonts
4. **Build section by section** — don't ask for the entire site at once
5. **Iterate in the same session** — Claude remembers the context of what it just built

---

## Quick Reference

| Tool | Purpose | Install |
|------|---------|---------|
| Claude Code | AI coding agent in terminal | `curl -fsSL https://claude.ai/install.sh \| bash` |
| Framer Motion | React animation library | `npm install framer-motion` |
| UI/UX Pro Max | Design knowledge skills for Claude | `npx uipro-cli@latest init` |
| 21st.dev Magic | AI component generator (MCP) | `claude mcp add magic --scope user --env API_KEY="..." -- npx -y @21st-dev/magic@latest` |

---

## Troubleshooting

**Claude Code says it can't find the skill:**
Make sure the skills are in `.claude/skills/` relative to the directory where you ran `claude`. Skills are project-scoped by default.

**`uipro-cli init` fails:**
Use the manual method — download the ZIP, copy the `.claude/skills` folder to your project root.

**21st.dev `/ui` command not working:**
Run `claude mcp list` to confirm it's registered. If not, re-run the `claude mcp add` command. Restart your Claude Code session after adding MCPs.

**Framer Motion animations not triggering:**
Make sure you're using `whileInView` not `animate` for scroll-based animations. Add `viewport={{ once: true }}` to prevent re-triggering.

**Animations janky on mobile:**
Reduce motion complexity. Use `transform` and `opacity` only — avoid animating `width`, `height`, or `margin`.

---

*Guide by OneThing Studio — one client, one focus, one month.*
