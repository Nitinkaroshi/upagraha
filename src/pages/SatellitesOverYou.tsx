import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Loader2, Share2, RefreshCw, Compass, Satellite, AlertCircle } from 'lucide-react';
import { fetchTLEGroup, type TLEEntry } from '@/lib/celestrak';
import { computeOverhead, getUserLocation, azimuthToCompass, type Observer, type OverheadSatellite } from '@/lib/skyview';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { slugify } from '@/lib/slugify';

type LocationState = 'idle' | 'requesting' | 'granted' | 'denied' | 'manual';

function ElevationDial({ elevation }: { elevation: number }) {
  const clamped = Math.max(0, Math.min(90, elevation));
  const angle = clamped * 2; // 0° elevation = 0°, 90° = 180° on dial
  return (
    <div className="relative w-10 h-10 shrink-0">
      <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
        <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <circle
          cx="20" cy="20" r="16" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 16}
          strokeDashoffset={(2 * Math.PI * 16) * (1 - angle / 360)}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[9px] text-white font-bold font-mono">
        {clamped.toFixed(0)}°
      </div>
    </div>
  );
}

export default function SatellitesOverYou() {
  const [state, setState] = useState<LocationState>('idle');
  const [observer, setObserver] = useState<Observer | null>(null);
  const [tles, setTles] = useState<TLEEntry[]>([]);
  const [loadingTles, setLoadingTles] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());
  const [manualLat, setManualLat] = useState('');
  const [manualLon, setManualLon] = useState('');

  useDocumentMeta({
    title: 'Satellites Over You — Real-Time Overhead Satellite Tracker | Upagraha',
    description: 'See which satellites are passing over your location right now. Free real-time tracker using live orbital data. No sign-up required.',
    canonical: 'https://upagraha-ten.vercel.app/satellites-over-you',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Satellites Over You',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Web',
      description: 'Real-time tracker showing satellites currently overhead based on your location.',
      url: 'https://upagraha-ten.vercel.app/satellites-over-you',
      offers: { '@type': 'Offer', price: '0' },
    },
  });

  // Load TLEs once
  useEffect(() => {
    let cancelled = false;
    setLoadingTles(true);
    fetchTLEGroup('active')
      .then((data) => { if (!cancelled) setTles(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoadingTles(false); });
    return () => { cancelled = true; };
  }, []);

  // Refresh "now" every 5 seconds so positions update live
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 5000);
    return () => clearInterval(id);
  }, []);

  const requestLocation = useCallback(async () => {
    setState('requesting');
    const loc = await getUserLocation();
    if (loc) {
      setObserver(loc);
      setState('granted');
    } else {
      setState('denied');
    }
  }, []);

  const submitManualLocation = useCallback(() => {
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return;
    setObserver({ latitude: lat, longitude: lon, altitude: 0 });
    setState('manual');
  }, [manualLat, manualLon]);

  const overhead = useMemo(() => {
    if (!observer || tles.length === 0) return [];
    return computeOverhead(tles, observer, 0, now);
  }, [observer, tles, now]);

  const visible = overhead.filter((s) => s.visible);
  const totalAbove = overhead.length;

  const shareText = useMemo(() => {
    if (!observer || overhead.length === 0) return '';
    return `🛰️ Right now, ${totalAbove} satellites are above me (${visible.length} clearly visible). The brightest: ${overhead[0]?.name} at ${overhead[0]?.elevation.toFixed(0)}° elevation. Check yours → upagraha-ten.vercel.app/satellites-over-you`;
  }, [observer, overhead, totalAbove, visible.length]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({ title: 'Satellites Over Me', text: shareText, url: window.location.href }).catch(() => {});
    } else if (shareText) {
      navigator.clipboard.writeText(shareText);
    }
  }, [shareText]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/50 text-xs font-medium mb-4">
            <MapPin className="w-3.5 h-3.5" />
            Live Geolocation Tracker
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Satellites Over You
          </h1>
          <p className="text-white/40 max-w-2xl mx-auto text-lg">
            See every satellite currently passing over your location. Updated in real-time
            using live orbital data from CelesTrak.
          </p>
        </div>

        {/* Location prompt */}
        {!observer && (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 text-center mb-6">
            <MapPin className="w-10 h-10 text-white/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Where are you?</h2>
            <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">
              We need your approximate location to calculate which satellites are overhead.
              Your location never leaves your browser.
            </p>

            <button
              onClick={requestLocation}
              disabled={state === 'requesting'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all disabled:opacity-50"
            >
              {state === 'requesting' ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
              {state === 'requesting' ? 'Getting location...' : 'Use my location'}
            </button>

            {state === 'denied' && (
              <p className="text-white/40 text-xs mt-4">
                Location blocked. Enter coordinates manually below.
              </p>
            )}

            <div className="mt-8 pt-8 border-t border-white/[0.06]">
              <p className="text-white/30 text-xs uppercase tracking-wider mb-3">or enter coordinates</p>
              <div className="flex gap-2 max-w-md mx-auto">
                <input
                  type="number" step="any" placeholder="Latitude (e.g., 12.97)"
                  value={manualLat} onChange={(e) => setManualLat(e.target.value)}
                  className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/20"
                />
                <input
                  type="number" step="any" placeholder="Longitude (e.g., 77.59)"
                  value={manualLon} onChange={(e) => setManualLon(e.target.value)}
                  className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/20"
                />
                <button
                  onClick={submitManualLocation}
                  className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-white text-sm rounded-lg border border-white/[0.08] transition-all"
                >
                  Go
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {observer && (
          <>
            {/* Headline stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 text-center">
                <div className="text-4xl font-bold text-white tracking-tight">{totalAbove}</div>
                <div className="text-[11px] text-white/30 uppercase tracking-wider mt-1">Above Horizon</div>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 text-center">
                <div className="text-4xl font-bold text-white tracking-tight">{visible.length}</div>
                <div className="text-[11px] text-white/30 uppercase tracking-wider mt-1">Clearly Visible</div>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 text-center">
                <div className="text-4xl font-bold text-white tracking-tight">{tles.length.toLocaleString()}</div>
                <div className="text-[11px] text-white/30 uppercase tracking-wider mt-1">Tracked Total</div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-xs text-white/40">
                <MapPin className="w-3.5 h-3.5" />
                <span className="font-mono">
                  {observer.latitude.toFixed(4)}°, {observer.longitude.toFixed(4)}°
                </span>
                <span className="text-white/20">·</span>
                <span>{now.toLocaleTimeString()}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white text-xs transition-all">
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
                <button onClick={() => setObserver(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white text-xs transition-all">
                  <RefreshCw className="w-3.5 h-3.5" /> Change location
                </button>
              </div>
            </div>

            {/* Satellite list */}
            {loadingTles ? (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-12 text-center">
                <Loader2 className="w-6 h-6 text-white/30 mx-auto mb-3 animate-spin" />
                <p className="text-white/40 text-sm">Loading satellite catalog...</p>
              </div>
            ) : overhead.length === 0 ? (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-12 text-center">
                <Satellite className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">No satellites currently above the horizon.</p>
                <p className="text-white/25 text-xs mt-1">Check back in a minute — they're moving fast.</p>
              </div>
            ) : (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/[0.06] text-[10px] text-white/25 font-medium uppercase tracking-wider">
                  <div className="col-span-1">Elev</div>
                  <div className="col-span-5">Satellite</div>
                  <div className="col-span-2">Direction</div>
                  <div className="col-span-2">Altitude</div>
                  <div className="col-span-2">Range</div>
                </div>

                {overhead.slice(0, 100).map((sat) => (
                  <Link
                    key={sat.noradId}
                    to={`/satellite/${sat.noradId}/${slugify(sat.name)}`}
                    className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${
                      sat.visible ? '' : 'opacity-60'
                    }`}
                  >
                    <div className="sm:col-span-1">
                      <ElevationDial elevation={sat.elevation} />
                    </div>
                    <div className="sm:col-span-5">
                      <div className="text-sm text-white font-medium truncate">{sat.name}</div>
                      <div className="text-[11px] text-white/25 font-mono">
                        NORAD {sat.noradId}
                        {sat.visible && <span className="ml-2 text-white/60">● visible</span>}
                      </div>
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <Compass className="w-3.5 h-3.5 text-white/20" />
                      <span className="text-sm text-white/60 font-mono">
                        {azimuthToCompass(sat.azimuth)} {sat.azimuth.toFixed(0)}°
                      </span>
                    </div>
                    <div className="sm:col-span-2 text-sm text-white/50 font-mono flex items-center">
                      {sat.altitude.toFixed(0)} km
                    </div>
                    <div className="sm:col-span-2 text-sm text-white/50 font-mono flex items-center">
                      {sat.range.toFixed(0)} km
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Note */}
            <div className="flex items-start gap-3 mt-5 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
              <AlertCircle className="w-4 h-4 text-white/20 shrink-0 mt-0.5" />
              <div className="text-xs text-white/25 leading-relaxed">
                <span className="text-white/50 font-medium">How this works.</span> Positions are computed via SGP4
                propagation from live CelesTrak TLEs. "Visible" means elevation above 10° on the horizon. Actual naked-eye
                visibility also depends on sunlight, satellite reflectivity, and your local sky conditions.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
