---
name: Ceylon Extreme Adventures
description: Chase freedom, one extreme adventure at a time. Adventure-tourism booking site for a safety-first Sri Lankan guide crew.
colors:
  blue-1: "#033C50"
  blue-2: "#1C566E"
  blue-3: "#4D7996"
  blue-4: "#ABC2D0"
  green-1: "#0F473C"
  green-2: "#2F664F"
  green-3: "#71A07C"
  green-4: "#B5E0B3"
  highlight-yellow: "#FFFF00"
  basalt-black: "#14181A"
  stone-gray: "#5C6660"
  mist-white: "#F7F5F0"
  cloud-gray: "#E7E4DC"
  success-green: "#3A8F4A"
  paper-white: "#FFFFFF"
typography:
  display:
    fontFamily: "North, sans-serif"
    fontSize: "clamp(2rem, 1.55rem + 2.2vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "0.5px"
  headline:
    fontFamily: "North, sans-serif"
    fontSize: "clamp(1.65rem, 1.4rem + 1.3vw, 2.6rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.3px"
  title:
    fontFamily: "Lato, sans-serif"
    fontSize: "clamp(1.25rem, 1.15rem + 0.4vw, 1.6rem)"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "Lato, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  body-lg:
    fontFamily: "Lato, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.95rem + 0.2vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Lato, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    letterSpacing: "0.5px"
  eyebrow:
    fontFamily: "Lato, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    letterSpacing: "2.5px"
rounded:
  sm: "6px"
  field: "8px"
  md: "14px"
  panel: "16px"
  pill: "999px"
spacing:
  gutter: "20px"
  grid-gap: "24px"
  section-y-mobile: "64px"
  section-y-tablet: "88px"
  section-y-desktop: "120px"
  container-max: "1240px"
components:
  button-primary:
    backgroundColor: "{colors.blue-2}"
    textColor: "{colors.paper-white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "15px 30px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.blue-1}"
  button-dark:
    backgroundColor: "{colors.green-1}"
    textColor: "{colors.paper-white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "15px 30px"
  button-dark-hover:
    backgroundColor: "{colors.green-2}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.paper-white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "15px 30px"
  card-event:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.basalt-black}"
    rounded: "{rounded.md}"
    padding: "20px 22px 24px"
  card-value:
    backgroundColor: "{colors.green-1}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.md}"
    padding: "28px 24px"
  card-booking:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.basalt-black}"
    rounded: "{rounded.md}"
    padding: "24px"
  field-light:
    backgroundColor: "{colors.mist-white}"
    textColor: "{colors.basalt-black}"
    rounded: "{rounded.field}"
    padding: "11px 13px"
  field-dark:
    backgroundColor: "rgba(255,255,255,0.08)"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.field}"
    padding: "13px 14px"
  badge-new:
    backgroundColor: "{colors.blue-2}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  nav-header:
    backgroundColor: "{colors.basalt-black}"
    textColor: "{colors.paper-white}"
    typography: "{typography.label}"
  footer:
    backgroundColor: "{colors.basalt-black}"
    textColor: "{colors.paper-white}"
---

# Design System: Ceylon Extreme Adventures

## Overview

**Creative North Star: "The Trailhead Briefing"**

The site should feel like the calm, exact minute before a descent: a guide laying out the route, the gear, the conditions and the price, plainly, before anyone touches the rope. Dark jungle surfaces frame the photography, warm light surfaces carry the facts, and a single blue signal marks the one thing to do next. Confidence comes from clarity and real imagery, not from decoration. The original ambition was an expedition-operator site in the vein of eliteexped.com; this is the current, more approachable version of it.

Density is moderate and editorial: full-bleed video and photo heroes, generous section padding, then tidy card grids for experiences, departures and reviews. Type is loud only where it earns it (uppercase North headlines), everything else is quiet, tracked and utilitarian. Depth comes from long, soft shadows under photographic cards and from dark overlays on imagery. Components are precise and restrained: uniform radii, hairline borders, small tracked uppercase labels. The primary call-to-action is the one place the system allows itself a glow.

**Key Characteristics:**
- Alternating dark (deep green, basalt black) and warm light (mist white, cloud gray, white) sections around real photography.
- One accent, brand blue, reserved for action and emphasis; one narrow yellow highlight reserved for date numerals only.
- Uppercase condensed display type over a plain sans body.
- Long, soft, low-opacity shadows under cards and photographs; flat everywhere else.
- Every image is a real CEA photograph; the hero is a looping montage with the logo kept legible over it.

## Colors

The official CEA brand palette (client-supplied 2026-10-03): four blues, four greens, one yellow, nothing else — no orange exists anywhere in the approved brand. An earlier "Adrenaline Orange" accent was used sitewide before this palette was supplied; it was never an approved brand color and has been fully removed.

### Primary
- **Blue 2** (`#1C566E`): the brand signal and primary action color. Primary button fill, "new" badge, active nav/tab state, active carousel dot, focus rings, text links. White text on it is 8.06:1.
- **Blue 1** (`#033C50`): the darkest blue. Primary button hover/press (11.89:1 with white text), and `accent-ink` — all blue *text* on light surfaces (eyebrows, tags, card categories) at 11.89:1 on white, 9.36:1 on cloud-gray.
- **Blue 4** (`#ABC2D0`): `accent-on-dark` — blue text/icons on green-1 or basalt surfaces, 5.72:1, the minimum to stay AA.
- **Blue 3** (`#4D7996`): decorative/graphic use only (large shapes, non-text fills). At only 2.26:1 on green-1 it must never carry small text on a dark surface.

### Secondary
- **Green 1** (`#0F473C`): the brand's dark surface — backgrounds of the activities, values and booking sections, the dark button, the mobile menu ground. **Green 2** (`#2F664F`) is the pressed/hover state for dark-green surfaces. Unlike the old jungle-green token, there is no swatch darker than Green 1 in the approved ramp, so "press" moves one step *lighter* (to Green 2) rather than synthesizing a darker shade outside the brand kit.
- **Green 3** (`#71A07C`) / **Green 4** (`#B5E0B3`): light-green accents for large elements or icon fills on a dark-green ground (Green 4 on Green 1 is 7.19:1); not used for small text.

### Highlight
- **Highlight Yellow** (`#FFFF00`): one deliberate, narrow use — the day-number on an event's date badge, matching the client's own October poster. It only ever sits on the near-black `rgba(20,24,26,.85)` badge fill (16.6:1). Never use it as text on a light surface (1.07:1 on white — effectively invisible) or spread it to any other UI element.

### Neutral
- **Basalt Black** (`#14181A`): body text on light, the scrolled header, the footer, the sticky mobile CTA bar, and overlay shadows.
- **Stone Gray** (`#5C6660`): secondary text, captions, metadata, unselected controls.
- **Mist White** (`#F7F5F0`): the default page ground, input fill on light cards, stepper background.
- **Cloud Gray** (`#E7E4DC`): alternate section ground (events, testimonials), card image placeholders, hairline borders on light surfaces.
- **Paper White** (`#FFFFFF`): cards, blog detail and booking-page grounds, text on dark.
- **Success Green** (`#3A8F4A`): confirmations only — not part of the brand ramp, a semantic color.
- Error text uses the plain CSS keyword `crimson`; it is not a brand token.

### Named Rules
**The Single Signal Rule.** Blue means "act here" or "look here." It appears as small text, badges, dots, or one button cluster, never as a large fill or a section background.

**The Readable Signal Rule.** Any surface that needs accent *text* uses `--accent-text`, which resolves to Blue 1 on light surfaces and Blue 4 on dark ones automatically — never hardcode a fixed blue for text, since what clears AA differs by background.

**The One Yellow Rule.** Yellow is not a second accent. It exists for exactly one job — a date numeral on its dark badge — because that is the only place on the site it is both on-brand and legible.

**The Dark Frame Rule.** Heroes, the activities carousel, values, booking and footer sit on green-1 or basalt; content and facts sit on mist white, cloud gray or white. Sections alternate; two dark or two light sections are not stacked without a reason.

**The Whole Logo Rule.** The header carries the full logo exactly as supplied (`logo-full.png`: green "Ceylon" with the carabiner climber, and "Extreme Adventures" stacked beneath), the same lockup as the footer. Never split it into a mark plus a separate tagline.

**The Legible Logo Rule.** The light logo must stay readable over any frame of the hero video; the transparent header carries a dark top-fading gradient for exactly this reason.

## Typography

**Display Font:** North (client-supplied, self-hosted via `next/font/local`), used uppercase for h1, h2, prices, date badges and the mobile menu. Single weight (400); size and tracking do the work of a type scale.
**Body Font:** Lato (client-supplied, self-hosted, weights 400/700/900), set on `body` so paragraphs, buttons, inputs and nav all inherit it (fallback `ui-sans-serif, system-ui, sans-serif`). h3 and h4 use it at 600 and 700.

**Character:** a compressed, poster-like headline face over a neutral working sans. It reads expedition-signage first, brochure second.

**Other brand fonts not used on the site:** the client's font pack also includes Montserrat, Lora, SpartanMB and a distressed display face called REVOLUTION. REVOLUTION matches the client's own flyer/poster title treatment (e.g. "OCTOBER EVENTS") but was deliberately not chosen as the sitewide heading face — too rough for body-adjacent headings at small sizes. It stays a print/poster-only face; do not wire it into the site without an explicit decision to do so.

### Hierarchy
- **Display** (North 400, `clamp(2rem, 1.55rem + 2.2vw, 4rem)`, 1.05, +0.5px, uppercase): h1 and hero lines.
- **Headline** (North 400, `clamp(1.65rem, 1.4rem + 1.3vw, 2.6rem)`, 1.1, +0.3px, uppercase): h2 section titles.
- **Title** (Lato 600, `clamp(1.25rem, 1.15rem + 0.4vw, 1.6rem)`, 1.2): h3 card and column titles. h4 is Lato 700 at `clamp(1.05rem, 1rem + 0.2vw, 1.25rem)` in green-1.
- **Body** (Lato 400, 16px, 1.6): paragraphs. Lead paragraphs use `body-lg` (`clamp(1rem, 0.95rem + 0.2vw, 1.125rem)`). Cards run 14px; flyer-style secondary text 12–13px.
- **Label** (Lato 700, 14px, +0.5px, uppercase): buttons and nav links. Form labels are 12–13px, 700, +0.3px, uppercase. Form fields are 16px so iOS never zooms on focus.
- **Eyebrow** (Lato 700, 12px, +2.5px, uppercase, blue): the small line above every section headline. Card tags are 11px, +1.5px.

**The size ramp.** Literal sizes stay on one ramp: 11, 12, 13, 14, 15, 16, 17, 19, 20, 22, 25 and 28px, plus the fluid `clamp()` steps above. New sizes join the ramp or use an existing step; half-pixel sizes (10.5, 12.5, 13.5, 14.5) were folded in and should not return.

### Named Rules
**The Poster Voice Rule.** North uppercase is for headlines, prices and date stamps only. Never for running text or long labels.

**The Tracked Caps Rule.** Small text that labels (eyebrows, tags, form labels, buttons) is uppercase and letter-spaced. Sentence-case is for reading.

## Layout

A single centered container (max 1240px, 20px side gutters) holds every section. Sections stack vertically with generous rhythm: 64px vertical padding on phones, 88px from 768px, 120px from 1280px. Content grids follow the same breakpoints the code uses (640, 768, 960, 1024, 1280): activity cards go from a one-at-a-time swipe carousel on phones to 2 columns from 768px and 3 from 960px; month and event grids go 1, 2, 3; the footer is 1.4fr + three equal columns from 768px. Grid gaps sit at 24–28px. Split layouts (about, booking) are two columns from 768–960px with 40–44px gaps.

On mobile, fixed bottom bars carry the primary action: a global "Book Now" bar, replaced on experience pages by the page's own "Enquire Now" bar so two bars never stack. The header is fixed at the top.

Photography drives composition: heroes are full-bleed (100svh on the homepage, ~46–60svh on inner pages) with a dark gradient overlay, cards use 4:5 portrait or 4:3 crops for flyers and activities, and blog cards use a wide ~16:10.5 crop.

## Elevation & Depth

A hybrid: sections are flat, while photographic cards float on long, soft, downward shadows with a strongly negative spread, so the shadow sits under the card rather than around it. Depth on imagery comes from dark gradient overlays, not from borders. Only the primary button (and the tall founder card) casts a colored glow.

### Shadow Vocabulary
- **Card lift** (`box-shadow: 0 20px 44px -26px rgba(20,24,26,.35)`): event cards, month banners, booking card. The core shadow; variants range from 16px/40px to 24px/50px offsets at 25–40% opacity.
- **Header/bar** (`box-shadow: 0 2px 20px rgba(0,0,0,.2)`): the scrolled header. Mobile bottom bars use an upward `0 -8px 24px rgba(0,0,0,.12–.3)`.
- **CTA glow** (`box-shadow: 0 8px 24px -8px rgba(28,86,110,.6)`): primary buttons only — Blue 2's own rgb.
- **Glass inset** (`inset 0 1px 0 rgba(255,255,255,.1), 0 12px 28px rgba(0,0,0,.18)`): the translucent panel over activity card photos.

### Named Rules
**The Long Soft Shadow Rule.** Shadows are offset down, wide-blurred, negatively spread and low opacity. A tight dark drop shadow is a mistake.

**The Earned Glow Rule.** Colored glow belongs to the primary CTA and the featured (center) founder card; nothing else glows.

## Shapes

One family of soft-square corners. Cards, banners and panels use a 14px radius (`--radius-md`); the translucent panel over activity photos uses 16px; inputs, date badges and steppers use 8px; a few small pieces use 6px; buttons, badges and pills are fully round (999px); avatars, carousel dots, nav circles and social buttons are circles. Borders are hairlines (1px) in cloud gray on light surfaces and 12–20%-white on dark surfaces. Images are always cropped to the container with `object-fit: cover`, never stretched.

## Components

Character: precise and restrained. Uniform radii, hairline borders and small tracked labels do the talking; the primary CTA is the only warm, glowing element.

### Buttons
- **Shape:** full pill (999px), 44px minimum height, 15px 30px padding, uppercase 14px/700 with +0.5px tracking.
- **Primary:** Blue 2 fill, white text (8.06:1), blue CTA glow. Hover deepens to Blue 1 (11.89:1) and lifts 2px.
- **Dark:** Green 1 fill, white text; hover deepens and lifts 2px. Used on light surfaces where the primary blue would compete.
- **Ghost:** transparent with a 1.5px white border at 65% opacity, white text; hover adds a 12% white wash. Used over photography.
- **Text link CTA:** uppercase 14px/700 with a 2px blue underline border (white text on dark sections, Blue 1 on the light testimonials section).

### Cards / Containers
- **Event card:** white, 14px radius, card-lift shadow, 4:5 flyer image on top with a dark date badge (8px radius, North day numeral in yellow) pinned top-left, body padded 20px 22px 24px, blue tag, green-1 price.
- **Activity card:** photo with a bottom dark gradient and a translucent glass panel (26% dark, 12px backdrop blur, 16px radius) holding title and blurb.
- **Value card (dark):** 6%-white fill on green-1, 1px 12%-white border, 14px radius, 28px 24px padding, blue icon in a 16%-blue circle.
- **Testimonial card:** white, 14px radius, blue stars (kept off yellow deliberately — see Shapes/Color notes below), 4-line clamped quote, 44px circular avatar; the active card sits centered at full scale between two dimmed, scaled-down neighbours.
- **Booking card:** white, 1px cloud-gray border, card-lift shadow, sticky beside the event details on desktop.
- **Level card (grouped experience):** when several experiences share a level group (currently White Water Rafting), the list shows one 4:5 photo card with a "Choose your level" row of 44px pill chips (Beginner, Extreme, Full Day), each linking to its own experience page. Those pages carry a level switcher above the title, with the current level filled green-1.
- **Profile banner:** team profile heroes start below the fixed header (`--header-h`, 76px on phones and 84px from 1024px), so the photo is never covered by the nav bar.

**Why stars are blue, not yellow.** Star ratings look like an obvious yellow use, but pure `#FFFF00` is 1.07:1 on the white testimonial card — unreadable. Yellow stays scoped to its one safe, dark-background use (the date badge) rather than spreading to a spot where it would fail.

### Inputs / Fields
- **Light (booking page):** mist-white fill, 1px cloud-gray border, 8px radius, 11px 13px padding, 16px text, uppercase 12px/700 labels above.
- **Dark (contact form):** 8%-white fill, 1px 20%-white border, white text, 70%-white placeholder.
- **Focus:** a 2px blue outline offset 1–2px, and the field brightens. Never remove it.
- **Quantity stepper:** mist-white pill-ish box, 40px circular buttons with a green-1 glyph that turns blue on hover.
- **Error:** plain crimson 13px text under the form.

### Focus
Every interactive element shows a 2px outline in `--accent-text` (Blue 1 on light, Blue 4 on dark) offset 3px on keyboard focus, and text selection is Blue 2 with white text. A visible "Skip to content" link appears at the top-left on first Tab.

### Navigation
- **Header:** fixed. On the homepage it starts transparent over the hero with a dark top-fading gradient, then turns 92%-opaque basalt with blur after 40px of scroll; inner pages use the solid version. Links are white uppercase 14px/600, blue on hover or when active. Desktop shows the links and a "Book Now" button from 1024px; below that a hamburger opens a full-screen green-1 menu with North 28px uppercase links. The closed menu is inert (unreachable by keyboard or screen reader), and Escape closes it.
- **Footer:** basalt black, four columns, white-65% links that turn blue on hover, circular social buttons with hairline borders.

### Carousel controls
- **Testimonial dots:** 6px circles, 50%-basalt when inactive (3.2:1) and Blue 1 when active, spaced 24px on center (the spacing, not padding, satisfies the touch-target rule). No active scaling. Activities dots follow the same 24px pitch on the dark surface.
- **Prev/next:** 44px circles with a 1px stone-gray border that fill blue on hover.
- **Autoplay:** carousels advance every 5 seconds, pause while hovered or focused, and stay still entirely under `prefers-reduced-motion`. There is no visible pause button by design.

### Signature: Hero
A full-viewport, muted, looping 28-second montage video over a poster frame of the same waterfall, a green-to-black gradient overlay, a translucent "SATA Gold Winner" pill badge, and a three-line North headline that reveals line by line. The poster is the section background, so the video is an enhancement: it loads after the page finishes, and is skipped for reduced-motion visitors and on data-saver or slow connections.

## Do's and Don'ts

### Do:
- **Do** use only real CEA photography and real reviews; imagery is cropped with `object-fit: cover` and given a `sizes` value matching its real rendered width.
- **Do** keep blue to small text, badges, dots and one button cluster per view, and use `--accent-text` so it stays readable on both light and dark surfaces.
- **Do** keep yellow scoped to the one place it's legible: the date numeral on its dark badge.
- **Do** keep the header logo readable over the hero video via the top gradient.
- **Do** use the long, soft, negative-spread shadow for every floating card.
- **Do** put all component CSS in `globals.css`; styled-jsx styles are absent from server HTML and cause flashes of unstyled content.
- **Do** keep interactive targets at 24px or with 24px pitch spacing, and keep the 2px blue focus outline.
- **Do** respect `prefers-reduced-motion` (no autoplaying video or carousels, no reveal transforms).
- **Do** keep hidden UI out of the tab order (`inert`) when it is only moved off-screen or collapsed.

### Don't:
- **Don't** fill a section or large surface with blue, and don't set small text in raw yellow on a light surface.
- **Don't** reintroduce orange anywhere — it is not part of the approved brand palette.
- **Don't** add glows or colored shadows beyond the primary button and the featured founder card.
- **Don't** use North for running text, and don't lowercase the tracked labels.
- **Don't** use stock photography, invented awards, or invented numbers.
- **Don't** stack the global mobile "Book Now" bar over a page that has its own bottom CTA.
- **Don't** use Blue 3 for small text on a dark surface (2.26:1 on green-1 — fails AA).
