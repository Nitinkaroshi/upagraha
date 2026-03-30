import { useState, useEffect, useCallback } from 'react';
import { fetchSatelliteGroup, searchSatellites, fetchSatelliteById, type ParsedSatellite } from './celestrak';

const CACHE_PREFIX = 'upagraha_sat_';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

interface CacheEntry {
  data: ParsedSatellite[];
  timestamp: number;
}

function getCached(key: string): ParsedSatellite[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      sessionStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function setCache(key: string, data: ParsedSatellite[]) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch { /* storage full — ignore */ }
}

export function useSatelliteData(group: string) {
  const [satellites, setSatellites] = useState<ParsedSatellite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const cached = getCached(group);
    if (cached) {
      setSatellites(cached);
      setLoading(false);
      return;
    }

    try {
      const data = await fetchSatelliteGroup(group);
      setSatellites(data);
      setCache(group, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch satellite data');
    } finally {
      setLoading(false);
    }
  }, [group]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { satellites, loading, error, refetch: fetchData };
}

export function useSatelliteSearch() {
  const [results, setResults] = useState<ParsedSatellite[]>([]);
  const [searching, setSearching] = useState(false);

  const search = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setSearching(true);
    try {
      // If purely numeric, search by NORAD ID
      if (/^\d+$/.test(query)) {
        const sat = await fetchSatelliteById(parseInt(query));
        setResults(sat ? [sat] : []);
      } else {
        const data = await searchSatellites(query);
        setResults(data.slice(0, 50));
      }
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  return { results, searching, search };
}
