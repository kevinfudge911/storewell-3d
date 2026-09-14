// One seamless 184-metre panorama, cropped at each observation window's
// position around the room. Keep the field mostly black and objects distant.
import { writeFileSync } from 'node:fs';

const width = 184 * 50, height = 12 * 50;
let seed = 9112026;
const random = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
};
const n = value => Number(value.toFixed(2));
const svg = body => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>\n`;
const save = (name, body) => writeFileSync(new URL(`../public/${name}`, import.meta.url), svg(body));
function stars(count, near = false) {
  return Array.from({length: count}, () => {
    const x = n(random() * width), y = n(random() * height);
    const r = n((near ? 1.1 : .5) + random() * (near ? 1.1 : .85));
    const opacity = n((near ? .45 : .22) + random() * .45);
    const color = random() > .9 ? '#e6d9bd' : '#d5e6f4';
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${opacity}"/>`;
  }).join('');
}
const definitions = `<defs>
  <radialGradient id="blue" cx="23%" cy="23%" r="82%"><stop stop-color="#829aaa"/><stop offset=".26" stop-color="#2d465b"/><stop offset=".62" stop-color="#080e19"/><stop offset="1" stop-color="#000104"/></radialGradient>
  <radialGradient id="amber" cx="22%" cy="25%" r="80%"><stop stop-color="#ab9572"/><stop offset=".24" stop-color="#504335"/><stop offset=".63" stop-color="#120f10"/><stop offset="1" stop-color="#000104"/></radialGradient>
  <radialGradient id="sun"><stop stop-color="#e8d4a3" stop-opacity=".3"/><stop offset=".2" stop-color="#a88950" stop-opacity=".12"/><stop offset="1" stop-color="#000104" stop-opacity="0"/></radialGradient>
</defs>`;
function planet(x, y, r, color, ring = false) {
  const rx = n(r * 1.85), ry = n(r * .43);
  const rings = ring ? `<ellipse rx="${rx}" ry="${ry}" fill="none" stroke="#9a8e78" stroke-width="2.4" opacity=".5"/>` : '';
  const frontRing = ring ? `<path d="M-${rx} 0 A${rx} ${ry} 0 0 0 ${rx} 0" fill="none" stroke="#aaa08a" stroke-width="2" opacity=".45"/>` : '';
  return `<g transform="translate(${x} ${y}) rotate(-24)">${rings}<circle r="${r}" fill="url(#${color})" stroke="#76818b" stroke-opacity=".13" stroke-width=".6"/>${frontRing}</g>`;
}
save('bridge-deep-space.svg', `${definitions}<path fill="#000104" d="M0 0H${width}V${height}H0Z"/>${stars(1100)}
  ${planet(245, 294, 25, 'blue')}${planet(1925, 235, 18, 'amber', true)}
  ${planet(3290, 195, 16, 'amber')}${planet(5335, 300, 22, 'blue')}
  ${planet(6460, 165, 10, 'amber')}${planet(8270, 255, 17, 'blue', true)}
  <g transform="translate(4220 315)"><circle r="22" fill="url(#sun)"/><circle r="2.2" fill="#e0d0a6"/><circle cx="13" cy="-3" r=".8" fill="#a2a9b5"/><circle cx="-23" cy="5" r="1.4" fill="#716454"/></g>
  <g transform="translate(7590 390)"><circle r="16" fill="url(#sun)"/><circle r="1.7" fill="#d6d5cc"/><circle cx="9" cy="3" r="1" fill="#bb9b75"/></g>`);
save('bridge-near-stars.svg', stars(155, true));
// Explicit user-space coordinates keep a horizontal stroke's zero-height
// bounding box from suppressing its gradient in browser SVG renderers.
save('bridge-space-meteors.svg', `<defs><linearGradient id="trail" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="76" y2="0"><stop stop-color="#b2cbe5" stop-opacity="0"/><stop offset=".9" stop-color="#b2cbe5" stop-opacity=".55"/><stop offset="1" stop-color="#f1f5fa" stop-opacity=".9"/></linearGradient></defs>
  ${[[145, 200], [4035, 360], [7180, 215]].map(([x,y]) => `<g transform="translate(${x} ${y}) rotate(-17)"><path d="M0 0H76" stroke="url(#trail)" stroke-width="2"/><circle cx="76" r="1.6" fill="#dce9f5"/></g>`).join('')}`);
console.log('Built the continuous dark-space panorama.');
