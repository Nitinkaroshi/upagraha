import { useState, useMemo } from 'react';
import { ShieldAlert, Clock, ArrowUpDown, Info } from 'lucide-react';
import { generateConjunctionEvents, type ConjunctionEvent } from '@/lib/orbital';

function RiskDot({ level }: { level: ConjunctionEvent['riskLevel'] }) {
  const opacity = { low: '20', medium: '40', high: '70', critical: '100' }[level];
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full bg-white/${opacity} ${level === 'critical' ? 'animate-pulse' : ''}`} />
      <span className={`text-xs font-medium text-white/${opacity === '100' ? '' : opacity}`}>
        {level === 'critical' ? 'CRIT' : level === 'high' ? 'High' : level === 'medium' ? 'Med' : 'Low'}
      </span>
    </div>
  );
}

export default function Conjunctions() {
  const [sortBy, setSortBy] = useState<'probability' | 'time' | 'distance'>('probability');
  const [filterRisk, setFilterRisk] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  const events = useMemo(() => generateConjunctionEvents(30), []);

  const filtered = useMemo(() => {
    let result = filterRisk === 'all' ? events : events.filter((e) => e.riskLevel === filterRisk);
    result.sort((a, b) => {
      if (sortBy === 'probability') return b.probability - a.probability;
      if (sortBy === 'time') return a.tca.getTime() - b.tca.getTime();
      return a.missDistance - b.missDistance;
    });
    return result;
  }, [events, sortBy, filterRisk]);

  const riskCounts = useMemo(() => ({
    critical: events.filter(e => e.riskLevel === 'critical').length,
    high: events.filter(e => e.riskLevel === 'high').length,
    medium: events.filter(e => e.riskLevel === 'medium').length,
    low: events.filter(e => e.riskLevel === 'low').length,
  }), [events]);

  return (
    <div className="min-h-screen pt-24 pb-16 grain">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/50 text-xs font-medium mb-4">
            <ShieldAlert className="w-3.5 h-3.5" />
            Conjunction Assessment
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Conjunction Risk Viewer
          </h1>
          <p className="text-white/35 max-w-2xl mx-auto">
            Monitor predicted close approaches between tracked objects in Earth orbit.
          </p>
        </div>

        {/* Risk summary */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Critical', count: riskCounts.critical, opacity: 'white' },
            { label: 'High', count: riskCounts.high, opacity: 'white/70' },
            { label: 'Medium', count: riskCounts.medium, opacity: 'white/50' },
            { label: 'Low', count: riskCounts.low, opacity: 'white/30' },
          ].map(({ label, count, opacity }) => (
            <div key={label} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold text-${opacity} tracking-tight`}>{count}</div>
              <div className="text-[10px] text-white/25 uppercase tracking-wider mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-5">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-white/20" />
            <span className="text-xs text-white/25">Sort:</span>
            {(['probability', 'time', 'distance'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  sortBy === s
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-white/[0.02] border-white/[0.06] text-white/30 hover:border-white/10'
                }`}
              >
                {s === 'probability' ? 'Risk' : s === 'time' ? 'Time' : 'Distance'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/25">Filter:</span>
            {(['all', 'critical', 'high', 'medium', 'low'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterRisk(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  filterRisk === f
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-white/[0.02] border-white/[0.06] text-white/30 hover:border-white/10'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Events table */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/[0.06] text-[10px] text-white/25 font-medium uppercase tracking-wider">
            <div className="col-span-1">Risk</div>
            <div className="col-span-3">Object 1</div>
            <div className="col-span-3">Object 2</div>
            <div className="col-span-2">TCA</div>
            <div className="col-span-1">Miss</div>
            <div className="col-span-2">Probability</div>
          </div>

          {filtered.map((event) => (
            <div
              key={event.id}
              className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${
                event.riskLevel === 'critical' ? 'bg-white/[0.02]' : ''
              }`}
            >
              <div className="sm:col-span-1 flex items-center">
                <RiskDot level={event.riskLevel} />
              </div>
              <div className="sm:col-span-3">
                <div className="text-sm text-white font-mono truncate">{event.object1}</div>
              </div>
              <div className="sm:col-span-3">
                <div className="text-sm text-white/60 font-mono truncate">{event.object2}</div>
              </div>
              <div className="sm:col-span-2 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-white/15 shrink-0" />
                <span className="text-xs text-white/40 font-mono">
                  {event.tca.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{' '}
                  {event.tca.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="sm:col-span-1">
                <span className="text-xs text-white/50 font-mono">{event.missDistance.toFixed(2)}km</span>
              </div>
              <div className="sm:col-span-2">
                <span className={`text-xs font-mono ${
                  event.probability > 0.001 ? 'text-white' : event.probability > 0.0001 ? 'text-white/70' : 'text-white/40'
                }`}>
                  {event.probability.toExponential(2)}
                </span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="px-5 py-12 text-center text-white/20 text-sm">
              No events match filter.
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 mt-5 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
          <Info className="w-4 h-4 text-white/20 shrink-0 mt-0.5" />
          <div className="text-xs text-white/20 leading-relaxed">
            <span className="text-white/40 font-medium">Simulated Data.</span> Production version ingests real CDMs from Space-Track.org.
          </div>
        </div>
      </div>
    </div>
  );
}
