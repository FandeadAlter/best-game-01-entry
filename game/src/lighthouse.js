import { PALETTE, TUNE } from './config.js';

export const LIGHT = { x: 208, y: 399 };

export function drawBeam(ctx, aim, focus, oil, time, length = TUNE.beamLength) {
  const dx = aim.x - LIGHT.x;
  const dy = aim.y - LIGHT.y;
  const angle = Math.atan2(dy, dx);
  const reach = length * (.72 + oil * .28);
  const half = focus ? TUNE.focusWidth : TUNE.beamWidth;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const gradient = ctx.createLinearGradient(LIGHT.x, LIGHT.y, LIGHT.x + Math.cos(angle) * reach, LIGHT.y + Math.sin(angle) * reach);
  gradient.addColorStop(0, focus ? 'rgba(255,236,176,.58)' : 'rgba(255,208,129,.48)');
  gradient.addColorStop(.58, 'rgba(255,175,76,.18)');
  gradient.addColorStop(1, 'rgba(255,153,47,0)');
  ctx.fillStyle = gradient;
  ctx.beginPath(); ctx.moveTo(LIGHT.x, LIGHT.y);
  ctx.lineTo(LIGHT.x + Math.cos(angle - half) * reach, LIGHT.y + Math.sin(angle - half) * reach);
  ctx.arc(LIGHT.x, LIGHT.y, reach, angle - half, angle + half);
  ctx.closePath(); ctx.fill();
  ctx.shadowColor = '#ffc46b'; ctx.shadowBlur = focus ? 34 : 22;
  ctx.strokeStyle = `rgba(255,223,157,${focus ? .45 : .23})`; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(LIGHT.x, LIGHT.y);
  ctx.lineTo(LIGHT.x + Math.cos(angle - half) * reach, LIGHT.y + Math.sin(angle - half) * reach);
  ctx.moveTo(LIGHT.x, LIGHT.y);
  ctx.lineTo(LIGHT.x + Math.cos(angle + half) * reach, LIGHT.y + Math.sin(angle + half) * reach); ctx.stroke();
  ctx.restore();
}

export function drawLighthouse(ctx, time) {
  ctx.save();
  const glow = ctx.createRadialGradient(LIGHT.x, LIGHT.y, 2, LIGHT.x, LIGHT.y, 105);
  glow.addColorStop(0, 'rgba(255,211,129,.54)'); glow.addColorStop(1, 'rgba(255,180,83,0)');
  ctx.fillStyle = glow; ctx.fillRect(LIGHT.x - 110, LIGHT.y - 110, 220, 220);
  ctx.fillStyle = '#17253a'; ctx.beginPath(); ctx.moveTo(0, 548); ctx.lineTo(95, 465); ctx.lineTo(208, 438); ctx.lineTo(330, 469); ctx.lineTo(428, 538); ctx.lineTo(485, 720); ctx.lineTo(0, 720); ctx.fill();
  ctx.fillStyle = '#c7c8be'; ctx.beginPath(); ctx.moveTo(176, 405); ctx.lineTo(239, 405); ctx.lineTo(251, 545); ctx.lineTo(162, 545); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#b74e42'; ctx.beginPath(); ctx.moveTo(169, 455); ctx.lineTo(244, 455); ctx.lineTo(247, 486); ctx.lineTo(166, 486); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#a83f38'; ctx.beginPath(); ctx.moveTo(164, 534); ctx.lineTo(249, 534); ctx.lineTo(253, 550); ctx.lineTo(159, 550); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#d4d0c4'; ctx.fillRect(158, 396, 98, 13);
  ctx.fillStyle = '#273b50'; ctx.fillRect(173, 380, 69, 18);
  ctx.fillStyle = '#ffd98a'; ctx.fillRect(182, 366, 52, 14);
  ctx.fillStyle = '#f5c66e'; ctx.beginPath(); ctx.moveTo(174, 366); ctx.lineTo(242, 366); ctx.lineTo(236, 356); ctx.lineTo(181, 356); ctx.fill();
  ctx.fillStyle = '#fff2cd'; ctx.fillRect(191, 368, 35, 9);
  ctx.globalAlpha = .75 + Math.sin(time * 5) * .08;
  ctx.fillStyle = '#fff7d7'; ctx.beginPath(); ctx.arc(LIGHT.x, LIGHT.y, 7, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
