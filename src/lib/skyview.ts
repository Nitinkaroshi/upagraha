import * as satellite from 'satellite.js';
import type { TLEEntry } from './celestrak';

const radToDeg = (rad: number) => rad * 180 / Math.PI;
const degToRad = (deg: number) => deg * Math.PI / 180;

export interface Observer {
  latitude: number;  // degrees
  longitude: number; // degrees
  altitude: number;  // meters above sea level
}

export interface OverheadSatellite {
  noradId: number;
  name: string;
  elevation: number;   // degrees above horizon (0-90)
  azimuth: number;     // degrees from true north (0-360, clockwise)
  range: number;       // km from observer to satellite
  altitude: number;    // km above Earth surface
  satLat: number;      // subsatellite latitude
  satLon: number;      // subsatellite longitude
  visible: boolean;    // elevation > 10 degrees
}

/**
 * Request the user's location via the Geolocation API.
 * Returns null if the user denies or browser does not support it.
 */
export function getUserLocation(): Promise<Observer | null> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          altitude: pos.coords.altitude ?? 0,
        });
      },
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }
    );
  });
}

/**
 * Given a list of TLEs and an observer, find which satellites are currently
 * above the horizon (elevation > minElevation degrees).
 * Sorted by elevation descending (highest in sky first).
 */
export function computeOverhead(
  tles: TLEEntry[],
  observer: Observer,
  minElevationDeg: number = 0,
  now: Date = new Date()
): OverheadSatellite[] {
  const observerGd = {
    latitude: degToRad(observer.latitude),
    longitude: degToRad(observer.longitude),
    height: (observer.altitude || 0) / 1000, // km
  };

  const gmst = satellite.gstime(now);
  const results: OverheadSatellite[] = [];

  for (const tle of tles) {
    try {
      const satrec = satellite.twoline2satrec(tle.tle1, tle.tle2);
      const posVel = satellite.propagate(satrec, now);
      if (!posVel.position || typeof posVel.position === 'boolean') continue;

      const positionEci = posVel.position;
      const positionEcf = satellite.eciToEcf(positionEci, gmst);
      const lookAngles = satellite.ecfToLookAngles(observerGd, positionEcf);
      const positionGd = satellite.eciToGeodetic(positionEci, gmst);

      const elevationDeg = radToDeg(lookAngles.elevation);
      if (elevationDeg < minElevationDeg) continue;

      const azimuthDeg = radToDeg(lookAngles.azimuth);
      const satLatDeg = radToDeg(positionGd.latitude);
      const satLonDeg = radToDeg(positionGd.longitude);

      results.push({
        noradId: tle.noradId,
        name: tle.name,
        elevation: elevationDeg,
        azimuth: ((azimuthDeg % 360) + 360) % 360,
        range: lookAngles.rangeSat,
        altitude: positionGd.height,
        satLat: satLatDeg,
        satLon: ((satLonDeg + 540) % 360) - 180, // normalize to [-180, 180]
        visible: elevationDeg > 10,
      });
    } catch {
      // SGP4 can fail on malformed/decayed TLEs — skip silently
    }
  }

  return results.sort((a, b) => b.elevation - a.elevation);
}

/** Compass direction from azimuth in degrees */
export function azimuthToCompass(deg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round(deg / 22.5) % 16;
  return dirs[idx];
}
