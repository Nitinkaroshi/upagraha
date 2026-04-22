import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Satellite, ChevronDown } from 'lucide-react';

const tools = [
  { to: '/satellites-over-you', label: 'Satellites Over You', badge: 'NEW' },
  { to: '/tracker', label: 'Live Tracker' },
  { to: '/lifetime-calculator', label: 'Lifetime Calculator' },
  { to: '/conjunctions', label: 'Conjunctions' },
  { to: '/deorbit-advisor', label: 'Deorbit Advisor' },
  { to: '/sustainability', label: 'Sustainability Score' },
];

const navLinks = [
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isToolPage = tools.some((t) => location.pathname === t.to);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close dropdown on navigation
  useEffect(() => { setToolsOpen(false); setMobileOpen(false); }, [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <Satellite className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-lg font-semibold tracking-tight text-white">upagraha</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {/* Tools dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isToolPage ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                Tools
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-black/95 backdrop-blur-xl border border-white/[0.08] rounded-xl py-2 shadow-2xl">
                  {tools.map((tool) => (
                    <Link
                      key={tool.to}
                      to={tool.to}
                      className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                        location.pathname === tool.to
                          ? 'text-white bg-white/10'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{tool.label}</span>
                      {tool.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white text-black">{tool.badge}</span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3.5 py-2 rounded-lg text-sm transition-all duration-200 ${
                  location.pathname.startsWith(link.to)
                    ? 'text-white bg-white/10'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link to="/lifetime-calculator"
              className="px-4 py-2 bg-white text-black font-medium text-sm rounded-lg hover:bg-white/90 transition-colors">
              Free Tools
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-white/60 hover:text-white">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="px-4 py-3 space-y-1">
            <div className="px-3 py-2 text-[10px] text-white/25 uppercase tracking-widest">Tools</div>
            {tools.map((tool) => (
              <Link key={tool.to} to={tool.to}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm ${
                  location.pathname === tool.to ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}>
                <span>{tool.label}</span>
                {tool.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white text-black">{tool.badge}</span>
                )}
              </Link>
            ))}
            <div className="border-t border-white/[0.06] my-2" />
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className={`block px-3 py-2.5 rounded-lg text-sm ${
                  location.pathname.startsWith(link.to) ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}>{link.label}</Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
