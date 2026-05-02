import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Loader2, GitCompare, ArrowRight, Satellite as SatIcon, AlertTriangle, Rocket, Globe } from 'lucide-react';
import { fetchSatelliteById, type ParsedSatellite } from '@/lib/celestrak';
import { calculateOrbitalLifetime, orbitalVelocity } from '@/lib/orbital';
import { calculateSustainabilityScore } from '@/lib/sustainability';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { slugify } from '@/lib/slugify';

const typeIcons = {
  satellite: SatIcon,
  debris: AlertTriangle,
  'rocket-body': Rocket,
  unknown: Globe,
} as const;

function fmt(n: number | null | undefined, digits = 1, suffix = ''): string {
  if (!Number.isFinite(n as number)) return '—';
  return (n as number).toFixed(digits) + suffix;
}

interface SatColumnProps {
  label: 'A' | 'B';
  sat: ParsedSatellite | null;
  loading: boolean;
  searchValue: string;
  onSearch: (v: string) => void;
  onSubmit: () => void;
}

function SatColumn({ label, sat, loading, searchValue, onSearch, onSubmit }: SatColumnProps) {
  const Icon = sat ? typeIcons[sat.type] : Globe;

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider border border-white/[0.08] rounded px-2 py-0.5">
          Satellite {label}
        </span>
        {sat && (
          <Link
            to={`/satellite/${sat.noradId}/${slugify(sat.name)}`}
            className="text-[11px] text-white/40 hover:text-white inline-flex items-center gap-1"
          >
            View detail <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="NORAD ID (e.g. 25544)"
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-white/90 disabled:opacity-50 transition-all"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Load'}
        </button>
      </form>

      {sat ? (
        <>
          <div className="flex items-start gap-3">
            <Icon className="w-6 h-6 text-white/40 mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-white font-semibold truncate">{sat.name}</div>
              <div className="text-[11px] text-white/30 font-mono">NORAD {sat.noradId}</div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-white/25 text-sm py-4 text-center">
          Enter a NORAD catalog number to load
        </div>
      )}
    </div>
  );
}

interface Row {
  label: string;
  a: string | number;
  b: string | number;
  /** When provided, the larger value is highlighted in this column. */
  highlight?: 'higher' | 'lower';
}

function ComparisonTable({ rows }: { rows: Row[] }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
      {rows.map((row, i) => {
        const aNum = typeof row.a === 'number' ? row.a : parseFloat(String(row.a));
        const bNum = typeof row.b === 'number' ? row.b : parseFloat(String(row.b));
        const validNumeric = Number.isFinite(aNum) && Number.isFinite(bNum) && row.highlight;
        let aWinner = false, bWinner = false;
        if (validNumeric) {
          if (row.highlight === 'higher') {
            aWinner = aNum > bNum;
            bWinner = bNum > aNum;
          } else {
            aWinner = aNum < bNum;
            bWinner = bNum < aNum;
          }
        }

        return (
          <div
            key={row.label}
            className={`grid grid-cols-12 gap-4 px-5 py-3.5 ${i < rows.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
          >
            <div className="col-span-4 text-xs text-white/35 uppercase tracking-wider self-center">
              {row.label}
            </div>
            <div className={`col-span-4 text-sm font-mono ${aWinner ? 'text-white font-bold' : 'text-white/70'}`}>
              {row.a}
              {aWinner && <span className="ml-2 text-[9px] text-white/40 uppercase">↑</span>}
            </div>
            <div className={`col-span-4 text-sm font-mono ${bWinner ? 'text-white font-bold' : 'text-white/70'}`}>
              {row.b}
              {bWinner && <span className="ml-2 text-[9px] text-white/40 uppercase">↑</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchA, setSearchA] = useState(searchParams.get('a') ?? '25544');
  const [searchB, setSearchB] = useState(searchParams.get('b') ?? '20580');
  const [satA, setSatA] = useState<ParsedSatellite | null>(null);
  const [satB, setSatB] = useState<ParsedSatellite | null>(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);

  const titleNames = satA && satB ? `${satA.name} vs ${satB.name}` : 'Compare Satellites';

  useDocumentMeta({
    title: `${titleNames} — Side-by-Side Comparison | Upagraha`,
    description: `Compare ${satA?.name ?? 'any satellite'} and ${satB?.name ?? 'any other satellite'} side-by-side. Orbital parameters, estimated lifetime, sustainability score, and more.`,
    canonical: `https://upagraha-ten.vercel.app/compare${satA && satB ? `?a=${satA.noradId}&b=${satB.noradId}` : ''}`,
    jsonLd: satA && satB
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `${satA.name} vs ${satB.name}`,
          description: `Side-by-side comparison of ${satA.name} and ${satB.name}.`,
          itemListOrder: 'Unordered',
          numberOfItems: 2,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: {
                '@type': 'Thing',
                name: satA.name,
                identifier: `NORAD-${satA.noradId}`,
                url: `https://upagraha-ten.vercel.app/satellite/${satA.noradId}/${slugify(satA.name)}`,
              },
            },
            {
              '@type': 'ListItem',
              position: 2,
              item: {
                '@type': 'Thing',
                name: satB.name,
                identifier: `NORAD-${satB.noradId}`,
                url: `https://upagraha-ten.vercel.app/satellite/${satB.noradId}/${slugify(satB.name)}`,
              },
            },
          ],
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Satellite Comparison Tool',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Web',
          url: 'https://upagraha-ten.vercel.app/compare',
          description: 'Compare any two satellites side-by-side: orbital parameters, lifetime, sustainability score.',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
  });

  const loadA = async (id: string) => {
    const noradId = parseInt(id, 10);
    if (!Number.isFinite(noradId)) return;
    setLoadingA(true);
    const sat = await fetchSatelliteById(noradId);
    setSatA(sat);
    setLoadingA(false);
    if (sat) setSearchParams((p) => { p.set('a', String(sat.noradId)); return p; });
  };

  const loadB = async (id: string) => {
    const noradId = parseInt(id, 10);
    if (!Number.isFinite(noradId)) return;
    setLoadingB(true);
    const sat = await fetchSatelliteById(noradId);
    setSatB(sat);
    setLoadingB(false);
    if (sat) setSearchParams((p) => { p.set('b', String(sat.noradId)); return p; });
  };

  // Auto-load both on mount if URL has values
  useEffect(() => {
    const a = searchParams.get('a');
    const b = searchParams.get('b');
    if (a) loadA(a);
    if (b) loadB(b);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Compute comparison metrics
  const lifetimeA = useMemo(() => satA ? calculateOrbitalLifetime(satA.altitude, 0.01, 2.2, 'moderate') : null, [satA]);
  const lifetimeB = useMemo(() => satB ? calculateOrbitalLifetime(satB.altitude, 0.01, 2.2, 'moderate') : null, [satB]);

  const sustA = useMemo(() => satA ? calculateSustainabilityScore({
    altitude: satA.altitude, mass: 100, crossSection: 1,
    hasDeorbitPlan: true, deorbitMethod: 'natural', hasPropulsion: false,
    hasCollisionAvoidance: false, isTrackable: true, passivated: true,
    numberOfComponents: 1, missionDurationYears: 5,
  }) : null, [satA]);

  const sustB = useMemo(() => satB ? calculateSustainabilityScore({
    altitude: satB.altitude, mass: 100, crossSection: 1,
    hasDeorbitPlan: true, deorbitMethod: 'natural', hasPropulsion: false,
    hasCollisionAvoidance: false, isTrackable: true, passivated: true,
    numberOfComponents: 1, missionDurationYears: 5,
  }) : null, [satB]);

  const both = satA && satB;

  const orbitalRows: Row[] = both ? [
    { label: 'Altitude', a: fmt(satA.altitude, 1, ' km'), b: fmt(satB.altitude, 1, ' km'), highlight: 'lower' },
    { label: 'Inclination', a: fmt(satA.inclination, 2, '°'), b: fmt(satB.inclination, 2, '°') },
    { label: 'Eccentricity', a: fmt(satA.eccentricity, 6), b: fmt(satB.eccentricity, 6) },
    { label: 'Period', a: fmt(satA.period, 1, ' min'), b: fmt(satB.period, 1, ' min') },
    { label: 'Velocity', a: fmt(orbitalVelocity(satA.altitude), 2, ' km/s'), b: fmt(orbitalVelocity(satB.altitude), 2, ' km/s') },
    { label: 'Object type', a: satA.type, b: satB.type },
  ] : [];

  const lifetimeRows: Row[] = both && lifetimeA && lifetimeB ? [
    {
      label: 'Estimated lifetime',
      a: lifetimeA.lifetimeYears > 100 ? '100+ yrs' : lifetimeA.lifetimeYears < 1 ? `${lifetimeA.lifetimeDays} days` : `${lifetimeA.lifetimeYears.toFixed(1)} yrs`,
      b: lifetimeB.lifetimeYears > 100 ? '100+ yrs' : lifetimeB.lifetimeYears < 1 ? `${lifetimeB.lifetimeDays} days` : `${lifetimeB.lifetimeYears.toFixed(1)} yrs`,
      highlight: 'lower',
    },
    { label: 'Risk level', a: lifetimeA.riskLevel.toUpperCase(), b: lifetimeB.riskLevel.toUpperCase() },
    { label: 'FCC 5-yr rule', a: lifetimeA.meetsComplianceFCC ? '✓ Compliant' : '✗ Non-compliant', b: lifetimeB.meetsComplianceFCC ? '✓ Compliant' : '✗ Non-compliant' },
    { label: 'ESA 25-yr rule', a: lifetimeA.meetsComplianceESA ? '✓ Compliant' : '✗ Non-compliant', b: lifetimeB.meetsComplianceESA ? '✓ Compliant' : '✗ Non-compliant' },
  ] : [];

  const sustRows: Row[] = both && sustA && sustB ? [
    { label: 'Sustainability score', a: sustA.overallScore, b: sustB.overallScore, highlight: 'higher' },
    { label: 'Grade', a: sustA.grade, b: sustB.grade },
  ] : [];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/50 text-xs font-medium mb-4">
            <GitCompare className="w-3.5 h-3.5" />
            Side-by-Side Comparison
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            {both ? `${satA.name} vs ${satB.name}` : 'Compare Satellites'}
          </h1>
          <p className="text-white/40 max-w-2xl mx-auto">
            Compare any two satellites side-by-side. Orbital parameters, estimated lifetime,
            and sustainability scores using live CelesTrak data.
          </p>
        </div>

        {/* Two satellite columns */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <SatColumn
            label="A" sat={satA} loading={loadingA}
            searchValue={searchA} onSearch={setSearchA}
            onSubmit={() => loadA(searchA)}
          />
          <SatColumn
            label="B" sat={satB} loading={loadingB}
            searchValue={searchB} onSearch={setSearchB}
            onSubmit={() => loadB(searchB)}
          />
        </div>

        {/* Comparison body */}
        {both ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">Orbital Parameters</h2>
              <ComparisonTable rows={orbitalRows} />
            </div>

            <div>
              <h2 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">Lifetime &amp; Compliance</h2>
              <ComparisonTable rows={lifetimeRows} />
              <p className="text-[11px] text-white/25 mt-2 px-1">
                Lifetime estimated assuming standard 100&nbsp;kg / 1&nbsp;m² profile and moderate solar activity.
                For exact compliance, plug your actual mass and area into the{' '}
                <Link to="/lifetime-calculator" className="text-white/50 hover:text-white underline underline-offset-2">
                  Lifetime Calculator
                </Link>.
              </p>
            </div>

            <div>
              <h2 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">Sustainability Score</h2>
              <ComparisonTable rows={sustRows} />
            </div>

            {/* Share */}
            <div className="text-center pt-4">
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white text-xs transition-all"
              >
                Copy share link
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-12 text-center">
            <GitCompare className="w-10 h-10 text-white/15 mx-auto mb-4" />
            <p className="text-white/40 text-sm mb-4">Load two satellites to see them side-by-side.</p>
            <p className="text-[11px] text-white/25">
              Try popular pairs:{' '}
              <button onClick={() => { setSearchA('25544'); setSearchB('20580'); loadA('25544'); loadB('20580'); }} className="text-white/50 hover:text-white underline underline-offset-2">ISS vs Hubble</button>
              {' · '}
              <button onClick={() => { setSearchA('25544'); setSearchB('48274'); loadA('25544'); loadB('48274'); }} className="text-white/50 hover:text-white underline underline-offset-2">ISS vs Tiangong</button>
              {' · '}
              <button onClick={() => { setSearchA('44713'); setSearchB('48274'); loadA('44713'); loadB('48274'); }} className="text-white/50 hover:text-white underline underline-offset-2">Starlink vs Tiangong</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
