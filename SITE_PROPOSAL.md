# Arbitus Website Proposal

> **Date:** April 6, 2026
> **Status:** Draft — awaiting review

---

## 1. Executive Summary

This proposal defines the structure, content, design direction, and tech stack for the Arbitus project website. The site serves two audiences: **developers discovering the project** (landing page) and **users implementing it** (documentation). The goal is to convert visitors into users by clearly communicating what Arbitus is, why it matters, and how to start using it in under 5 minutes.

---

## 2. Project Context

**Arbitus** is an open-source security proxy (written in Rust) that sits between AI agents and MCP servers. It enforces per-agent policies — authentication, rate limiting, payload filtering, schema validation, OPA/Rego policies, human-in-the-loop approval, and audit logging — before any tool call reaches the upstream server.

### Why the site matters now

- MCP has reached **132M monthly npm downloads** (70x YoY growth), adopted by every major AI provider
- **92% of MCP servers carry high security risk** — the protocol's own roadmap lists security as "on the horizon"
- The MCP gateway space has **40+ projects** but no dominant open-source security-focused player
- Arbitus is at **v0.19.1** — feature-complete enough for a public launch, but needs visibility

### Competitive positioning

Arbitus occupies a unique position: **high-security, high-completeness, open-source**. No other OSS project covers the full security surface (auth + rate limiting + encoding-aware payload filtering + schema validation + OPA/Rego + prompt injection detection + HITL + shadow mode + supply-chain verification + audit). The closest comparison is agentgateway (Linux Foundation), which is a connectivity platform (the "nginx"), while Arbitus is the enforcement proxy (the "WAF").

---

## 3. Site Structure

```
arbitus-gateway.xyz
├── / .......................... Landing page (marketing)
├── /docs ...................... Documentation hub
│   ├── /docs/getting-started .. Quick start guide
│   ├── /docs/configuration .... Full YAML reference
│   ├── /docs/usage ............ HTTP mode, HITL, shadow mode, federation, OpenAI bridge
│   ├── /docs/deployment ....... Docker, Helm, HTTPS, mTLS, stdio
│   ├── /docs/audit ............ Audit backends, CloudEvents, OpenLineage
│   ├── /docs/observability .... Prometheus, OpenTelemetry, dashboard, circuit breaker
│   ├── /docs/architecture ..... Middleware pipeline, trait-based design
│   └── /docs/security ......... Encoding-aware filtering, prompt injection, supply chain
├── /blog ...................... Technical blog (launch posts, deep-dives)
└── /community ................. GitHub Discussions, Discord, contributing guide
```

---

## 4. Landing Page Sections

Based on Evil Martians' research of 100+ dev tool landing pages and analysis of Kong, Traefik, Supabase, Envoy, and Vercel sites.

### 4.1 Hero

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   The security proxy for AI agents and MCP servers          │
│                                                             │
│   Auth, rate limiting, payload filtering, and audit —       │
│   before any tool call reaches your upstream.               │
│                                                             │
│   [cargo install arbitus]        [GitHub →]  [Docs →]       │
│                                                             │
│   ┌───────────────────────────────────────────────────┐     │
│   │  Agent (Cursor, Claude, etc.)                     │     │
│   │         │  JSON-RPC                               │     │
│   │         ▼                                         │     │
│   │       arbitus  ← auth, rate limit, HITL,          │     │
│   │         │        payload filter, audit             │     │
│   │         ▼                                         │     │
│   │   MCP Server (filesystem, database, APIs...)      │     │
│   └───────────────────────────────────────────────────┘     │
│                                                             │
│   MIT Licensed  ·  Rust  ·  Sub-millisecond overhead        │
└─────────────────────────────────────────────────────────────┘
```

**Design notes:**
- Centered composition, dark background
- The architecture diagram should be an animated SVG showing a request flowing through the pipeline (not a GIF — SVG for crisp rendering at any size)
- Install command is a clickable copy-to-clipboard element
- Three install methods on hover/tab: `cargo install`, Docker pull, binary download

### 4.2 Trust Block

```
┌─────────────────────────────────────────────────────────────┐
│  ⭐ N GitHub stars  ·  🦀 Pure Rust  ·  📦 crates.io       │
│  🐳 Multi-arch Docker  ·  ⎈ Helm chart  ·  MIT License     │
└─────────────────────────────────────────────────────────────┘
```

Once early adopters exist, add a logo carousel. Until then, lean on technical credibility signals (Rust, MIT, crates.io, Helm).

### 4.3 The Problem (Why This Exists)

Three problem-solution blocks, leading with the pain:

| Problem | Statistic | Arbitus Solution |
|---------|-----------|------------------|
| **"92% of MCP servers have security issues"** | iEnable research, 2026 | Per-agent auth (JWT/OIDC/mTLS), encoding-aware payload filtering, prompt injection detection |
| **"Agents can access anything — no guardrails"** | MCP spec has no built-in access control | Per-agent tool allowlists/denylists, rate limiting, OPA/Rego policies, schema validation |
| **"No visibility into what AI agents actually do"** | No audit trail in standard MCP | Full audit log (SQLite, webhook, CloudEvents, OpenLineage), Prometheus metrics, OpenTelemetry traces, dashboard |

Each block: bold problem statement → one-line stat → how Arbitus solves it → link to relevant docs section.

### 4.4 Feature Grid

Bento grid layout (modular cards, varied sizes). Large cards for differentiators, smaller cards for table-stakes features.

**Large cards (unique differentiators):**

1. **Human-in-the-Loop** — Suspend sensitive tool calls until an operator approves or rejects via REST API. Auto-reject after timeout. *No other OSS MCP gateway has this.*
2. **Shadow Mode** — Intercept and log tool calls without forwarding. Dry-run risky operations before enforcing policies. *Unique to Arbitus.*
3. **Encoding-Aware Filtering** — Block patterns catch Base64, URL-encoded, double-encoded, and Unicode-obfuscated payloads. Regex alone isn't enough. *Only Arbitus does this.*
4. **OPA/Rego Policies** — Industry-standard policy engine (used by Kubernetes, Terraform). Organizations with existing OPA policies adopt without rewriting. *agentgateway explicitly declined OPA support.*

**Standard cards:**

| Feature | One-liner |
|---------|-----------|
| Per-Agent Auth | API key, JWT/OIDC, mTLS — each agent gets its own policy |
| Rate Limiting | Per-agent, per-tool, per-IP sliding window with standard headers |
| Schema Validation | Validate tool arguments against inputSchema before forwarding |
| Prompt Injection Detection | 7 built-in patterns, always-block mode |
| Supply-Chain Security | SHA-256 + cosign verification of MCP server binaries |
| Tool Federation | Aggregate tools from multiple upstreams into a single view |
| OpenAI Bridge | `/openai/v1/tools` and `/execute` for function-calling clients |
| Circuit Breaker | Automatic upstream failure isolation with half-open recovery |
| Config Hot-Reload | SIGUSR1 or automatic every 30 seconds — no restart needed |
| Transport Agnostic | HTTP+SSE or stdio — same config, same policies |
| Secrets-Safe Config | `${VAR}` interpolation + OpenBao/Vault integration |
| Container-Ready | Multi-arch Docker, Helm chart with sidecar pattern, graceful shutdown |

### 4.5 How It Works (Interactive Config Example)

Show a real `gateway.yml` with syntax highlighting and annotations:

```yaml
transport:
  type: http
  addr: "0.0.0.0:4000"
  upstream: "http://localhost:3000/mcp"

agents:
  cursor:                                    # ← per-agent policies
    allowed_tools: [read_file, "list_*"]     # ← glob wildcards
    rate_limit: 30                           # ← calls/minute
    api_key: "${CURSOR_API_KEY}"             # ← env var interpolation

  claude-code:
    denied_tools: [delete_file, drop_table]
    rate_limit: 60
    approval_required: [delete_file]         # ← human-in-the-loop
    shadow_tools: ["exec_*"]                 # ← shadow mode

rules:
  block_patterns: ["password", "api_key"]    # ← encoding-aware
  block_prompt_injection: true               # ← built-in detection
  opa:
    policy_path: policy.rego                 # ← OPA/Rego
```

**Design**: Code block with callout annotations on hover. Each annotation links to the relevant docs section.

### 4.6 Quick Start (3 Steps)

```
1. Install           2. Configure              3. Run
cargo install        cp gateway.example.yml    ./arbitus gateway.yml
arbitus              gateway.yml
                     # edit agents & rules     Agents connect to
                                               localhost:4000/mcp
```

Three columns, each with a code block. Below: links to Docker, Helm, and binary install alternatives.

### 4.7 Architecture Diagram

```
            ┌──────────────────────────────────────────┐
            │                 Arbitus                  │
            │                                          │
  request ──► Pipeline                                 │
            │   1. RateLimitMiddleware                 │
            │   2. AuthMiddleware                      │
            │   3. HitlMiddleware    ← suspend & wait  │
            │   4. SchemaValidationMiddleware          │
            │   5. PayloadFilterMiddleware             │
            │   6. OpaMiddleware                       │
            │         │                                │
            │    Allow / Block / Redact                │
            │         │                                │
            │   Shadow mode check  ← mock if matched   │
            │         │                                │
            │   AuditLog + Metrics                     │
            │         │                                │
            │    McpUpstream (per-agent routing)        │
            └──────────────────────────────────────────┘
```

This should be a polished SVG with color-coded stages (green = allow, red = block, yellow = HITL suspend). Interactive: hover each stage for a tooltip description.

### 4.8 Comparison Section

A concise "Why Arbitus" comparison table:

| Capability | Arbitus | Other OSS Gateways | Commercial Gateways |
|------------|:-------:|:-------------------:|:-------------------:|
| Per-agent auth (JWT, mTLS) | ✅ | Partial | ✅ |
| Encoding-aware filtering | ✅ | ❌ | ❌ |
| Human-in-the-Loop | ✅ | ❌ | Varies |
| Shadow mode (dry-run) | ✅ | ❌ | ❌ |
| OPA/Rego policies | ✅ | ❌ | Varies |
| Supply-chain verification | ✅ | ❌ | ❌ |
| Hash-chain audit | ✅ | ❌ | ❌ |
| HTTP + stdio transports | ✅ | HTTP only | HTTP only |
| Sub-ms overhead (Rust) | ✅ | Go/Python/TS | Varies |
| Open source (MIT) | ✅ | Varies | ❌ |

### 4.9 Observability Showcase

Screenshot/mockup of the `/dashboard` audit viewer with filtering. Show:
- Per-agent filtering
- Outcome breakdown (allowed, blocked, shadowed)
- Block rate percentage
- Prometheus metrics snippet
- OpenTelemetry trace visualization

### 4.10 Final CTA

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Start securing your MCP servers today                     │
│                                                             │
│   [Get Started →]         [View on GitHub →]                │
│                                                             │
│   MIT Licensed · Community-driven · Production-ready        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Documentation Structure

Migrate the existing `docs/` folder from the mcp-gateway repo. The current docs are well-written and comprehensive — they need a proper navigation shell, not a rewrite.

### Pages

| Doc | Source | Notes |
|-----|--------|-------|
| Getting Started | New (combine README quick start + examples) | First-time user flow: install → configure → run → verify |
| Configuration | `docs/configuration.md` | Full YAML reference |
| Usage | `docs/usage.md` | HTTP mode, HITL, shadow mode, federation, OpenAI bridge |
| Deployment | `docs/deployment.md` | Docker, Helm, HTTPS, mTLS, stdio |
| Audit | `docs/audit.md` | Backends, CloudEvents, OpenLineage, CLI |
| Observability | `docs/observability.md` | Prometheus, OpenTelemetry, dashboard, circuit breaker |
| Architecture | `docs/architecture.md` | Pipeline, traits, encoding, tests |
| Security | New (extract from README + attack scenarios) | Encoding-aware filtering, prompt injection, supply chain, OPA |
| CLI Reference | New (extract from bin/arbitus.rs) | `start`, `validate`, `audit`, `replay`, `verify-log` |
| Changelog | `CHANGELOG.md` | Link or embed |

### Documentation features needed
- **Pagefind or Algolia search** — developers expect to search docs
- **Copy-to-clipboard** on all code blocks
- **Dark mode default** with light mode toggle
- **Sidebar navigation** with section grouping
- **Edit on GitHub** link on every page
- **Previous/Next navigation** at page bottom

---

## 6. Blog (Launch Content)

The blog serves the marketing strategy outlined in `MARKETING_STRATEGY.md`. Initial posts for launch:

| # | Title | Audience | Distribution |
|---|-------|----------|--------------|
| 1 | "92% of MCP Servers Have Security Issues — Here's What We Found" | Security engineers, AI devs | HN, r/netsec, r/cybersecurity |
| 2 | "Why MCP Needs Its Own Security Proxy (Not Just an API Gateway)" | DevOps, platform teams | HN, r/devops |
| 3 | "Building a Sub-Millisecond Security Proxy in Rust" | Rust developers | r/rust, Dev.to |
| 4 | "Per-Agent Policies: Why One Size Doesn't Fit All in AI Security" | Platform teams | Dev.to, LinkedIn |

---

## 7. Tech Stack Recommendation

### Option A: Astro + Starlight (Recommended)

```
Landing page:    Astro with custom components + Tailwind CSS
Documentation:   Starlight (Astro integration)
Blog:            Astro Content Collections
Search:          Pagefind (built-in, offline-capable, zero cost)
Styling:         Tailwind CSS v4
Deployment:      Cloudflare Pages or Vercel (free tier)
Domain:          arbitus-gateway.xyz
```

**Why Astro + Starlight:**

| Factor | Reasoning |
|--------|-----------|
| **Performance** | Best-in-class: ~0.8s LCP, ~12kB JS bundle, 95-100 Lighthouse. Rust project deserves a fast site. |
| **Zero JS by default** | Content pages ship as static HTML. Interactive components opt-in via Astro Islands. |
| **Pagefind search** | Built-in, offline-capable, zero external dependencies. No Algolia account needed. |
| **Single repo** | Landing page + docs + blog in one Astro project. Shared styling and components. |
| **Markdown-native** | Existing `docs/*.md` files drop in with minimal changes. |
| **Dark mode** | First-class support in Starlight. Matches developer tool expectations. |
| **i18n ready** | Built-in internationalization if Portuguese docs are needed later. |
| **Self-hosted** | No vendor dependency. Deploys anywhere static files can be served. |
| **Growing ecosystem** | Astro is the fastest-growing SSG in 2025-2026. Starlight has strong adoption for OSS docs. |

### Alternative: Mintlify (Fastest time-to-market)

```
Landing page:    Custom Astro (separate)
Documentation:   Mintlify (hosted, free for OSS)
Blog:            Mintlify or separate
```

**Why consider Mintlify:**
- Used by the official MCP protocol site (modelcontextprotocol.io)
- AI-native features (llms.txt, built-in AI assistant)
- Beautiful defaults with zero design effort
- Free for open-source projects

**Why NOT Mintlify:**
- Hosted platform — less control, potential vendor lock-in
- Landing page still needs a custom build
- Rust/infrastructure projects benefit from a "we own our stack" signal

### Decision: **Astro + Starlight**

The self-hosted approach aligns with Arbitus's identity as an infrastructure tool. It signals technical competence, gives full control over design and content, and avoids vendor dependency.

---

## 8. Design Direction

### Primary Reference: ohmyopenagent.com

The site should follow the design language of https://ohmyopenagent.com/ — a dark-mode-first landing page built with Next.js + Tailwind CSS v4. Key patterns to replicate:

- **Section flow**: Hero → Feature showcases (one per section, alternating layout) → Testimonials → Final CTA
- **Hero**: Large gradient heading (`bg-gradient-to-r from-cyan-400 to-purple-600`), bold subtitle, trust metrics, dual CTA buttons
- **Color palette**: `#0a0a0a` background, `#ededed` text, cyan-400 accent (oklch), zinc-800 for cards/borders
- **Typography**: GeistSans (or Inter as fallback), `text-4xl` (3rem) for headings, `font-black` (900) weight
- **Spacing**: Generous — `max-w-3xl` (48rem) containers, `px-8` (2rem) horizontal padding, `mb-16` (4rem) between sections
- **Animations**: Minimal — `transition-colors` on interactive elements, no scroll animations
- **Cards**: Feature cards with subtle borders, zinc-800 backgrounds, clear icon/title/description hierarchy

### Secondary Reference: Personal Astro Site (Simplicity)

From the user's personal site at `/code/site`, carry over these qualities:

- **CSS-variable-driven theming** — clean `[data-theme]` system with named semantic variables (`--bg`, `--tx`, `--accent`)
- **Astro ViewTransitions** — smooth page navigation without SPA overhead
- **Comprehensive SEO** — JSON-LD structured data, Open Graph, canonical URLs, preloaded fonts
- **Inline theme script** — prevent flash of wrong theme (`<script is:inline>` in `<head>`)
- **Clean typography hierarchy** — consistent heading sizes and weights, good line-height (1.75)
- **Shiki dual-theme** — code highlighting that respects light/dark via CSS variables
- **No bloat** — minimal dependencies, no unnecessary JavaScript

### Visual Identity (Finalized)

| Element | Specification |
|---------|---------------|
| **Primary background** | Dark — `#0a0a0a` (matching ohmyopenagent.com) |
| **Surface/card bg** | `#18181b` (zinc-900) for cards, `#27272a` (zinc-800) for borders |
| **Text primary** | `#ededed` (near-white) |
| **Text secondary** | `#a1a1aa` (zinc-400) |
| **Accent color** | Teal/cyan — matching the Arbitus logo (hex lattice is cyan on black) |
| **Accent gradient** | `from-cyan-400 to-teal-500` (logo-aligned, differentiated from ohmyopenagent's purple) |
| **Secondary accent** | Warm amber/orange for warnings, blocks, security alerts |
| **Typography (prose)** | Inter or Geist Sans, base 18px, line-height 1.75 |
| **Typography (headings)** | Same family, `font-black` (900) for hero, `font-bold` (700) for sections |
| **Typography (code)** | JetBrains Mono / Fira Code, 0.875rem |
| **Code blocks** | Shiki dual-theme (github-dark / github-light), dark default |
| **Iconography** | Lucide Icons (MIT, consistent, works with Tailwind) |
| **Max content width** | 48rem (768px) for docs, wider for landing page feature sections |
| **Section spacing** | 4rem (mb-16) between major sections |

### Design Principles

1. **Code-first** — show configs and CLI commands, not screenshots of dashboards
2. **Dark mode as foundation** — light mode as secondary option
3. **Minimal motion** — only `transition-colors` on interactive elements; no scroll animations
4. **Generous spacing** — follow ohmyopenagent's spacious layout (not dense marketing)
5. **No stock imagery** — diagrams, code blocks, and architecture visualizations only
6. **CSS-variable theming** — semantic variables for colors, easy to maintain
7. **ViewTransitions** — smooth page navigation via Astro

### Inspiration Sites

| Site | What to borrow |
|------|----------------|
| **ohmyopenagent.com** | Primary reference — dark theme, section layout, gradient headings, spacious feel, CTA patterns |
| **Personal Astro site** | Simplicity — CSS variables, ViewTransitions, SEO patterns, inline theme script, Shiki dual-theme |
| **Supabase** | Trust block with scrolling logos, community testimonials section |
| **Tailwind CSS** | Code-first aesthetic, "Build whatever you want" showcase |
| **Kong** | Feature grid with numbered sections, enterprise comparison table |
| **Traefik** | Big numbers trust block ("3.4B+ downloads"), ecosystem visualization |
| **Envoy Gateway** | "Built in the open" community message, adopter logo grid |

---

## 9. Content & Messaging

### Tagline options (pick one)

1. **"The security proxy for AI agents and MCP servers"** — direct, descriptive (current README)
2. **"Secure every tool call"** — shorter, action-oriented
3. **"The WAF for MCP"** — analogy-driven, resonates with infra engineers
4. **"Policy enforcement for the AI agent era"** — enterprise-focused

**Recommendation:** Use #1 as the primary tagline (clarity > cleverness for a new category). Use #3 in blog posts and comparisons to anchor the positioning.

### Messaging hierarchy

1. **What it is** — A security proxy between AI agents and MCP servers
2. **What it does** — Enforces auth, rate limits, payload filters, and audit before tool calls reach upstream
3. **Why it matters** — 92% of MCP servers have security issues; the protocol has no built-in security layer
4. **Why Arbitus** — Only OSS project with the full security stack; Rust; sub-ms overhead; works in 5 minutes
5. **How to start** — `cargo install arbitus` → configure → run

### Tone

- **Technical, not marketing** — write for a staff engineer, not a VP
- **Concise** — every sentence earns its place
- **Evidence-based** — stats, benchmarks, code examples over adjectives
- **Confident, not arrogant** — "the only OSS project with X" (factual) vs "the best gateway ever" (opinion)

---

## 10. SEO & Discoverability

### Target keywords

| Keyword | Intent | Content |
|---------|--------|---------|
| "MCP security proxy" | Direct product search | Landing page, README |
| "MCP gateway" | Product comparison | Blog: "Why MCP needs gateways" |
| "secure MCP server" | How-to | Tutorial: "Secure your MCP server in 5 minutes" |
| "MCP rate limiting" | How-to | Docs: rate limiting section |
| "MCP audit logging" | How-to | Docs: audit section |
| "AI agent security" | Problem awareness | Blog: "92% of MCP servers..." |
| "MCP authentication" | How-to | Docs: auth configuration |

### Quick wins

1. Submit to awesome-mcp-security (672 stars) and awesome-mcp-servers (3,856 stars)
2. Publish on Dev.to + Hashnode (high domain authority, fast indexing)
3. Directory submissions: Firsto, AlternativeTo, StartupStash
4. GitHub README optimization (naturally ranks for project terms)
5. Landing page targets "MCP security proxy" and "MCP gateway" directly

---

## 11. Implementation Plan

### Phase 1: Foundation (Week 1-2)

- [ ] Initialize Astro + Starlight project in `arbitus-site` repo
- [ ] Configure Tailwind CSS v4 + dark theme
- [ ] Create landing page with hero, trust block, problem-solution, and feature grid
- [ ] Migrate existing `docs/*.md` into Starlight sidebar
- [ ] Add Pagefind search
- [ ] Deploy to Cloudflare Pages / Vercel
- [ ] Register domain (arbitus-gateway.xyz)

### Phase 2: Polish (Week 3-4)

- [ ] Create animated architecture SVG diagram
- [ ] Add interactive config example with annotations
- [ ] Build comparison table section
- [ ] Add blog infrastructure (Astro Content Collections)
- [ ] Write and publish first blog post ("92% of MCP servers...")
- [ ] Create "Getting Started" tutorial (new, not just migrated docs)
- [ ] Add CLI reference page
- [ ] Add "Security" docs page

### Phase 3: Launch (Week 5)

- [ ] Submit to awesome lists
- [ ] Post Show HN
- [ ] Cross-post to r/mcp, r/AI_Agents, r/rust
- [ ] Submit to TLDR AI newsletter
- [ ] Share in MCP Discord and Rust Discord

### Phase 4: Iterate (Ongoing)

- [ ] 1 blog post/week
- [ ] Dashboard screenshots / observability showcase
- [ ] Community testimonials as they arrive
- [ ] Performance benchmarks page
- [ ] Comparison pages (vs agentgateway, vs direct MCP)

---

## 12. Decisions (Resolved)

1. **Domain**: `arbitus-gateway.xyz`
2. **GitHub org**: Already migrated
3. **Logo**: Existing — `~/Downloads/arbitus-logo.png` (icon, cyan hexagonal lattice on black) and `~/Downloads/arbitus.png` (icon + "ARBITUS" text)
4. **i18n**: English only at launch
5. **Analytics**: Cloudflare Web Analytics
6. **Demo video**: After site launch

---

## Appendix A: Reference Sites

| Site | URL | What to study |
|------|-----|---------------|
| Kong | konghq.com | Feature grid, enterprise social proof, comparison tables |
| Traefik | traefik.io | Big numbers trust block, ecosystem partnerships |
| Supabase | supabase.com | Community testimonials, "start building" code examples |
| Vercel | vercel.com | Minimal hero, AI-focused product lineup |
| Tailwind CSS | tailwindcss.com | Code-first aesthetic, real-world showcase |
| Envoy Gateway | gateway.envoyproxy.io | Community-focused messaging, adopter logos |
| Evil Martians LaunchKit | launchkit.evilmartians.io | Open-source landing page template based on 100-page research |

## Appendix B: Key Statistics for Site Content

| Statistic | Value | Source |
|-----------|-------|--------|
| MCP monthly npm downloads | 132 million (70x YoY) | Jonathan Lai / LinkedIn |
| Active MCP servers | 10,000+ | VirtualAssistantVA |
| MCP servers with high security risk | 92% | iEnable |
| Fortune 500 MCP penetration | 28% | Synvestable |
| MCP CVEs in 60 days (2026) | 30 | Hacker News |
| MCP gateway projects | 40+ | Market analysis |
| VC funding in MCP startups | $17M+ | TechCrunch, VentureBeat |

## Appendix C: File Mapping (mcp-gateway → site)

| Source (mcp-gateway) | Destination (site) |
|---------------------|-------------------|
| `docs/configuration.md` | `/docs/configuration` |
| `docs/usage.md` | `/docs/usage` |
| `docs/deployment.md` | `/docs/deployment` |
| `docs/audit.md` | `/docs/audit` |
| `docs/observability.md` | `/docs/observability` |
| `docs/architecture.md` | `/docs/architecture` |
| `CHANGELOG.md` | `/docs/changelog` |
| `CONTRIBUTING.md` | `/community/contributing` |
| `README.md` (quick start section) | `/docs/getting-started` (expanded) |
| `gateway.example.yml` | Embedded in landing page + getting started |
