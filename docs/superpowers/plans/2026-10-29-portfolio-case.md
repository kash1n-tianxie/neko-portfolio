# Portfolio Case Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the website as the first featured project with an evidence-based bilingual case study and public GitHub documentation.
**Architecture:** Reuse existing Work records, featured poster layout and case template. Add one content module and featured component; media comes from actual current website captures.
**Tech Stack:** Existing Next.js15, React19, TypeScript, next-intl and CSS. No new dependencies.
**Spec:** `docs/superpowers/specs/2026-10-29-portfolio-case-design.md`

## Global Constraints
- Slug `kashin-ink`, title `KASHIN.INK`, first featured work and Hero project-strip item.
- Repo `https://github.com/kash1n-tianxie/neko-portfolio`, demo `https://kashin.ink/`, pixel-world path `/world`.
- Existing six featured projects keep their order and stable anchors; shift their indices to02–07. No duplicate archive item.
- Japanese-first with English parity; explain actual design intent, UI, pixel2D world and iteration, without fabricated achievements or metrics.
- Preserve original GIF colors and motion-reduction support; do not change gameplay, dependencies or palette behavior.
- Root supplies `/assets/works/kashin-ink/cover.gif`, `cover.webp`, `blue-yellow.webp`, `red-black.webp`, `pixel-world.webp`, all1280×800.

## Review Focus
- Updated featured count/indices and links must agree across data, Hero and homepage navigation.
- Removing the new work from featured order must fail content tests; old games remain unchanged.
- New detail/world links must stay locale-aware; external GitHub links open safely.
- GIF must honor both system and site motion settings and have a real static fallback.
- Long Japanese copy and seven project links must not overflow small screens.

### Task 1: First-position project and case study
**Files:** Create `src/content/portfolio-site.ts`, `src/components/works/portfolio-site-feature.tsx`; modify `src/content/works.ts`, `src/components/sections/works.tsx`, `src/components/sections/hero.tsx`, `src/components/works/nyanko-home-feature.tsx`, `src/app/[locale]/works/[slug]/page.tsx`, scoped CSS as needed; update `tests/work-content.test.mjs` and meaningful rendering tests.
**Interfaces:** Export `portfolioSite` (slug, repoUrl, liveUrl, worldPath) and `portfolioSiteWork: Work` from new content module. Export `PortfolioSiteFeature({locale})`. Root provides media paths above; do not create placeholder art.
- [x] Write content-order/link and rendering tests that fail when the new first project is missing, duplicated or links incorrectly; run and observe failure.
- [x] Implement data, four thoughtful bilingual case-study sections, custom section labels and accessible GitHub/home/world links. Use AnimatedWorkCover for the new detail cover as well as feature.
- [x] Render feature first with index01, parameterize NyankoHome index default1 and pass2, shift remaining indices and archive offset to7. Update navigation count dynamically where simple.
- [x] Run full tests and scoped lint; report expected missing media until root captures finish, then rerun. Do not commit or push; root integrates and publishes.

### Task 2: Actual media, repository documentation and release
**Owner:** Root; capture browser views concurrently while Task1 is implemented.
- [x] Capture current actual blue/yellow homepage, red/black homepage and playable pixel town using browser tools. Normalize to1280×800; assemble lightweight GIF and static WebP without recoloring.
- [x] Add Japanese README covering intent, UI,2D world, architecture, local commands, AI-assisted production note, public links; no license invention.
- [x] Verify full suite/lint/build and browser (375px/desktop, both palettes/locales, motion off, detail/GitHub/world links).
- [ ] Obtain independent scoped review, fix important findings, commit and push to existing main; update GitHub description/homepage.
- [ ] Verify Vercel production completion and public first-project/detail page. Save proof screenshot and deliver links.
