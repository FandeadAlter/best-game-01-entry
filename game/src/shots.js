import { hashSeed, mulberry32 } from './random.js';

export function shotConfig() {
  const params = new URLSearchParams(location.search);
  const scene = params.get('shot');
  if (!scene) return null;
  return { scene, seed: hashSeed(params.get('seed') || scene), random: mulberry32(hashSeed(params.get('seed') || scene)) };
}

export function applyShot(state, shot) {
  if (!shot) return;
  const { scene, random } = shot;
  state.mode = scene === 'title' ? 'title' : scene === 'dawn' ? 'win' : 'play';
  if (scene === 'play' || scene === 'storm') {
    state.nightIndex = scene === 'storm' ? 3 : 2;
    state.night = state.nights[state.nightIndex];
    state.saved = scene === 'storm' ? 3 : 4; state.score = 2650; state.combo = 3;
    state.hearts = scene === 'storm' ? 1 : 2; state.oil = .68;
    state.focus = true; state.aim = { x: 840, y: 500 };
    state.ships = state.ships.slice(0, 6);
    state.ships.forEach((ship,index)=>{ship.alive=true;ship.age=10;ship.x=scene==='storm'?690+index*57:600+index*80;ship.y=scene==='storm'?430+index*27:450+index*32;});
    state.whirlpools = scene === 'storm' ? [{x:881,y:485},{x:1030,y:525}] : [];
    state.hornTimer = scene === 'storm' ? 1.7 : 0;
  }
  if (scene === 'dawn') { state.score=5230;state.totalSaved=31;state.nightIndex=4;state.night=state.nights[4];state.saved=8;state.hearts=3; }
  state.time = 38 + random() * .01;
  state.shot = true;
}

export function readyShot() {
  window.__shotReady = true;
}
