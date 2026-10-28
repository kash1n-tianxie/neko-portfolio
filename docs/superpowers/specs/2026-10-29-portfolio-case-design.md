# Portfolio as the first featured work

The user requests publishing the current site to their GitHub and presenting the site itself as the first portfolio project, explaining its intent, UI, interactions, pixel2D world and design rationale, with GitHub links. This is a scoped addition to the existing Japanese-first bilingual portfolio, not a redesign.

Use the existing public repository `https://github.com/kash1n-tianxie/neko-portfolio` and production domain `https://kashin.ink/`. Update stale repository description/homepage and add a Japanese README. Do not create a duplicate repository, change visibility, introduce licensing claims or publish private source-checkout files.

Add `KASHIN.INK` at `/works/kashin-ink` and first in the homepage, Hero project strip and data order. Existing six featured projects retain their order, content, stable anchors and links, now numbered02–07. Smaller projects remain below. Use the current poster/card system and dual palettes. Cover is an animated GIF assembled from actual site views; provide a static reduced-motion cover and three screenshots (blue/yellow UI, red/black UI, playable pixel town).

The Japanese case study explains: (1) making the portfolio itself an experience rather than only a list, (2) high-contrast game-menu typography, spray textures and switchable palettes, (3) responsive black-cat gaze and reversible scrolling with an optional pixel2D walk, NPCs and pond interactions, (4) iterations toward clarity, including moving away from the 3D approach and simplifying the entrance artwork. Describe intent as intent; do not invent awards, research, engagement metrics or handmade-art claims. Credit AI-assisted implementation/art honestly. English mirrors the content.

Approach: extend the existing Work data and shared case template with one featured component. A standalone custom microsite would duplicate navigation; an archive-only card would not satisfy first-position emphasis. Reuse is the chosen bounded implementation approach based on the explicit request.

Verify responsive layouts, both locales/palettes, direct detail/world/repository links, GIF/static motion preference behavior and full tests/lint/build before publishing.
