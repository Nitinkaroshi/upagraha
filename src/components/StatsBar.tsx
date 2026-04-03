import { Satellite, AlertTriangle, BarChart3, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatsBarProps {
  liveCounts?: { total: number; satellites: number; debris: number; rocketBodies: number };
}

function AnimatedNumber({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const start = performance.now();
    const from = 0;

    function step(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(from + (target - from) * eased));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, [target, duration]);

  return <>{current.toLocaleString()}</>;
}

const defaultStats = [
  { icon: Satellite, label: 'Tracked Objects', value: 36500 },
  { icon: AlertTriangle, label: 'Active Debris', value: 23000 },
  { icon: BarChart3, label: 'Daily Conjunctions', value: 1500 },
  { icon: Shield, label: 'Risk Events / Day', value: 15 },
];

export default function StatsBar({ liveCounts }: StatsBarProps) {
  const stats = liveCounts
    ? [
        { icon: Satellite, label: 'Objects Loaded', value: liveCounts.total },
        { icon: Satellite, label: 'Active Satellites', value: liveCounts.satellites },
        { icon: AlertTriangle, label: 'Debris Fragments', value: liveCounts.debris },
        { icon: Shield, label: 'Rocket Bodies', value: liveCounts.rocketBodies },
      ]
    : defaultStats;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] transition-all duration-300"
        >
          <stat.icon className="w-5 h-5 text-white/40 mb-3" />
          <div className="text-2xl font-bold text-white tracking-tight">
            <AnimatedNumber target={stat.value} />
            {!liveCounts && stat.value >= 1000 && '+'}
          </div>
          <div className="text-xs text-white/30 mt-1.5 uppercase tracking-wider">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
