import { useState, useMemo } from 'react';
import { Compass, CheckCircle, AlertTriangle, DollarSign, Clock, Zap } from 'lucide-react';
import { recommendDeorbitStrategies, type DeorbitStrategy } from '@/lib/deorbit';

const feasibilityStyles = {
  excellent: { bg: 'bg-white/10', border: 'border-white/20', text: 'text-white', label: 'EXCELLENT' },
  good: { bg: 'bg-white/[0.06]', border: 'border-white/15', text: 'text-white/80', label: 'GOOD' },
  possible: { bg: 'bg-white/[0.03]', border: 'border-white/10', text: 'text-white/50', label: 'POSSIBLE' },
  'not-recommended': { bg: 'bg-white/[0.01]', border: 'border-white/[0.06]', text: 'text-white/30', label: 'NOT REC.' },
};

function StrategyCard({ strategy, rank }: { strategy: DeorbitStrategy; rank: number }) {
  const style = feasibilityStyles[strategy.feasibility];
  const [expanded, setExpanded] = useState(rank === 0);

  return (
    <div className={`${style.bg} border ${style.border} rounded-xl overflow-hidden transition-all`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-6 py-5 flex items-start gap-4"
      >
        <span className="text-white/15 font-mono text-sm font-bold mt-0.5">#{rank + 1}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-white font-semibold">{strategy.name}</h3>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${style.text} border ${style.border}`}>
              {style.label}
            </span>
          </div>
          <p className="text-white/30 text-sm">{strategy.description}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-bold text-white">{strategy.feasibilityScore}</div>
          <div className="text-[10px] text-white/25 uppercase tracking-wider">Score</div>
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-6 border-t border-white/[0.04] pt-5 space-y-5">
          {/* Key metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-2">
              <DollarSign className="w-4 h-4 text-white/25 mt-0.5 shrink-0" />
              <div>
                <div className="text-[10px] text-white/25 uppercase tracking-wider">Est. Cost</div>
                <div className="text-sm text-white font-mono">
                  {strategy.estimatedCostUSD[0] === 0 && strategy.estimatedCostUSD[1] === 0
                    ? 'Free'
                    : `$${(strategy.estimatedCostUSD[0] / 1000).toFixed(0)}k–$${(strategy.estimatedCostUSD[1] / 1000).toFixed(0)}k`}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-white/25 mt-0.5 shrink-0" />
              <div>
                <div className="text-[10px] text-white/25 uppercase tracking-wider">Deorbit Time</div>
                <div className="text-sm text-white font-mono">{strategy.estimatedDeorbitTime}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-white/25 mt-0.5 shrink-0" />
              <div>
                <div className="text-[10px] text-white/25 uppercase tracking-wider">TRL</div>
                <div className="text-sm text-white font-mono">{strategy.trl}/9</div>
              </div>
            </div>
          </div>

          {strategy.deltaVRequired !== undefined && (
            <div className="bg-white/[0.02] rounded-lg px-4 py-3">
              <span className="text-xs text-white/30">Delta-V Required: </span>
              <span className="text-sm text-white font-mono font-bold">{strategy.deltaVRequired} m/s</span>
            </div>
          )}
          {strategy.additionalDragArea !== undefined && strategy.additionalDragArea > 0 && (
            <div className="bg-white/[0.02] rounded-lg px-4 py-3">
              <span className="text-xs text-white/30">Additional Drag Area Needed: </span>
              <span className="text-sm text-white font-mono font-bold">{strategy.additionalDragArea} m²</span>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-white/30 mb-2 font-medium">Advantages</div>
              <ul className="space-y-1.5">
                {strategy.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/50">
                    <CheckCircle className="w-3 h-3 text-white/30 mt-0.5 shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs text-white/30 mb-2 font-medium">Considerations</div>
              <ul className="space-y-1.5">
                {strategy.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/40">
                    <AlertTriangle className="w-3 h-3 text-white/20 mt-0.5 shrink-0" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DeorbitAdvisor() {
  const [altitude, setAltitude] = useState(600);
  const [mass, setMass] = useState(50);
  const [area, setArea] = useState(0.25);
  const [hasPropulsion, setHasPropulsion] = useState(false);

  const strategies = useMemo(() => {
    if (altitude < 150 || altitude > 2000 || mass <= 0 || area <= 0) return [];
    return recommendDeorbitStrategies(altitude, mass, area, hasPropulsion);
  }, [altitude, mass, area, hasPropulsion]);

  return (
    <div className="min-h-screen pt-24 pb-16 grain">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/50 text-xs font-medium mb-4">
            <Compass className="w-3.5 h-3.5" />
            Strategy Tool
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Deorbit Strategy Advisor
          </h1>
          <p className="text-white/35 max-w-2xl mx-auto">
            Enter your satellite parameters to get ranked deorbit strategy recommendations
            with cost estimates, feasibility scores, and compliance analysis.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-5">
              <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider">Parameters</h3>

              <div>
                <label className="flex justify-between text-sm text-white/40 mb-2">
                  <span>Altitude</span>
                  <span className="text-white font-mono text-xs">{altitude} km</span>
                </label>
                <input type="range" min={150} max={2000} value={altitude}
                  onChange={(e) => setAltitude(Number(e.target.value))} className="w-full accent-white" />
              </div>

              <div>
                <label className="flex justify-between text-sm text-white/40 mb-2">
                  <span>Mass</span>
                  <span className="text-white font-mono text-xs">{mass} kg</span>
                </label>
                <input type="number" value={mass} onChange={(e) => setMass(Number(e.target.value))} min={0.1} step={1}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/20" />
              </div>

              <div>
                <label className="flex justify-between text-sm text-white/40 mb-2">
                  <span>Cross-Section</span>
                  <span className="text-white font-mono text-xs">{area} m²</span>
                </label>
                <input type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} min={0.001} step={0.01}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/20" />
              </div>

              <div>
                <label className="text-sm text-white/40 mb-2 block">Onboard Propulsion?</label>
                <div className="grid grid-cols-2 gap-2">
                  {[false, true].map((val) => (
                    <button key={String(val)} onClick={() => setHasPropulsion(val)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                        hasPropulsion === val
                          ? 'bg-white/10 border-white/20 text-white'
                          : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:border-white/10'
                      }`}>
                      {val ? 'Yes' : 'No'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Strategies */}
          <div className="lg:col-span-3 space-y-4">
            {strategies.length > 0 ? (
              strategies.map((strategy, i) => (
                <StrategyCard key={strategy.method} strategy={strategy} rank={i} />
              ))
            ) : (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-12 text-center">
                <Compass className="w-10 h-10 text-white/15 mx-auto mb-4" />
                <p className="text-white/30 text-sm">Enter valid parameters to see recommendations.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
