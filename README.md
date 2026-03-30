# upagraha

**Safeguarding Space, Securing the Future.**

Open-source space debris monitoring and regulatory compliance platform for satellite operators.

## What is this?

Upagraha provides free tools for the space community:

- **Orbital Lifetime Calculator** — Estimate satellite deorbit time, check FCC 5-year rule and ESA 25-year guideline compliance
- **Live Satellite Tracker** — 3D visualization of objects in Earth orbit
- **Conjunction Risk Viewer** — Monitor close approach events and collision probabilities
- **Compliance Report Export** — Generate regulatory compliance documentation

## Tech Stack

- React + TypeScript
- Three.js (react-three-fiber) — 3D orbital visualization
- TailwindCSS v4 — Styling
- Recharts — Data visualization
- satellite.js — SGP4 orbit propagation
- CelesTrak API — Real satellite catalog data
- Vite — Build tool

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Data Sources

- [CelesTrak](https://celestrak.org) — Satellite catalog and TLE data
- [Space-Track.org](https://www.space-track.org) — US DoD conjunction data messages
- Atmospheric density model based on 1976 US Standard Atmosphere

## Disclaimer

This platform uses simplified models for estimation and educational purposes. **Do not use for operational collision avoidance or regulatory filings.** For official analysis, use NASA DAS or ESA DRAMA.

## License

MIT

## Contributing

Contributions welcome. Please open an issue first to discuss what you'd like to change.

---

Built by [Upagraha](https://www.upagraha.com)
