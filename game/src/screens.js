import { PALETTE } from './config.js';

function centered(ctx, value, y, size, color = PALETTE.cream, weight = 'normal') {
  ctx.fillStyle=color;ctx.font=`${weight} ${size}px Georgia`;ctx.textAlign='center';ctx.fillText(value,640,y);
}

export function drawTitle(ctx, state, time) {
  ctx.save();ctx.fillStyle='rgba(3,8,18,.25)';ctx.fillRect(0,0,1280,720);
  centered(ctx,'LAMPKEEPER’S TIDE',158,49,'#ffe0a0');
  centered(ctx,'A light held against the dark',194,18,'#c3d0dc');
  ctx.strokeStyle='rgba(255,218,161,.35)';ctx.beginPath();ctx.moveTo(440,218);ctx.lineTo(840,218);ctx.stroke();
  centered(ctx,'Guide the lost ships home.',280,21);
  centered(ctx,'Move the mouse to turn the beam. Hold to focus.',319,15,'#c4d2df');
  centered(ctx,'H sounds the horn  ·  P pauses  ·  M mutes',347,14,'#9fb4cb');
  ctx.globalAlpha=.7+Math.sin(time*3)*.18;centered(ctx,'CLICK TO BEGIN THE NIGHT',436,19,'#ffd98a','bold');ctx.globalAlpha=1;
  centered(ctx,`BEST HARBOUR  ${String(state.best).padStart(5,'0')}`,500,13,'#a9bdd1');
  centered(ctx,'Five nights. One light. Bring them all home.',594,14,'#8298b2');
  centered(ctx,'HOW TO PLAY',626,13,'#ffd98a');ctx.restore();
}

export function drawHowTo(ctx, time) {
  ctx.save();ctx.fillStyle='rgba(4,9,20,.84)';ctx.fillRect(230,160,820,410);ctx.strokeStyle='rgba(255,211,136,.45)';ctx.strokeRect(230,160,820,410);
  centered(ctx,'KEEP THE LIGHT',220,28,'#ffe0a0');
  centered(ctx,'Ships follow the amber beam. Lead them toward the harbour mouth.',283,17);
  centered(ctx,'Stay with each ship as it nears the rocks.',321,16,'#c1d0df');
  centered(ctx,'Hold mouse or Space to focus: longer reach, faster oil use.',360,15,'#c1d0df');
  centered(ctx,'H steadies nearby ships with the foghorn. Cooldown: 8 seconds.',399,15,'#c1d0df');
  centered(ctx,"Save the night's quota of ships to see the dawn.",438,15,'#c1d0df');
  centered(ctx,'CLICK TO RETURN',516,15,'#ffd98a','bold');ctx.restore();
}

export function drawUpgrade(ctx, choices, selected) {
  ctx.save();ctx.fillStyle='rgba(4,9,20,.88)';ctx.fillRect(0,0,1280,720);
  centered(ctx,'THE TIDE TURNS',160,34,'#ffe0a0');centered(ctx,'Choose one keeper’s advantage',198,16,'#bdcddd');
  choices.forEach((choice,index)=>{
    const x=246+index*270;ctx.fillStyle=index===selected?'rgba(255,191,99,.17)':'rgba(255,255,255,.045)';ctx.fillRect(x,270,230,210);
    ctx.strokeStyle=index===selected?'#ffd98a':'rgba(255,255,255,.2)';ctx.lineWidth=index===selected?2:1;ctx.strokeRect(x,270,230,210);
    ctx.fillStyle='#ffd98a';ctx.font='36px Georgia';ctx.textAlign='center';ctx.fillText(choice.icon,x+115,332);
    ctx.fillStyle='#fff1d5';ctx.font='19px Georgia';ctx.fillText(choice.name,x+115,380);
    ctx.fillStyle='#b8c9d9';ctx.font='13px system-ui';ctx.fillText(choice.description,x+115,416);ctx.fillText('CLICK TO CHOOSE',x+115,456);
  });
  centered(ctx,'CLICK A BOON TO BEGIN THE NEXT NIGHT',546,13,'#9fb4cb');ctx.restore();
}

export function drawEnd(ctx, state, won) {
  ctx.save();ctx.fillStyle='rgba(5,11,22,.56)';ctx.fillRect(0,0,1280,720);
  centered(ctx,won?'DAWN BREAKS':'THE HARBOUR FALLS',180,38,won?'#ffe1a0':'#ff8b78');
  centered(ctx,won?'The tide is kept. The lights are yours.':'The last lantern fades into the rain.',226,17,'#d4dfeb');
  centered(ctx,`TOTAL SCORE  ${state.score}`,310,22,'#fff1d5');
  centered(ctx,`SHIPS BROUGHT HOME  ${state.totalSaved}`,348,16,'#c4d2df');
  centered(ctx,`BEST HARBOUR  ${String(state.best).padStart(5,'0')}`,382,14,'#a9bdd1');
  ctx.globalAlpha=.82+Math.sin(state.time*3)*.15;centered(ctx,'CLICK TO PLAY AGAIN  ·  R',475,18,'#ffd98a','bold');ctx.restore();
}

export function drawPause(ctx) {
  ctx.save();ctx.fillStyle='rgba(5,11,22,.72)';ctx.fillRect(0,0,1280,720);centered(ctx,'NIGHT PAUSED',310,36,'#ffe0a0');centered(ctx,'P / ESC TO RESUME',365,16,'#d1deeb');centered(ctx,'R TO RESTART',395,14,'#9fb4cb');ctx.restore();
}
