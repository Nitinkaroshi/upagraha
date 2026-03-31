import { Link } from 'react-router-dom';
import { Target, Eye, Zap, Mail, ArrowRight } from 'lucide-react';
import { GitHubIcon } from '@/components/Icons';

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-16 grain">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            About upagraha
          </h1>
          <p className="text-white/35 text-lg">
            Safeguarding Space, Securing the Future
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-20">
          {[
            { icon: Target, title: 'Mission', text: 'Make space sustainability tools accessible to every satellite operator, researcher, and student — regardless of budget.' },
            { icon: Eye, title: 'Vision', text: 'A future where every object in orbit is tracked, every mission plans for end-of-life, and space remains sustainable.' },
            { icon: Zap, title: 'Approach', text: 'Open-source first. Free tools for the community. Premium compliance features for operators who need regulatory-grade reports.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-7">
              <Icon className="w-6 h-6 text-white/30 mb-5" />
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-white/30 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">The Problem</h2>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 space-y-5">
            <p className="text-white/40 leading-relaxed">
              Earth's orbital environment is becoming increasingly congested. With over <span className="text-white font-medium">36,000 tracked objects</span> larger
              than 10cm and an estimated <span className="text-white font-medium">millions of smaller fragments</span>, the risk of collision grows every year.
            </p>
            <p className="text-white/40 leading-relaxed">
              The 2009 Iridium-Cosmos collision and the 2007 Chinese ASAT test each created thousands of new debris
              fragments. Each collision increases risk further — a potential cascade known as <span className="text-white font-medium">Kessler Syndrome</span>.
            </p>
            <p className="text-white/40 leading-relaxed">
              New regulations like the <span className="text-white">FCC's 5-year deorbit rule</span> and
              ESA's <span className="text-white">Zero Debris Charter</span> push toward responsible operations. But many operators lack the tools for compliance.
            </p>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">What We Offer</h2>
          <div className="space-y-3">
            {[
              { n: '01', title: 'Orbital Lifetime Calculator', desc: 'Instant lifetime estimates with FCC and ESA compliance checking. No sign-up required.' },
              { n: '02', title: 'Live Debris Tracker', desc: '3D visualization of the orbital environment using real catalog data. Filter, search, explore.' },
              { n: '03', title: 'Conjunction Risk Assessment', desc: 'Monitor close approaches, assess collision probabilities, understand risk levels.' },
              { n: '04', title: 'Compliance Reports (Coming Soon)', desc: 'Generate regulatory compliance documentation for FCC, ITU, and ESA. Export-ready.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 flex items-start gap-4">
                <span className="text-white/15 font-mono text-sm font-bold">{n}</span>
                <div>
                  <h3 className="text-white font-medium mb-1">{title}</h3>
                  <p className="text-white/30 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">Get Involved</h2>
          <p className="text-white/30 max-w-xl mx-auto mb-8">
            Upagraha is open source. We welcome contributions from developers, astrodynamics
            experts, and anyone passionate about space sustainability.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://github.com/upagraha"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] rounded-lg transition-all"
            >
              <GitHubIcon className="w-4 h-4" />
              GitHub
            </a>
            <a
              href="mailto:upagraha.space@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] rounded-lg transition-all"
            >
              <Mail className="w-4 h-4" />
              Contact Us
            </a>
            <Link
              to="/lifetime-calculator"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all"
            >
              Try Our Tools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
