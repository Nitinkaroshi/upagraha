import { Satellite, AlertTriangle, BarChart3, Shield } from 'lucide-react';

const stats = [
  {
    icon: Satellite,
    label: 'Tracked Objects',
    value: '36,500+',
  },
  {
    icon: AlertTriangle,
    label: 'Active Debris',
    value: '23,000+',
  },
  {
    icon: BarChart3,
    label: 'Daily Conjunctions',
    value: '~1,500',
  },
  {
    icon: Shield,
    label: 'Collision Risk Events',
    value: '~15/day',
  },
];

export default function StatsBar() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] transition-all duration-300"
        >
          <stat.icon className="w-5 h-5 text-white/40 mb-3" />
          <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
          <div className="text-xs text-white/30 mt-1.5 uppercase tracking-wider">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
