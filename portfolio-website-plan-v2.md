# Zixu (Wing) Ren — Portfolio Website Plan v2 (Final)

## 🎯 Strategic Positioning

**Target roles:** AI Product Designer / Interaction Designer
**Target companies:** Hardware-software crossover multinationals in Europe
(Philips, B&O, Dyson, Nothing, Teenage Engineering, Google Hardware, Samsung, Sonos, IKEA smart home)
**Target regions:** Spain / Europe / Remote
**Language:** English only

**Hero statement:**
> "Designing how *people* connect with *AI*"

**Sub-line:**
> AI Product Designer / Interaction Designer

---

## 🖼️ Visual Identity

### Colors (3 only)
- **Cream/Off-white:** `#F5F2E8` — primary background
- **Lemon Yellow:** `#E8DC2B` — accent, digital twin body, highlight sections
- **Black:** `#1A1A1A` — text, dark sections

### Typography
- **Display (headlines):** Elegant serif with personality — mix of roman + italic
  - Candidates: Playfair Display, Cormorant Garamond, or DM Serif Display
  - Style: Large, mixed weight (bold project names + italic descriptions like victorventura.xyz)
- **Body/UI:** Clean sans-serif, small
  - Candidates: Satoshi, General Sans, or DM Sans
  - Used for: navigation, tags, buttons, small labels
- **Size scale:** Headlines very large (48-72px), body small (12-14px), high contrast

### Design Principles
- Each full section = ONE solid color (cream OR yellow OR black)
- No color splits within a section
- Flat, no shadows, no gradients
- Large typography as the primary visual element
- Generous whitespace
- Minimal UI chrome — content speaks

---

## 🏗️ Page Flow (Single Page, Scroll-Based)

The entire site is ONE page. No routing to project detail pages.
Each section occupies roughly one viewport height.

### Section 1: HERO (Cream top + Yellow bottom)
**Layout reference:** "Tomorrow on Paper"
- Top half: cream `#F5F2E8`
  - Small navigation: name (left), links (right) — "Works / About / Contact"
  - Large centered headline with mixed serif styling:
    "Designing how *people* connect with *AI*"
  - Subtle hand-drawn line between cream and yellow zones (like reference)
- Bottom half: lemon yellow `#E8DC2B`
  - Centered button: `[ talk to my digital twin ]`
  - Corner links: LinkedIn, Email (left) / Based in Spain (right)

**Digital Twin Activation:**
When user clicks "talk to my digital twin":
1. Yellow background SHRINKS from full-width into an organic blob shape (CSS clip-path or SVG animation)
2. Background behind it becomes cream
3. The yellow blob starts breathing/morphing animation
4. Chat interface appears (text input + conversation bubbles)
5. During conversation, blob morphs into contextual shapes:
   - Talking about creativity → lightbulb
   - Talking about emotions/Unlovable → heart
   - Talking about growth → raindrop/seed
   - Idle/thinking → organic blob
   - General greeting → lemon (playful)
6. Each shape is SOLID lemon yellow, flat, no outline — just the silhouette

**Digital Twin Chat:**
- Powered by Claude API (called client-side)
- System prompt contains Wing's full background, personality, project details
- Conversational, warm, answers questions about Wing's work and experience
- This is the ONLY interactive JavaScript island on the entire site

### Section 2: PHILOSOPHY QUOTE (Black)
Full-screen black `#1A1A1A`
Centered text in cream:
> *"I believe meaningful technology should extend beyond screens —
> engaging our bodies, environments, and emotions."*

### Section 3: SELECTED WORKS (Cream)
**Layout reference:** victorventura.xyz list style

Full-screen cream `#F5F2E8`
- Section label: "SELECTED WORKS" (small, sans-serif, top-left)
- Each project = one horizontal row/card:
  - Left: small icon or colored dot/symbol
  - Project name in BOLD CAPS serif
  - Italic serif description
  - Rows have generous vertical spacing
  - On hover: subtle highlight (yellow underline or background flash)
  - On click: expands inline to show project details (accordion style) — 
    OR scrolls to project detail section below

**Project List (7 projects):**
```
⬡  AIMO                    AI companion for elderly wellness
◐  UNLOVABLE               AI emotional support for breakups
◉  SAMSUNG CAF             Wearable interaction for sports
◈  SAMSUNG AIR-N           Smart home air purification system
▣  I-TATTOO                China's first tattoo art space ecosystem
◎  BASAO                   Tea experience & retail space design
△  COCREATAIL              DIY cocktail kit brand & product
```

### Section 4: PROJECT DETAILS (Alternating Cream/Yellow)
Each project gets a sub-section when clicked/scrolled to:
- **Hero image** (full-width)
- **One-liner:** What is this project?
- **Role / Duration / Client**
- **The Approach:** 2-3 sentences on your design thinking
- **Key Visuals:** 2-4 images showing process and result
- **Outcome:** Impact or result (if applicable)

Color alternates: Cream → Yellow → Cream → Yellow...
This creates rhythm as user scrolls through projects.

### Section 5: PHILOSOPHY QUOTE 2 (Black)
> *"When you have an idea, make it happen."*

### Section 6: ABOUT (Yellow)
Full-screen lemon yellow `#E8DC2B`
- Brief bio paragraph (3-4 sentences)
- Key skills as subtle text (not tags/badges)
- Professional photo (optional — or keep it text-only to match minimal style)

### Section 7: EXPERIENCE (Cream)
- Timeline or list of key roles:
  - ELISAVA — Human Interaction Design & AI (2025-2026)
  - Independent Design Consultant (2019-2025)
  - I-TATTOO — Design Leader & Art Director (2015-2018)
  - Samsung Design China — Senior Interaction Designer (2013-2015)

### Section 8: COLLABORATED WITH (Black)
- Company/brand logos or names in a horizontal row
- Samsung, Tencent, Vans, Adidas, BASAO, Hortifrut, ABInBev...

### Section 9: CONTACT (Cream)
- Large serif: "Let's *talk*"
- Subline: "Open to roles in Europe · Available July 2026"
- Email button + Download CV button
- LinkedIn link

---

## 🔧 Technical Architecture

### Stack
- **Astro** — Static site generator, zero JS by default
- **CSS** — Pure CSS (no Tailwind), CSS variables for colors/fonts
- **One interactive island** — Digital Twin (Preact or vanilla JS component)
- **Claude API** — For digital twin chat functionality
- **Deployment** — Vercel or Netlify

### Key Astro Features to Demonstrate

1. **Content Collections** — All 7 projects stored as Markdown files with Zod schema validation
   - Frontmatter: title, description, role, duration, client, tags, images, order
   - Schema enforces required fields at build time

2. **Island Architecture** — Digital Twin chat is the only `client:visible` island
   - Everything else is static HTML/CSS, zero JavaScript
   - Demonstrates Astro's core philosophy perfectly

3. **Component-based architecture** — Each section is an Astro component
   - Reusable, maintainable, clear separation of concerns

4. **Static Site Generation** — `astro build` outputs pure HTML/CSS
   - Fast, SEO-friendly, no server needed

### File Structure
```
src/
├── layouts/
│   └── BaseLayout.astro              # HTML shell, meta, fonts, CSS variables
├── components/
│   ├── Nav.astro                     # Minimal navigation
│   ├── Hero.astro                    # Hero section (cream + yellow split)
│   ├── PhilosophyQuote.astro         # Black quote divider (reusable)
│   ├── WorksList.astro               # Project list (victorventura style)
│   ├── ProjectDetail.astro           # Single project expanded view
│   ├── About.astro                   # Bio section
│   ├── Experience.astro              # Career timeline
│   ├── Brands.astro                  # Collaborated with logos
│   ├── Contact.astro                 # Contact CTA
│   └── DigitalTwin/
│       ├── DigitalTwin.jsx           # Interactive island (Preact)
│       ├── BlobShape.jsx             # SVG blob morphing logic
│       └── ChatInterface.jsx         # Chat UI + API connection
├── content/
│   └── projects/
│       ├── aimo.md
│       ├── unlovable.md
│       ├── samsung-caf.md
│       ├── samsung-air-n.md
│       ├── i-tattoo.md
│       ├── basao.md
│       └── cocreatail.md
├── pages/
│   └── index.astro                   # Single page, composes all sections
├── styles/
│   └── global.css                    # CSS variables, reset, typography
└── assets/
    └── images/                       # Project images
```

---

## 📋 Commit Roadmap (20 commits)

Format: `type: description`
Each commit message includes What / How / Why.

### Phase 1: Foundation (April 7-8)
```
1. init: scaffold Astro project with TypeScript and basic config
   What: Initialize Astro project with recommended settings
   How: npm create astro@latest, configure astro.config.mjs
   Why: Astro provides static-first architecture ideal for portfolio sites

2. feat: define global CSS system with color and typography variables
   What: CSS custom properties for cream/yellow/black palette and font loading
   How: CSS variables in global.css, Google Fonts import for serif + sans
   Why: Design tokens ensure visual consistency and easy theme adjustments

3. feat: create base layout with HTML meta and responsive viewport
   What: BaseLayout.astro with semantic HTML, meta tags, font preloading
   How: Astro layout component wrapping slot content
   Why: Centralized layout prevents duplication and ensures consistent page shell

4. feat: implement minimal navigation header
   What: Fixed nav with name (left) and section links (right)
   How: Static Astro component with anchor links to page sections
   Why: Single-page scroll navigation — no client-side routing needed
```

### Phase 2: Hero + Digital Twin (April 8)
```
5. feat: build hero section with cream/yellow split layout
   What: Full-viewport hero with upper cream zone and lower yellow zone
   How: CSS Grid with two rows, viewport height, centered typography
   Why: Recreates the "Tomorrow on Paper" aesthetic — bold, minimal, editorial

6. feat: add digital twin activation interaction
   What: Click "talk" button → yellow background shrinks into blob shape
   How: CSS clip-path animation from rectangle to organic blob path
   Why: The transition from static to alive embodies the digital twin concept

7. feat: implement blob morphing with SVG path transitions
   What: Yellow blob smoothly transitions between shapes (circle, lemon, bulb, heart, drop)
   How: SVG path d attribute transitions using CSS or JS interpolation
   Why: Each shape serves as visual metaphor during AI conversation

8. feat: create chat interface as Astro interactive island
   What: Preact component for chat UI inside the hero section
   How: client:visible directive loads JS only when hero is in viewport
   Why: Demonstrates Astro island architecture — only interactive component ships JS
```

### Phase 3: Content System (April 8-9)
```
9. feat: define project content collection with Zod schema
   What: Type-safe schema for project frontmatter (title, role, description, etc.)
   How: src/content/config.ts with Zod validation, defineCollection()
   Why: Schema validation catches content errors at build time, not runtime

10. feat: add all project markdown files with frontmatter
    What: 7 project files with structured metadata and content
    How: Markdown files in src/content/projects/ following schema
    Why: Content separated from presentation — easy to add/edit projects

11. feat: build works list section in victorventura.xyz style
    What: Vertical list of projects with bold name + italic description
    How: Astro component querying content collection, CSS Grid rows
    Why: List layout is scannable and emphasizes project names for quick reading

12. feat: implement project detail expansion
    What: Clicking a project reveals its details inline (accordion)
    How: CSS-only accordion with :target or minimal JS toggle
    Why: Keeps user in scroll flow — no page navigation interruption
```

### Phase 4: Remaining Sections (April 9)
```
13. feat: add philosophy quote divider component
    What: Reusable full-screen black section with centered cream text
    How: Astro component accepting quote text as prop
    Why: Creates visual rhythm between content sections with design philosophy

14. feat: build about section on yellow background
    What: Bio, skills narrative, design philosophy on full yellow screen
    How: Static Astro component with typographic layout
    Why: Personal section that shows personality beyond project work

15. feat: add experience timeline section
    What: Career history in clean list format
    How: Semantic HTML with CSS styling, no external timeline library
    Why: Concise career overview for recruiters scanning the page

16. feat: implement brand logos section
    What: Horizontal row of company/brand names on black background
    How: CSS Flexbox layout with brand text or SVG logos
    Why: Social proof — recognizable names build credibility

17. feat: create contact section with CTA
    What: "Let's talk" headline, email link, CV download button
    How: Static section with mailto link and PDF download
    Why: Clear call-to-action to convert page visitors into conversations
```

### Phase 5: AI Integration + Polish (April 9-10)
```
18. feat: connect digital twin chat to Claude API
    What: Chat messages sent to Claude API with portfolio context as system prompt
    How: Fetch to Anthropic messages endpoint, streaming response display
    Why: AI-powered conversation makes the portfolio interactive and memorable

19. feat: add scroll-based section transitions and micro-animations
    What: Subtle fade-in on scroll, smooth section transitions
    How: Intersection Observer API for scroll-triggered CSS animations
    Why: Progressive reveal creates narrative pacing without heavy JS

20. feat: configure build optimization and deploy to Vercel
    What: Static build, image optimization, meta tags, OG image
    How: astro build with Vercel adapter, configure _headers for caching
    Why: Production deployment with performance optimization
```

---

## 📝 Content Wing Needs to Prepare

### Priority 1 (Tonight April 7):
- [ ] **Hero headline** — confirm or refine "Designing how people connect with AI"
- [ ] **3 philosophy quotes** for the black divider sections
- [ ] **Short bio** (3-4 sentences for About section)
- [ ] **Digital Twin persona document** — write about yourself in detail (background, personality, values, how you talk) for the AI system prompt

### Priority 2 (April 8):
For each of the 7 projects, write in English:
- [ ] One-line description (max 8 words)
- [ ] Your role title
- [ ] Duration + client/company
- [ ] The challenge (2-3 sentences)
- [ ] 3-5 key highlights (what you did, decisions you made)
- [ ] Impact/result
- [ ] 1 cover image + 2-4 supporting images (high-res)

### Priority 3 (April 9):
- [ ] Career timeline entries (4-5 key roles)
- [ ] List of brands/companies to display
- [ ] Testimonial quotes (if available)
- [ ] Professional CV as downloadable PDF
- [ ] OG image for social sharing

---

## 🎤 Class Presentation Notes

### Technical story (for professor):
1. "I chose Astro because my portfolio is 95% static content. Astro ships zero JavaScript by default, making it the fastest option for content sites."

2. "The digital twin chat is the only interactive island — it uses `client:visible` so the JS only loads when the hero section enters the viewport. Users who never interact with it never download that code."

3. "I used Content Collections with Zod schemas to manage project data. This separates content from presentation and catches errors at build time."

4. "The blob morphing uses CSS clip-path transitions — no heavy animation libraries, keeping the bundle minimal."

### Trade-offs to discuss:
- "Single-page vs multi-page: I chose single-page because the scroll narrative creates a stronger first impression, but it means all content loads at once. I mitigated this with lazy loading for images."
- "Client-side API calls vs server routes: The AI chat calls Claude directly from the browser. In production I'd add a server endpoint for rate limiting and API key security."
- "CSS-only animations vs JS libraries: I avoided Framer Motion or GSAP to keep the bundle small and to demonstrate that CSS can handle sophisticated transitions."

### Future improvements:
- API route for secure AI calls with rate limiting
- i18n for Chinese/Spanish versions
- CMS integration (Astro + Keystatic or Decap)
- Analytics to track which projects get most engagement
- Accessibility audit (screen reader testing for blob interaction)
