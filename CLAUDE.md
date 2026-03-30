# Upagraha

Space debris monitoring and regulatory compliance platform.

## Build & Run
```
npm install
npm run dev      # Dev server at localhost:5173
npm run build    # Production build
npm run preview  # Preview production build
```

## Architecture
- React + TypeScript + Vite
- TailwindCSS v4 (custom @theme in src/index.css)
- Three.js via @react-three/fiber for 3D globe
- Recharts for graphs
- jsPDF for PDF report generation
- satellite.js (installed, for future SGP4 propagation)

## Design System
- **Black and white only** — no colored accents
- Opacity-based hierarchy: white, white/60, white/40, white/30, white/20
- Borders: white/[0.06] default, white/[0.12] hover
- Buttons: white bg + black text (primary), white/[0.04] bg (secondary)
- Font: Inter (sans), JetBrains Mono (mono)

## Key Files
- `src/lib/orbital.ts` — Orbital mechanics calculations (lifetime, velocity, period)
- `src/lib/celestrak.ts` — CelesTrak API client (satellite catalog)
- `src/lib/deorbit.ts` — Deorbit strategy recommendation engine
- `src/lib/sustainability.ts` — Sustainability scoring algorithm
- `src/lib/pdfReport.ts` — PDF compliance report generator
- `src/lib/useSatelliteData.ts` — React hook for CelesTrak data with caching
- `src/components/EarthGlobe.tsx` — 3D Earth with orbital objects

## Data Sources
- CelesTrak (celestrak.org) — free, CORS-enabled, rate-limited to ~1 req/group/hour
- Cached in sessionStorage with 1hr TTL

## Important Notes
- All calculations use simplified models — disclaimers on every tool page
- The 3D globe uses procedural earth texture, not NASA imagery
- Conjunction events are simulated — future: ingest real CDMs from Space-Track.org
- No backend — everything runs client-side
