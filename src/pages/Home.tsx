import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, Radio, ShieldCheck, Compass, Leaf, ExternalLink, MapPin } from 'lucide-react';
import { GitHubIcon } from '@/components/Icons';
import StatsBar from '@/components/StatsBar';
import FAQ, { type FAQItem } from '@/components/FAQ';
import { useSatelliteData } from '@/lib/useSatelliteData';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { lazy, Suspense, useMemo } from 'react';

const homeFAQ: FAQItem[] = [
  {
    question: 'What is space debris?',
    answer: 'Space debris is any human-made object in orbit that no longer serves a useful purpose: defunct satellites, spent rocket stages, fragments from collisions or explosions. There are over 36,000 tracked objects larger than 10 cm and an estimated 1 million pieces between 1–10 cm. At orbital velocities (~7.8 km/s in LEO), even a 1 cm fragment carries the kinetic energy of a hand grenade.',
  },
  {
    question: 'What is the FCC 5-year deorbit rule?',
    answer: 'In 2022 the U.S. Federal Communications Commission adopted a rule requiring all satellites in low Earth orbit (LEO) to deorbit within 5 years of the end of their mission. It applies to all new FCC-licensed missions, including small satellites and CubeSats. The rule replaces the older 25-year guideline and is enforced through FCC Part 25 license conditions.',
  },
  {
    question: 'Are Upagraha tools free?',
    answer: 'Yes. Every tool on Upagraha is free with no sign-up. The platform is open-source under the MIT license. Future paid features (branded compliance reports, API access, mission portfolio management) will sit on top of the free tier — the core tools stay free forever.',
  },
  {
    question: 'Where does the satellite data come from?',
    answer: 'We pull live orbital element data from CelesTrak (celestrak.org), a free public catalog maintained by Dr. T.S. Kelso that mirrors data from the U.S. Space Force. Positions are computed in your browser using the SGP4 propagator (the standard NORAD model). Data refreshes hourly.',
  },
  {
    question: 'Can I use these tools for an actual FCC filing?',
    answer: 'Use Upagraha for design iteration and screening — not as the sole basis for a regulatory filing. For the formal FCC submission, run NASA DAS (Debris Assessment Software). Upagraha helps you iterate orbits and configurations 50× faster, then DAS validates the final answer before you file.',
  },
  {
    question: 'What is Kessler Syndrome?',
    answer: 'Kessler Syndrome is a runaway-collision scenario proposed by NASA scientist Donald Kessler in 1978. As more debris accumulates in orbit, collision probability rises. Each collision creates more debris, increasing collision probability further. If unchecked, certain orbital regimes could become unusable for generations. The 2009 Iridium-Cosmos collision and the 2007/2021 ASAT tests have already accelerated the timeline.',
  },
  {
    question: 'How does Upagraha differ from NASA DAS or Ansys STK?',
    answer: 'NASA DAS and Ansys STK are powerful desktop applications that take significant time to install, learn, and run. Upagraha runs entirely in your browser, gives results in seconds, and is free. The tradeoff: simplified physics models suitable for screening and design iteration, not for the formal regulatory submission. Use both — Upagraha for fast iteration, DAS for the final filing.',
  },
];

// Three.js + react-three-fiber are ~600 kB. Defer until paint.
const EarthGlobe = lazy(() => import('@/components/EarthGlobe'));

const tools = [
  {
    icon: MapPin,
    title: 'Satellites Over You',
    description: 'See which satellites are passing overhead right now. Real-time SGP4 propagation from your location.',
    to: '/satellites-over-you',
    badge: 'NEW',
  },
  {
    icon: Calculator,
    title: 'Orbital Lifetime Calculator',
    description: 'Calculate deorbit time. Check FCC 5-year and ESA 25-year compliance. Export PDF reports.',
    to: '/lifetime-calculator',
  },
  {
    icon: Radio,
    title: 'Live Satellite Tracker',
    description: 'Real-time 3D visualization with live CelesTrak data. 15 satellite catalog groups.',
    to: '/tracker',
  },
  {
    icon: ShieldCheck,
    title: 'Conjunction Risk Viewer',
    description: 'Monitor close approach events. Assess collision probability and risk levels.',
    to: '/conjunctions',
  },
  {
    icon: Compass,
    title: 'Deorbit Strategy Advisor',
    description: 'Get ranked deorbit recommendations with cost estimates and delta-V calculations.',
    to: '/deorbit-advisor',
  },
  {
    icon: Leaf,
    title: 'Sustainability Score',
    description: 'Rate your mission 0-100 on 5 debris risk factors. Get a grade and improvement plan.',
    to: '/sustainability',
  },
];

export default function Home() {
  const { satellites, loading } = useSatelliteData('active');

  useDocumentMeta({
    title: 'Upagraha — Free Space Debris & Satellite Compliance Tools',
    description: 'Free, open-source tools for satellite operators: orbital lifetime calculator with FCC/ESA compliance check, live satellite tracker, deorbit advisor, and sustainability scoring. No sign-up required.',
    canonical: 'https://upagraha-ten.vercel.app/',
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
        {
          '@type': 'Organization',
          '@id': 'https://upagraha-ten.vercel.app/#org',
          name: 'Upagraha',
          url: 'https://upagraha-ten.vercel.app/',
          logo: 'https://upagraha-ten.vercel.app/og-default.png',
          founder: { '@type': 'Person', name: 'Nitin Karoshi' },
          sameAs: ['https://github.com/Nitinkaroshi/upagraha'],
        },
        {
          '@type': 'SoftwareApplication',
          name: 'Upagraha',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          description: 'Open-source space debris monitoring and regulatory compliance platform.',
        },
      ],
    },
  });

  const liveCounts = useMemo(() => {
    if (!satellites.length) return undefined;
    return {
      total: satellites.length,
      satellites: satellites.filter(s => s.type === 'satellite').length,
      debris: satellites.filter(s => s.type === 'debris').length,
      rocketBodies: satellites.filter(s => s.type === 'rocket-body').length,
    };
  }, [satellites]);

  return (
    <div className="min-h-screen">
      {/* NEW-feature announcement bar */}
      <Link
        to="/satellites-over-you"
        className="block bg-white/[0.06] border-b border-white/[0.08] backdrop-blur-xl hover:bg-white/[0.09] transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-center gap-3 text-center text-xs sm:text-sm">
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white text-black tracking-wider">NEW</span>
          <MapPin className="w-3.5 h-3.5 text-white/60" />
          <span className="text-white/70">
            <span className="text-white font-medium">Satellites Over You</span>
            <span className="hidden sm:inline"> — see every satellite currently passing over your location</span>
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-white/40" />
        </div>
      </Link>

      {/* Hero */}
      <section className="relative pt-16 pb-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[70vh]">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/60 text-xs font-medium mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-slow" />
                {loading ? 'Loading live satellite data...' : `Tracking ${satellites.length.toLocaleString()} objects live`}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
                <span className="text-white glow-text">Safeguarding Space.</span>
                <br />
                <span className="text-white/40">Securing the Future.</span>
              </h1>

              <p className="text-white/40 text-lg max-w-xl mb-10 leading-relaxed">
                Free, open-source tools for satellite operators, researchers, and space
                enthusiasts. Track debris, calculate orbital lifetimes, and assess
                compliance with space sustainability regulations.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  to="/satellites-over-you"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  See Satellites Over You
                </Link>
                <Link
                  to="/lifetime-calculator"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] rounded-lg transition-all"
                >
                  Try Lifetime Calculator
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="h-[400px] lg:h-[550px]">
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white/20 text-xs">Loading globe…</div>}>
                <EarthGlobe satellites={satellites} showCounter={!loading && satellites.length > 0} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <StatsBar liveCounts={liveCounts} />
        </div>
      </section>

      {/* Tools */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Free Space Debris Tools</h2>
            <p className="text-white/35 max-w-2xl mx-auto">
              5 tools built for satellite operators, university programs, and the space community.
              No sign-up required. Open source forever.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool) => (
              <Link
                key={tool.to}
                to={tool.to}
                className="group relative bg-white/[0.02] border border-white/[0.06] rounded-xl p-7 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300"
              >
                {tool.badge && (
                  <span className="absolute top-4 right-4 text-[9px] font-bold px-1.5 py-0.5 rounded bg-white text-black tracking-wider">
                    {tool.badge}
                  </span>
                )}
                <tool.icon className="w-6 h-6 text-white/30 mb-5 group-hover:text-white/60 transition-colors" />
                <h3 className="text-lg font-semibold text-white mb-2">{tool.title}</h3>
                <p className="text-white/35 text-sm leading-relaxed mb-5">{tool.description}</p>
                <span className="inline-flex items-center gap-1.5 text-white/50 text-sm font-medium group-hover:text-white group-hover:gap-2.5 transition-all">
                  Try it free <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FAQ items={homeFAQ} />

      {/* Why section */}
      <section className="py-24 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">Why Space Debris Matters</h2>
            <p className="text-white/35 leading-relaxed mb-10">
              There are over 36,000 tracked objects larger than 10cm in Earth orbit, and millions
              of smaller fragments. Each collision creates more debris, risking a chain reaction
              known as <span className="text-white font-medium">Kessler Syndrome</span> that could make
              orbital space unusable. New FCC regulations now require satellites to deorbit within
              5 years of mission end — our tools help operators plan for compliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://github.com/Nitinkaroshi/upagraha"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] rounded-lg transition-all"
              >
                <GitHubIcon className="w-4 h-4" />
                Star on GitHub
              </a>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white/40 hover:text-white transition-colors"
              >
                Learn more <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
