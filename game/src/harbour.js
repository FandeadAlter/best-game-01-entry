import { PALETTE } from './config.js';

export function drawHarbour(ctx, saved, time, dawn = false) {
  ctx.save();
  ctx.fillStyle = '#1a2938'; ctx.beginPath(); ctx.moveTo(380, 720); ctx.lineTo(480, 592); ctx.lineTo(670, 574); ctx.lineTo(735, 609); ctx.lineTo(760, 720); ctx.fill();
  ctx.fillStyle = '#26384a'; ctx.beginPath(); ctx.moveTo(760, 720); ctx.lineTo(827, 611); ctx.lineTo(1037, 603); ctx.lineTo(1158, 720); ctx.fill();
  ctx.strokeStyle = 'rgba(207,230,255,.55)'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(515, 646); ctx.quadraticCurveTo(660, 605, 806, 646); ctx.stroke();
  for (let i = 0; i < Math.min(saved, 9); i++) {
    const x = 558 + (i % 4) * 51, y = 647 + Math.floor(i / 4) * 25;
    ctx.fillStyle = '#202832'; ctx.beginPath(); ctx.moveTo(x - 18, y); ctx.lineTo(x + 18, y); ctx.lineTo(x + 22, y + 5); ctx.lineTo(x - 15, y + 6); ctx.fill();
    ctx.fillStyle = '#f2dbb5'; ctx.beginPath(); ctx.moveTo(x - 3, y); ctx.lineTo(x - 3, y - 19); ctx.lineTo(x + 9, y - 1); ctx.fill();
    ctx.fillStyle = dawn ? '#ffe4a2' : '#ffd98a'; ctx.globalAlpha = .7 + Math.sin(time * 4 + i) * .2; ctx.fillRect(x + 4, y + 2, 3, 3); ctx.globalAlpha = 1;
  }
  const lamps = [[508, 570], [1052, 578], [1112, 606]];
  for (const [x,y] of lamps) {
    ctx.fillStyle = '#ffd98a'; ctx.globalAlpha = .8 + Math.sin(time * 3 + x) * .1; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
    const g = ctx.createRadialGradient(x,y,1,x,y,38); g.addColorStop(0,'rgba(255,211,125,.22)'); g.addColorStop(1,'rgba(255,211,125,0)'); ctx.fillStyle=g;ctx.fillRect(x-38,y-38,76,76);
  }
  ctx.restore();
}

export function drawWhirlpools(ctx, pools, time) {
  for (const pool of pools) {
    ctx.save(); ctx.translate(pool.x, pool.y); ctx.rotate(time * .7);
    for (let r = 0; r < 4; r++) {
      ctx.strokeStyle = `rgba(105,178,205,${.34 - r * .055})`; ctx.lineWidth = 3 - r * .4;
      ctx.beginPath(); ctx.ellipse(0, 0, 23 + r * 11, 9 + r * 4, r * .45, .4, Math.PI * 1.8); ctx.stroke();
    }
    ctx.restore();
  }
}
