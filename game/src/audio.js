export function createAudio() {
  let context = null, muted = false, wave = null, waveGain = null;
  function ensure() {
    if (!context) {
      context = new AudioContext();
      const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
      const data = buffer.getChannelData(0); let seed = 17;
      for (let i = 0; i < data.length; i++) { seed = (seed * 16807) % 2147483647; data[i] = (seed / 1073741823 - 1) * .14; }
      wave = context.createBufferSource(); wave.buffer = buffer; wave.loop = true;
      const filter = context.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 220;
      waveGain = context.createGain(); waveGain.gain.value = .045;
      wave.connect(filter).connect(waveGain).connect(context.destination); wave.start();
    }
    if (context.state === 'suspended') context.resume();
  }
  function tone(frequency, duration, type = 'sine', volume = .12, endFrequency = frequency) {
    if (muted) return;
    ensure(); const now = context.currentTime;
    const oscillator = context.createOscillator(), gain = context.createGain();
    oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20,endFrequency), now + duration);
    gain.gain.setValueAtTime(volume, now); gain.gain.exponentialRampToValueAtTime(.001, now + duration);
    oscillator.connect(gain).connect(context.destination); oscillator.start(now); oscillator.stop(now + duration);
  }
  return {
    save() { tone(690,.65,'sine',.11,1120); tone(1050,.42,'triangle',.055,1450); },
    wreck() { tone(108,.8,'sawtooth',.16,52); },
    horn() { tone(78,1.25,'sine',.24,63); tone(117,1.15,'sine',.09,92); },
    dawn() { tone(440,1.2,'sine',.08,660); setTimeout(()=>tone(554,1.6,'sine',.07,830),240); },
    focus(on) { if (!muted && on) tone(230,.2,'triangle',.025,260); },
    mute() { muted=!muted; if (waveGain && context) waveGain.gain.setTargetAtTime(muted?0:.045,context.currentTime,.08); return muted; },
    get muted() { return muted; }
  };
}
