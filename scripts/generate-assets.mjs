import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const ASSETS = resolve(process.cwd(), 'assets');
mkdirSync(ASSETS, { recursive: true });

// ----- Helpers -----
function arc(cx, cy, r, a1, a2) {
  const p1 = polar(cx, cy, r, a1);
  const p2 = polar(cx, cy, r, a2);
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y} Z`;
}
function polar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// ----- Icon SVG -----
function iconSVG(size) {
  const cx = size / 2;
  const cy = size / 2;
  // Decorative confetti dots
  const dots = [
    { x: 0.18, y: 0.22, r: 0.045, c: '#FFD60A' },
    { x: 0.85, y: 0.18, r: 0.035, c: '#FFFFFF' },
    { x: 0.12, y: 0.78, r: 0.038, c: '#FFFFFF' },
    { x: 0.88, y: 0.82, r: 0.05, c: '#FFD60A' },
    { x: 0.78, y: 0.42, r: 0.025, c: '#FFFFFF' },
    { x: 0.22, y: 0.58, r: 0.028, c: '#FFD60A' },
  ]
    .map(
      (d) =>
        `<circle cx="${d.x * size}" cy="${d.y * size}" r="${d.r * size}" fill="${d.c}" opacity="0.85"/>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFA940"/>
      <stop offset="55%" stop-color="#FF8A00"/>
      <stop offset="100%" stop-color="#FF6B9D"/>
    </linearGradient>
    <radialGradient id="glow" cx="35%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect x="0" y="0" width="${size}" height="${size}" fill="url(#bg)"/>
  <rect x="0" y="0" width="${size}" height="${size}" fill="url(#glow)"/>
  ${dots}
  <text x="${cx}" y="${cy + size * 0.18}" text-anchor="middle"
        font-family="Arial Rounded MT Bold, Avenir Next Heavy, sans-serif"
        font-weight="900" font-size="${size * 0.55}" fill="#FFFFFF">
    1+1
  </text>
</svg>`;
}

// ----- Adaptive icon (Android) — foreground only, transparent bg -----
function adaptiveIconSVG(size) {
  const cx = size / 2;
  const cy = size / 2;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <text x="${cx}" y="${cy + size * 0.1}" text-anchor="middle"
        font-family="Arial Rounded MT Bold, Avenir Next Heavy, sans-serif"
        font-weight="900" font-size="${size * 0.34}" fill="#FFFFFF"
        stroke="#E07600" stroke-width="${size * 0.012}" paint-order="stroke">
    1+1
  </text>
</svg>`;
}

// ----- Splash SVG (just the logo on cream bg) -----
function splashSVG(size) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.32;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="circ" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFA940"/>
      <stop offset="100%" stop-color="#FF6B9D"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="#FFF8E1"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#circ)"/>
  <text x="${cx}" y="${cy + r * 0.25}" text-anchor="middle"
        font-family="Arial Rounded MT Bold, Avenir Next Heavy, sans-serif"
        font-weight="900" font-size="${r * 1.0}" fill="#FFFFFF">
    1+1
  </text>
</svg>`;
}

// ----- Favicon -----
function faviconSVG(size) {
  return iconSVG(size);
}

// ----- Render -----
async function render(svg, outPath, size) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outPath);
  console.log('✓', outPath);
}

await render(iconSVG(1024), `${ASSETS}/icon.png`, 1024);
await render(adaptiveIconSVG(1024), `${ASSETS}/adaptive-icon.png`, 1024);
await render(splashSVG(1242), `${ASSETS}/splash-icon.png`, 1242);
await render(faviconSVG(48), `${ASSETS}/favicon.png`, 48);

console.log('Done!');
