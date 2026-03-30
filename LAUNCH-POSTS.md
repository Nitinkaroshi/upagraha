# Launch Posts — Copy & Customize Before Posting

---

## 1. Hacker News (Show HN) — POST THIS FIRST

**Title:**
Show HN: Upagraha – Open-source space debris tracking and compliance tools

**Text:**
Hey HN, I built Upagraha (https://www.upagraha.com) — a free, open-source platform for satellite operators and space enthusiasts to track debris, calculate orbital lifetimes, and check regulatory compliance.

The tools:

- Orbital Lifetime Calculator — enter altitude, mass, cross-section → get estimated deorbit time with FCC 5-year rule and ESA 25-year guideline compliance check. Exports branded PDF reports.
- Live Satellite Tracker — real data from CelesTrak with 15 catalog groups (Starlink, ISS, debris collections). Search any satellite by name or NORAD ID.
- Deorbit Strategy Advisor — enter your satellite params, get ranked deorbit strategies (natural decay, drag sail, propulsive, tether) with cost estimates and delta-V calculations.
- Space Sustainability Score — rate your mission on 5 factors, get a 0-100 score with improvement recommendations.
- Conjunction Risk Viewer — simulated close approach events (real CDM integration coming).

Tech: React, TypeScript, Three.js (3D globe), TailwindCSS, jsPDF, CelesTrak API. Entirely client-side, no backend.

Background: There are 36,500+ tracked objects in orbit. The FCC now requires satellites to deorbit within 5 years, but many small operators lack tools to plan for compliance. The existing tools are either expensive (Ansys STK), government-only (NASA DAS), or ugly academic software. I wanted to build something accessible.

GitHub: https://github.com/Nitinkaroshi/upagraha

Would love feedback from anyone in the space industry or anyone who's dealt with orbital mechanics.

---

## 2. Reddit — r/spaceflight

**Title:**
I built a free orbital lifetime calculator that checks FCC 5-year deorbit compliance — would love feedback from the community

**Text:**
I've been working on an open-source platform called Upagraha that provides free space debris monitoring tools. The main tool is an Orbital Lifetime Calculator where you enter your satellite's altitude, mass, and cross-section area, and it tells you:

- How long the satellite will stay in orbit
- Whether it meets the FCC's new 5-year deorbit rule
- Whether it meets ESA's 25-year guideline
- A visual altitude decay profile
- You can export a branded PDF compliance report

It also has:
- A live satellite tracker using real CelesTrak data (15 catalog groups)
- A deorbit strategy advisor that recommends the best deorbit method with cost estimates
- A space sustainability scoring system

Everything runs in the browser, no sign-up needed.

Link: https://www.upagraha.com/lifetime-calculator
GitHub: https://github.com/Nitinkaroshi/upagraha

I'm not an aerospace engineer — I'm a software developer who's passionate about space sustainability. The calculations use simplified atmospheric models, so this is for estimation/screening, not operational use. Would love feedback on accuracy and what features would be most useful.

---

## 3. Reddit — r/cubesat

**Title:**
Free orbital lifetime calculator + deorbit strategy advisor for CubeSat missions

**Text:**
Built a free tool that might be useful for CubeSat mission planning: https://www.upagraha.com/lifetime-calculator

Enter your CubeSat's altitude, mass, and cross-section → get instant orbital lifetime estimate with FCC 5-year deorbit compliance check. Has presets for 3U CubeSats.

Also built a deorbit strategy advisor (/deorbit-advisor) that recommends whether you need a drag sail, propulsion, or if natural decay is sufficient. Shows cost estimates and delta-V requirements.

Open source: https://github.com/Nitinkaroshi/upagraha

Disclaimer: Uses simplified atmospheric models. For actual regulatory filings, use NASA DAS. But it's useful for quick screening during mission design.

Would love feedback from anyone working on CubeSat missions.

---

## 4. Reddit — r/aerospace

**Title:**
Open-source space debris compliance toolkit — orbital lifetime, deorbit strategies, sustainability scoring

**Text:**
I built an open-source platform with free tools for space debris analysis:

1. **Orbital Lifetime Calculator** — Simplified King-Hele drag model with exponential atmosphere. Checks FCC 5-year and ESA 25-year compliance. PDF report export.

2. **Deorbit Strategy Advisor** — Recommends natural decay, drag sail, propulsive, or EDT based on altitude/mass/area. Calculates delta-V for Hohmann transfer to 120km perigee, required drag area for sail compliance, propellant mass estimates.

3. **Space Sustainability Score** — 5-factor scoring: orbital lifetime (30%), collision avoidance (20%), deorbit plan (20%), orbital regime (15%), debris generation risk (15%).

4. **Live Tracker** — CelesTrak GP data with 15 catalog groups.

Tech details: Atmospheric density uses layered exponential model with scale heights from US Standard Atmosphere 1976. Solar activity modeled as density multiplier (0.5x low, 1x moderate, 2.5x high).

Obviously simplified compared to NRLMSISE-00 or JB2008, but useful for parametric screening. Open source (MIT): https://github.com/Nitinkaroshi/upagraha

Looking for feedback from astrodynamics people on the models and what would make this more useful.

---

## 5. Twitter/X Thread

**Tweet 1:**
I built a free, open-source space debris monitoring platform.

5 tools. No sign-up. No cost.

Thread on what it does and why space debris matters 🧵

**Tweet 2:**
36,500+ objects are tracked in Earth orbit.

Millions more are too small to track.

The FCC now requires all new satellites to deorbit within 5 years.

But many small operators don't have tools to plan for compliance.

That's what Upagraha solves.

**Tweet 3:**
Tool 1: Orbital Lifetime Calculator

Enter altitude, mass, cross-section → instant deorbit estimate.

✓ FCC 5-year rule check
✓ ESA 25-year guideline check
✓ Altitude decay chart
✓ PDF compliance report export

Try it: upagraha.com/lifetime-calculator

**Tweet 4:**
Tool 2: Deorbit Strategy Advisor

Enter your satellite params → get ranked strategies:

- Natural decay (free, if altitude allows)
- Drag sail ($50k-250k)
- Propulsive ($200k-2M)
- Electrodynamic tether ($100k-500k)

With delta-V calcs and feasibility scores.

**Tweet 5:**
Tool 3: Space Sustainability Score

Rate your satellite mission 0-100 on:
- Orbital lifetime compliance
- Collision avoidance capability
- Deorbit plan quality
- Orbital regime risk
- Debris generation risk

Get a grade + improvement recommendations.

**Tweet 6:**
Tool 4: Live Satellite Tracker

Real data from CelesTrak. 15 catalog groups.

Search any satellite by name or NORAD ID.

3D visualization with Three.js.

**Tweet 7:**
Everything is open source (MIT license).

Built with React, TypeScript, Three.js, TailwindCSS.

Entirely client-side. No backend. No tracking.

GitHub: github.com/Nitinkaroshi/upagraha
Website: upagraha.com

Star the repo if you think space sustainability matters ⭐

---

## 6. LinkedIn Post

I'm excited to share something I've been building: **Upagraha** — a free, open-source space debris monitoring and compliance platform.

**The problem:** There are 36,500+ tracked objects in Earth orbit. The FCC now requires satellites to deorbit within 5 years. But many small satellite operators and university programs lack affordable tools to plan for compliance.

**What I built:**
→ Orbital Lifetime Calculator with FCC/ESA compliance checking and PDF report export
→ Deorbit Strategy Advisor with cost estimates for 4 methods
→ Space Sustainability Score rating system (0-100)
→ Live Satellite Tracker using real CelesTrak catalog data
→ Conjunction Risk Viewer

Everything runs in the browser. No sign-up, no cost, open source.

🔗 Try it: www.upagraha.com
💻 GitHub: github.com/Nitinkaroshi/upagraha

I'm looking for:
- Feedback from satellite operators and aerospace engineers
- Connections in the space industry
- Contributors who care about space sustainability

If you know anyone in the satellite or space debris space, I'd appreciate a tag or share.

#SpaceDebris #SpaceSustainability #Satellites #OpenSource #SpaceTech

---

## 7. Product Hunt (Save for later — when you have some traffic)

**Tagline:** Free space debris tracking and compliance tools for satellite operators

**Description:**
Upagraha is an open-source platform that helps satellite operators track debris, calculate orbital lifetimes, and comply with regulations like the FCC's 5-year deorbit rule.

5 free tools:
🛰️ Orbital Lifetime Calculator with PDF compliance reports
🎯 Deorbit Strategy Advisor with cost estimates
🌍 Live Satellite Tracker with CelesTrak data
📊 Space Sustainability Score
⚠️ Conjunction Risk Viewer

Built with React, Three.js, and real satellite data. No sign-up required.

---

## POSTING ORDER (Important)

1. **Day 1:** Deploy to Vercel. Verify everything works live.
2. **Day 2:** Post on r/spaceflight and r/cubesat (morning, EST timezone)
3. **Day 2:** Post Twitter thread (afternoon)
4. **Day 3:** Post on r/aerospace
5. **Day 3:** Post on LinkedIn
6. **Day 4:** Post Show HN (Tuesday or Wednesday morning EST — best HN times)
7. **Week 2:** Product Hunt launch (only after you have some initial traffic/stars)

## RULES
- Do NOT post all at once — spread over 4-5 days
- Engage with EVERY comment — this is your credibility
- If someone gives technical feedback, fix it immediately and reply with the fix
- Do NOT be promotional — be genuinely helpful and curious
- Ask questions back to commenters — build relationships
