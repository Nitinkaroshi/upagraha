/**
 * Per-route static meta config for build-time HTML pre-rendering.
 *
 * For every entry, we generate a static HTML file at the route path, copied
 * from dist/index.html with the head injected with route-specific meta.
 * Vercel will then serve `/lifetime-calculator/index.html` (etc.) on direct
 * navigation and to crawlers — meaning Google sees correct title +
 * description + JSON-LD on the first crawl pass, not after JS renders.
 */

export interface RouteMeta {
  /** Path matching React Router (e.g. '/lifetime-calculator'). Will produce dist{path}/index.html. */
  path: string;
  title: string;
  description: string;
  jsonLd?: Record<string, unknown>;
  /** Override og:type. Defaults to 'website'. Use 'article' for blog posts. */
  ogType?: string;
}

const ORG_LD = {
  '@type': 'Organization',
  '@id': 'https://upagraha-ten.vercel.app/#org',
  name: 'Upagraha',
  url: 'https://upagraha-ten.vercel.app/',
  logo: 'https://upagraha-ten.vercel.app/og-default.svg',
  founder: { '@type': 'Person', name: 'Nitin Karoshi' },
  sameAs: ['https://github.com/Nitinkaroshi/upagraha'],
};

const offer = { '@type': 'Offer', price: '0', priceCurrency: 'USD' };

export const ROUTES: RouteMeta[] = [
  {
    path: '/',
    title: 'Upagraha — Free Space Debris & Satellite Compliance Tools',
    description: 'Free, open-source tools for satellite operators: orbital lifetime calculator with FCC/ESA compliance check, live satellite tracker, deorbit advisor, and sustainability scoring. No sign-up required.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': 'https://upagraha-ten.vercel.app/#website',
          url: 'https://upagraha-ten.vercel.app/',
          name: 'Upagraha',
          description: 'Free, open-source space debris monitoring and regulatory compliance tools.',
          publisher: { '@id': 'https://upagraha-ten.vercel.app/#org' },
        },
        ORG_LD,
        {
          '@type': 'SoftwareApplication',
          name: 'Upagraha',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Web',
          offers: offer,
          description: 'Open-source space debris monitoring and regulatory compliance platform.',
        },
      ],
    },
  },
  {
    path: '/lifetime-calculator',
    title: 'Orbital Lifetime Calculator — FCC 5-Year Compliance Check | Upagraha',
    description: 'Free orbital lifetime calculator. Estimate satellite deorbit time, check FCC 5-year and ESA 25-year compliance, export branded PDF report. No sign-up.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: 'Orbital Lifetime Calculator',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Web',
          url: 'https://upagraha-ten.vercel.app/lifetime-calculator',
          description: 'Calculate orbital lifetime and check FCC/ESA debris-mitigation compliance for any satellite design.',
          offers: offer,
        },
        {
          '@type': 'HowTo',
          name: 'How to Calculate Orbital Lifetime and FCC Compliance',
          description: 'Estimate how long a satellite will remain in orbit and verify it meets the FCC 5-year deorbit rule.',
          totalTime: 'PT2M',
          tool: [{ '@type': 'HowToTool', name: 'Upagraha Orbital Lifetime Calculator' }],
          step: [
            { '@type': 'HowToStep', name: 'Enter altitude', text: 'Enter the operational orbital altitude in kilometers (typically 150 to 2000 km for LEO satellites).' },
            { '@type': 'HowToStep', name: 'Enter mass', text: 'Enter the satellite total mass in kilograms.' },
            { '@type': 'HowToStep', name: 'Enter cross-section area', text: 'Enter the average cross-sectional area in square meters as seen from the velocity vector.' },
            { '@type': 'HowToStep', name: 'Set drag coefficient', text: 'Use the default 2.2 for satellites unless you have a measured value.' },
            { '@type': 'HowToStep', name: 'Choose solar activity', text: 'Pick low, moderate, or high solar activity — affects atmospheric density and decay rate.' },
            { '@type': 'HowToStep', name: 'Read the result', text: 'The tool computes estimated lifetime in years and checks compliance with the FCC 5-year and ESA 25-year rules. Export a PDF report.' },
          ],
        },
      ],
    },
  },
  {
    path: '/tracker',
    title: 'Live Satellite Tracker — Real-Time CelesTrak Data | Upagraha',
    description: 'Free 3D satellite tracker. Search 8,000+ active satellites by name or NORAD ID. Live data from CelesTrak with 15 catalog groups: ISS, Starlink, GPS, debris.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Live Satellite Tracker',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Web',
      url: 'https://upagraha-ten.vercel.app/tracker',
      description: 'Real-time 3D visualization of satellites and debris in Earth orbit with live CelesTrak data.',
      offers: offer,
    },
  },
  {
    path: '/conjunctions',
    title: 'Satellite Conjunction Risk Viewer — Close Approach Events | Upagraha',
    description: 'Monitor predicted close approaches between satellites and debris. Assess collision probability and risk levels for tracked orbital objects.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Conjunction Risk Viewer',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Web',
      url: 'https://upagraha-ten.vercel.app/conjunctions',
      description: 'View predicted close-approach events between orbital objects with risk levels and miss-distance estimates.',
      offers: offer,
    },
  },
  {
    path: '/deorbit-advisor',
    title: 'Deorbit Strategy Advisor — Cost & Feasibility for 4 Methods | Upagraha',
    description: 'Free deorbit strategy recommendation tool. Compare natural decay, drag sail, propulsive, and electrodynamic tether with cost estimates and delta-V calculations.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: 'Deorbit Strategy Advisor',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Web',
          url: 'https://upagraha-ten.vercel.app/deorbit-advisor',
          description: 'Get ranked deorbit-strategy recommendations with cost, delta-V, and feasibility scores.',
          offers: offer,
        },
        {
          '@type': 'HowTo',
          name: 'How to Choose a Satellite Deorbit Strategy',
          description: 'Select the best end-of-life disposal method for your satellite based on altitude, mass, and budget.',
          totalTime: 'PT1M',
          step: [
            { '@type': 'HowToStep', name: 'Enter orbit altitude', text: 'Enter your satellite operational altitude in km.' },
            { '@type': 'HowToStep', name: 'Enter mass and area', text: 'Enter satellite mass in kg and cross-sectional area in square meters.' },
            { '@type': 'HowToStep', name: 'Indicate propulsion availability', text: 'Specify whether your satellite has onboard propulsion.' },
            { '@type': 'HowToStep', name: 'Compare ranked strategies', text: 'Review the four deorbit methods (natural decay, drag sail, propulsive, electrodynamic tether) ranked by feasibility score, with cost estimates, delta-V required, and pros/cons for each.' },
          ],
        },
      ],
    },
  },
  {
    path: '/sustainability',
    title: 'Space Sustainability Score — Rate Your Satellite Mission | Upagraha',
    description: 'Score your satellite mission 0-100 on 5 debris-risk factors. Free tool with letter grade, factor breakdown, and improvement recommendations.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Space Sustainability Score',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Web',
      url: 'https://upagraha-ten.vercel.app/sustainability',
      description: 'Rate your satellite mission on orbital lifetime, collision avoidance, deorbit plan, regime risk, and debris generation.',
      offers: offer,
    },
  },
  {
    path: '/compare',
    title: 'Compare Satellites — ISS vs Hubble vs Starlink Side-by-Side | Upagraha',
    description: 'Compare any two satellites side-by-side. Orbital parameters, estimated lifetime, FCC compliance, and sustainability scores. Free, real-time CelesTrak data.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Satellite Comparison Tool',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Web',
      url: 'https://upagraha-ten.vercel.app/compare',
      description: 'Compare any two satellites side-by-side: orbital parameters, lifetime, sustainability score.',
      offers: offer,
    },
  },
  {
    path: '/satellites-over-you',
    title: 'Satellites Over You — Real-Time Overhead Satellite Tracker | Upagraha',
    description: 'See which satellites are passing over your location right now. Free real-time tracker using live orbital data. No sign-up required.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Satellites Over You',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Web',
      url: 'https://upagraha-ten.vercel.app/satellites-over-you',
      description: 'Real-time tracker showing satellites currently overhead based on your location.',
      offers: offer,
    },
  },
  {
    path: '/about',
    title: 'About Upagraha — Open-Source Space Debris Tools',
    description: 'Upagraha makes space sustainability tools free and accessible to every satellite operator. Open source, built by Nitin Karoshi.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      url: 'https://upagraha-ten.vercel.app/about',
      name: 'About Upagraha',
      description: 'Mission, vision, and approach behind Upagraha — open-source space debris monitoring tools.',
    },
  },
  {
    path: '/blog',
    title: 'Space Debris & Compliance Blog — Upagraha',
    description: 'Technical guides on space debris, FCC compliance, orbital mechanics, and satellite sustainability. From an open-source space-tech platform.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Upagraha Blog',
      url: 'https://upagraha-ten.vercel.app/blog',
      description: 'Space debris, satellite compliance, and orbital mechanics guides.',
    },
  },
  // Blog posts
  {
    path: '/blog/fcc-5-year-deorbit-rule-compliance-guide',
    title: 'Complete Guide to FCC 5-Year Deorbit Compliance | Upagraha',
    description: 'The FCC now requires LEO satellites to deorbit within 5 years. Full guide to the 2024 rule, lifetime calculation, and compliance strategies.',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'Complete Guide to FCC 5-Year Deorbit Compliance',
      datePublished: '2026-03-30',
      dateModified: '2026-03-30',
      author: { '@type': 'Person', name: 'Nitin Karoshi', url: 'https://github.com/Nitinkaroshi' },
      publisher: ORG_LD,
      mainEntityOfPage: 'https://upagraha-ten.vercel.app/blog/fcc-5-year-deorbit-rule-compliance-guide',
    },
  },
  {
    path: '/blog/what-is-kessler-syndrome',
    title: 'What is Kessler Syndrome and Why Should You Care? | Upagraha',
    description: 'A chain reaction of orbital collisions could render Low Earth Orbit unusable. The science, current risk, and what the industry is doing.',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'What is Kessler Syndrome and Why Should You Care?',
      datePublished: '2026-03-28',
      dateModified: '2026-03-28',
      author: { '@type': 'Person', name: 'Nitin Karoshi' },
      publisher: ORG_LD,
      mainEntityOfPage: 'https://upagraha-ten.vercel.app/blog/what-is-kessler-syndrome',
    },
  },
  {
    path: '/blog/orbital-lifetime-calculation-explained',
    title: 'How Orbital Lifetime Calculations Work: A Technical Guide | Upagraha',
    description: 'Atmospheric drag, solar activity, ballistic coefficients. A practical guide to orbital lifetime calculations for satellite engineers.',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'How Orbital Lifetime Calculations Work',
      datePublished: '2026-03-25',
      dateModified: '2026-03-25',
      author: { '@type': 'Person', name: 'Nitin Karoshi' },
      publisher: ORG_LD,
      mainEntityOfPage: 'https://upagraha-ten.vercel.app/blog/orbital-lifetime-calculation-explained',
    },
  },
  {
    path: '/blog/fcc-part-25-satellite-application-checklist',
    title: 'FCC Part 25 Satellite Application: Complete Filing Checklist for Small Operators',
    description: 'Step-by-step guide to filing your FCC Part 25 application. Required forms, orbital debris assessment, deorbit plan, fees, and how to avoid the most common rejections.',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'FCC Part 25 Satellite Application: Complete Filing Checklist for Small Operators',
      datePublished: '2026-04-15',
      dateModified: '2026-04-15',
      author: { '@type': 'Person', name: 'Nitin Karoshi' },
      publisher: ORG_LD,
      mainEntityOfPage: 'https://upagraha-ten.vercel.app/blog/fcc-part-25-satellite-application-checklist',
    },
  },
  {
    path: '/blog/drag-sail-vs-propulsion-deorbit',
    title: 'Drag Sail vs Propulsion: Choosing a Deorbit Strategy for Your Satellite | Upagraha',
    description: 'Practical comparison of drag sails, propulsion, and electrodynamic tethers. Cost, mass, and complexity tradeoffs to choose the right deorbit strategy.',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'Drag Sail vs Propulsion: Choosing a Deorbit Strategy for Your Satellite',
      datePublished: '2026-04-18',
      dateModified: '2026-04-18',
      author: { '@type': 'Person', name: 'Nitin Karoshi' },
      publisher: ORG_LD,
      mainEntityOfPage: 'https://upagraha-ten.vercel.app/blog/drag-sail-vs-propulsion-deorbit',
    },
  },
  {
    path: '/blog/how-to-read-a-tle-two-line-element',
    title: 'How to Read a Two-Line Element (TLE): Field-by-Field Breakdown | Upagraha',
    description: 'TLE is the universal text format for satellite orbits. Complete reference covering every field, every checksum, and how to use TLEs with SGP4.',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'How to Read a Two-Line Element (TLE): Field-by-Field Breakdown',
      datePublished: '2026-04-20',
      dateModified: '2026-04-20',
      author: { '@type': 'Person', name: 'Nitin Karoshi' },
      publisher: ORG_LD,
      mainEntityOfPage: 'https://upagraha-ten.vercel.app/blog/how-to-read-a-tle-two-line-element',
    },
  },
  {
    path: '/blog/when-can-i-see-the-iss-tonight',
    title: 'When Can I See the ISS Tonight? Live Pass Predictor + 10 Other Bright Satellites',
    description: 'The ISS is the third-brightest object in the night sky. Find it from your location and 10 other satellites you can spot with the naked eye tonight.',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'When Can I See the ISS Tonight? Live Pass Predictor + 10 Other Bright Satellites',
      datePublished: '2026-04-22',
      dateModified: '2026-04-22',
      author: { '@type': 'Person', name: 'Nitin Karoshi' },
      publisher: ORG_LD,
      mainEntityOfPage: 'https://upagraha-ten.vercel.app/blog/when-can-i-see-the-iss-tonight',
    },
  },
  {
    path: '/blog/ballistic-coefficient-explained',
    title: 'Ballistic Coefficient: How to Calculate It and Why It Matters | Upagraha',
    description: 'Ballistic coefficient is the key number in orbital lifetime analysis. Formula, what drives it, and how to design for the lifetime you want.',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'Ballistic Coefficient: How to Calculate It and Why It Matters for Your Satellite',
      datePublished: '2026-04-21',
      dateModified: '2026-04-21',
      author: { '@type': 'Person', name: 'Nitin Karoshi' },
      publisher: ORG_LD,
      mainEntityOfPage: 'https://upagraha-ten.vercel.app/blog/ballistic-coefficient-explained',
    },
  },
];
