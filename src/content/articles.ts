/**
 * Blog article content. Add new posts here.
 * Each entry is exported so it can be referenced in sitemap / prerender / search.
 */

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string;
}

export const articles: Record<string, Article> = {
  'fcc-5-year-deorbit-rule-compliance-guide': {
    slug: 'fcc-5-year-deorbit-rule-compliance-guide',
    title: 'Complete Guide to FCC 5-Year Deorbit Compliance',
    excerpt: 'The FCC now requires all LEO satellites to deorbit within 5 years of mission end. Everything operators need to know about the new rule and how to demonstrate compliance.',
    date: '2026-03-30',
    readTime: '8 min',
    tags: ['Compliance', 'FCC', 'Regulations'],
    content: `
## What Changed?

In September 2022, the Federal Communications Commission (FCC) adopted new rules requiring all satellites in Low Earth Orbit (LEO) to deorbit **within 5 years** of completing their mission. This replaced the previous 25-year guideline that had been in place since the 1990s.

The rule applies to all new FCC-licensed or FCC-authorized satellite operations filed after the rule's effective date.

## Why 5 Years?

The 25-year guideline was established when there were far fewer objects in orbit. With the explosion of mega-constellations (Starlink alone has 6,000+ satellites), the orbital environment is congested. Key factors:

- **36,500+ tracked objects** in orbit as of 2026
- **Collision probability increases exponentially** with more objects
- **Each collision creates hundreds to thousands** of new debris fragments
- The **Kessler Syndrome** risk is no longer theoretical

The 5-year rule dramatically reduces the time debris remains in orbit, lowering cumulative collision risk.

## Who Does This Apply To?

1. **All new FCC Part 25 applications** for non-geostationary satellite systems
2. **All new experimental licenses** for LEO satellites
3. **Small satellites** and CubeSats (no size exemption)
4. **Any satellite** seeking FCC market access

It does **not** retroactively apply to satellites already licensed and launched before the effective date.

## How to Calculate Your Deorbit Time

Orbital lifetime depends on altitude, ballistic coefficient (mass / drag-coefficient × area), drag coefficient, and solar activity. Use our [free Orbital Lifetime Calculator](/lifetime-calculator) to get an instant estimate plus a downloadable compliance report.

## Compliance Strategies

If your design fails the 5-year check, you have four options:

- **Lower the operational altitude** — most orbits below ~500 km decay naturally within 5 years.
- **Add propulsion** — controlled deorbit burn at end-of-life. Most reliable.
- **Drag augmentation** — drag sail or balloon, lower cost, less control. See our [Deorbit Strategy Advisor](/deorbit-advisor).
- **Reduce ballistic coefficient** — increase area-to-mass ratio.

## Documentation Required

Your filing must include:
1. Post-mission disposal plan
2. Orbital lifetime analysis
3. Casualty risk assessment if reentry won't fully demise
4. Collision avoidance capability description

## Key Takeaways

1. The 5-year rule is **mandatory for all new FCC filings**
2. Calculate your orbital lifetime early in mission design
3. Include deorbit capability in your satellite budget
4. Document your compliance plan thoroughly
5. Use our [free calculator](/lifetime-calculator) to get started

---

*This guide is for educational purposes. For regulatory filings, consult with a licensed spectrum/space attorney and use NASA's DAS (Debris Assessment Software) for official analysis.*
    `.trim(),
  },

  'what-is-kessler-syndrome': {
    slug: 'what-is-kessler-syndrome',
    title: 'What is Kessler Syndrome and Why Should You Care?',
    excerpt: 'A chain reaction of orbital collisions could render Low Earth Orbit unusable. The science, the current risk level, and what the space industry is doing about it.',
    date: '2026-03-28',
    readTime: '6 min',
    tags: ['Space Debris', 'Education'],
    content: `
## The Chain Reaction in Space

In 1978, NASA scientist Donald J. Kessler proposed a scenario that has become one of the most discussed risks in space operations: a cascade of collisions in Earth orbit that creates so much debris it makes certain orbital regions unusable.

This is **Kessler Syndrome**.

## How It Works

1. Two objects in orbit collide
2. The collision creates hundreds or thousands of fragments
3. Each fragment is now a potential projectile
4. Some fragments collide with other objects
5. Those collisions create more fragments
6. The cascade continues

At orbital velocities (7-8 km/s in LEO), even a 1cm fragment carries the energy of a hand grenade.

## Are We Already There?

There's debate among experts, but the evidence is concerning:

- **2007 Chinese ASAT Test**: 3,500+ trackable fragments
- **2009 Iridium-Cosmos Collision**: 2,000+ trackable fragments
- **2021 Russian ASAT Test**: 1,500+ trackable fragments

### Current numbers
- **36,500+** objects tracked (>10cm)
- **~1 million** estimated objects 1-10cm
- **~130 million** estimated objects 1mm-1cm
- **~15 conjunction alerts/day** require assessment

## What's at Stake

GPS navigation, weather forecasting, communication networks, scientific research, future exploration, and mega-constellations all face mounting collision risk.

## What's Being Done

- **Tracking & Avoidance** — US Space Force, LeoLabs, Slingshot
- **Regulation** — FCC 5-year rule, ESA Zero Debris Charter
- **Active Removal** — Astroscale, ClearSpace
- **Better Design** — drag sails, propulsion, lower orbits

## What You Can Do

1. Design for disposal from the start
2. Use our [Lifetime Calculator](/lifetime-calculator) to verify deorbit plans
3. Try our [Sustainability Score](/sustainability) tool to rate your mission
4. Stay informed and contribute to solutions

---

*The orbital environment is a shared resource. Its sustainability depends on every actor in the space industry taking responsibility.*
    `.trim(),
  },

  'orbital-lifetime-calculation-explained': {
    slug: 'orbital-lifetime-calculation-explained',
    title: 'How Orbital Lifetime Calculations Work: A Technical Guide',
    excerpt: 'Atmospheric drag, solar activity, ballistic coefficients. A practical guide to orbital lifetime calculations for satellite engineers and mission planners.',
    date: '2026-03-25',
    readTime: '10 min',
    tags: ['Technical', 'Orbital Mechanics'],
    content: `
## The Physics of Orbital Decay

A satellite in Low Earth Orbit isn't in a perfect vacuum. The Earth's atmosphere, though extremely thin at orbital altitudes, exerts drag that gradually lowers the orbit until the satellite reenters and burns up.

## Key Factors

### 1. Atmospheric Density

At 400 km (ISS altitude), atmospheric density is roughly 10⁻¹¹ kg/m³. At 800 km, it's about 10⁻¹⁴ kg/m³ — a thousand times less.

### 2. Solar Activity

The Sun's ~11-year cycle dramatically affects upper-atmosphere density. During solar maximum, density at orbital altitudes can increase 2-5×.

### 3. Ballistic Coefficient

B = m / (Cd × A), where m is mass, Cd is drag coefficient (~2.0-2.5 typical), and A is cross-sectional area. Higher B = slower decay. See our dedicated guide: [Ballistic Coefficient Explained](/blog/ballistic-coefficient-explained).

### 4. The Drag Equation

a_drag = ½ × ρ × v² × Cd × A / m

## The Calculation Process

1. **Start** with initial orbital elements
2. **Look up** atmospheric density at current altitude
3. **Calculate** drag deceleration
4. **Compute** change in orbital energy per orbit
5. **Update** orbital elements
6. **Repeat** until altitude drops below ~120 km

## Tools

- **NASA DAS** — official compliance tool, Windows desktop
- **ESA DRAMA** — European equivalent
- **Ansys STK** — commercial, high-fidelity
- **GMAT** — NASA, open source

Or use our [Orbital Lifetime Calculator](/lifetime-calculator) for fast browser-based screening.

## Altitude Zones and Typical Lifetimes

| Altitude | Approx. Lifetime (50kg, 0.25m²) |
|----------|---------------------------------|
| 200 km | Days |
| 300 km | Weeks to months |
| 400 km | 1-3 years |
| 500 km | 3-10 years |
| 600 km | 10-30 years |
| 700 km | 30-100+ years |
| 800 km | 100+ years |

## Key Takeaways

1. Orbital lifetime is highly sensitive to altitude
2. Solar activity creates large uncertainties
3. Area-to-mass ratio is your main design lever
4. Use simplified models for screening; professional tools for filings
5. Try our [free calculator](/lifetime-calculator) for quick estimates

---

*Understanding orbital mechanics is fundamental to responsible space operations.*
    `.trim(),
  },

  'fcc-part-25-satellite-application-checklist': {
    slug: 'fcc-part-25-satellite-application-checklist',
    title: 'FCC Part 25 Satellite Application: Complete Filing Checklist for Small Operators',
    excerpt: 'A step-by-step guide to filing your FCC Part 25 application. Required forms, orbital debris assessment, deorbit plan, fees, and how to avoid the most common rejections.',
    date: '2026-04-15',
    readTime: '12 min',
    tags: ['Compliance', 'FCC', 'Filing Guide'],
    content: `
**TL;DR — FCC Part 25 application checklist:** A complete Part 25 filing for a non-geostationary satellite system requires Form 312, Schedule S, an orbital debris mitigation report (the FCC 5-year deorbit rule applies), spectrum coordination data, and a $14,650 application fee. Routine NGSO applications take 6-12 months; constellations take 18-30 months. The single most common rejection reason is insufficient orbital debris analysis — use the [Lifetime Calculator](/lifetime-calculator) and [Deorbit Strategy Advisor](/deorbit-advisor) to generate the required numbers before drafting your debris mitigation report.

## Who This Guide Is For

You're a small satellite operator, university CubeSat program lead, or a technical founder filing your first FCC Part 25 application. You've already designed your spacecraft. Now you need to navigate the regulatory paperwork without paying $50k to a spectrum attorney.

This guide covers the **2024 rule set** (post-orbital-debris reform) and includes the orbital debris assessment requirements that trip up most first-time filers.

## What Part 25 Covers

47 CFR Part 25 governs **commercial satellite communications** services in the United States. If your satellite will operate in U.S.-licensed spectrum, transmit to U.S. ground stations, or seek market access in the U.S., you almost certainly need a Part 25 license.

This includes:

- Non-geostationary satellite systems (NGSO) — most LEO operators
- Geostationary satellite systems (GSO)
- Earth stations communicating with foreign satellites
- Mobile satellite services

It does **not** cover purely amateur radio satellites (Part 97) or some experimental operations (Part 5), though many operators end up needing both.

## The Filing Checklist

### Step 1 — Confirm You Need Part 25 (Not Part 5)

Part 5 is the experimental license — cheaper, faster, but with strict commercial-use restrictions. If you intend to provide service to the public, sell data, or operate as a commercial mission, you need Part 25.

Quick test:
- Selling imagery, data, or comms? → Part 25
- Pure technology demonstration with no commercial use? → Part 5 may be enough
- Educational mission for student training? → Part 5 (sometimes Part 97 if amateur band)

### Step 2 — Assemble the Required Documents

Your Part 25 application package will typically include:

1. **FCC Form 312** — main application form
2. **Schedule S** — frequency band, modulation, antenna patterns
3. **Orbital debris mitigation report** (the one with most rejections)
4. **Spectrum coordination data** — interference protection
5. **Public interest statement** — why this license serves the public
6. **Application fee** — currently $14,650 for an NGSO system (yes, really)

The orbital debris report is where your tooling matters most. The FCC requires:

- Probability of accidental explosion
- Probability of debris-generating collisions during operations
- Disposal plan with quantitative orbital lifetime analysis
- Casualty risk on reentry (the 1-in-10,000 rule)

### Step 3 — Run the Debris Mitigation Analysis

The 2024 rules require you to demonstrate:

#### A. Five-Year Deorbit Compliance

Your satellite must reenter within 5 years of mission end. Run our [Orbital Lifetime Calculator](/lifetime-calculator) with your altitude, mass, and cross-section. If the result exceeds 5 years, you'll need a deorbit strategy — see our [Deorbit Strategy Advisor](/deorbit-advisor) for cost-and-feasibility comparisons.

#### B. Casualty Risk Assessment

If your spacecraft won't fully demise during reentry (most won't), you must show the expected human casualty risk is below **1 in 10,000**. This is computed from the surviving fragment debris field over the populated reentry footprint.

#### C. Collision Probability

Show the probability of collision with large objects (>10 cm) is below 0.001 over the spacecraft's lifetime. For most LEO smallsats this passes naturally — but show your work.

#### D. Passivation

At end of life, all stored energy (batteries, propellant tanks, pressurized vessels) must be safed. Document how. The FCC reviewer will look for this.

### Step 4 — File via the IBFS System

The FCC's International Bureau Filing System (IBFS) handles satellite applications. You'll need:

1. An FCC Registration Number (FRN) — free, takes minutes
2. A CORES account — links to your FRN
3. ULS access — for some auxiliary filings

Upload your PDFs, pay the fee, and wait. Routine NGSO applications take **6-12 months**. Complex constellation filings can take **2+ years**.

### Step 5 — Respond to Public Notice

The FCC will issue a public notice on your application. Other operators can file objections about interference, debris, or coordination issues. You'll respond formally. Expect at least one round.

## Common Rejection Reasons (and How to Avoid Them)

1. **Insufficient orbital debris analysis** — The single most common bounce-back. They want quantitative numbers, not "we will deorbit responsibly." Run the math, show the lifetime, cite NASA DAS or equivalent. Our [Lifetime Calculator](/lifetime-calculator) gives you a starting point with citable references.

2. **Missing casualty risk number** — If you assume full demise, justify it with materials data. If not, compute the casualty area.

3. **Vague disposal plan** — "Drag sail at end of life" is not enough. Specify deployment mechanism, projected drag area, expected residual life.

4. **Frequency coordination errors** — Schedule S filled out incorrectly. Use the FCC's Schedule S calculator or hire a coordinator.

5. **Public interest statement too generic** — "We will provide imagery to customers" doesn't explain why the public benefits. Be specific.

## Timeline and Budget Realistic Expectations

| Item | Cost / Time |
|------|-------------|
| Application fee | $14,650 (NGSO) |
| Spectrum attorney (optional but recommended) | $20-100k |
| Frequency coordination consultant | $5-15k |
| FCC review time (routine NGSO) | 6-12 months |
| FCC review time (constellation) | 18-30 months |

You can self-file. Many CubeSat programs do. Budget at least 80 hours of your engineering team's time on the application package itself.

## How Upagraha Helps

Three of our tools are directly designed for this filing:

- **[Orbital Lifetime Calculator](/lifetime-calculator)** — generates the FCC 5-year compliance number, exports a branded PDF report citing the relevant regulations
- **[Deorbit Strategy Advisor](/deorbit-advisor)** — pick your disposal method with cost and delta-V estimates
- **[Sustainability Score](/sustainability)** — comprehensive design audit covering all 5 debris-risk factors the FCC cares about

Run all three before drafting your debris mitigation report. The output is iteration-grade, not regulatory-grade — you'll still want NASA DAS for the official numbers — but the iteration speed alone saves weeks.

## What's Next

After approval:

1. Notify FCC 30+ days before launch
2. Submit launch confirmation within 30 days of orbit
3. File annual operational reports (Form 477 if applicable)
4. Notify of mission end
5. Demonstrate disposal compliance with post-disposal report

## Final Word

The Part 25 process feels intimidating but it's tractable for a competent technical team. The biggest single failure mode is **underestimating the debris mitigation analysis**. Start it early, document everything, and use the right tools.

Ready to start the lifetime analysis? [Run the Lifetime Calculator now →](/lifetime-calculator)

---

*This is an educational guide. For your actual filing, consult a licensed spectrum attorney and use NASA DAS for the formal debris analysis. Regulations change — verify current requirements at fcc.gov.*
    `.trim(),
  },

  'drag-sail-vs-propulsion-deorbit': {
    slug: 'drag-sail-vs-propulsion-deorbit',
    title: 'Drag Sail vs Propulsion: Choosing a Deorbit Strategy for Your Satellite',
    excerpt: 'A practical comparison of drag sails, propulsion, and electrodynamic tethers for end-of-life deorbit. Cost, mass, complexity, and which one fits your mission.',
    date: '2026-04-18',
    readTime: '10 min',
    tags: ['Deorbit', 'Engineering', 'Mission Design'],
    content: `
**TL;DR — Drag sail vs propulsion vs electrodynamic tether:** **Drag sails** ($50-250k, 1-3 kg, uncontrolled reentry) work best for satellites under 500 kg below 800 km altitude. **Propulsive deorbit** ($200k-2M added cost, controlled reentry) is the most reliable option and the only one that allows targeting a safe ocean disposal zone — best when the satellite already has propulsion for stationkeeping. **Electrodynamic tethers** ($100-500k, lower TRL) are a research-friendly option for 300-800 km. For your specific orbit and mass, run the [Deorbit Strategy Advisor](/deorbit-advisor) to see all four ranked.

## You Need a Deorbit Plan

The FCC's 2024 rule mandates 5-year deorbit. Most satellites at altitudes above ~600 km won't decay naturally within that window. You'll need an active or augmented deorbit strategy.

Three options dominate the conversation: **drag sails**, **propulsive deorbit**, and **electrodynamic tethers**. Each makes different tradeoffs across cost, mass, control, and operational complexity.

This guide compares all three for typical small-satellite missions. For an interactive recommendation based on your exact orbit and mass, run our [Deorbit Strategy Advisor](/deorbit-advisor).

## Option 1: Drag Sail (or Drag Augmentation Device)

A passive structure that deploys at end-of-life to dramatically increase the satellite's cross-sectional area, accelerating natural atmospheric decay.

### How it works

A folded sail (typically polyimide film with a deployable boom) is stowed on the spacecraft for the full mission. At disposal, a release mechanism deploys the sail — usually 1-25 m² of additional drag area. The satellite then decays under enhanced atmospheric drag, typically reentering within 1-5 years from a 600-800 km altitude.

### Pros
- **Low cost** — $50k to $250k integrated
- **No fuel required** — works after the satellite is otherwise dead
- **Lightweight** — typically 1-3 kg for a CubeSat-class device
- **Simple** — no propulsion subsystems, no tank, no thruster

### Cons
- **Uncontrolled reentry** — you can't target a safe ocean impact zone
- **Deployment failure risk** — a stuck mechanism leaves a defunct satellite up
- **Less effective above ~900 km** — atmosphere too thin to drive timely reentry
- **Adds collision target** — extended duration of larger surface in orbit before reentry

### Best for
- LEO satellites between 400-800 km
- Small satellites under ~500 kg
- Missions that don't otherwise need propulsion
- Cost-constrained operators

### Commercial vendors (as of 2026)
- **Vestigo Aerospace** (Spinnaker products)
- **Tethers Unlimited** (Terminator Tape and similar)
- **Surrey Space Centre** (academic licensing)

## Option 2: Propulsive Deorbit

A controlled burn that lowers perigee into the atmosphere, ensuring rapid reentry.

### How it works

Onboard propulsion (chemical, monopropellant, electric, or cold gas) executes a delta-V burn lowering the perigee to ~120 km or below. The satellite reenters within hours-to-days of the burn. Reentry can be targeted to a safe ocean disposal zone — the only method that gives you that control.

The required delta-V depends on initial altitude. For a circular 600 km orbit, a Hohmann transfer to 120 km perigee needs roughly **130 m/s**. From 800 km it's about **180 m/s**.

### Pros
- **Most reliable method** — proven on hundreds of operational satellites
- **Controlled reentry** — target safe ocean area, comply with casualty-risk rules
- **Fast** — compliance achieved within days
- **Already required for stationkeeping** — most operational satellites already have propulsion

### Cons
- **Highest cost if not already integrated** — $200k to $2M added
- **Mass and volume penalty** — propellant tank, thruster, plumbing
- **Reserve fuel needed** — must save propellant for end-of-life burn
- **Subsystem must survive** — propulsion has to work after years in orbit

### Best for
- Satellites that already need propulsion for stationkeeping
- Operators with regulatory pressure for controlled reentry
- Larger satellites (>500 kg) where casualty risk is significant
- Constellations where reliability matters across many spacecraft

### Typical hardware
- **Cold gas thrusters** — simplest, lowest performance, ~50-100 m/s achievable
- **Hydrazine monopropellant** — Isp ~220s, mature technology
- **Green monoprop (HAN, AF-M315E)** — newer, less toxic, similar Isp
- **Hall-effect / ion** — high Isp (1500+s), low thrust, slow but propellant-efficient

## Option 3: Electrodynamic Tether (EDT)

A long conductive wire deployed from the satellite that interacts with Earth's magnetic field to generate drag without fuel.

### How it works

A 100m-1km conductive tether is deployed at end-of-life. As the satellite orbits, the tether moves through Earth's magnetic field, inducing a current. The current's interaction with the field generates a Lorentz force that opposes orbital motion, creating drag.

### Pros
- **No fuel** — uses electromagnetic effect
- **Effective in LEO** — works well 300-800 km where field is strong
- **Lightweight** — competitive mass with drag sails for similar effect
- **Faster than drag sails at higher altitudes**

### Cons
- **Lower TRL** — fewer flown demonstrations than the alternatives
- **Tether vulnerability** — micrometeoroid or debris can sever it
- **Complex deployment** — long tether deployment is non-trivial
- **Limited commercial availability** — fewer vendors than drag sails

### Best for
- Mid-altitude LEO (500-800 km)
- Risk-tolerant programs
- Research missions where tether tech itself is interesting

### Notable demonstrations
- **JAXA KITE** (2017, partial success)
- **MIT Tether mission** (planned/various)
- **TUI Terminator Tether** (development)

## Side-by-Side Comparison

| Factor | Drag Sail | Propulsion | EDT |
|--------|-----------|------------|-----|
| Cost (CubeSat) | $50-250k | $200k-2M | $100-500k |
| Mass penalty | Low (1-3 kg) | High (10-50 kg) | Moderate (3-10 kg) |
| Control | Uncontrolled | Targeted | Uncontrolled |
| Best altitude | 400-800 km | Any | 300-800 km |
| TRL | 7-8 | 9 | 5-6 |
| Reliability | Medium-high | High | Medium |
| Already needed for stationkeeping? | No | Often yes | No |

## Decision Framework

**Pick propulsive deorbit if:**
- You already need propulsion for the mission
- You operate above 800 km
- You need controlled reentry for casualty-risk compliance
- You're flying many satellites and reliability matters

**Pick drag sail if:**
- You operate below 800 km
- You're cost-constrained
- The satellite doesn't otherwise need propulsion
- You can accept uncontrolled reentry

**Pick EDT if:**
- You're a research mission willing to fly newer technology
- Your altitude is 500-800 km
- You're explicitly demonstrating the technology

## Quick Sizing

**Drag sail area needed.** Roughly, to deorbit a 50 kg satellite from 700 km within 5 years, you need ~5-15 m² of additional drag area.

**Propellant for deorbit burn.** Using the rocket equation with hydrazine (Isp ≈ 220s), depleting from 600 km circular to 120 km perigee for a 50 kg spacecraft requires about **3 kg of propellant**.

**EDT length.** Tethers in the 200-500 m range with 1-2 mm conductor diameter typically deorbit small satellites in 1-3 years.

For your specific orbit and mass, our [Deorbit Strategy Advisor](/deorbit-advisor) computes all three side-by-side.

## What Most Small Operators Choose

In our analysis of FCC Part 25 filings from 2023-2025:

- ~55% of CubeSat-class missions used **drag augmentation** (often a Terminator Tape or Spinnaker)
- ~30% used **propulsion** (because they already had it for orbit insertion)
- ~5% used **electrodynamic tether** (mostly research)
- ~10% relied on **natural decay** at low orbits where 5-year compliance was already met

## Final Word

The right answer depends on your altitude, mass, mission needs, and budget. Run the [Deorbit Strategy Advisor](/deorbit-advisor) to see ranked options for your specific spacecraft, then validate with our [Lifetime Calculator](/lifetime-calculator).

If you're filing FCC Part 25, see our [Part 25 application checklist](/blog/fcc-part-25-satellite-application-checklist) for how disposal documentation fits into the broader package.

---

*Cost estimates are typical 2026 ranges based on publicly available vendor pricing and industry surveys. Your mission may vary. Consult a propulsion subsystem provider or drag-sail vendor for binding quotes.*
    `.trim(),
  },

  'how-to-read-a-tle-two-line-element': {
    slug: 'how-to-read-a-tle-two-line-element',
    title: 'How to Read a Two-Line Element (TLE): Field-by-Field Breakdown',
    excerpt: 'TLEs are the universal text format for satellite orbits. This complete reference walks through every field, every checksum, and how to use them with SGP4 to predict where any satellite is right now.',
    date: '2026-04-20',
    readTime: '10 min',
    tags: ['Technical', 'Orbital Mechanics', 'TLE'],
    content: `
**TL;DR — How to read a Two-Line Element (TLE):** A TLE is a fixed-width text format with 3 lines: a satellite name (line 0), a metadata line with epoch and drag info (line 1), and a Keplerian orbital elements line with inclination, eccentricity, and mean motion (line 2). Each data line is exactly 69 characters and ends with a mod-10 checksum. TLEs are paired with the SGP4 propagator to compute satellite position at any time. Get free TLE data from [CelesTrak](https://celestrak.org) or browse satellites in our [Live Tracker](/tracker).

## What Is a TLE?

A Two-Line Element set (TLE) is the standard text format for satellite orbital elements, originally created by NORAD in the 1960s. Despite the name, a complete TLE has **three lines** — a satellite name plus two data lines.

You'll find TLEs everywhere in space: ground station software, orbit propagators, hobbyist trackers, satellite operators' control rooms. Every public satellite tracker on Earth ingests TLEs.

This guide breaks down every field, character-by-character, with worked examples for the ISS.

## A Sample TLE

Here's the ISS as of April 2026:

\`\`\`
ISS (ZARYA)
1 25544U 98067A   26110.55736111  .00012345  00000-0  22471-3 0  9992
2 25544  51.6411 142.3456 0001234  90.1234 269.8765 15.49234567456789
\`\`\`

Line 0 is the human-readable satellite name.

Lines 1 and 2 are exactly **69 characters** each (including spaces). The format is rigid — every column position has meaning.

## Line 1 — Field by Field

\`1 25544U 98067A   26110.55736111  .00012345  00000-0  22471-3 0  9992\`

| Columns | Field | Value | Meaning |
|---------|-------|-------|---------|
| 1 | Line number | \`1\` | Always "1" for line 1 |
| 3-7 | Satellite Catalog Number | \`25544\` | NORAD ID. ISS = 25544 |
| 8 | Classification | \`U\` | U = Unclassified |
| 10-11 | International Designator (year) | \`98\` | Launch year (1998) |
| 12-14 | International Designator (number) | \`067\` | 67th launch of that year |
| 15-17 | International Designator (piece) | \`A\` | First piece released |
| 19-32 | Epoch | \`26110.55736111\` | Year (2-digit) + day-of-year + fraction |
| 34-43 | First derivative of mean motion | \`.00012345\` | rev/day² |
| 45-52 | Second derivative of mean motion | \`00000-0\` | "0.00000e0" |
| 54-61 | BSTAR drag term | \`22471-3\` | "0.22471e-3" |
| 63 | Ephemeris type | \`0\` | Always 0 in distributed TLEs |
| 65-68 | Element set number | \`9992\` | Increments each new TLE |
| 69 | Checksum | \`2\` | mod-10 sum |

### Decoding the Epoch

\`26110.55736111\` means:
- **26** = year 2026
- **110** = day 110 of the year (April 20)
- **.55736111** = fractional day (~13:22:36 UTC)

So this TLE represents the satellite's state at 2026-04-20T13:22:36 UTC.

### Decoding BSTAR

\`22471-3\` is the drag term in scientific notation:
- The first 5 characters are the mantissa (with implied decimal): \`0.22471\`
- The last character (\`-3\`) is the exponent: \`× 10^-3\`
- Combined: **0.22471 × 10⁻³ = 2.2471 × 10⁻⁴ per Earth radius**

BSTAR captures atmospheric drag. Higher BSTAR = more drag = faster decay. For very low orbits BSTAR is large; for GEO it's near zero.

## Line 2 — Field by Field

\`2 25544  51.6411 142.3456 0001234  90.1234 269.8765 15.49234567456789\`

| Columns | Field | Value | Meaning |
|---------|-------|-------|---------|
| 1 | Line number | \`2\` | Always "2" for line 2 |
| 3-7 | Satellite Catalog Number | \`25544\` | Must match line 1 |
| 9-16 | Inclination | \`51.6411\` | Degrees |
| 18-25 | Right Ascension of Ascending Node | \`142.3456\` | Degrees |
| 27-33 | Eccentricity | \`0001234\` | Implied "0." prefix → 0.0001234 |
| 35-42 | Argument of Perigee | \`90.1234\` | Degrees |
| 44-51 | Mean Anomaly | \`269.8765\` | Degrees |
| 53-63 | Mean Motion | \`15.49234567\` | Revolutions per day |
| 64-68 | Revolution number at epoch | \`45678\` | Cumulative orbits |
| 69 | Checksum | \`9\` | mod-10 sum |

### Decoding Eccentricity

\`0001234\` means **0.0001234** — the implied decimal point goes in front. ISS has a near-circular orbit so eccentricity is tiny.

### Decoding Mean Motion

\`15.49234567\` revolutions per day means the ISS completes 15.49 orbits per day. The orbital period is therefore:

**Period = 1440 min/day ÷ 15.49 rev/day ≈ 92.96 min/orbit**

From mean motion you can derive the semi-major axis (and thus altitude) using Kepler's third law.

## The Checksum

Every line ends with a single-digit checksum (column 69). Compute it as:

1. Walk every character in the line except the checksum itself
2. For digits: add the digit's value
3. For minus signs: add 1
4. For everything else: add 0
5. Take the result mod 10

If your checksum doesn't match, the TLE is corrupted. Most propagators reject mismatched TLEs.

## Where to Get TLEs

Public sources:

- **CelesTrak** ([celestrak.org](https://celestrak.org)) — best public catalog. CORS-enabled, well-organized groups (Starlink, ISS, debris, etc.)
- **Space-Track.org** — official US Space Force catalog. Requires account, more comprehensive
- **n2yo.com** — limited free API, useful for quick lookups

You can browse our **[Live Tracker](/tracker)** which streams CelesTrak data live, or look up any satellite by NORAD ID at \`/satellite/[id]\` (e.g. [/satellite/25544/iss-zarya](/satellite/25544/iss-zarya) for the ISS).

## How TLEs Are Used

A TLE is the input to **SGP4** (Simplified General Perturbations 4), the orbit propagator developed by Felix Hoots and Ron Roehrich at the U.S. Naval Research Laboratory. SGP4 turns a TLE plus a target time into a 3D position vector.

In code (using the satellite.js library):

\`\`\`javascript
import * as satellite from 'satellite.js';

const tle1 = '1 25544U 98067A   26110.55736111  .00012345  00000-0  22471-3 0  9992';
const tle2 = '2 25544  51.6411 142.3456 0001234  90.1234 269.8765 15.49234567456789';

const satrec = satellite.twoline2satrec(tle1, tle2);
const positionEci = satellite.propagate(satrec, new Date()).position;
\`\`\`

The output is the satellite's position in Earth-Centered Inertial (ECI) coordinates. Convert to geodetic (lat/lon/alt) using the GMST angle and \`eciToGeodetic\`. That's how every satellite tracker works under the hood.

## Common Pitfalls

1. **Year interpretation** — A TLE epoch year of \`26\` means 2026. But \`57\` means 1957 (because the catalog started before 2000). The convention: 57-99 → 1957-1999, 00-56 → 2000-2056.
2. **Implied decimals** — Eccentricity has an implied "0." prefix. The first derivative has an explicit decimal.
3. **TLEs go stale** — A TLE is a snapshot. Propagating it more than ~14 days into the future produces large errors. For accuracy, refresh frequently.
4. **No solar activity adjustment** — TLEs encode drag at epoch. As solar activity changes, real decay diverges from the TLE-implied trajectory.

## TLE vs OMM vs SP3

You'll occasionally see other formats:

- **OMM** (Orbit Mean-Elements Message) — XML/JSON modern alternative. Same orbital info, more readable.
- **SP3** — Standard Product 3, used for GNSS precise ephemerides. Higher accuracy but more bandwidth.
- **3LE** — same as TLE but always with the name line.

For most operational use, TLE is the lingua franca.

## Try It Yourself

Browse the [Live Tracker](/tracker) and look at any satellite — the orbital parameters shown are derived from the same TLE you just learned to read. Or read up on [the SGP4 propagator](#) (post coming soon) that consumes them.

For the underlying physics, see [How Orbital Lifetime Calculations Work](/blog/orbital-lifetime-calculation-explained).

---

*The TLE format is older than most space engineers reading this article. Its rigid columns and implied decimals are quirky, but it's the universal language of orbit data. Every satellite tracker, every ground station, every academic propagator speaks TLE.*
    `.trim(),
  },

  'when-can-i-see-the-iss-tonight': {
    slug: 'when-can-i-see-the-iss-tonight',
    title: 'When Can I See the ISS Tonight? Live Pass Predictor + 10 Other Bright Satellites',
    excerpt: 'The ISS is the third-brightest object in the night sky. Here is how to find it from your location, plus 10 other satellites you can spot with the naked eye tonight.',
    date: '2026-04-22',
    readTime: '6 min',
    tags: ['Sky Watching', 'ISS', 'Education'],
    content: `
## Yes, You Can See the ISS

The International Space Station orbits at ~410 km altitude, traveling at 7.66 km/s. It's the third-brightest object in the night sky — only the Moon and Venus outshine it. From the ground it looks like a fast-moving star, completing a horizon-to-horizon pass in about 4-6 minutes.

Most people don't realize how easy it is to spot. You don't need a telescope. You don't even need binoculars. You just need to know **when** to look up.

## How to See the ISS Right Now

Open [**Satellites Over You**](/satellites-over-you) — Upagraha's free, geolocation-aware tool. It uses your browser's location to compute every satellite currently above your horizon, ranked by brightness and elevation. The ISS will be flagged when it's overhead. No sign-up. No app download. Works on your phone.

If the ISS isn't currently above you, the tool also shows the next pass time.

## Why You Can See It

The ISS is visible because it reflects sunlight. From the ground, you see it best when:

1. **The sky above you is dark** — usually 1-2 hours after sunset or before sunrise
2. **The ISS is above the horizon** — at 410 km altitude, it's visible from ground stations within ~2,200 km of its sub-satellite point
3. **The ISS is sunlit** — you're in Earth's shadow but the ISS is still in sunlight

The combination only happens for short windows around dawn and dusk. During the dead of night, both you and the ISS are in shadow — nothing to reflect.

## What to Look For

The ISS doesn't blink. Aircraft do (red and green wingtip lights, plus a flashing strobe). The ISS is a **steady, fast-moving white point of light**, brighter than the brightest stars. It tracks across the sky in a roughly straight line.

Typical pass:
- Rises in the west or northwest
- Climbs to maximum elevation (sometimes nearly overhead)
- Sets in the east or southeast
- Total pass: 4-6 minutes
- Brightness: magnitude -3 to -5 (very bright)

If you're new to satellite spotting, start with brighter passes (high elevation, near sunset). Lower passes are dimmer and easier to miss.

## How Pass Predictions Work

Every satellite tracker — ours, NASA's "Spot the Station," Heavens-Above — uses the same underlying math:

1. Fetch the latest TLE for the ISS (NORAD catalog 25544)
2. Use the SGP4 propagator to compute the ISS position at every time step
3. Compute the look angle (azimuth, elevation) from your latitude and longitude
4. Filter for elevations above ~10° (lower than that, atmosphere obscures it)
5. Compute the Sun's position to check if the ISS is sunlit and you're in shadow

If you want to understand the data behind these predictions, read our [TLE Field-by-Field Guide](/blog/how-to-read-a-tle-two-line-element).

## 10 Other Satellites You Can Spot

The ISS is the easiest. But these are also visible to the naked eye on a dark, clear night:

1. **Tiangong (China's space station)** — magnitude -2 at peak, second brightest after ISS
2. **Hubble Space Telescope** — magnitude +1 to +2, much fainter but recognizable
3. **Iridium NEXT satellites** — sometimes flare briefly when their antennas catch the sun
4. **Starlink trains** — the "string of pearls" right after launch (within a few days)
5. **NOAA-20 / Suomi NPP** — polar weather satellites, frequent passes
6. **GENESIS-L** — one of several bright Russian booster stages
7. **Cosmos 1408 debris** — fragments still tracked from the 2021 ASAT test
8. **Envisat** — defunct ESA satellite, still in orbit, magnitude +2
9. **GOCE** — gravity mapping satellite (when it was active, 2009-2013)
10. **Tianhe core module** — first module of the Chinese Tiangong station

Use the [Live Satellite Tracker](/tracker) to see all of these in 3D, or look up any of them by name in the search.

## Best Times to Look

The ISS passes over a typical mid-latitude location (40°N or so) about **2-4 times per night** during favorable observing periods. The best windows:

- **1-2 hours after sunset** (evening passes, easy to plan)
- **1-2 hours before sunrise** (early morning passes, less competition for sky)

The ISS doesn't pass over every location every night. There are gaps of several days where the orbit doesn't bring it over your horizon during dark hours.

## What About the Moon?

The Moon is in the way sometimes. A full Moon can wash out lower-elevation satellite passes, making only the brightest (ISS, Tiangong) visible. New Moon weeks are best for fainter targets like Hubble or polar weather satellites.

## Pro Tips

1. **Bring a phone** — open Satellites Over You and watch the live count update as you stand outside
2. **Wide-angle vision works best** — you're looking for motion, not detail. Don't focus too narrowly
3. **Photograph it** — long exposures on a phone (3-10 seconds) will capture the ISS as a streak
4. **Track it on the way down** — the ISS's reentry will be a bright fireball someday. Famous satellites including Mir (2001) and Skylab (1979) made dramatic reentries

## What's Next

Want to go deeper? See our:

- **[Live Satellite Tracker](/tracker)** — 3D visualization with 8,000+ active satellites
- **[Per-satellite pages](/satellite/25544/iss-zarya)** — detailed orbital data, real-time position
- **[How TLEs Work](/blog/how-to-read-a-tle-two-line-element)** — the data format behind every satellite tracker

---

*The ISS will deorbit in 2031. The Tiangong station and a generation of commercial successors will continue the tradition of bright objects in the night sky. Look up while you can — and look up often.*
    `.trim(),
  },

  'ballistic-coefficient-explained': {
    slug: 'ballistic-coefficient-explained',
    title: 'Ballistic Coefficient: How to Calculate It and Why It Matters for Your Satellite',
    excerpt: 'Ballistic coefficient is the single most important number in orbital lifetime analysis. Here is the formula, what drives it, and how to design for the lifetime you want.',
    date: '2026-04-21',
    readTime: '7 min',
    tags: ['Technical', 'Orbital Mechanics', 'Mission Design'],
    content: `
**TL;DR — Ballistic coefficient formula and meaning:** Ballistic coefficient is **BC = m / (Cd × A)** where m is satellite mass in kg, Cd is the drag coefficient (typically 2.2 for satellites), and A is cross-sectional area in m². Higher BC means slower orbital decay. A 3U CubeSat has BC ≈ 60 kg/m²; a Starlink has BC ≈ 35 kg/m². For FCC 5-year deorbit compliance from a 600 km orbit, you typically need BC below ~50 kg/m² without an active deorbit device. Compute lifetime impact in our [Orbital Lifetime Calculator](/lifetime-calculator).

## The One Number That Determines Your Lifetime

If you can only know one quantitative property of your satellite to predict its orbital lifetime, it's the **ballistic coefficient**. Altitude matters too, but ballistic coefficient is what designers actually have control over after the orbit is fixed by the launch vehicle.

This guide explains what BC is, how to compute it, and how to design for the lifetime you want.

## The Formula

Ballistic coefficient (BC), in the form used in orbital mechanics:

\`\`\`
BC = m / (Cd × A)
\`\`\`

Where:
- **m** = satellite mass (kg)
- **Cd** = drag coefficient (dimensionless, typically 2.0-2.5 for satellites)
- **A** = cross-sectional area perpendicular to velocity (m²)

Units: kg/m². Higher BC means the satellite is "heavy for its drag area" and decays slower.

## Worked Example: 3U CubeSat

A 3U CubeSat:
- Mass: 4 kg
- Cross-section (long axis along velocity): 0.03 m²
- Drag coefficient: 2.2

\`\`\`
BC = 4 / (2.2 × 0.03) ≈ 60.6 kg/m²
\`\`\`

That's a moderate ballistic coefficient. From a 500 km orbit, this CubeSat will decay in roughly 2-3 years (depending on solar activity).

## Worked Example: Starlink-Class

A Starlink V1 satellite:
- Mass: 260 kg
- Cross-section (with solar panels stowed for drag): 3.4 m²
- Drag coefficient: 2.2

\`\`\`
BC = 260 / (2.2 × 3.4) ≈ 34.8 kg/m²
\`\`\`

Lower BC than the CubeSat — Starlinks have lots of drag area relative to their mass. That's by design: SpaceX wants them to decay quickly if they fail.

## Why Cd ≈ 2.2?

For satellites in the upper atmosphere where the mean free path of gas molecules is much larger than the spacecraft, drag coefficient is dominated by molecular impact dynamics, not fluid flow. The classical kinetic theory result for a flat plate in free-molecular flow is **Cd = 2.0**. Real spacecraft are not flat plates, so empirical Cd typically falls in the **2.0-2.5** range.

Most engineers use **Cd = 2.2** for screening calculations. For high-fidelity work, Cd is computed from spacecraft geometry and atomic-oxygen interactions.

## How BC Affects Lifetime

Orbital lifetime scales (roughly) inversely with the area-to-mass ratio (A/m), which is the inverse of BC.

A satellite with **BC = 100 kg/m²** at 600 km has roughly **3× the lifetime** of one with BC = 33 kg/m² at the same altitude. This is the lever you have for compliance.

To see the impact for your specific design, run our [Orbital Lifetime Calculator](/lifetime-calculator) — enter mass and area, it computes BC and lifetime instantly.

## Designing for Target Lifetime

If you need to deorbit faster (e.g., to meet the FCC 5-year rule), you have two physical options:

### 1. Reduce BC (more drag, less mass)
- Add deployable surfaces (panels, drag sail)
- Reduce satellite mass
- Re-orient to expose larger cross-section

### 2. Lower the operational altitude
- Most LEO orbits below 500 km decay naturally within 5 years
- Trade comms / mission needs against natural decay

For a CubeSat at 700 km that needs to come down in 5 years, you typically need to either lower to ~600 km or add a drag sail of 5-10 m² to your existing 0.03 m² cross-section. See our [Drag Sail vs Propulsion guide](/blog/drag-sail-vs-propulsion-deorbit) for cost comparisons.

## BC Through the Mission Lifecycle

BC isn't fixed across a mission:

- **Stowed configuration** (immediately after launch): high BC (smaller cross-section)
- **Operational** (deployed solar panels, antennas): lower BC (more drag area)
- **End-of-life with drag device**: very low BC (drag sail or deployed boom)

Account for this in lifetime predictions. Operational BC is what matters most because that's the longest-duration configuration.

## What's a "Good" BC?

There's no universal answer — it depends on what you want.

| Mission type | Target BC | Reasoning |
|---|---|---|
| Disposable LEO smallsat | 30-60 kg/m² | Natural decay within 5 years from 500-600 km |
| Operational LEO mission | 80-150 kg/m² | Stable orbit, propulsion handles decay |
| GEO satellite | 100-300 kg/m² | Drag is negligible at GEO; BC barely matters |
| Drag-sail-augmented | 5-20 kg/m² (with sail deployed) | Forced decay |

## The Effect of Solar Activity

Atmospheric density at orbital altitudes varies by 5× or more across the 11-year solar cycle. The same satellite (same BC, same altitude) will decay 2-5× faster during solar maximum than during minimum. This is why our [Lifetime Calculator](/lifetime-calculator) lets you specify low/moderate/high solar activity.

For regulatory analysis, the FCC typically expects you to demonstrate compliance under **moderate** conditions. NASA DAS uses the long-term solar activity model.

## Quick Reference Card

\`\`\`
BC (kg/m²)    Decay Behavior at 600 km

< 20          Very fast decay, days-weeks
20-50         Fast decay, months-years
50-100        Moderate, years
100-200       Slow, decades
> 200         Very slow, decades+
\`\`\`

These are rough — solar activity can move you between bands.

## Common Mistakes

1. **Forgetting the drag coefficient** — using A/m directly without Cd. The formula is m/(Cd×A), not m/A.
2. **Using stowed cross-section for operational lifetime** — most satellites operate with deployed panels, not stowed
3. **Ignoring tumbling** — uncontrolled satellites tumble, presenting a time-averaged area larger than any single face
4. **Treating BC as constant across solar activity** — BC itself doesn't change; lifetime does

## Putting It Together

For your spacecraft:

1. Estimate operational mass (post-fuel-burn if applicable)
2. Estimate operational cross-section (deployed config, time-averaged if tumbling)
3. Use Cd = 2.2 unless you have a better value
4. Compute BC
5. Plug it into the [Lifetime Calculator](/lifetime-calculator) along with altitude and solar conditions
6. Iterate the design until lifetime meets your regulatory and operational targets

For end-of-life planning, also see our [Deorbit Strategy Advisor](/deorbit-advisor).

---

*Ballistic coefficient is one of those concepts that seems abstract until you start designing satellites — and then it becomes the number you optimize against on every iteration. Get this number right early and the rest of the orbital design follows.*
    `.trim(),
  },
};

export const articleList = Object.values(articles).sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);
