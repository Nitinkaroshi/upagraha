import { Satellite } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/[0.06] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Satellite className="w-5 h-5 text-white" />
              <span className="text-base font-semibold text-white">upagraha</span>
            </div>
            <p className="text-white/40 text-sm max-w-md leading-relaxed">
              Open-source space debris monitoring and regulatory compliance tools
              for satellite operators. Safeguarding space, securing the future.
            </p>
            <p className="text-white/20 text-xs mt-4">
              Data sourced from publicly available catalogs (CelesTrak, Space-Track).
              Not for operational collision avoidance.
            </p>
          </div>

          <div>
            <h3 className="text-white/70 font-medium text-xs uppercase tracking-wider mb-4">Tools</h3>
            <ul className="space-y-2.5">
              <li><Link to="/tracker" className="text-white/40 hover:text-white text-sm transition-colors">Live Tracker</Link></li>
              <li><Link to="/lifetime-calculator" className="text-white/40 hover:text-white text-sm transition-colors">Lifetime Calculator</Link></li>
              <li><Link to="/conjunctions" className="text-white/40 hover:text-white text-sm transition-colors">Conjunctions</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white/70 font-medium text-xs uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-white/40 hover:text-white text-sm transition-colors">About</Link></li>
              <li><a href="https://github.com/upagraha" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white text-sm transition-colors">GitHub</a></li>
              <li><a href="mailto:contact@upagraha.com" className="text-white/40 hover:text-white text-sm transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] mt-8 pt-8 text-center text-white/20 text-xs">
          &copy; {new Date().getFullYear()} Upagraha. Open source under MIT License.
        </div>
      </div>
    </footer>
  );
}
