import { PALETTE, W, H } from './config.js';

export function drawSea(ctx, time, weather) {
  const sky = ctx.createLinearGradient(0, 0, 0, H * .58);
  sky.addColorStop(0, weather.dawn ? '#3b3040' : PALETTE.sky);
  sky.addColorStop(1, weather.dawn ? '#c87966' : '#102545');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 88; i++) {
    const x = (i * 193.7 + (i % 4) * 31) % W;
    const y = 22 + ((i * 83) % 285);
    const pulse = .45 + Math.sin(time * 1.2 + i) * .22;
    ctx.globalAlpha = weather.dawn ? .22 : pulse;
    ctx.fillStyle = i % 7 === 0 ? '#ffe4ad' : '#d9eaff';
    ctx.fillRect(x, y, i % 9 === 0 ? 2 : 1, i % 9 === 0 ? 2 : 1);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = weather.dawn ? '#e8a078' : '#192a42';
  ctx.beginPath(); ctx.moveTo(0, 335); ctx.lineTo(260, 302); ctx.lineTo(430, 340); ctx.lineTo(660, 306); ctx.lineTo(820, 340); ctx.lineTo(1040, 300); ctx.lineTo(1280, 340); ctx.lineTo(1280, 405); ctx.lineTo(0, 405); ctx.fill();
  const water = ctx.createLinearGradient(0, 335, 0, H);
  water.addColorStop(0, weather.dawn ? '#37536a' : PALETTE.sea2);
  water.addColorStop(.38, PALETTE.sea);
  water.addColorStop(1, '#07172f');
  ctx.fillStyle = water; ctx.fillRect(0, 335, W, H - 335);
  for (let row = 0; row < 17; row++) {
    const y = 372 + row * 22;
    ctx.beginPath();
    for (let x = -10; x <= W + 10; x += 22) {
      const wave = Math.sin(x * .012 + time * (1.1 + row * .025) + row) * (2 + row * .08);
      if (x === -10) ctx.moveTo(x, y + wave); else ctx.lineTo(x, y + wave);
    }
    ctx.strokeStyle = `rgba(158,202,235,${.035 + row * .002})`;
    ctx.lineWidth = row % 4 === 0 ? 2 : 1;
    ctx.stroke();
  }
  if (weather.fog > 0) {
    for (let i = 0; i < 5; i++) {
      const x = ((time * (7 + i * 2) + i * 271) % 1500) - 100;
      const y = 340 + i * 61;
      const gradient = ctx.createRadialGradient(x, y, 8, x, y, 240 + i * 9);
      gradient.addColorStop(0, `rgba(170,195,215,${weather.fog * .13})`);
      gradient.addColorStop(1, 'rgba(170,195,215,0)');
      ctx.fillStyle = gradient; ctx.fillRect(x - 250, y - 70, 500, 140);
    }
  }
  if (weather.storm > 0) {
    ctx.strokeStyle = `rgba(190,216,239,${weather.storm * .28})`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 110; i++) {
      const x = (i * 127 + time * 170) % (W + 60) - 30;
      const y = (i * 71 + time * 290) % H;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 13, y + 30); ctx.stroke();
    }
  }
}
