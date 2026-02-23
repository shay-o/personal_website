# Design Context — Personal Website (James O'Reilly)

Generated: 2026-02-21

## App Overview
A personal portfolio / professional website aimed at potential employers. Currently a template-in-progress with placeholder content. The owner wants something simple and functional with a touch of wit — referencing lusmo.re (clean, minimal, pleasant design) and jhm.omg.lol (playful, but preferring less goofy). Role appears to be Product Manager / Business Leader.

## Target Platform
Both (responsive) — single-page scrolling site designed for desktop with responsive mobile support.

## Layout Patterns
- Single-page scroll with anchor navigation
- Max-width 1200px centered container with 1.5rem horizontal padding
- Sections stacked vertically with generous 4rem vertical padding
- CSS Grid for 2-column layouts (About: 2fr/1fr; Contact: 1fr/1.5fr)
- CSS Grid auto-fit for project cards (minmax 350px)
- Mobile: stacks to single column at 768px, nav collapses at 480px

## Navigation
- Primary: Fixed top navbar with initials brand left, 4 links right (About, Experience, Projects, Contact)
- Scroll shadow effect on navbar when scrolled
- Active link highlighting via JS scroll tracking
- Mobile: nav links hidden at 480px (hamburger not yet implemented)

## Page Types
### Single-Page Portfolio
- Structure: Hero → About → Experience → Projects → Contact → Footer
- Key elements: Profile photo, headline, CTAs, stats counter, skills grid, timeline, project cards, social links, contact form

### Hero Section
- Structure: Centered, max-width 800px
- Key elements: Circular profile photo (200px), H1 with highlighted name, subtitle, description paragraph, dual CTA buttons, 3-stat row

### About Section
- Structure: 2-col grid (text left, skills right)
- Key elements: Two body paragraphs, 2x3 skills grid with emoji icons

### Experience Section
- Structure: Left-side vertical timeline line, items hanging right
- Key elements: Timeline dot, role title, company (colored), date badge, description, bulleted achievements

### Projects Section
- Structure: Auto-fit card grid (3 across on desktop)
- Key elements: Image top, title, description, impact badges, skill tags

### Contact Section
- Structure: 2-col (social links left, form right)
- Key elements: LinkedIn, Twitter, Email, GitHub links; name/email/message form

## Interaction Patterns
- Smooth scroll navigation
- Hover: cards lift (translateY -8px), timeline items slide right (translateX 8px), social links slide right
- Social links get brand color borders on hover
- Scroll-triggered fade-in animations via IntersectionObserver
- Contact form submit (needs backend integration)
- Stats counter animation (wired up, currently commented out)

## Content Hierarchy
- H1: 3rem (hero name)
- Section titles: 2.5rem with gradient underline bar
- Timeline H3: 1.5rem role titles
- Body: 1.125rem with 1.7-1.8 line height
- Labels/tags: 0.875rem

## UX Conventions
- Cards with box-shadow, border-radius xl, hover lift
- Gradient accents: indigo (#4f46e5) → cyan (#06b6d4)
- Emoji icons for skills and achievements
- Impact badges with gradient fill
- Skill tags with muted background

## Design Aesthetic (User Preference)
- Inspired by: lusmo.re — simple, functional, pleasant (clean typography, minimal chrome)
- Also likes: jhm.omg.lol — playful/simple (but user prefers less goofy)
- Goal: Simple + functional + a little bit of wit
- Audience: Potential employers

## Screenshot Observations
No live screenshots available — site is a template with placeholder content. Analysis based on code review.

## Wireframes Generated
- `wireframe/personal-website.html` — 4 options: Safe Option (scroll), Text-First (lusmo.re style), Hub & Spoke (tile directory), Accordion (scannable collapse). Recommended: Option 4 (Accordion) for discoverability goal.
