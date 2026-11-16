import { LIGHT } from './lighthouse.js';
import { PALETTE, SHIPS, W, H } from './config.js';

export function spawnShips(night, random) {
  return Array.from({ length: night.count }, (_, index) => {
    const type = night.types[Math.min(night.types.length - 1, Math.floor(random() * night.types.length))];
    return { id: index, type, x: 540 + random() * 650, y: 370 + random() * 180, vx: -4, vy: 0, alive: false, age: 0, saved: false, warned: false, seed: random() * 8 };
  });
}

function inBeam(ship, aim, focus, fog) {
  const dx = ship.x - LIGHT.x, dy = ship.y - LIGHT.y;
  const distance = Math.hypot(dx, dy);
  if (distance > 620 * (1 - fog * .38)) return false;
  const angle = Math.atan2(dy, dx), target = Math.atan2(aim.y - LIGHT.y, aim.x - LIGHT.x);
  let delta = Math.atan2(Math.sin(angle - target), Math.cos(angle - target));
  return Math.abs(delta) < (focus ? .18 : .31) - Math.min(.08, fog * .1);
}

export function updateShips(state, dt, weather, input, hooks) {
  for (const ship of state.ships) {
    if (ship.saved || ship.wrecked) continue;
    ship.age += dt;
    if (!ship.alive) {
      if (ship.age > ship.id * 1.35 + 1.6) { ship.alive = true; hooks.warning?.(ship); }
      continue;
    }
    const spec = SHIPS[ship.type];
    const toward = inBeam(ship, input, state.focus, weather.fog);
    const targetX = 540 + ship.id % 3 * 54;
    const targetY = 646;
    let steerX = (targetX - ship.x) / Math.max(140, Math.abs(targetX - ship.x) + Math.abs(targetY - ship.y));
    let steerY = (targetY - ship.y) / Math.max(140, Math.abs(targetX - ship.x) + Math.abs(targetY - ship.y));
    if (toward) {
      steerX += (input.x - ship.x) / 310;
      steerY += (input.y - ship.y) / 310;
    }
    if (state.hornTimer > 0) { steerX += (targetX - ship.x) / 90; steerY += (targetY - ship.y) / 90; }
    const gust = Math.sin(state.time * 4 + ship.seed) * weather.storm * 19;
    const speed = spec.speed * (toward ? 1.17 : .78);
    ship.vx += (steerX * speed + weather.current * 12 + gust * .18 - ship.vx) * Math.min(1, dt * (toward ? 2.9 : 1.1));
    ship.vy += (steerY * speed + gust - ship.vy) * Math.min(1, dt * 1.3);
    ship.x += ship.vx * dt; ship.y += ship.vy * dt;
    ship.x += Math.sin(state.time * 2 + ship.seed) * dt * 5;
    if (ship.x < 440 || ship.x > 1250 || ship.y > 705 || (ship.x < 410 && ship.y > 520)) {
      ship.wrecked = true; hooks.wreck?.(ship);
    } else if (ship.x > 470 && ship.x < 626 && ship.y > 612 && ship.y < 690) {
      ship.saved = true; hooks.save?.(ship);
    }
  }
}

export function drawShips(ctx, ships, time, fog = 0) {
  for (const ship of ships) {
    if (ship.saved || ship.wrecked) continue;
    if (!ship.alive) {
      const a = .35 + Math.sin(time * 5 + ship.seed) * .24;
      ctx.fillStyle = `rgba(255,220,151,${a})`; ctx.beginPath(); ctx.arc(ship.x, ship.y, 3, 0, Math.PI * 2); ctx.fill();
      continue;
    }
    const spec = SHIPS[ship.type], scale = spec.scale;
    const alpha = ship.type === 'ghost' ? .68 : Math.max(.35, 1 - fog * .52);
    ctx.save(); ctx.translate(ship.x, ship.y); ctx.rotate(Math.atan2(ship.vy, ship.vx) * .22); ctx.scale(scale, scale); ctx.globalAlpha = alpha;
    ctx.shadowColor = ship.type === 'ghost' ? '#9be7ed' : '#ffc46b'; ctx.shadowBlur = ship.type === 'ghost' ? 18 : 7;
    ctx.fillStyle = '#1b2430'; ctx.beginPath(); ctx.moveTo(-25, 0); ctx.lineTo(18, -2); ctx.lineTo(28, 4); ctx.lineTo(15, 10); ctx.lineTo(-19, 8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = ship.type === 'ghost' ? '#d6fbfa' : spec.color;
    ctx.beginPath(); ctx.moveTo(-5, -3); ctx.lineTo(-5, -34); ctx.lineTo(12, -4); ctx.fill();
    if (ship.type === 'cutter' || ship.type === 'galleon') { ctx.beginPath(); ctx.moveTo(-13, -3); ctx.lineTo(-13, -25); ctx.lineTo(-2, -4); ctx.fill(); }
    if (ship.type === 'galleon') { ctx.beginPath(); ctx.moveTo(8, -3); ctx.lineTo(8, -25); ctx.lineTo(21, -4); ctx.fill(); }
    ctx.fillStyle = '#ffd98a'; ctx.fillRect(1, 1, 3, 3);
    ctx.strokeStyle = 'rgba(218,237,251,.38)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(20, 10); ctx.lineTo(38, 14 + Math.sin(time * 5 + ship.seed) * 2); ctx.stroke();
    ctx.restore();
  }
}
