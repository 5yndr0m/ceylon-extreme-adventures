---
target: the homepage
total_score: 20
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
target_identity: "file:/home/syndrom/Documents/ceylone_extream_adventures/dev/ceylon-extreme-adventures/src/app/page.tsx"
target_fingerprint: "sha256:21bc73dfc162b243c42786515e4b4cc3813d7c42e28100c93987019a53514cd7"
target_path: /home/syndrom/Documents/ceylone_extream_adventures/dev/ceylon-extreme-adventures/src/app/page.tsx
timestamp: 2026-09-28T17-32-16Z
slug: src-app-page-tsx
closed: true
---
Method: dual-agent (A: design review, B: detector scan). No browser available; judged from source and detector output.

# Critique: Homepage (src/app/page.tsx)

Health score 20/32 (heuristics 7 and 10 n/a), 62%, Acceptable.
Scores: 1=2, 2=3, 3=2, 4=3, 5=3, 6=2, 8=3, 9=2.

## Design specificity
Half grounded. Evidence layer is CEA-specific (SATA Gold, 0 injuries, real founders, TripAdvisor reviews, montage hero); structure is a generic operator template. DESIGN.md's "Trailhead Briefing" (route, gear, conditions, price) is barely present on the page.
Detector: nothing in page.tsx or homepage components. 54 advisory/warning findings all in globals.css: 1 real layout-transition (globals.css:330 testimonial slide width), 46 font-size advisories mostly false positives against DESIGN.md prose ramp (3 real drift: 1.05rem, 2.4rem, 1.35rem), 5 colour and 2 radius advisories, intentional or off-homepage.

## Priority issues
1. [P1] Departures hide their own facts: month cards show image + count + 13px "See More"; render date/title/from-price/spots. (layout)
2. [P1] Safety asserted, not shown: add a "How we keep you safe" band (rescue plan, hard-stop rule, certification, Ministry letter, 0 injuries), move stat strip up. (shape)
3. [P1] Activity cards carry no decision facts; River Expedition card links to zero experiences; "Six Ways" count wrong. (clarify)
4. [P2] Three competing autoplays plus hero video; keep testimonials, stop founders and mobile activities autoplay. (quieter)
5. [P2] No closing conversion route (Book / private trip / WhatsApp). (harden)

## Persona red flags
Jordan: hero CTA goes to carousel not dates; 13px See More; no beginner signal.
Casey: autoplay while reading; See More tiny; sticky Book Now repeats header CTA to an image grid.
Priya: no price/currency; no visible safety process or company registration; refund policy only in footer; mailto-only contact; "0 injuries" has no context.

## Minor
Hero badge too long at 12px; "From the trail" eyebrow repeats the heading; rope-divider CSS unused; footer Rafting link drifts from homepage card filter; Watch Showreel leaves funnel.

## Questions
Why does the catalog sit above the only priced thing (departures)? Would 0 injuries be believed with the rescue plan behind it? What one fact makes Priya click Book?
