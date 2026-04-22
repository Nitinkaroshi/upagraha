import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Satellite as SatIcon, AlertTriangle, Rocket, Globe, Clock, Gauge, Calculator, Leaf, RefreshCw, Loader2 } from 'lucide-react';
import * as satellite from 'satellite.js';
import { fetchSatelliteById, fetchTLEById, type ParsedSatellite, type TLEEntry } from '@/lib/celestrak';
import { orbitalVelocity, calculateOrbitalLifetime } from '@/lib/orbital';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { slugify } from '@/lib/slugify';

const radToDeg = (rad: number) => rad * 180 / Math.PI;

const typeMeta = {
  satellite: { icon: SatIcon, label: 'Active Satellite', description: 'An operational satellite' },
  debris: { icon: AlertTriangle, label: 'Space Debris', description: 'Orbital debris fragment' },
  'rocket-body': { icon: Rocket, label: 'Rocket Body', description: 'Spent rocket upper stage' },
  unknown: { icon: Globe, label: 'Tracked Object', description: 'Unclassified tracked object' },
};

function fmt(n: number | null | undefined, digits = 1, suffix = ''): string {
  if (!Number.isFinite(n as number)) return '—';
  return (n as number).toFixed(digits) + suffix;
}

export default function SatellitePage() {
  const { noradId: noradIdParam } = useParams<{ noradId: string; slug?: string }>();
  const noradId = parseInt(noradIdParam ?? '', 10);

  const [data, setData] = useState<ParsedSatellite | null>(null);
  const [tle, setTle] = useState<TLEEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [now, setNow] = useState(() => new Date());

  // Fetch GP + TLE in parallel
  useEffect(() => {
    if (!Number.isFinite(noradId)) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    Promise.all([fetchSatelliteById(noradId), fetchTLEById(noradId)])
      .then(([sat, tleData]) => {
        if (cancelled) return;
        if (!sat) { setNotFound(true); return; }
        setData(sat);
        setTle(tleData);
      })
      .catch(() => { if (!cancelled) setNotFound(true); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [noradId]);

  // Tick live position
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 2000);
    return () => clearInterval(id);
  }, []);

  // Current live position via SGP4
  const livePosition = useMemo(() => {
    if (!tle) return null;
    try {
      const satrec = satellite.twoline2satrec(tle.tle1, tle.tle2);
      const posVel = satellite.propagate(satrec, now);
      if (!posVel.position || typeof posVel.position === 'boolean') return null;
      const gmst = satellite.gstime(now);
      const gd = satellite.eciToGeodetic(posVel.position, gmst);
      const velocity = posVel.velocity && typeof posVel.velocity !== 'boolean'
        ? Math.sqrt(posVel.velocity.x ** 2 + posVel.velocity.y ** 2 + posVel.velocity.z ** 2)
        : null;
      return {
        latitude: radToDeg(gd.latitude),
        longitude: ((radToDeg(gd.longitude) + 540) % 360) - 180,
        altitude: gd.height,
        velocity, // km/s
      };
    } catch {
      return null;
    }
  }, [tle, now]);

  // Lifetime estimate (assume 100kg, 1m² if we can't guess)
  const lifetime = useMemo(() => {
    if (!data) return null;
    const assumedMass = data.type === 'debris' ? 5 : 100;
    const assumedArea = data.type === 'debris' ? 0.05 : 1;
    return calculateOrbitalLifetime(data.altitude, assumedArea / assumedMass, 2.2, 'moderate');
  }, [data]);

  // SEO meta — runs every render so it updates as data loads
  useDocumentMeta({
    title: data
      ? `${data.name} (NORAD ${data.noradId}) — Live Tracker & Orbital Data | Upagraha`
      : 'Satellite — Upagraha',
    description: data
      ? `Live position, orbital parameters, and lifetime estimate for ${data.name} (NORAD ${data.noradId}). ${typeMeta[data.type].description} at ${data.altitude.toFixed(0)}km altitude, ${data.inclination.toFixed(1)}° inclination.`
      : 'Track any satellite by NORAD catalog number.',
    canonical: data
      ? `https://upagraha-ten.vercel.app/satellite/${data.noradId}/${slugify(data.name)}`
      : undefined,
    jsonLd: data
      ? {
          '@context': 'https://schema.org',
          '@type': 'Thing',
          name: data.name,
          identifier: `NORAD-${data.noradId}`,
          description: `${typeMeta[data.type].label} in ${data.altitude.toFixed(0)}km orbit`,
          url: `https://upagraha-ten.vercel.app/satellite/${data.noradId}/${slugify(data.name)}`,
        }
      : undefined,
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-white/30 animate-spin" />
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <AlertTriangle className="w-10 h-10 text-white/25 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Satellite not found</h1>
          <p className="text-white/40 text-sm mb-6">
            No satellite with NORAD ID <span className="font-mono text-white/60">{noradIdParam}</span> in the CelesTrak catalog.
          </p>
          <Link to="/tracker" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Browse the tracker
          </Link>
        </div>
      </div>
    );
  }

  const meta = typeMeta[data.type] || typeMeta.unknown;
  const Icon = meta.icon;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <Link to="/tracker" className="inline-flex items-center gap-1.5 text-white/30 hover:text-white text-xs mb-6 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to tracker
        </Link>

        {/* Header */}
        <header className="flex items-start gap-5 mb-10">
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] shrink-0">
            <Icon className="w-8 h-8 text-white/60" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider border border-white/[0.08] rounded px-1.5 py-0.5">
                {meta.label}
              </span>
              <span className="text-[10px] text-white/25 font-mono">NORAD {data.noradId}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{data.name}</h1>
            <p className="text-white/40 text-sm mt-2">
              {meta.description} in a {data.altitude.toFixed(0)}&nbsp;km orbit with {data.inclination.toFixed(1)}° inclination.
            </p>
          </div>
        </header>

        {/* Live position */}
        <section className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-medium text-white/50 uppercase tracking-wider">Live Position</h2>
            <span className="text-[10px] text-white/25 font-mono flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3" /> updated {now.toLocaleTimeString()}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div>
              <div className="text-[10px] text-white/25 uppercase tracking-wider mb-1">Latitude</div>
              <div className="text-xl font-mono text-white">{fmt(livePosition?.latitude, 3, '°')}</div>
            </div>
            <div>
              <div className="text-[10px] text-white/25 uppercase tracking-wider mb-1">Longitude</div>
              <div className="text-xl font-mono text-white">{fmt(livePosition?.longitude, 3, '°')}</div>
            </div>
            <div>
              <div className="text-[10px] text-white/25 uppercase tracking-wider mb-1">Altitude</div>
              <div className="text-xl font-mono text-white">{fmt(livePosition?.altitude, 1, ' km')}</div>
            </div>
            <div>
              <div className="text-[10px] text-white/25 uppercase tracking-wider mb-1">Speed</div>
              <div className="text-xl font-mono text-white">{fmt(livePosition?.velocity, 2, ' km/s')}</div>
            </div>
          </div>
        </section>

        {/* Orbital parameters */}
        <section className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 mb-5">
          <h2 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-4">Orbital Parameters</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { label: 'Mean Altitude', value: fmt(data.altitude, 1, ' km'), icon: Globe },
              { label: 'Inclination', value: fmt(data.inclination, 2, '°'), icon: Gauge },
              { label: 'Eccentricity', value: fmt(data.eccentricity, 6), icon: Gauge },
              { label: 'Period', value: fmt(data.period, 1, ' min'), icon: Clock },
              { label: 'Velocity', value: fmt(orbitalVelocity(data.altitude), 2, ' km/s'), icon: Gauge },
              { label: 'RAAN', value: fmt(data.raan, 2, '°'), icon: Gauge },
            ].map(({ label, value, icon: I }) => (
              <div key={label} className="flex items-start gap-3">
                <I className="w-4 h-4 text-white/20 mt-0.5 shrink-0" />
                <div>
                  <div className="text-[10px] text-white/25 uppercase tracking-wider">{label}</div>
                  <div className="text-sm font-mono text-white mt-0.5">{value}</div>
                </div>
              </div>
            ))}
          </div>
          {data.epoch && (
            <div className="mt-5 pt-4 border-t border-white/[0.04] text-[11px] text-white/25">
              Epoch: <span className="font-mono text-white/50">{data.epoch}</span>
            </div>
          )}
        </section>

        {/* Lifetime estimate */}
        {lifetime && (
          <section className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 mb-5">
            <h2 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-4">
              Estimated Orbital Lifetime
            </h2>
            <div className="flex items-baseline gap-4">
              <div className="text-3xl font-bold text-white tracking-tight">
                {lifetime.lifetimeYears > 100 ? '100+ years' : lifetime.lifetimeYears < 1 ? `${lifetime.lifetimeDays} days` : `${lifetime.lifetimeYears.toFixed(1)} years`}
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${lifetime.meetsComplianceFCC ? 'border-white/30 text-white/70' : 'border-white/10 text-white/30'}`}>
                  FCC 5yr {lifetime.meetsComplianceFCC ? '✓' : '✗'}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${lifetime.meetsComplianceESA ? 'border-white/30 text-white/70' : 'border-white/10 text-white/30'}`}>
                  ESA 25yr {lifetime.meetsComplianceESA ? '✓' : '✗'}
                </span>
              </div>
            </div>
            <p className="text-white/30 text-xs mt-3">
              Based on assumed {data.type === 'debris' ? '5kg / 0.05m²' : '100kg / 1m²'} profile. For precise calculation, use the{' '}
              <Link to="/lifetime-calculator" className="text-white/70 hover:text-white underline underline-offset-2">
                Lifetime Calculator
              </Link>
              {' '}with the actual satellite specs.
            </p>
          </section>
        )}

        {/* Related tools CTA */}
        <section className="grid sm:grid-cols-3 gap-3">
          <Link to="/lifetime-calculator" className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.04] transition-all">
            <Calculator className="w-5 h-5 text-white/30 mb-2" />
            <div className="text-sm font-semibold text-white">Lifetime Calculator</div>
            <div className="text-xs text-white/30 mt-1">Custom lifetime + compliance check</div>
          </Link>
          <Link to="/deorbit-advisor" className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.04] transition-all">
            <Rocket className="w-5 h-5 text-white/30 mb-2" />
            <div className="text-sm font-semibold text-white">Deorbit Advisor</div>
            <div className="text-xs text-white/30 mt-1">Strategy recommendations</div>
          </Link>
          <Link to="/sustainability" className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.04] transition-all">
            <Leaf className="w-5 h-5 text-white/30 mb-2" />
            <div className="text-sm font-semibold text-white">Sustainability Score</div>
            <div className="text-xs text-white/30 mt-1">Rate this mission 0-100</div>
          </Link>
        </section>
      </div>
    </div>
  );
}
