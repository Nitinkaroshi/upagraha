import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

const articles: Record<string, { title: string; date: string; readTime: string; content: string }> = {
  'fcc-5-year-deorbit-rule-compliance-guide': {
    title: 'Complete Guide to FCC 5-Year Deorbit Compliance',
    date: '2026-03-30',
    readTime: '8 min read',
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

The rule applies to:

1. **All new FCC Part 25 applications** for non-geostationary satellite systems
2. **All new experimental licenses** for LEO satellites
3. **Small satellites** and CubeSats (no size exemption)
4. **Any satellite** seeking FCC market access

It does **not** retroactively apply to satellites already licensed and launched before the effective date.

## How to Calculate Your Deorbit Time

The orbital lifetime of a satellite depends on several factors:

### 1. Orbital Altitude
Lower orbits experience more atmospheric drag and deorbit faster. A satellite at 300 km might deorbit in weeks, while one at 800 km could take decades without propulsion.

### 2. Ballistic Coefficient (Area-to-Mass Ratio)
Satellites with larger cross-sections relative to their mass experience more drag. A large solar panel array increases drag, reducing orbital lifetime.

### 3. Solar Activity
The Sun's 11-year activity cycle significantly affects atmospheric density at orbital altitudes. During solar maximum, the upper atmosphere expands, increasing drag by 2-5x compared to solar minimum.

### 4. Drag Coefficient
Typically assumed to be 2.2 for most satellites, but varies with shape and orientation.

### Using the Upagraha Calculator

Our [free Orbital Lifetime Calculator](/lifetime-calculator) provides instant estimates:

1. Enter your orbital altitude (150-2000 km)
2. Enter satellite mass and cross-section area
3. Select solar activity level
4. Get instant compliance assessment

The calculator shows whether your satellite meets the FCC 5-year rule and provides a decay profile chart.

## Compliance Strategies

If your satellite doesn't naturally deorbit within 5 years, you have several options:

### Active Propulsion
Include a propulsion system (chemical, electric, or cold gas) to perform a deorbit maneuver at end of life. This is the most reliable approach.

### Drag Augmentation
Deploy a drag sail or drag device to increase atmospheric drag. Lower cost than propulsion but less controllable. Companies like Vestigo Aerospace offer commercial drag sails.

### Lower Initial Orbit
If mission requirements allow, launching to a lower orbit can naturally meet the 5-year requirement. Below ~500 km, most satellites deorbit within 5 years without assistance.

### Mission Design
Design the mission timeline to account for deorbit time from the start, ensuring total time in orbit (mission + disposal) stays under regulatory limits.

## Documentation Requirements

When filing your FCC application, you must include:

1. **Post-mission disposal plan** describing your deorbit strategy
2. **Orbital lifetime analysis** showing compliance with the 5-year rule
3. **Casualty risk assessment** if the satellite won't fully demise during reentry
4. **Collision avoidance capabilities** description

## What Happens If You Don't Comply?

The FCC can:
- Deny your license application
- Impose conditions on existing licenses
- Levy fines for non-compliance
- Require performance bonds for debris mitigation

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
    title: 'What is Kessler Syndrome and Why Should You Care?',
    date: '2026-03-28',
    readTime: '6 min read',
    content: `
## The Chain Reaction in Space

In 1978, NASA scientist Donald J. Kessler proposed a scenario that has become one of the most discussed risks in space operations: a cascade of collisions in Earth orbit that creates so much debris it makes certain orbital regions unusable.

This is **Kessler Syndrome**.

## How It Works

The concept is straightforward:

1. Two objects in orbit collide
2. The collision creates hundreds or thousands of fragments
3. Each fragment is now a potential projectile
4. Some fragments collide with other objects
5. Those collisions create more fragments
6. The cascade continues

At orbital velocities (7-8 km/s in LEO), even a 1cm fragment carries the energy of a hand grenade. A 10cm fragment can destroy a spacecraft.

## Are We Already There?

There's debate among experts, but the evidence is concerning:

### Events that increased debris significantly:
- **2007 Chinese ASAT Test**: China destroyed its Fengyun-1C weather satellite, creating 3,500+ trackable fragments. Many remain in orbit today.
- **2009 Iridium-Cosmos Collision**: An active Iridium communications satellite collided with a defunct Russian Cosmos satellite at ~11.7 km/s, creating 2,000+ trackable fragments.
- **2021 Russian ASAT Test**: Russia destroyed its Cosmos 1408 satellite, creating 1,500+ trackable fragments that threatened the ISS crew.

### Current numbers:
- **36,500+** objects tracked by Space Surveillance Network (>10cm)
- **~1 million** estimated objects 1-10cm
- **~130 million** estimated objects 1mm-1cm
- **~15 conjunction alerts per day** require assessment

## What's at Stake

If Kessler Syndrome progresses significantly:

- **GPS navigation** could be disrupted
- **Weather forecasting** satellites could be lost
- **Communication networks** could degrade
- **Scientific research** from orbit becomes impossible
- **Future space exploration** becomes extremely risky
- **Mega-constellations** (Starlink, OneWeb) face constant collision risk

The economic impact would be in the **trillions of dollars**.

## What's Being Done

### Tracking & Avoidance
The US Space Force tracks 36,500+ objects and issues conjunction warnings. Companies like LeoLabs and Slingshot Aerospace provide commercial tracking services.

### Regulatory Measures
- FCC now requires 5-year post-mission deorbit (was 25 years)
- ESA's Zero Debris Charter aims for zero debris generation by 2030
- UN COPUOS Space Debris Mitigation Guidelines

### Active Debris Removal
Companies like Astroscale (Japan) and ClearSpace (Switzerland/ESA) are developing spacecraft to capture and deorbit large debris objects.

### Better Design
New satellites increasingly include deorbit capability — drag sails, propulsion systems, or design for low enough orbits to naturally decay.

## What You Can Do

If you're a satellite operator, researcher, or student:

1. **Design for disposal** from the start
2. **Use compliance tools** like our [Lifetime Calculator](/lifetime-calculator) to verify deorbit plans
3. **Support regulations** that mandate responsible behavior
4. **Stay informed** about the evolving debris environment
5. **Contribute to solutions** — the space debris sector needs talent

---

*The orbital environment is a shared resource. Its sustainability depends on every actor in the space industry taking responsibility.*
    `.trim(),
  },
  'orbital-lifetime-calculation-explained': {
    title: 'How Orbital Lifetime Calculations Work: A Technical Guide',
    date: '2026-03-25',
    readTime: '10 min read',
    content: `
## The Physics of Orbital Decay

A satellite in Low Earth Orbit isn't in a perfect vacuum. The Earth's atmosphere, though extremely thin at orbital altitudes, exerts a drag force that gradually lowers the orbit until the satellite reenters and burns up.

Understanding this process is essential for mission planning and regulatory compliance.

## Key Factors

### 1. Atmospheric Density

The atmosphere doesn't end abruptly — it gradually thins with altitude. At 400 km (ISS altitude), atmospheric density is roughly 10⁻¹¹ kg/m³. At 800 km, it's about 10⁻¹⁴ kg/m³ — a thousand times less.

Atmospheric density models include:
- **NRLMSISE-00**: Standard empirical model
- **JB2008**: Used by US Space Force
- **DTM-2020**: European model
- **1976 Standard Atmosphere**: Simplified reference model

### 2. Solar Activity

The Sun's output varies on an ~11-year cycle. During solar maximum:
- Increased UV and EUV radiation heats the upper atmosphere
- The thermosphere expands significantly
- Atmospheric density at orbital altitudes can increase 2-5x
- Satellite lifetimes can decrease dramatically

The F10.7 index (solar radio flux) and Ap index (geomagnetic activity) are key inputs to atmospheric models.

### 3. Ballistic Coefficient

The ballistic coefficient B = m / (Cd × A), where:
- **m** = satellite mass (kg)
- **Cd** = drag coefficient (typically 2.0-2.5)
- **A** = cross-sectional area perpendicular to velocity (m²)

A higher ballistic coefficient means less drag per unit mass, resulting in longer orbital lifetime.

### 4. The Drag Equation

The deceleration due to atmospheric drag is:

**a_drag = ½ × ρ × v² × Cd × A / m**

Where:
- ρ = atmospheric density (kg/m³)
- v = orbital velocity (m/s)
- Cd = drag coefficient
- A/m = area-to-mass ratio (m²/kg)

### 5. Orbit-Averaged Effects

Rather than computing drag at every point in the orbit, we can use orbit-averaged equations. For a nearly circular orbit, the rate of semi-major axis decay is:

**da/dt ≈ -ρ × v × Cd × (A/m) × a**

This leads to an accelerating decay — as altitude drops, density increases, causing faster decay, which lowers altitude further.

## The Calculation Process

### Step-by-step:

1. **Start** with initial orbital elements (altitude, eccentricity)
2. **Look up** atmospheric density at current altitude
3. **Calculate** drag deceleration
4. **Compute** change in orbital energy per orbit
5. **Update** orbital elements
6. **Repeat** until altitude drops below ~120 km (reentry)

### What makes it complicated:

- Atmospheric density varies with latitude, longitude, time of day, and solar activity
- Solar activity 11-year cycle is only partially predictable
- Satellite attitude and tumbling affect cross-sectional area
- Atmospheric drag is not the only perturbation (gravity harmonics, solar radiation pressure, third-body effects)

## Tools for Calculation

### Professional tools:
- **NASA DAS** (Debris Assessment Software) — official NASA tool for compliance
- **ESA DRAMA** (Debris Risk Assessment and Mitigation Analysis) — ESA's equivalent
- **STK/ODTK** (Ansys) — commercial, high-fidelity
- **GMAT** (NASA) — open source, general mission analysis

### Open-source libraries:
- **Orekit** (Java) — comprehensive astrodynamics library
- **poliastro** (Python) — orbital mechanics with Python
- **python-sgp4** — SGP4 propagator implementation
- **satellite.js** — JavaScript SGP4 implementation

### Our calculator:
The [Upagraha Orbital Lifetime Calculator](/lifetime-calculator) uses a simplified exponential atmosphere model with King-Hele theory for quick estimates. It's designed for:
- Initial mission feasibility checks
- Compliance pre-screening
- Educational purposes
- Quick parametric studies

For regulatory filings, always use NASA DAS or equivalent high-fidelity tools.

## Practical Considerations

### Altitude zones and typical lifetimes:

| Altitude | Approx. Lifetime (50kg, 0.25m²) | Notes |
|----------|----------------------------------|-------|
| 200 km | Days | Very short-lived |
| 300 km | Weeks to months | ISS requires regular reboost |
| 400 km | 1-3 years | Below FCC 5-year threshold |
| 500 km | 3-10 years | Border zone for compliance |
| 600 km | 10-30 years | Likely needs deorbit capability |
| 700 km | 30-100+ years | Definitely needs deorbit |
| 800 km | 100+ years | Long-term debris risk |

These are rough estimates. Actual lifetimes depend on all factors discussed above.

## Key Takeaways

1. Orbital lifetime is highly sensitive to altitude — a 100km difference can mean years vs. decades
2. Solar activity creates large uncertainties — always check both solar min and max scenarios
3. Area-to-mass ratio is your main design lever (besides propulsion)
4. Simplified models are fine for screening; use professional tools for regulatory filings
5. Try our [free calculator](/lifetime-calculator) for quick estimates

---

*Understanding orbital mechanics is fundamental to responsible space operations. The math is well-established — the challenge is applying it consistently across the growing space industry.*
    `.trim(),
  },
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? articles[slug] : null;

  if (!article) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Article not found</h1>
          <Link to="/blog" className="text-white/50 hover:text-white transition-colors">
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 grain">
      <article className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-white/30 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to blog
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-white/25 text-sm">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>
        </header>

        <div
          className="prose prose-invert max-w-none
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:tracking-tight
            [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white/80 [&_h3]:mt-8 [&_h3]:mb-3
            [&_p]:text-white/40 [&_p]:leading-relaxed [&_p]:mb-4
            [&_ul]:text-white/40 [&_ul]:space-y-2 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5
            [&_ol]:text-white/40 [&_ol]:space-y-2 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5
            [&_li]:leading-relaxed
            [&_strong]:text-white [&_strong]:font-semibold
            [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-white/20 hover:[&_a]:decoration-white/50
            [&_code]:text-white/60 [&_code]:bg-white/[0.04] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
            [&_table]:w-full [&_table]:text-sm [&_table]:mb-4
            [&_th]:text-white/50 [&_th]:text-left [&_th]:pb-2 [&_th]:border-b [&_th]:border-white/[0.08] [&_th]:font-medium
            [&_td]:text-white/40 [&_td]:py-2 [&_td]:border-b [&_td]:border-white/[0.04]
            [&_hr]:border-white/[0.06] [&_hr]:my-8
            [&_em]:text-white/30 [&_em]:not-italic
          "
          dangerouslySetInnerHTML={{ __html: markdownToHtml(article.content) }}
        />

        {/* CTA */}
        <div className="mt-16 bg-white/[0.03] border border-white/[0.08] rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-3">Try Our Free Tools</h3>
          <p className="text-white/30 text-sm mb-6 max-w-md mx-auto">
            Calculate orbital lifetimes, check regulatory compliance, and explore the orbital environment.
          </p>
          <Link
            to="/lifetime-calculator"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all"
          >
            Lifetime Calculator
          </Link>
        </div>
      </article>
    </div>
  );
}

/** Very simple markdown-to-HTML (handles what we need) */
function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => {
      if (match.includes('<li>')) return `<ul>${match}</ul>`;
      return match;
    })
    .replace(/^\|(.+)\|$/gm, (_, row) => {
      const cells = row.split('|').map((c: string) => c.trim()).filter(Boolean);
      return '<tr>' + cells.map((c: string) => `<td>${c}</td>`).join('') + '</tr>';
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, (match) => `<table>${match}</table>`)
    .replace(/^---$/gm, '<hr/>')
    .replace(/^\*(.+)\*$/gm, '<em>$1</em>')
    .replace(/^(?!<[a-z])((?!^$).+)$/gm, '<p>$1</p>')
    .replace(/\n\n+/g, '\n');
}
