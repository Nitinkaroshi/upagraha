# Product Marketing Context

*Last updated: 2026-04-22*

## Product Overview

**One-liner:** Free, open-source space debris monitoring and regulatory compliance tools for satellite operators and the space community.

**What it does:** Upagraha gives satellite operators, university CubeSat programs, and space enthusiasts free in-browser tools to calculate orbital lifetime, check FCC/ESA compliance, plan deorbit strategies, score mission sustainability, and visualize the orbital debris environment with live satellite data. Everything runs client-side — no sign-up, no credit card, no install.

**Product category:** Space situational awareness (SSA) tools / Space debris compliance platform.
- How prospects search: "orbital lifetime calculator," "FCC 5 year deorbit rule," "satellite tracker," "satellites overhead"

**Product type:** Open-source web application (free) with planned freemium SaaS tier (branded compliance reports, API access, multi-mission portfolio).

**Business model:**
- **Now:** Free for everyone. Open source under MIT.
- **Future:** Freemium — basic tools stay free; paid tier adds branded PDF reports, API access, multi-mission management, alerts.
- **Pricing target (planned):** Free / Starter $49-99 mo / Professional $199-499 mo / Enterprise $1k-2k mo.

## Target Audience

**Target companies/users:**
- Small satellite operators and SmallSat startups (especially India, US, EU)
- University CubeSat programs (300+ globally with active missions)
- Aerospace consultants who help clients file FCC/ITU paperwork
- Space-tech students, hobbyists, science journalists (top of funnel)

**Decision-makers:**
- Mission systems engineer (technical user — runs the tools)
- Regulatory/compliance lead (uses output for filings)
- Founder/PM at small operator (signs off on paid tier)
- Professor or program lead at university (introduces students)

**Primary use case:** "I need to check if my satellite design meets the FCC 5-year deorbit rule before filing paperwork — fast, without paying for STK or learning NASA DAS."

**Jobs to be done:**
- Verify mission compliance with FCC/ESA debris-mitigation rules early in design
- Compare deorbit strategies (drag sail vs propulsion vs natural decay) with cost estimates
- Show a stakeholder/professor a credible-looking visualization of the orbital environment
- Find satellites currently overhead from my location (consumer/curiosity)
- Look up specific satellite orbital data (ISS, Hubble, Starlink, etc.)

**Use cases:**
- Pre-design feasibility check for a CubeSat mission proposal
- Compliance pre-screening before formal NASA DAS analysis
- Educational demos in aerospace / orbital mechanics courses
- Stakeholder presentations needing an "orbital environment" visual
- Hobbyist sky-watching ("when can I see the ISS?")
- Research / blog references for space sustainability content

## Personas

| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| **Mission Engineer (User)** | Speed, accuracy, easy export | Existing free tools are ugly/desktop-only; paid tools are $$$ | Browser-based, modern UX, results in seconds |
| **Compliance Lead (Champion)** | Documented audit trail, regulatory rules | Hard to demonstrate compliance before filing | One-click PDF report citing FCC/ESA references |
| **Startup Founder (Decision Maker)** | Cost, time-to-launch | Can't afford $30k/yr STK license for a 50kg satellite | Free now; cheap when paid features land |
| **University Professor (Influencer)** | Pedagogical clarity, reliability | Students need accessible tools to learn orbital mechanics | Free forever for academic use, open source |
| **Curious Public (Awareness)** | "Is this cool?" sharable | No good free way to see space debris | Beautiful 3D globe + "satellites over me right now" |

## Problems & Pain Points

**Core problem:** Satellite operators face new mandatory debris-mitigation regulations (FCC 5-year rule, ESA Zero Debris Charter), but the tools to plan for compliance are either prohibitively expensive (Ansys STK at $30k+/yr), only run on outdated desktop software (NASA DAS, ESA DRAMA), or require deep astrodynamics expertise just to install.

**Why alternatives fall short:**
- **NASA DAS / ESA DRAMA:** Free but desktop-only, ugly UI, steep learning curve, slow iteration
- **Ansys STK / GMAT:** Powerful but $30k+ license, weeks to learn
- **LeoLabs / Slingshot Aerospace:** SSA-focused, expensive enterprise contracts, not designed for compliance pre-screening
- **CelesTrak (raw data):** Free but it's data, not a tool — you have to build everything yourself
- **In-house spreadsheets:** Error-prone, can't be shared with regulators

**What it costs them:** Weeks of lost time on every mission iteration. Tens of thousands in software licenses or consulting fees that small operators can't afford. Worst case: missing the FCC 5-year rule and getting their license denied.

**Emotional tension:** "I'm a competent engineer, why is checking a basic regulatory rule so painful? Why does every tool either cost a fortune or feel like it's from 1998?"

## Competitive Landscape

**Direct competitors (free debris/orbital tools):**
- **NASA DAS** — Authoritative but Windows desktop only, dated UI, slow
- **ESA DRAMA** — European equivalent, same usability gap
- **CelesTrak** — Provides raw catalog data; not a tool, no calculations or compliance
- **n2yo.com / heavens-above.com** — Public satellite trackers; visualization only, no compliance work

**Secondary competitors (paid SaaS / enterprise SSA):**
- **LeoLabs** — Radar-based commercial SSA. Premium price; targets large operators.
- **Slingshot Aerospace** — DoD-focused SSA platform. Not for small operators.
- **Kayhan Space** — Conjunction analysis SaaS. Closest in spirit but $$$.
- **Ansys STK** — Industry-standard astrodynamics suite. Powerful, expensive, complex.

**Indirect competitors:**
- **Aerospace consultants** — Hire a person to do the analysis. $$$, slow, doesn't scale.
- **Spreadsheets / hand calculations** — Error-prone, not auditable.

**How they fall short:** Free tools are unusable; usable tools are unaffordable for small ops; everything is desktop-bound or behind a sales call.

## Differentiation

**Key differentiators:**
- Free forever for the core tools — no signup, no credit card, no demo call
- Browser-based — works on any device, no install, no version conflicts
- Modern UX — black & white minimal aesthetic, real-time 3D globe, animated space background
- Real live data — direct CelesTrak feed, SGP4 propagation, updates hourly
- Built for the FCC 5-year rule era — not retrofitted from a 25-year mindset
- Open source (MIT) — auditable, forkable, no vendor lock-in
- Programmatic SEO — every tracked satellite has its own page (8000+ pages)
- Geolocation feature — "Satellites Over You" works from any browser

**How we do it differently:** Strip the problem to its essentials. Pick one thing (compliance pre-screening, lifetime estimation, deorbit advisor) and make it perfect in the browser. Don't try to be STK. Be the tool engineers actually open daily.

**Why that's better:** A 50kg-satellite startup can iterate compliance design 50× faster than waiting for a consultant or learning DAS. Universities can teach orbital mechanics with a tool students will actually use.

**Why customers choose us:** Speed (results in 2 seconds), cost (zero), trust (open source + cite-able regulatory references), aesthetics (looks credible to non-engineering stakeholders).

## Objections

| Objection | Response |
|-----------|----------|
| "Is this accurate enough for regulatory filings?" | No — we're explicit. Use Upagraha for screening and design iteration. For the actual FCC filing, run NASA DAS. We make the iteration 50× faster; DAS validates the final answer. |
| "How do I know it's not just simulated data?" | The Live Tracker pulls real TLEs from CelesTrak. The Lifetime Calculator uses King-Hele drag theory with the 1976 US Standard Atmosphere. Code is open source — read it. |
| "What's the catch with 'free'?" | Tools stay free forever (MIT license). We monetize later via branded PDFs, API access, and multi-mission management for ops who want them. The free tier is genuinely complete. |
| "I've never heard of you." | Fair — we're new. Star us on GitHub, read our blog, run the tools. The platform is the proof. |
| "Why not just use NASA DAS?" | DAS is the regulatory standard but takes 30 minutes to install, runs only on Windows, and has a UI from 2001. We do iteration in seconds in any browser. Use both. |

**Anti-persona:** Large geostationary operators (Intelsat, SES) with in-house STK licenses, defense/national-security customers requiring classified networks, anyone who needs operational-grade conjunction screening (we explicitly say we are not that).

## Switching Dynamics

**Push (away from current solutions):** "I just want to check if my CubeSat's lifetime is under 5 years and STK takes 3 hours, NASA DAS won't open on my Mac, and the consultant wants $5k for a one-page memo."

**Pull (toward us):** "Wait, I can just open a webpage, type in altitude/mass, and have the FCC compliance answer in 2 seconds with a downloadable PDF? And it's free?"

**Habit:** Existing engineers default to STK or DAS because that's what their thesis advisor / senior engineer used. Our job is to make us so much faster that the habit breaks naturally.

**Anxiety:** "Will my regulator accept this?" — answered by: we're a screening tool, you still file with DAS. "Will the data be wrong?" — answered by: open-source code, citing standard models, real CelesTrak data.

## Customer Language

**How they describe the problem:**
- "I just need to check FCC compliance fast"
- "STK is overkill for a CubeSat"
- "DAS won't run on my Mac"
- "How do I find when the ISS passes over me?"
- "What's the deorbit time for a 500km orbit?"

**How they describe us (aspirational, until validated):**
- "It's like Stripe for space compliance"
- "Finally a debris tool that doesn't look like it's from 2001"
- "Free, beautiful, and it just works"

**Words to use:**
- Free, open source, in-browser, no sign-up
- FCC 5-year rule, ESA Zero Debris Charter, compliance, deorbit
- Real-time, live, CelesTrak, SGP4, NORAD ID
- Orbital lifetime, ballistic coefficient, conjunction
- "Right now" (urgency), "passing over you" (immediacy)

**Words to avoid:**
- "AI-powered" (overused, our tools are physics, not ML)
- "Enterprise" (we're not that yet)
- "Solution" (vague — say "tool" or specific tool name)
- "Disruption" (cringy in serious aerospace)
- "Easy" (it's technical work — say "fast" or "browser-based")

**Glossary:**
| Term | Meaning |
|------|---------|
| TLE | Two-Line Element — text format for orbital elements, NORAD-issued |
| SGP4 | Simplified General Perturbations propagator — standard model for orbit prediction |
| NORAD ID | Catalog number for tracked space objects |
| FCC 5-year rule | 2024 FCC mandate that LEO satellites must deorbit within 5 years of mission end |
| ESA Zero Debris | European Space Agency policy targeting zero debris by 2030 |
| Conjunction | Predicted close approach between two orbital objects |
| Kessler Syndrome | Cascading collision scenario making LEO unusable |
| Ballistic coefficient | Mass / (drag coefficient × cross-sectional area) — drives orbital decay rate |

## Brand Voice

**Tone:** Honest, direct, technical-but-accessible. No hype, no sales-speak.

**Style:** Conversational like a senior engineer explaining to a peer — never condescending, never marketing-fluffy. Short sentences. Concrete numbers. Cite regulations and physics by name.

**Personality:** Minimalist · Credible · Curious · Pragmatic · Generous (open source, free).

**Visual identity:** Pure black & white. Subtle starfield + 3D globe. No colored accents (functional risk indicators only). Inter sans + JetBrains Mono. Looks like a NASA mission console designed by Linear.

## Proof Points

**Metrics (real, verifiable):**
- 8,000+ active satellites with live data from CelesTrak
- 36,500+ tracked objects in Earth orbit
- SGP4 propagation accuracy to within ~1km for short-term predictions
- 100% client-side — zero servers, zero tracking, zero credentials needed
- 5+ tools shipped (and counting), all free

**Customers:** None yet — pre-launch as of 2026-04-22.

**Testimonials:** None yet — collect aggressively post-launch.

**Value themes:**
| Theme | Proof |
|-------|-------|
| Free without compromise | MIT license, no ads, no signup, full features |
| Real data, not demos | Direct CelesTrak feed, not pre-canned datasets |
| Built for the new regs | FCC 5-year rule check is a primary feature |
| Modern UX | Three.js globe, live counters, responsive design |
| Open source | github.com/Nitinkaroshi/upagraha |
| Educational | Glossary, references to King-Hele, US Std Atm 1976 |

## Goals

**Primary business goal (12-month):** Achieve 1,000 monthly active users and 50 paying subscribers ($2,500-5,000 MRR) by April 2027.

**Conversion action (now):** Run a tool, star the repo, share a result. (Lead capture comes once we add email-required features like alerts and saved missions.)

**Conversion action (paid tier, planned):** Sign up to save mission profiles → upgrade to export branded PDF reports / API access.

**Current metrics:** Pre-launch. Site live at https://upagraha-ten.vercel.app, GitHub at https://github.com/Nitinkaroshi/upagraha. Zero traffic, zero users.

**Distribution priorities:**
1. Long-form SEO (blog + programmatic satellite pages) — compounding
2. Reddit r/spaceflight, r/cubesat, r/aerospace — direct prospect channels
3. Hacker News Show HN — credibility burst
4. University CubeSat program email outreach — high-LTV acquisition
5. Aerospace regulatory consultants — leverage channel (each = 5-20 referrals)
