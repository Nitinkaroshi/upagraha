import { useState, useMemo, useEffect } from 'react';
import { Search, Satellite, AlertTriangle, Rocket, Filter, Loader2, Globe, RefreshCw } from 'lucide-react';
import EarthGlobe from '@/components/EarthGlobe';
import { orbitalVelocity, orbitalPeriod } from '@/lib/orbital';
import { CELESTRAK_GROUPS, type ParsedSatellite } from '@/lib/celestrak';
import { useSatelliteData, useSatelliteSearch } from '@/lib/useSatelliteData';
import { useDebounce } from '@/lib/useDebounce';

type FilterType = 'all' | 'satellite' | 'debris' | 'rocket-body';

const typeConfig = {
  satellite: { icon: Satellite, label: 'Satellite' },
  debris: { icon: AlertTriangle, label: 'Debris' },
  'rocket-body': { icon: Rocket, label: 'Rocket Body' },
  unknown: { icon: Globe, label: 'Unknown' },
};

export default function Tracker() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedObject, setSelectedObject] = useState<ParsedSatellite | null>(null);
  const [group, setGroup] = useState('stations');

  const { satellites, loading, error, refetch } = useSatelliteData(group);
  const { results: searchResults, searching, search: doSearch } = useSatelliteSearch();
  const debouncedSearch = useDebounce(search, 400);

  // Trigger CelesTrak search when debounced value changes and is 3+ chars
  useEffect(() => {
    if (debouncedSearch.length >= 3) {
      doSearch(debouncedSearch);
    }
  }, [debouncedSearch, doSearch]);

  const displayObjects = useMemo(() => {
    // If searching with 3+ chars, show API results merged with local filter
    const source = debouncedSearch.length >= 3 && searchResults.length > 0
      ? searchResults
      : satellites;

    return source.filter((obj) => {
      if (filter !== 'all' && obj.type !== filter) return false;
      if (search && debouncedSearch.length < 3) {
        return obj.name.toLowerCase().includes(search.toLowerCase()) || obj.id.includes(search);
      }
      return true;
    });
  }, [satellites, searchResults, filter, search, debouncedSearch]);

  const counts = useMemo(() => ({
    all: satellites.length,
    satellite: satellites.filter(o => o.type === 'satellite').length,
    debris: satellites.filter(o => o.type === 'debris').length,
    'rocket-body': satellites.filter(o => o.type === 'rocket-body').length,
  }), [satellites]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Live Satellite & Debris Tracker
          </h1>
          <p className="text-white/35 max-w-2xl mx-auto">
            Real-time data from CelesTrak satellite catalog. Search any satellite by name or NORAD ID.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-1 space-y-4">
            {/* Group selector */}
            <div className="relative">
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-white/20 transition-colors cursor-pointer"
              >
                {Object.entries(CELESTRAK_GROUPS).map(([label, value]) => (
                  <option key={value} value={value} className="bg-black text-white">{label}</option>
                ))}
              </select>
              <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or NORAD ID..."
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
              />
              {searching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 animate-spin" />
              )}
            </div>

            {debouncedSearch.length >= 3 && searchResults.length > 0 && (
              <div className="text-[11px] text-white/30 px-1">
                Showing {searchResults.length} results from CelesTrak search
              </div>
            )}

            {/* Filters */}
            <div className="grid grid-cols-2 gap-2">
              {(['all', 'satellite', 'debris', 'rocket-body'] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    filter === f
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:border-white/10'
                  }`}
                >
                  <span>{f === 'all' ? 'All' : f === 'rocket-body' ? 'R/B' : f.charAt(0).toUpperCase() + f.slice(1)}</span>
                  <span className="bg-white/[0.06] px-1.5 py-0.5 rounded text-[10px]">{counts[f]}</span>
                </button>
              ))}
            </div>

            {/* Object list */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-white/50 font-medium uppercase tracking-wider">
                  {loading ? 'Loading...' : `${displayObjects.length} objects`}
                </span>
                <button onClick={refetch} className="text-white/20 hover:text-white/50 transition-colors">
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {error && (
                <div className="px-4 py-3 text-xs text-white/40 border-b border-white/[0.04]">
                  Failed to load: {error}. Showing cached or demo data.
                </div>
              )}

              <div className="max-h-[500px] overflow-y-auto">
                {loading && !satellites.length ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-5 h-5 text-white/20 animate-spin" />
                  </div>
                ) : (
                  displayObjects.slice(0, 200).map((obj) => {
                    const config = typeConfig[obj.type] || typeConfig.unknown;
                    const Icon = config.icon;
                    return (
                      <button
                        key={obj.id}
                        onClick={() => setSelectedObject(obj)}
                        className={`w-full text-left px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${
                          selectedObject?.id === obj.id ? 'bg-white/[0.05]' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-3.5 h-3.5 text-white/25 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm text-white truncate">{obj.name}</div>
                            <div className="text-[11px] text-white/25 font-mono">
                              {obj.noradId} · {obj.altitude.toFixed(0)}km · {obj.inclination.toFixed(1)}°
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden h-[500px]">
              <EarthGlobe />
            </div>

            {selectedObject && (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  {(() => {
                    const config = typeConfig[selectedObject.type] || typeConfig.unknown;
                    const Icon = config.icon;
                    return (
                      <>
                        <Icon className="w-5 h-5 text-white/40" />
                        <div>
                          <div className="text-white font-medium">{selectedObject.name}</div>
                          <div className="text-xs text-white/30">
                            NORAD ID: {selectedObject.noradId} · {config.label} · Epoch: {selectedObject.epoch?.split('T')[0]}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Altitude', value: `${selectedObject.altitude.toFixed(1)} km` },
                    { label: 'Inclination', value: `${selectedObject.inclination.toFixed(2)}°` },
                    { label: 'Velocity', value: `${orbitalVelocity(selectedObject.altitude).toFixed(2)} km/s` },
                    { label: 'Period', value: `${selectedObject.period?.toFixed(1) || (orbitalPeriod(selectedObject.altitude) / 60).toFixed(1)} min` },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="text-[10px] text-white/25 uppercase tracking-wider">{label}</div>
                      <div className="text-sm text-white font-mono mt-0.5">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 text-[11px] text-white/20">
              <Satellite className="w-3 h-3 shrink-0 mt-0.5" />
              <span>Live data from CelesTrak satellite catalog. 3D positions use simplified orbital propagation. Updated hourly.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
