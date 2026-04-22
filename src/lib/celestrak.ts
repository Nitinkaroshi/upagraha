/**
 * CelesTrak API client for fetching real satellite TLE/GP data.
 * CelesTrak provides free access to satellite catalog data.
 * Docs: https://celestrak.org/NORAD/documentation/gp-data-formats.php
 */

export interface SatelliteRecord {
  OBJECT_NAME: string;
  OBJECT_ID: string;
  NORAD_CAT_ID: number;
  OBJECT_TYPE: string; // PAY, R/B, DEB, UNK
  EPOCH: string;
  MEAN_MOTION: number;
  ECCENTRICITY: number;
  INCLINATION: number;
  RA_OF_ASC_NODE: number;
  ARG_OF_PERICENTER: number;
  MEAN_ANOMALY: number;
  BSTAR: number;
  MEAN_MOTION_DOT: number;
  PERIOD: number; // minutes
  APOAPSIS: number; // km
  PERIAPSIS: number; // km
  RCS_SIZE: string; // SMALL, MEDIUM, LARGE
}

export interface ParsedSatellite {
  id: string;
  noradId: number;
  name: string;
  type: 'satellite' | 'debris' | 'rocket-body' | 'unknown';
  altitude: number; // average of apoapsis and periapsis
  inclination: number;
  raan: number;
  argPerigee: number;
  meanAnomaly: number;
  eccentricity: number;
  period: number; // minutes
  epoch: string;
}

const TYPE_MAP: Record<string, ParsedSatellite['type']> = {
  'PAY': 'satellite',
  'DEB': 'debris',
  'R/B': 'rocket-body',
  'UNK': 'unknown',
};

function parseRecord(rec: SatelliteRecord): ParsedSatellite {
  return {
    id: String(rec.NORAD_CAT_ID),
    noradId: rec.NORAD_CAT_ID,
    name: rec.OBJECT_NAME,
    type: TYPE_MAP[rec.OBJECT_TYPE] || 'unknown',
    altitude: (rec.APOAPSIS + rec.PERIAPSIS) / 2,
    inclination: rec.INCLINATION,
    raan: rec.RA_OF_ASC_NODE,
    argPerigee: rec.ARG_OF_PERICENTER,
    meanAnomaly: rec.MEAN_ANOMALY,
    eccentricity: rec.ECCENTRICITY,
    period: rec.PERIOD,
    epoch: rec.EPOCH,
  };
}

/**
 * Fetch satellite catalog from CelesTrak GP data API.
 * Available groups: stations, starlink, active, analyst, cosmos-2251-debris,
 * iridium-33-debris, fengyun-1c-debris, and more.
 */
export async function fetchSatelliteGroup(group: string): Promise<ParsedSatellite[]> {
  const url = `https://celestrak.org/NORAD/elements/gp.php?GROUP=${encodeURIComponent(group)}&FORMAT=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`CelesTrak API error: ${response.status} ${response.statusText}`);
  }

  const data: SatelliteRecord[] = await response.json();
  return data.map(parseRecord);
}

/**
 * Fetch a single satellite by NORAD Catalog ID.
 */
export async function fetchSatelliteById(noradId: number): Promise<ParsedSatellite | null> {
  const url = `https://celestrak.org/NORAD/elements/gp.php?CATNR=${noradId}&FORMAT=json`;

  const response = await fetch(url);
  if (!response.ok) return null;

  const data: SatelliteRecord[] = await response.json();
  if (data.length === 0) return null;
  return parseRecord(data[0]);
}

/**
 * Search satellites by name.
 */
export async function searchSatellites(name: string): Promise<ParsedSatellite[]> {
  const url = `https://celestrak.org/NORAD/elements/gp.php?NAME=${encodeURIComponent(name)}&FORMAT=json`;

  const response = await fetch(url);
  if (!response.ok) return [];

  const data: SatelliteRecord[] = await response.json();
  return data.map(parseRecord);
}

/** Parsed TLE with the two line elements needed for SGP4 propagation */
export interface TLEEntry {
  name: string;
  noradId: number;
  tle1: string;
  tle2: string;
}

/**
 * Parse the classic 3-line TLE format into structured entries.
 * Format:
 *   LINE 0: Satellite name
 *   LINE 1: 1 NNNNNU ...
 *   LINE 2: 2 NNNNN ...
 */
function parseTLEText(text: string): TLEEntry[] {
  const lines = text.split(/\r?\n/).map((l) => l.trimEnd()).filter((l) => l.length > 0);
  const entries: TLEEntry[] = [];
  for (let i = 0; i + 2 < lines.length; i += 3) {
    const name = lines[i].trim();
    const tle1 = lines[i + 1];
    const tle2 = lines[i + 2];
    if (!tle1.startsWith('1 ') || !tle2.startsWith('2 ')) continue;
    const noradId = parseInt(tle1.slice(2, 7).trim(), 10);
    if (!Number.isFinite(noradId)) continue;
    entries.push({ name, noradId, tle1, tle2 });
  }
  return entries;
}

/**
 * Fetch a CelesTrak group as raw TLE lines.
 * CelesTrak's gp.php?FORMAT=TLE sometimes returns 403 — the classic static
 * URL (/NORAD/elements/{group}.txt) is far more reliable, so we try it first
 * and fall back to gp.php if needed.
 */
export async function fetchTLEGroup(group: string): Promise<TLEEntry[]> {
  // Try classic URL first — stable, cached, no rate limiting issues
  const classicUrl = `https://celestrak.org/NORAD/elements/${encodeURIComponent(group)}.txt`;
  try {
    const response = await fetch(classicUrl);
    if (response.ok) {
      const text = await response.text();
      const parsed = parseTLEText(text);
      if (parsed.length > 0) return parsed;
    }
  } catch { /* fall through */ }

  // Fallback: gp.php endpoint (may 403 on some clients)
  const gpUrl = `https://celestrak.org/NORAD/elements/gp.php?GROUP=${encodeURIComponent(group)}&FORMAT=TLE`;
  const response = await fetch(gpUrl);
  if (!response.ok) {
    throw new Error(`CelesTrak TLE fetch error: ${response.status}`);
  }
  const text = await response.text();
  return parseTLEText(text);
}

/**
 * Fetch a single TLE by NORAD Catalog ID.
 * gp.php with CATNR is the only way to grab a specific satellite's TLE;
 * if it 403s, derive TLE lines from the JSON record instead.
 */
export async function fetchTLEById(noradId: number): Promise<TLEEntry | null> {
  const url = `https://celestrak.org/NORAD/elements/gp.php?CATNR=${noradId}&FORMAT=TLE`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const text = await response.text();
      const parsed = parseTLEText(text);
      if (parsed[0]) return parsed[0];
    }
  } catch { /* fall through to JSON-derived TLE */ }

  // Fallback: fetch JSON record and construct TLE lines from Keplerian elements
  const sat = await fetchSatelliteById(noradId);
  if (!sat) return null;
  const record = await fetchJsonRecord(noradId);
  if (!record) return null;
  const tle = recordToTLE(record);
  if (!tle) return null;
  return { name: sat.name, noradId: sat.noradId, tle1: tle.tle1, tle2: tle.tle2 };
}

/**
 * Fetch the raw SatelliteRecord JSON for a single NORAD ID.
 */
async function fetchJsonRecord(noradId: number): Promise<SatelliteRecord | null> {
  const url = `https://celestrak.org/NORAD/elements/gp.php?CATNR=${noradId}&FORMAT=json`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const data: SatelliteRecord[] = await response.json();
  return data[0] ?? null;
}

/**
 * Construct valid TLE lines from a CelesTrak JSON GP record.
 * Used as a fallback when the TLE endpoint returns 403.
 * Checksum computed per Space-Track convention.
 */
function recordToTLE(r: SatelliteRecord): { tle1: string; tle2: string } | null {
  try {
    const cat = String(r.NORAD_CAT_ID).padStart(5, ' ');
    // Parse international designator from OBJECT_ID (e.g. "1998-067A" -> "98067A  ")
    const objId = r.OBJECT_ID || '';
    const yr = objId.slice(2, 4);
    const rest = objId.slice(5).padEnd(6, ' ');
    const intlDesig = (yr + rest).padEnd(8, ' ');

    // Epoch: "2026-04-22T12:34:56.789012" -> YYDDD.DDDDDDDD
    const ep = new Date(r.EPOCH);
    const year2 = String(ep.getUTCFullYear() % 100).padStart(2, '0');
    const start = Date.UTC(ep.getUTCFullYear(), 0, 0);
    const diffMs = ep.getTime() - start;
    const dayOfYear = diffMs / 86400000;
    const epochStr = `${year2}${dayOfYear.toFixed(8).padStart(12, '0')}`;

    const nDot = Number(r.MEAN_MOTION_DOT) / 2;
    const nDotStr = (nDot >= 0 ? ' ' : '-') + `.${Math.abs(nDot).toFixed(8).slice(2, 10)}`;

    const bstar = Number(r.BSTAR);
    const bstarStr = formatExpField(bstar);

    let line1 = `1 ${cat}U ${intlDesig} ${epochStr} ${nDotStr}  00000-0 ${bstarStr} 0  9999`;
    line1 = line1.slice(0, 68);
    line1 += computeChecksum(line1);

    const inc = Number(r.INCLINATION).toFixed(4).padStart(8, ' ');
    const raan = Number(r.RA_OF_ASC_NODE).toFixed(4).padStart(8, ' ');
    const ecc = Number(r.ECCENTRICITY).toFixed(7).slice(2, 9); // drop "0."
    const argP = Number(r.ARG_OF_PERICENTER).toFixed(4).padStart(8, ' ');
    const ma = Number(r.MEAN_ANOMALY).toFixed(4).padStart(8, ' ');
    const mm = Number(r.MEAN_MOTION).toFixed(8).padStart(11, ' ');

    let line2 = `2 ${cat} ${inc} ${raan} ${ecc} ${argP} ${ma} ${mm}99999`;
    line2 = line2.slice(0, 68);
    line2 += computeChecksum(line2);

    return { tle1: line1, tle2: line2 };
  } catch {
    return null;
  }
}

function formatExpField(n: number): string {
  if (!Number.isFinite(n) || n === 0) return ' 00000-0';
  const sign = n < 0 ? '-' : ' ';
  const abs = Math.abs(n);
  const exp = Math.floor(Math.log10(abs));
  const mantissa = Math.round(abs * Math.pow(10, -exp + 4));
  return `${sign}${mantissa.toString().padStart(5, '0')}${exp >= 0 ? '+' : '-'}${Math.abs(exp)}`;
}

function computeChecksum(line: string): string {
  let sum = 0;
  for (const c of line) {
    if (c >= '0' && c <= '9') sum += parseInt(c, 10);
    else if (c === '-') sum += 1;
  }
  return String(sum % 10);
}

/** Available satellite groups on CelesTrak */
export const CELESTRAK_GROUPS = {
  'Space Stations': 'stations',
  'Starlink': 'starlink',
  'OneWeb': 'oneweb',
  'Active Satellites': 'active',
  'COSMOS 2251 Debris': 'cosmos-2251-debris',
  'Iridium 33 Debris': 'iridium-33-debris',
  'Fengyun 1C Debris': 'fengyun-1c-debris',
  'BREEZE-M Debris': 'breeze-m-r-b-debris',
  'Indian ASAT Test Debris': 'indian-asat-debris',
  '100 Brightest': '100-brightest',
  'GPS Constellation': 'gps-ops',
  'Galileo': 'galileo',
  'Planet (Doves)': 'planet',
  'Spire': 'spire',
  'Last 30 Days Launches': 'last-30-days',
} as const;
