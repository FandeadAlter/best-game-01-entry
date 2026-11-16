import { PALETTE } from './config.js';

export function drawHud(ctx, state) {
  ctx.save();
  const grad = ctx.createLinearGradient(0,0,0,88); grad.addColorStop(0,'rgba(5,11,24,.92)'); grad.addColorStop(1,'rgba(5,11,24,.58)');
  ctx.fillStyle = grad; ctx.fillRect(0,0,1280,88);
  ctx.strokeStyle='rgba(255,220,169,.18)'; ctx.beginPath();ctx.moveTo(30,87);ctx.lineTo(1250,87);ctx.stroke();
  const text=(value,x,y,size=17,color=PALETTE.cream)=>{ctx.fillStyle=color;ctx.font=`${size}px Georgia`;ctx.textAlign='left';ctx.fillText(value,x,y);};
  const roman=['I','II','III','IV','V'][state.nightIndex] || 'V';
  text(`NIGHT ${roman}`,34,34,15,'#ffd98a'); text(state.night.name.toUpperCase(),34,59,13,'#a8bad0');
  text('SAVED',250,30,11,'#9fb4cb'); text(`${state.saved} / ${state.night.quota}`,250,59,25);
  text('SCORE',410,30,11,'#9fb4cb'); text(String(state.score).padStart(5,'0'),410,59,22);
  text(`COMBO  ×${Math.max(1,state.combo)}`,566,51,16,state.combo>1?'#ffd98a':'#a8bad0');
  for(let i=0;i<3;i++){
    const x=754+i*31; ctx.fillStyle=i<state.hearts?'#ff645a':'rgba(255,100,90,.2)';
    ctx.beginPath();ctx.moveTo(x,38);ctx.bezierCurveTo(x-11,29,x-20,42,x,57);ctx.bezierCurveTo(x+20,42,x+11,29,x,38);ctx.fill();
  }
  text('OIL',870,30,11,'#9fb4cb'); ctx.fillStyle='rgba(255,255,255,.13)';ctx.fillRect(870,42,180,12);
  const oil=ctx.createLinearGradient(870,42,1050,42);oil.addColorStop(0,'#ffc46b');oil.addColorStop(1,'#fff0bb');ctx.fillStyle=oil;ctx.fillRect(870,42,180*Math.max(0,state.oil),12);
  ctx.strokeStyle='rgba(255,231,193,.42)';ctx.strokeRect(870,42,180,12);text(`${Math.round(state.oil*100)}%`,1060,53,13);
  const horn=state.hornCooldown<=0?'READY':`${state.hornCooldown.toFixed(1)}s`;
  ctx.fillStyle=state.hornCooldown<=0?'#473924':'rgba(255,255,255,.08)';ctx.beginPath();ctx.roundRect(1142,20,106,43,5);ctx.fill();
  ctx.strokeStyle='rgba(255,220,169,.3)';ctx.stroke();text('H  HORN',1153,37,11,'#ffd98a');text(horn,1153,54,12);
  ctx.restore();
}

export function drawBanner(ctx, title, subtitle, progress = 1) {
  ctx.save();ctx.globalAlpha=progress;ctx.fillStyle='rgba(5,12,27,.74)';ctx.fillRect(380,103,520,61);
  ctx.strokeStyle='rgba(255,211,136,.37)';ctx.strokeRect(380,103,520,61);
  ctx.fillStyle='#ffe6b6';ctx.font='22px Georgia';ctx.textAlign='center';ctx.fillText(title,640,130);
  ctx.fillStyle='#b8cadb';ctx.font='13px system-ui';ctx.fillText(subtitle,640,151);ctx.restore();
}
