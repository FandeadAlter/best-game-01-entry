import { H, NIGHTS, PALETTE, TUNE, W } from './config.js';
import { createInput } from './input.js';
import { drawBeam, drawLighthouse, LIGHT } from './lighthouse.js';
import { drawSea } from './sea.js';
import { drawHarbour, drawWhirlpools } from './harbour.js';
import { drawShips, spawnShips, updateShips } from './ships.js';
import { createEffects, burst, drawEffects, floatText, updateEffects } from './particles.js';
import { drawBanner, drawHud } from './hud.js';
import { drawEnd, drawHowTo, drawPause, drawTitle, drawUpgrade } from './screens.js';
import { createAudio } from './audio.js';
import { applyShot, readyShot, shotConfig } from './shots.js';
import { mulberry32 } from './random.js';

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
const shot = shotConfig();
const random = shot?.random || mulberry32(20261116);
const audio = createAudio();
const effects = createEffects(random);
const upgrades = [
  { name:'Wide Lantern', description:'A broader, gentler beam', icon:'◉', kind:'wide' },
  { name:'Far-Reaching Lens', description:'Find ships beyond the fog', icon:'⌁', kind:'reach' },
  { name:'Deep Oil Flask', description:'Focus lasts much longer', icon:'♧', kind:'oil' }
];
const state = {
  mode:'title', nights:NIGHTS, nightIndex:0, night:NIGHTS[0], ships:[], saved:0, totalSaved:0,
  score:0, best:Number(localStorage.getItem('lampkeeper-best')||0), hearts:3, combo:0, oil:1,
  focus:false, aim:{x:770,y:340}, time:0, nightTime:0, hornCooldown:0, hornTimer:0, whirlpools:[],
  upgradeIndex:0, bonus:{wide:0,reach:0,oil:0}, howTo:false, banner:2.5, muted:false
};
state.ships=spawnShips(state.night,random);
const input=createInput(canvas,{
  horn:()=>useHorn(), mute:()=>{state.muted=audio.mute();},
  pause:()=>{if(state.mode==='play')state.mode='pause';else if(state.mode==='pause')state.mode='play';},
  restart:()=>{if(['win','loss'].includes(state.mode))restartGame();},
  confirm:()=>{if(state.mode==='title')startGame();else if(state.mode==='upgrade')chooseUpgrade(state.upgradeIndex);else if(state.mode==='pause')state.mode='play';},
  pointer:(x,y)=>handlePointer(x,y)
});

function startGame(){
  if(state.howTo){state.howTo=false;return;}
  state.mode='play';state.nightIndex=0;state.night=NIGHTS[0];state.hearts=3;state.saved=0;state.totalSaved=0;state.score=0;state.combo=0;state.oil=1;state.ships=spawnShips(state.night,random);state.nightTime=0;state.banner=2.5;
}
function restartGame(){
  state.mode='title';state.howTo=false;state.nightIndex=0;state.night=NIGHTS[0];state.hearts=3;state.saved=0;state.totalSaved=0;state.score=0;state.combo=0;state.oil=1;state.ships=spawnShips(state.night,random);state.whirlpools=[];
}
function useHorn(){
  if(state.mode!=='play'||state.hornCooldown>0)return;
  state.hornCooldown=TUNE.hornCooldown;state.hornTimer=2;audio.horn();
  for(let i=0;i<5;i++)effects.items.push({kind:'ring',x:LIGHT.x,y:LIGHT.y,life:.9,max:.9,color:'#ffd98a',radius:28+i*20});
}
function chooseUpgrade(index){
  const picked=upgrades[index];if(!picked)return;
  if(picked.kind==='wide')state.bonus.wide++;
  if(picked.kind==='reach')state.bonus.reach++;
  if(picked.kind==='oil')state.bonus.oil++;
  state.nightIndex++;state.night=NIGHTS[state.nightIndex];state.saved=0;state.combo=0;state.ships=spawnShips(state.night,random);state.nightTime=0;state.banner=2.4;state.mode='play';
}
function updateBest(){
  if(state.score>state.best){state.best=state.score;localStorage.setItem('lampkeeper-best',String(state.best));}
}
function finishNight(){
  if(state.nightIndex===NIGHTS.length-1){updateBest();state.mode='win';audio.dawn();}
  else {state.mode='upgrade';state.upgradeIndex=1;}
}
function handlePointer(x,y){
  if(state.mode==='title'){
    if(state.howTo){state.howTo=false;return;}
    if(y>548&&y<644&&x>320&&x<960){state.howTo=true;return;}
    startGame();
  }else if(state.mode==='upgrade'){
    if(y>250&&y<500){const index=Math.floor((x-246)/270);chooseUpgrade(Math.max(0,Math.min(2,index)));}
  }else if(state.mode==='win'||state.mode==='loss')restartGame();
  else if(state.mode==='pause')state.mode='play';
}
function update(dt){
  state.time+=dt;
  if(state.mode!=='play')return;
  state.nightTime+=dt;state.aim={x:input.x,y:input.y};state.focus=input.focus&&state.oil>0;
  if(state.focus)state.oil=Math.max(0,state.oil-dt*TUNE.focusDrain/100*(1-state.bonus.oil*.16));
  else state.oil=Math.min(1,state.oil+dt*TUNE.oilRegen/100*(1+state.bonus.oil*.12));
  state.hornCooldown=Math.max(0,state.hornCooldown-dt);state.hornTimer=Math.max(0,state.hornTimer-dt);state.banner=Math.max(0,state.banner-dt);
  const weather={...state.night,fog:state.night.fog,storm:state.night.storm};
  updateShips(state,dt,weather,state.aim,{
    warning:ship=>{ship.warningShown=true;},
    save:ship=>{state.saved++;state.totalSaved++;state.combo++;state.oil=Math.min(1,state.oil+.13);state.score+=Math.round((ship.type==='ghost'?300:ship.type==='galleon'?200:ship.type==='cutter'?150:100)*Math.min(5,state.combo));burst(effects,ship.x,ship.y,'#ffd98a',16);floatText(effects,ship.x,ship.y-18,`+${ship.type==='ghost'?300:ship.type==='galleon'?200:ship.type==='cutter'?150:100}`);audio.save();if(state.saved>=state.night.quota)finishNight();},
    wreck:ship=>{state.hearts--;state.combo=0;effects.shake=12;effects.flash=1;burst(effects,ship.x,ship.y,'#ff6c59',26);audio.wreck();if(state.hearts<=0){updateBest();state.mode='loss';}}
  });
  updateEffects(effects,dt);
  if(state.nightIndex>=3&&state.whirlpools.length===0&&state.nightTime>9){state.whirlpools=Array.from({length:state.nightIndex===4?2:1},(_,i)=>({x:760+i*195,y:470+i*25}));}
  for(const pool of state.whirlpools){for(const ship of state.ships){if(ship.alive&&!ship.saved&&!ship.wrecked){const d=Math.hypot(ship.x-pool.x,ship.y-pool.y);if(d<90){ship.vx+=(pool.x-ship.x)*dt*.12;ship.vy+=(pool.y-ship.y)*dt*.12;}}}}
  if(state.ships.every(ship=>ship.saved||ship.wrecked)&&state.saved<state.night.quota){updateBest();state.mode='loss';}
}
function draw(){
  const weather=state.mode==='win'?{fog:0,storm:0,dawn:true}:state.night;
  ctx.save();
  if(effects.shake>0){ctx.translate((random()-.5)*effects.shake,(random()-.5)*effects.shake);}
  drawSea(ctx,state.time,weather);
  if(state.mode==='win'){
    const dawn=ctx.createLinearGradient(0,280,0,460);dawn.addColorStop(0,'rgba(255,214,142,.12)');dawn.addColorStop(1,'rgba(255,174,121,.28)');ctx.fillStyle=dawn;ctx.fillRect(0,250,W,250);
  }
  drawBeam(ctx,state.aim,state.focus,state.oil,state.time,TUNE.beamLength+state.bonus.reach*70);
  drawHarbour(ctx,state.totalSaved,state.time,state.mode==='win');
  drawWhirlpools(ctx,state.whirlpools,state.time);
  drawShips(ctx,state.ships,state.time,state.night.fog);
  drawLighthouse(ctx,state.time);
  drawEffects(ctx,effects);
  if(state.mode==='play'||state.mode==='pause'){
    drawHud(ctx,state);
    if(state.banner>0)drawBanner(ctx,`NIGHT ${['I','II','III','IV','V'][state.nightIndex]} · ${state.night.name}`,`Save ${state.night.quota} ships before the harbour is lost`,Math.min(1,state.banner));
  }
  if(state.mode==='title')state.howTo?drawHowTo(ctx,state.time):drawTitle(ctx,state,state.time);
  if(state.mode==='upgrade')drawUpgrade(ctx,upgrades,state.upgradeIndex);
  if(state.mode==='pause')drawPause(ctx);
  if(state.mode==='win'||state.mode==='loss')drawEnd(ctx,state,state.mode==='win');
  ctx.restore();
}
function frame(now){
  if(!frame.last)frame.last=now;
  const dt=Math.min(.04,(now-frame.last)/1000);frame.last=now;
  update(dt);draw();
  if(shot&&!window.__shotReady){draw();readyShot();return;}
  requestAnimationFrame(frame);
}
function boot(){
  if(shot){
    applyShot(state,shot);
    if(shot.scene==='storm')state.night.fog=.26;
    if(shot.scene==='dawn')state.totalSaved=31;
  }
  requestAnimationFrame(frame);
}
boot();
