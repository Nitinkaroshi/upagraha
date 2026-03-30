/**
 * Deorbit strategy recommendation engine.
 * Suggests the best deorbit method based on orbital and satellite parameters.
 */

import { calculateOrbitalLifetime, orbitalVelocity } from './orbital';

const EARTH_RADIUS_KM = 6371;
const EARTH_MU = 398600.4418;

export type DeorbitMethod = 'natural-decay' | 'drag-sail' | 'propulsive' | 'electrodynamic-tether';

export interface DeorbitStrategy {
  method: DeorbitMethod;
  name: string;
  description: string;
  feasibility: 'excellent' | 'good' | 'possible' | 'not-recommended';
  feasibilityScore: number; // 0-100
  estimatedCostUSD: [number, number]; // [min, max]
  estimatedDeorbitTime: string;
  deltaVRequired?: number; // m/s (for propulsive)
  additionalDragArea?: number; // m² (for drag sail)
  pros: string[];
  cons: string[];
  trl: number; // Technology Readiness Level (1-9)
}

/**
 * Calculate delta-V needed to lower perigee from circular orbit to 120km
 */
function deorbitDeltaV(altitudeKm: number): number {
  const r1 = (EARTH_RADIUS_KM + altitudeKm) * 1000; // meters
  const r2 = (EARTH_RADIUS_KM + 120) * 1000; // target perigee
  const a_transfer = (r1 + r2) / 2;
  const v_circular = Math.sqrt(EARTH_MU * 1e9 / r1);
  const v_transfer = Math.sqrt(EARTH_MU * 1e9 * (2 / r1 - 1 / a_transfer));
  return Math.abs(v_circular - v_transfer); // m/s
}

/**
 * Calculate additional drag area needed to deorbit within targetYears
 */
function requiredDragArea(
  altitudeKm: number, mass: number, currentArea: number, targetYears: number
): number {
  // Binary search for area that gives target lifetime
  let lo = currentArea;
  let hi = currentArea + 200;

  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    const result = calculateOrbitalLifetime(altitudeKm, mid / mass, 2.2, 'moderate');
    if (result.lifetimeYears > targetYears) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return Math.max(0, hi - currentArea);
}

export function recommendDeorbitStrategies(
  altitudeKm: number,
  massKg: number,
  crossSectionM2: number,
  hasOnboardPropulsion: boolean = false
): DeorbitStrategy[] {
  const currentLifetime = calculateOrbitalLifetime(altitudeKm, crossSectionM2 / massKg, 2.2, 'moderate');
  const dv = deorbitDeltaV(altitudeKm);
  const strategies: DeorbitStrategy[] = [];

  // 1. Natural Decay
  const naturalFeasible = currentLifetime.lifetimeYears <= 5;
  strategies.push({
    method: 'natural-decay',
    name: 'Natural Atmospheric Decay',
    description: 'Let atmospheric drag naturally lower the orbit until reentry. No additional hardware needed.',
    feasibility: naturalFeasible ? 'excellent' : currentLifetime.lifetimeYears <= 25 ? 'possible' : 'not-recommended',
    feasibilityScore: naturalFeasible ? 95 : currentLifetime.lifetimeYears <= 10 ? 60 : currentLifetime.lifetimeYears <= 25 ? 30 : 5,
    estimatedCostUSD: [0, 0],
    estimatedDeorbitTime: currentLifetime.lifetimeYears < 1
      ? `${currentLifetime.lifetimeDays} days`
      : `${currentLifetime.lifetimeYears.toFixed(1)} years`,
    pros: [
      'Zero additional cost',
      'No hardware modifications',
      'No risk of deployment failure',
      'Simplest compliance path',
    ],
    cons: naturalFeasible ? [
      'No control over reentry location',
      'Dependent on solar activity predictions',
    ] : [
      `Current lifetime: ${currentLifetime.lifetimeYears.toFixed(1)} years — exceeds 5-year FCC rule`,
      'Not viable without lowering initial orbit',
      'Uncontrolled reentry timing',
    ],
    trl: 9,
  });

  // 2. Drag Sail / Drag Augmentation
  const dragArea = requiredDragArea(altitudeKm, massKg, crossSectionM2, 4.5);
  const dragFeasible = altitudeKm <= 900 && dragArea < 100 && massKg < 1000;
  strategies.push({
    method: 'drag-sail',
    name: 'Drag Sail Deployment',
    description: 'Deploy a lightweight sail to increase atmospheric drag and accelerate orbital decay.',
    feasibility: dragFeasible ? (dragArea < 10 ? 'excellent' : 'good') : altitudeKm <= 1200 ? 'possible' : 'not-recommended',
    feasibilityScore: dragFeasible ? (dragArea < 5 ? 90 : dragArea < 25 ? 75 : 55) : 20,
    estimatedCostUSD: [50000, 250000],
    estimatedDeorbitTime: dragFeasible ? '1-5 years' : 'May not achieve compliance',
    additionalDragArea: Math.round(dragArea * 10) / 10,
    pros: [
      'Lower cost than propulsive systems',
      `Requires ~${dragArea.toFixed(1)} m² additional drag area`,
      'Passive after deployment — no fuel needed',
      'Commercially available (Vestigo, Tethers Unlimited)',
    ],
    cons: [
      'Risk of deployment failure',
      altitudeKm > 700 ? 'Less effective at higher altitudes' : 'Must survive orbital environment until deployment',
      'Uncontrolled reentry',
      'Adds mass and volume to satellite bus',
    ],
    trl: 7,
  });

  // 3. Propulsive Deorbit
  const propellantMass = (massKg * (1 - Math.exp(-dv / (220 * 9.81)))); // Hydrazine Isp ~220s
  strategies.push({
    method: 'propulsive',
    name: 'Propulsive Deorbit Maneuver',
    description: 'Use onboard propulsion to perform a deorbit burn, lowering perigee into the atmosphere.',
    feasibility: hasOnboardPropulsion ? 'excellent' : massKg < 500 ? 'good' : 'possible',
    feasibilityScore: hasOnboardPropulsion ? 95 : 50,
    estimatedCostUSD: hasOnboardPropulsion ? [5000, 50000] : [200000, 2000000],
    estimatedDeorbitTime: 'Hours to days (controlled)',
    deltaVRequired: Math.round(dv * 10) / 10,
    pros: [
      'Most reliable method',
      `Requires ${dv.toFixed(1)} m/s delta-V`,
      'Controlled reentry — can target safe ocean area',
      'Fastest deorbit — compliance within days',
      `Propellant mass: ~${propellantMass.toFixed(1)} kg (hydrazine)`,
    ],
    cons: hasOnboardPropulsion ? [
      'Requires fuel reservation for end-of-life',
      'Propulsion system must survive full mission duration',
    ] : [
      'Requires onboard propulsion system',
      'Highest cost if not already integrated',
      'Adds significant mass and complexity',
      'Must reserve fuel for end-of-life burn',
    ],
    trl: 9,
  });

  // 4. Electrodynamic Tether
  const tetherFeasible = altitudeKm >= 300 && altitudeKm <= 800;
  strategies.push({
    method: 'electrodynamic-tether',
    name: 'Electrodynamic Tether',
    description: 'Deploy a conductive tether that interacts with Earth\'s magnetic field to generate drag force.',
    feasibility: tetherFeasible ? 'possible' : 'not-recommended',
    feasibilityScore: tetherFeasible ? 45 : 10,
    estimatedCostUSD: [100000, 500000],
    estimatedDeorbitTime: tetherFeasible ? '6 months - 3 years' : 'Not effective at this altitude',
    pros: [
      'No fuel required — uses electromagnetic force',
      'Proven concept (JAXA KITE, ESA experiments)',
      'Works well in LEO where magnetic field is strong',
      'Can be compact and lightweight',
    ],
    cons: [
      'Lower TRL than drag sails or propulsion',
      'Tether susceptible to debris impact and severing',
      altitudeKm > 800 ? 'Magnetic field too weak at this altitude' : 'Requires power for current generation',
      'Limited commercial availability',
      'Complex deployment mechanism',
    ],
    trl: 5,
  });

  return strategies.sort((a, b) => b.feasibilityScore - a.feasibilityScore);
}
