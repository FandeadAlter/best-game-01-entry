export const W = 1280;
export const H = 720;
export const PALETTE = {
  sky: '#070d1d', sea: '#0b1e3a', sea2: '#12294d', foam: '#cfe6ff',
  amber: '#ffc46b', orange: '#ff9d2e', cream: '#fff1d5', muted: '#a6bbd2',
  red: '#ff5a4e', dawn: '#ffd98a', rose: '#ff9d7a', rock: '#17243a'
};
export const NIGHTS = [
  { name: 'First Light', count: 6, quota: 4, fog: .08, current: .12, storm: 0, types: ['sloop'] },
  { name: 'Cross-current', count: 8, quota: 5, fog: .13, current: .48, storm: 0, types: ['sloop', 'cutter'] },
  { name: 'Fog Bank', count: 10, quota: 6, fog: .48, current: .16, storm: 0, types: ['sloop', 'cutter', 'galleon', 'ghost'] },
  { name: 'Storm', count: 12, quota: 7, fog: .26, current: .32, storm: .8, types: ['sloop', 'cutter', 'galleon'] },
  { name: 'The Long Night', count: 14, quota: 8, fog: .38, current: .5, storm: .65, types: ['sloop', 'cutter', 'galleon', 'ghost'] }
];
export const SHIPS = {
  sloop: { speed: 28, score: 100, color: '#e8dfc9', scale: 1 },
  cutter: { speed: 43, score: 150, color: '#f0d8b2', scale: .86 },
  galleon: { speed: 20, score: 200, color: '#d5c7a8', scale: 1.28 },
  ghost: { speed: 35, score: 300, color: '#bce8f2', scale: .95 }
};
export const TUNE = { beamLength: 620, beamWidth: .29, focusWidth: .17, focusDrain: 5.5, oilRegen: .8, shipInterval: 3.3, hornCooldown: 8, hornRadius: 310 };
