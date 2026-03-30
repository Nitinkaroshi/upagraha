import { useState, useMemo } from 'react';
import { Leaf, Share2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateSustainabilityScore, type SustainabilityInput } from '@/lib/sustainability';

function ScoreGauge({ score, grade }: { score: number; grade: string }) {
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
        <circle cx="80" cy="80" r="70" fill="none" stroke="white" strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white">{score}</span>
        <span className="text-lg font-bold text-white/50">{grade}</span>
        <span className="text-[10px] text-white/20 uppercase tracking-widest mt-1">Score</span>
      </div>
    </div>
  );
}

export default function SustainabilityScore() {
  const [input, setInput] = useState<SustainabilityInput>({
    altitude: 500,
    mass: 50,
    crossSection: 0.25,
    hasDeorbitPlan: true,
    deorbitMethod: 'natural',
    hasPropulsion: false,
    hasCollisionAvoidance: false,
    isTrackable: true,
    passivated: false,
    numberOfComponents: 1,
    missionDurationYears: 3,
  });

  const update = (partial: Partial<SustainabilityInput>) => setInput((prev) => ({ ...prev, ...partial }));

  const result = useMemo(() => {
    if (input.altitude < 150 || input.altitude > 2000 || input.mass <= 0) return null;
    return calculateSustainabilityScore(input);
  }, [input]);

  const shareUrl = useMemo(() => {
    if (!result) return '';
    const params = new URLSearchParams({
      alt: String(input.altitude), m: String(input.mass), a: String(input.crossSection),
      dm: input.deorbitMethod, p: input.hasPropulsion ? '1' : '0',
    });
    return `${window.location.origin}/sustainability?${params}`;
  }, [result, input]);

  return (
    <div className="min-h-screen pt-24 pb-16 grain">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/50 text-xs font-medium mb-4">
            <Leaf className="w-3.5 h-3.5" />
            Sustainability Rating
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Space Sustainability Score
          </h1>
          <p className="text-white/35 max-w-2xl mx-auto">
            Rate your satellite mission on 5 debris risk factors. Get an overall sustainability
            grade and actionable recommendations.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider">Orbital Parameters</h3>

              <div>
                <label className="flex justify-between text-sm text-white/40 mb-2">
                  <span>Altitude</span><span className="text-white font-mono text-xs">{input.altitude} km</span>
                </label>
                <input type="range" min={150} max={2000} value={input.altitude}
                  onChange={(e) => update({ altitude: Number(e.target.value) })} className="w-full accent-white" />
              </div>
              <div>
                <label className="flex justify-between text-sm text-white/40 mb-2">
                  <span>Mass</span><span className="text-white font-mono text-xs">{input.mass} kg</span>
                </label>
                <input type="number" value={input.mass} onChange={(e) => update({ mass: Number(e.target.value) })} min={0.1}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/20" />
              </div>
              <div>
                <label className="flex justify-between text-sm text-white/40 mb-2">
                  <span>Mission Duration</span><span className="text-white font-mono text-xs">{input.missionDurationYears} yrs</span>
                </label>
                <input type="range" min={0.5} max={15} step={0.5} value={input.missionDurationYears}
                  onChange={(e) => update({ missionDurationYears: Number(e.target.value) })} className="w-full accent-white" />
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider">Mission Design</h3>

              {([
                { key: 'hasPropulsion', label: 'Onboard Propulsion' },
                { key: 'hasCollisionAvoidance', label: 'Collision Avoidance System' },
                { key: 'isTrackable', label: 'Trackable (>10cm / reflector)' },
                { key: 'passivated', label: 'End-of-Life Passivation Plan' },
                { key: 'hasDeorbitPlan', label: 'Formal Deorbit Plan' },
              ] as const).map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-white/40">{label}</span>
                  <button
                    onClick={() => update({ [key]: !input[key] })}
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      input[key] ? 'bg-white/30' : 'bg-white/[0.08]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${
                      input[key] ? 'left-5.5' : 'left-0.5'
                    }`} style={{ left: input[key] ? '22px' : '2px' }} />
                  </button>
                </div>
              ))}

              <div>
                <label className="text-sm text-white/40 mb-2 block">Deorbit Method</label>
                <select
                  value={input.deorbitMethod}
                  onChange={(e) => update({ deorbitMethod: e.target.value as SustainabilityInput['deorbitMethod'] })}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/20 cursor-pointer"
                >
                  <option value="none" className="bg-black">None</option>
                  <option value="natural" className="bg-black">Natural Decay</option>
                  <option value="drag-sail" className="bg-black">Drag Sail</option>
                  <option value="propulsive" className="bg-black">Propulsive</option>
                  <option value="tether" className="bg-black">Electrodynamic Tether</option>
                </select>
              </div>

              <div>
                <label className="flex justify-between text-sm text-white/40 mb-2">
                  <span>Separable Components</span>
                  <span className="text-white font-mono text-xs">{input.numberOfComponents}</span>
                </label>
                <input type="range" min={1} max={10} value={input.numberOfComponents}
                  onChange={(e) => update({ numberOfComponents: Number(e.target.value) })} className="w-full accent-white" />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-5">
            {result ? (
              <>
                {/* Score gauge */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8">
                  <ScoreGauge score={result.overallScore} grade={result.grade} />
                  <div className="text-center mt-4">
                    <div className="text-white/25 text-xs">
                      Orbital Lifetime: {result.orbitLifetimeYears.toFixed(1)} years
                    </div>
                  </div>

                  {/* Share */}
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => navigator.clipboard.writeText(shareUrl)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white text-xs transition-all"
                    >
                      <Share2 className="w-3 h-3" /> Share Score
                    </button>
                  </div>
                </div>

                {/* Factor breakdown */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
                  <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-5">Score Breakdown</h3>
                  <div className="space-y-4">
                    {result.factors.map((factor) => (
                      <div key={factor.name}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-white/60">{factor.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-white/20">{(factor.weight * 100).toFixed(0)}% weight</span>
                            <span className="text-sm text-white font-mono font-bold">{factor.score.toFixed(0)}</span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white/40 rounded-full transition-all duration-700"
                            style={{ width: `${factor.score}%` }}
                          />
                        </div>
                        <div className="text-[11px] text-white/20 mt-1">{factor.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                {result.recommendations.length > 0 && (
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
                    <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-4">Recommendations to Improve</h3>
                    <ul className="space-y-3">
                      {result.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-white/40">
                          <ArrowRight className="w-3.5 h-3.5 text-white/20 mt-0.5 shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                <div className="flex gap-3">
                  <Link to="/lifetime-calculator"
                    className="flex-1 text-center px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white/50 hover:text-white text-sm transition-all">
                    Lifetime Calculator
                  </Link>
                  <Link to="/deorbit-advisor"
                    className="flex-1 text-center px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white/50 hover:text-white text-sm transition-all">
                    Deorbit Advisor
                  </Link>
                </div>
              </>
            ) : (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-12 text-center">
                <Leaf className="w-10 h-10 text-white/15 mx-auto mb-4" />
                <p className="text-white/30 text-sm">Enter valid parameters to see your sustainability score.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
