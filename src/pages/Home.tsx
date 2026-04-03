import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, Radio, ShieldCheck, Compass, Leaf, ExternalLink } from 'lucide-react';
import { GitHubIcon } from '@/components/Icons';
import EarthGlobe from '@/components/EarthGlobe';
import StatsBar from '@/components/StatsBar';
import { useSatelliteData } from '@/lib/useSatelliteData';
import { useMemo } from 'react';

const tools = [
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
    <div className="min-h-screen grain">
      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 starfield opacity-30" />

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
                  to="/lifetime-calculator"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all"
                >
                  Try Lifetime Calculator
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/tracker"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] rounded-lg transition-all"
                >
                  View Live Tracker
                </Link>
              </div>
            </div>

            <div className="h-[400px] lg:h-[550px]">
              <EarthGlobe satellites={satellites} showCounter={!loading && satellites.length > 0} />
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
                className="group bg-white/[0.02] border border-white/[0.06] rounded-xl p-7 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300"
              >
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
