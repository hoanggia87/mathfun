import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { resolve } from 'path';

const ASSETS = resolve(process.cwd(), 'assets');
mkdirSync(ASSETS, { recursive: true });

const FONT_STACK =
  "'SF Pro Rounded','SF Compact Rounded','.SF NS Rounded','Avenir Next Heavy','Arial Rounded MT Bold',sans-serif";

const C = {
  bg: '#3F4FE5',     // royal blue background
  white: '#FFFFFF',
  yellow: '#FFD83D',
  orange: '#FF8A2E',
  green: '#4ADE80',
  cyan: '#4DC9E6',
  magenta: '#D946EF',
  pink: '#EC5E9D',
};

function ch(x, y, t, color, fs, tilt = 0) {
  // Add stroke of same color to thicken strokes (libvips/librsvg often falls back
  // from 'SF Pro Rounded Heavy' to a lighter weight, so we fatten manually).
  const sw = fs * 0.09;
  // Rotate around the character's visual center (baseline is at y, so center ≈ y - 0.35·fs).
  const rotCy = y - fs * 0.35;
  const transform = tilt ? ` transform="rotate(${tilt} ${x} ${rotCy})"` : '';
  return `<text x="${x}" y="${y}" text-anchor="middle"${transform} font-family="${FONT_STACK}" font-weight="900" font-size="${fs}" fill="${color}" stroke="${color}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round" paint-order="stroke fill">${t}</text>`;
}

// Layout (2 rows):
//   Row 1: 1 2 3   (white, yellow, orange)
//   Row 2: + − × ÷ (green, cyan, magenta, orange)
function gridGroup(canvasSize, contentScale) {
  const cx = canvasSize / 2;
  const cy = canvasSize / 2;

  const fsBig = canvasSize * 0.36 * contentScale;
  const fsOp = canvasSize * 0.24 * contentScale;

  const lineH = fsBig * 0.95;
  const baselineOffset = fsBig * 0.35;

  const y1 = cy - lineH * 0.45 + baselineOffset;
  const y2 = cy + lineH * 0.55 + baselineOffset;

  const colN = canvasSize * 0.245 * contentScale;
  const colOp = canvasSize * 0.2 * contentScale;

  return [
    ch(cx - colN, y1, '1', C.white, fsBig),
    ch(cx, y1, '2', C.yellow, fsBig),
    ch(cx + colN, y1, '3', C.orange, fsBig),
    ch(cx - 1.5 * colOp, y2, '+', C.green, fsOp),
    ch(cx - 0.5 * colOp, y2, '−', C.cyan, fsOp),
    ch(cx + 0.5 * colOp, y2, '×', C.magenta, fsOp),
    ch(cx + 1.5 * colOp, y2, '÷', C.orange, fsOp),
  ].join('\n  ');
}

// ----- iOS / generic app icon -----
function iconSVG(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="glow" cx="30%" cy="25%" r="70%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect x="0" y="0" width="${size}" height="${size}" fill="${C.bg}"/>
  <rect x="0" y="0" width="${size}" height="${size}" fill="url(#glow)"/>
  ${gridGroup(size, 1)}
</svg>`;
}

// ----- Android adaptive icon foreground (transparent bg) -----
// Android crops ~33% per axis; keep content within inner ~66%.
function adaptiveIconSVG(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${gridGroup(size, 0.62)}
</svg>`;
}

// ----- Splash screen -----
function splashSVG(size) {
  const cx = size / 2;
  const cy = size / 2;
  const sq = size * 0.62;
  const sx = cx - sq / 2;
  const sy = cy - sq / 2;
  const radius = sq * 0.22;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#FFF8E1"/>
  <rect x="${sx}" y="${sy}" width="${sq}" height="${sq}" rx="${radius}" ry="${radius}" fill="${C.bg}"/>
  ${gridGroup(size, 0.62)}
</svg>`;
}

function faviconSVG(size) {
  return iconSVG(size);
}

async function render(svg, outPath, size) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outPath);
  console.log('✓', outPath);
}

await render(iconSVG(1024), `${ASSETS}/icon.png`, 1024);
await render(adaptiveIconSVG(1024), `${ASSETS}/adaptive-icon.png`, 1024);
await render(splashSVG(1242), `${ASSETS}/splash-icon.png`, 1242);
await render(faviconSVG(48), `${ASSETS}/favicon.png`, 48);

console.log('Done!');
