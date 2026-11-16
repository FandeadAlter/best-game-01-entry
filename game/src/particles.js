export function createEffects(random) {
  return { items: [], random, shake: 0, flash: 0 };
}

export function burst(effects, x, y, color, count = 18) {
  for (let i = 0; i < count; i++) {
    const angle = effects.random() * Math.PI * 2, speed = 30 + effects.random() * 130;
    effects.items.push({ kind: 'spark', x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: .45 + effects.random() * .8, max: 1.25, color, size: 1 + effects.random() * 3 });
  }
}

export function floatText(effects, x, y, text, color = '#ffe2a4') {
  effects.items.push({ kind: 'text', x, y, text, vy: -28, life: 1.15, max: 1.15, color });
}

export function updateEffects(effects, dt) {
  effects.shake = Math.max(0, effects.shake - dt * 18);
  effects.flash = Math.max(0, effects.flash - dt * 1.8);
  effects.items = effects.items.filter(item => {
    item.life -= dt; item.x += (item.vx || 0) * dt; item.y += (item.vy || 0) * dt; item.vy = (item.vy || 0) + (item.kind === 'spark' ? 36 : 0) * dt;
    return item.life > 0;
  });
}

export function drawEffects(ctx, effects) {
  for (const item of effects.items) {
    ctx.globalAlpha = Math.max(0, item.life / item.max);
    if (item.kind === 'spark') {
      ctx.fillStyle = item.color; ctx.shadowColor = item.color; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = item.color; ctx.font = 'bold 22px Georgia'; ctx.textAlign = 'center'; ctx.fillText(item.text, item.x, item.y);
    }
  }
  ctx.globalAlpha = 1;
  if (effects.flash > 0) { ctx.fillStyle = `rgba(255,55,48,${effects.flash * .17})`; ctx.fillRect(0, 0, 1280, 720); }
}
