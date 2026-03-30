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
