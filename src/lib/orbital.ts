/**
 * Orbital mechanics calculations for space debris analysis.
 * Uses simplified models suitable for educational/compliance estimation purposes.
 */

const EARTH_RADIUS_KM = 6371;
const EARTH_MU = 398600.4418; // km^3/s^2
const EARTH_MASS = 5.972e24; // kg
const BOLTZMANN = 1.380649e-23;
const AVOGADRO = 6.022e23;
const MOLAR_MASS_AIR = 0.0289644; // kg/mol

export interface OrbitalElements {
  altitude: number; // km above Earth surface
  inclination: number; // degrees
  eccentricity: number;
  raan: number; // Right Ascension of Ascending Node (degrees)
  argPerigee: number; // Argument of perigee (degrees)
  meanAnomaly: number; // degrees
}

export interface LifetimeResult {
  lifetimeYears: number;
  lifetimeDays: number;
  meetsComplianceFCC: boolean; // FCC 5-year rule
  meetsComplianceESA: boolean; // ESA 25-year guideline
  decayProfile: { year: number; altitude: number }[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface ConjunctionEvent {
  id: string;
  object1: string;
  object2: string;
  tca: Date; // Time of Closest Approach
  missDistance: number; // km
  probability: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Atmospheric density model (simplified exponential)
 * Based on the 1976 US Standard Atmosphere with scale heights
 */
function atmosphericDensity(altitudeKm: number): number {
  const layers: [number, number, number][] = [
    // [base altitude km, base density kg/m³, scale height km]
    [0, 1.225, 8.5],
    [100, 5.297e-7, 5.9],
    [150, 2.070e-9, 25.5],
    [200, 2.789e-10, 37.5],
    [250, 7.248e-11, 44.8],
    [300, 2.418e-11, 52.0],
    [400, 3.725e-12, 58.2],
    [500, 6.967e-13, 60.8],
    [600, 1.454e-13, 63.2],
    [700, 3.614e-14, 65.8],
    [800, 1.170e-14, 68.0],
    [900, 5.245e-15, 72.0],
    [1000, 3.019e-15, 76.0],
  ];

  let layer = layers[0];
  for (let i = layers.length - 1; i >= 0; i--) {
    if (altitudeKm >= layers[i][0]) {
      layer = layers[i];
      break;
    }
  }

  const [baseAlt, baseDensity, scaleHeight] = layer;
  return baseDensity * Math.exp(-(altitudeKm - baseAlt) / scaleHeight);
}

/**
 * Calculate orbital period in seconds
 */
export function orbitalPeriod(altitudeKm: number): number {
  const a = EARTH_RADIUS_KM + altitudeKm;
  return 2 * Math.PI * Math.sqrt((a * a * a) / EARTH_MU);
}

/**
 * Calculate orbital velocity in km/s
 */
export function orbitalVelocity(altitudeKm: number): number {
  const r = EARTH_RADIUS_KM + altitudeKm;
  return Math.sqrt(EARTH_MU / r);
}

/**
 * Estimate orbital lifetime due to atmospheric drag
 * Uses King-Hele's theory (simplified)
 */
export function calculateOrbitalLifetime(
  altitudeKm: number,
  areaMassRatio: number, // m²/kg (cross-section area / mass)
  dragCoefficient: number = 2.2,
  solarActivity: 'low' | 'moderate' | 'high' = 'moderate'
): LifetimeResult {
  const solarMultiplier = {
    low: 0.5,
    moderate: 1.0,
    high: 2.5,
  }[solarActivity];

  let currentAlt = altitudeKm;
  const decayProfile: { year: number; altitude: number }[] = [{ year: 0, altitude: currentAlt }];
  let totalDays = 0;
  const dt = 1; // day step

  while (currentAlt > 120 && totalDays < 365 * 200) {
    const r = (EARTH_RADIUS_KM + currentAlt) * 1000; // meters
    const density = atmosphericDensity(currentAlt) * solarMultiplier;
    const velocity = orbitalVelocity(currentAlt) * 1000; // m/s

    // Drag deceleration: a_drag = -0.5 * Cd * (A/m) * rho * v²
    const dragAccel = 0.5 * dragCoefficient * areaMassRatio * density * velocity * velocity;

    // Rate of altitude decrease (simplified from orbit-averaged drag)
    const period = orbitalPeriod(currentAlt);
    const dAltPerOrbit = (dragAccel * period * period) / (2 * Math.PI * r) * 1000; // km
    const orbitsPerDay = 86400 / period;
    const dAltPerDay = dAltPerOrbit * orbitsPerDay;

    currentAlt -= dAltPerDay * dt;
    totalDays += dt;

    if (totalDays % 365 === 0 || currentAlt <= 120) {
      decayProfile.push({
        year: totalDays / 365,
        altitude: Math.max(currentAlt, 0),
      });
    }
  }

  const lifetimeYears = totalDays / 365;
  const meetsComplianceFCC = lifetimeYears <= 5;
  const meetsComplianceESA = lifetimeYears <= 25;

  let riskLevel: LifetimeResult['riskLevel'];
  if (lifetimeYears <= 5) riskLevel = 'low';
  else if (lifetimeYears <= 25) riskLevel = 'medium';
  else if (lifetimeYears <= 100) riskLevel = 'high';
  else riskLevel = 'critical';

  return {
    lifetimeYears,
    lifetimeDays: totalDays,
    meetsComplianceFCC,
    meetsComplianceESA,
    decayProfile,
    riskLevel,
  };
}

/**
 * Calculate position on a circular orbit at a given time
 */
export function orbitalPosition(
  altitudeKm: number,
  inclinationDeg: number,
  raanDeg: number,
  timeSec: number,
  meanAnomalyDeg: number = 0
): [number, number, number] {
  const r = EARTH_RADIUS_KM + altitudeKm;
  const period = orbitalPeriod(altitudeKm);
  const n = (2 * Math.PI) / period; // mean motion

  const M = ((meanAnomalyDeg * Math.PI) / 180 + n * timeSec) % (2 * Math.PI);
  const inc = (inclinationDeg * Math.PI) / 180;
  const raan = (raanDeg * Math.PI) / 180;

  // Position in orbital plane
  const xOrb = r * Math.cos(M);
  const yOrb = r * Math.sin(M);

  // Rotate to 3D (simplified — circular orbit, no argument of perigee)
  const x =
    xOrb * Math.cos(raan) - yOrb * Math.cos(inc) * Math.sin(raan);
  const y =
    xOrb * Math.sin(raan) + yOrb * Math.cos(inc) * Math.cos(raan);
  const z = yOrb * Math.sin(inc);

  return [x, y, z];
}

/**
 * Generate sample debris/satellite objects for visualization
 */
export interface SpaceObject {
  id: string;
  name: string;
  type: 'satellite' | 'debris' | 'rocket-body';
  altitude: number;
  inclination: number;
  raan: number;
  meanAnomaly: number;
  size: number; // relative size for visualization
}

export function generateSampleObjects(count: number): SpaceObject[] {
  const objects: SpaceObject[] = [];
  const types: SpaceObject['type'][] = ['satellite', 'debris', 'rocket-body'];
  const names = {
    satellite: ['SAT', 'STARLINK', 'ONEWEB', 'COSMOS', 'IRIDIUM'],
    debris: ['DEB', 'FRAG', 'OBJ'],
    'rocket-body': ['R/B', 'STAGE'],
  };

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * 3)];
    const namePrefix = names[type][Math.floor(Math.random() * names[type].length)];

    objects.push({
      id: `${i + 10000}`,
      name: `${namePrefix}-${i + 1000}`,
      type,
      altitude: 200 + Math.random() * 1800, // 200-2000 km
      inclination: Math.random() * 120, // 0-120 degrees
      raan: Math.random() * 360,
      meanAnomaly: Math.random() * 360,
      size: type === 'debris' ? 0.3 + Math.random() * 0.5 : 0.8 + Math.random() * 0.7,
    });
  }

  return objects;
}

/**
 * Generate simulated conjunction events
 */
export function generateConjunctionEvents(count: number): ConjunctionEvent[] {
  const events: ConjunctionEvent[] = [];
  const objects = [
    'ISS (ZARYA)', 'STARLINK-1234', 'COSMOS 2251 DEB', 'FENGYUN 1C DEB',
    'ENVISAT', 'IRIDIUM 33 DEB', 'CZ-6A DEB', 'ATLAS CENTAUR R/B',
    'MICROSAT-R DEB', 'SL-16 R/B', 'NOAA 17', 'BREEZE-M DEB',
  ];

  for (let i = 0; i < count; i++) {
    const idx1 = Math.floor(Math.random() * objects.length);
    let idx2 = Math.floor(Math.random() * objects.length);
    while (idx2 === idx1) idx2 = Math.floor(Math.random() * objects.length);

    const missDistance = Math.random() * 5; // 0-5 km
    const probability = missDistance < 0.1
      ? 0.001 + Math.random() * 0.01
      : missDistance < 1
        ? 0.00001 + Math.random() * 0.001
        : Math.random() * 0.00001;

    let riskLevel: ConjunctionEvent['riskLevel'];
    if (probability > 0.001) riskLevel = 'critical';
    else if (probability > 0.0001) riskLevel = 'high';
    else if (probability > 0.00001) riskLevel = 'medium';
    else riskLevel = 'low';

    const tcaDate = new Date();
    tcaDate.setHours(tcaDate.getHours() + Math.floor(Math.random() * 168)); // next 7 days

    events.push({
      id: `CDM-${2024000 + i}`,
      object1: objects[idx1],
      object2: objects[idx2],
      tca: tcaDate,
      missDistance,
      probability,
      riskLevel,
    });
  }

  return events.sort((a, b) => b.probability - a.probability);
}

/**
 * Format number to scientific notation
 */
export function toScientific(n: number, digits: number = 3): string {
  if (n === 0) return '0';
  const exp = Math.floor(Math.log10(Math.abs(n)));
  const mantissa = n / Math.pow(10, exp);
  return `${mantissa.toFixed(digits - 1)} × 10^${exp}`;
}
