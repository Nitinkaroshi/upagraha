/**
 * Space Sustainability Scoring System
 * Rates a satellite mission on debris risk factors.
 */

import { calculateOrbitalLifetime } from './orbital';

export interface SustainabilityInput {
  altitude: number; // km
  mass: number; // kg
  crossSection: number; // m²
  hasDeorbitPlan: boolean;
  deorbitMethod: 'none' | 'natural' | 'drag-sail' | 'propulsive' | 'tether';
  hasPropulsion: boolean;
  hasCollisionAvoidance: boolean;
  isTrackable: boolean; // >10cm, has radar reflector
  passivated: boolean; // batteries/fuel drained at end of life
  numberOfComponents: number; // separable parts (deploy, release, etc.)
  missionDurationYears: number;
}

export interface SustainabilityResult {
  overallScore: number; // 0-100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  factors: {
    name: string;
    score: number;
    weight: number;
    weightedScore: number;
    description: string;
  }[];
  recommendations: string[];
  orbitLifetimeYears: number;
}

function getGrade(score: number): SustainabilityResult['grade'] {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 65) return 'B';
  if (score >= 50) return 'C';
  if (score >= 35) return 'D';
  return 'F';
}

export function calculateSustainabilityScore(input: SustainabilityInput): SustainabilityResult {
  const lifetime = calculateOrbitalLifetime(
    input.altitude, input.crossSection / input.mass, 2.2, 'moderate'
  );
  const recommendations: string[] = [];

  // Factor 1: Orbital Lifetime Compliance (30%)
  let lifetimeScore: number;
  if (lifetime.lifetimeYears <= 5) {
    lifetimeScore = 90 + (5 - lifetime.lifetimeYears) * 2; // bonus for faster deorbit
  } else if (lifetime.lifetimeYears <= 10) {
    lifetimeScore = 60 + (10 - lifetime.lifetimeYears) * 6;
  } else if (lifetime.lifetimeYears <= 25) {
    lifetimeScore = 20 + (25 - lifetime.lifetimeYears) * (40 / 15);
  } else {
    lifetimeScore = Math.max(0, 20 - (lifetime.lifetimeYears - 25) * 0.2);
  }
  lifetimeScore = Math.min(100, Math.max(0, lifetimeScore));

  if (lifetime.lifetimeYears > 5) {
    recommendations.push('Lower orbital altitude or add deorbit capability to meet FCC 5-year rule');
  }
  if (lifetime.lifetimeYears > 25) {
    recommendations.push('Mission poses long-term debris risk — consider active deorbit system');
  }

  // Factor 2: Collision Avoidance (20%)
  let avoidanceScore = 20; // base
  if (input.hasPropulsion) avoidanceScore += 35;
  if (input.hasCollisionAvoidance) avoidanceScore += 30;
  if (input.isTrackable) avoidanceScore += 15;
  avoidanceScore = Math.min(100, avoidanceScore);

  if (!input.hasPropulsion) {
    recommendations.push('Add propulsion for collision avoidance maneuver capability');
  }
  if (!input.hasCollisionAvoidance) {
    recommendations.push('Implement automated conjunction assessment and avoidance system');
  }
  if (!input.isTrackable) {
    recommendations.push('Add radar reflector or GPS beacon for trackability');
  }

  // Factor 3: Deorbit Plan (20%)
  let deorbitScore: number;
  switch (input.deorbitMethod) {
    case 'propulsive': deorbitScore = 95; break;
    case 'drag-sail': deorbitScore = 80; break;
    case 'tether': deorbitScore = 65; break;
    case 'natural': deorbitScore = lifetime.lifetimeYears <= 5 ? 70 : 30; break;
    default: deorbitScore = input.hasDeorbitPlan ? 40 : 5;
  }

  if (!input.hasDeorbitPlan) {
    recommendations.push('Develop a formal post-mission disposal plan — required for FCC licensing');
  }
  if (input.deorbitMethod === 'none') {
    recommendations.push('Select and integrate a deorbit mechanism (propulsion, drag sail, or tether)');
  }

  // Factor 4: Orbital Regime Risk (15%)
  let regimeScore: number;
  if (input.altitude <= 400) regimeScore = 95;
  else if (input.altitude <= 600) regimeScore = 80;
  else if (input.altitude <= 800) regimeScore = 55;
  else if (input.altitude <= 1000) regimeScore = 30;
  else regimeScore = 10;

  if (input.altitude > 700) {
    recommendations.push(`Altitude ${input.altitude}km is in a congested regime — consider a lower orbit if mission allows`);
  }

  // Factor 5: Debris Generation Risk (15%)
  let debrisScore = 80;
  if (input.numberOfComponents > 1) debrisScore -= (input.numberOfComponents - 1) * 10;
  if (input.passivated) debrisScore += 15;
  if (input.mass > 500) debrisScore -= 10;
  if (input.mass > 1000) debrisScore -= 10;
  debrisScore = Math.min(100, Math.max(0, debrisScore));

  if (!input.passivated) {
    recommendations.push('Plan for end-of-life passivation (deplete batteries, vent fuel tanks) to prevent accidental breakup');
  }
  if (input.numberOfComponents > 2) {
    recommendations.push('Minimize mission-related debris — reduce separable components where possible');
  }

  const factors = [
    { name: 'Orbital Lifetime', score: lifetimeScore, weight: 0.30, weightedScore: lifetimeScore * 0.30, description: 'How quickly the satellite will deorbit post-mission' },
    { name: 'Collision Avoidance', score: avoidanceScore, weight: 0.20, weightedScore: avoidanceScore * 0.20, description: 'Ability to detect and avoid potential collisions' },
    { name: 'Deorbit Plan', score: deorbitScore, weight: 0.20, weightedScore: deorbitScore * 0.20, description: 'Quality and reliability of the disposal strategy' },
    { name: 'Orbital Regime', score: regimeScore, weight: 0.15, weightedScore: regimeScore * 0.15, description: 'Risk level of the chosen orbital altitude' },
    { name: 'Debris Generation', score: debrisScore, weight: 0.15, weightedScore: debrisScore * 0.15, description: 'Risk of creating new debris during or after mission' },
  ];

  const overallScore = Math.round(factors.reduce((sum, f) => sum + f.weightedScore, 0));

  return {
    overallScore,
    grade: getGrade(overallScore),
    factors,
    recommendations,
    orbitLifetimeYears: lifetime.lifetimeYears,
  };
}
