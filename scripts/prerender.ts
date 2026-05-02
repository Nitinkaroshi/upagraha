/**
 * Post-build pre-render: writes per-route HTML files into dist/ with correct
 * <title>, <meta>, <link rel="canonical">, and JSON-LD baked in.
 *
 * Approach: copy the built dist/index.html for each route, then mutate the
 * head section. The React app still hydrates and runs as normal — the only
 * difference is what crawlers and social-media unfurlers see on first load.
 *
 * Run via: `npx tsx scripts/prerender.ts` after `vite build`.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROUTES, type RouteMeta } from './routes-meta.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const SOURCE_HTML = join(DIST, 'index.html');
const SITE = 'https://upagraha-ten.vercel.app';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildHead(route: RouteMeta): string {
  const url = `${SITE}${route.path === '/' ? '/' : route.path}`;
  const ogType = route.ogType ?? 'website';
  const ogImage = `${SITE}/og-default.svg`;
  const jsonLdTag = route.jsonLd
    ? `<script type="application/ld+json">${JSON.stringify(route.jsonLd).replace(/</g, '\\u003c')}</script>`
    : '';

  return [
    `<title>${escapeHtml(route.title)}</title>`,
    `<meta name="description" content="${escapeHtml(route.description)}" />`,
    `<meta name="author" content="Nitin Karoshi" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${escapeHtml(route.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(route.description)}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:site_name" content="Upagraha" />`,
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Upagraha — open-source space debris monitoring tools" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`,
    `<meta name="twitter:image" content="${ogImage}" />`,
    jsonLdTag,
  ].filter(Boolean).join('\n    ');
}

function rewriteHtml(template: string, route: RouteMeta): string {
  const newHead = buildHead(route);

  // Strip the current title + canonical + og:* + twitter:* + JSON-LD blocks.
  // We keep the org JSON-LD and other static head pieces (favicon, fonts, theme-color).
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>/g, '')
    .replace(/<meta[^>]+name=["']description["'][^>]*>/g, '')
    .replace(/<meta[^>]+property=["']og:[^"']+["'][^>]*>/g, '')
    .replace(/<meta[^>]+name=["']twitter:[^"']+["'][^>]*>/g, '')
    // Remove any pre-existing per-route JSON-LD (keep the org one which is in index.html)
    .replace(/<script type="application\/ld\+json">[^<]*"@type":\s*"(?:WebApplication|BlogPosting|Blog|AboutPage|WebSite|SoftwareApplication)"[\s\S]*?<\/script>/g, '');

  // Insert new head content right before </head>
  html = html.replace('</head>', `    ${newHead}\n  </head>`);
  return html;
}

function writeRoute(template: string, route: RouteMeta): string {
  const html = rewriteHtml(template, route);
  // For path '/', overwrite dist/index.html. For others, dist<path>/index.html
  const outDir = route.path === '/' ? DIST : join(DIST, route.path.replace(/^\//, ''));
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, 'index.html');
  writeFileSync(outFile, html, 'utf8');
  return outFile;
}

function main() {
  if (!existsSync(SOURCE_HTML)) {
    console.error(`✗ ${SOURCE_HTML} not found. Run "vite build" first.`);
    process.exit(1);
  }
  const template = readFileSync(SOURCE_HTML, 'utf8');

  console.log(`Pre-rendering ${ROUTES.length} routes…`);
  for (const route of ROUTES) {
    const out = writeRoute(template, route);
    console.log(`  ✓ ${route.path.padEnd(60)} → ${out.replace(ROOT + '\\', '').replace(ROOT + '/', '')}`);
  }
  console.log(`\nDone. Vercel will serve these static HTML files for the listed routes.`);
}

main();
