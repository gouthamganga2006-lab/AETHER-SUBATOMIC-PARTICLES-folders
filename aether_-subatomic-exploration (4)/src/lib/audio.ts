// Web Audio API procedural sound engine with real-time frequency analysis

let ctx: AudioContext | null = null;
let mainGain: GainNode | null = null;
let analyser: AnalyserNode | null = null;
let filter: BiquadFilterNode | null = null;
let osc1: OscillatorNode | null = null;
let osc2: OscillatorNode | null = null;
let oscSub: OscillatorNode | null = null;
let isInitialized = false;
let isMuted = false;
let currentPreset: 'drone' | 'shimmer' | 'silent' = 'drone';

const freqDataArray = new Uint8Array(64);

export const initAudio = () => {
  if (isInitialized && ctx) {
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    return;
  }
  isInitialized = true;

  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AudioCtx();

    // Analyser node for audio reactivity
    analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.8;

    // Master gain
    mainGain = ctx.createGain();
    mainGain.gain.value = isMuted ? 0 : 0.4;
    mainGain.connect(analyser);
    analyser.connect(ctx.destination);

    // Spatial delay loop
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.38;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.35;
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(mainGain);

    // Main resonant filter
    filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 220;
    filter.Q.value = 3.5;
    filter.connect(mainGain);
    filter.connect(delay);

    // Sub-bass oscillator (heartbeat / quantum pulse)
    oscSub = ctx.createOscillator();
    oscSub.type = 'sine';
    oscSub.frequency.value = 43.65; // Low F

    // Drone oscillator 1
    osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 65.41; // Low C

    // Drone oscillator 2 (harmonic fifth)
    osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = 98.0; // G

    // Slow LFO for filter breath
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 120;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const subGain = ctx.createGain();
    subGain.gain.value = 0.5;
    oscSub.connect(subGain);
    subGain.connect(filter);

    osc1.connect(filter);
    osc2.connect(filter);

    oscSub.start();
    osc1.start();
    osc2.start();
    lfo.start();
  } catch {
    // Graceful fallback if Web Audio is unsupported
  }
};

export const setWarpAudio = (active: boolean) => {
  if (!ctx || !filter || !osc1 || !osc2) return;
  const now = ctx.currentTime;

  if (active) {
    filter.frequency.setTargetAtTime(1400, now, 0.4);
    osc1.frequency.setTargetAtTime(130.8, now, 0.4);
    osc2.frequency.setTargetAtTime(196.0, now, 0.4);
  } else {
    filter.frequency.setTargetAtTime(220, now, 0.8);
    osc1.frequency.setTargetAtTime(65.41, now, 0.8);
    osc2.frequency.setTargetAtTime(98.0, now, 0.8);
  }
};

/**
 * Triggers a crystalline harmonic chime when the user clicks or triggers a quantum shockwave
 */
export const triggerQuantumChime = (freqOffset = 0) => {
  if (!ctx || isMuted) return;
  try {
    const now = ctx.currentTime;
    const chimeGain = ctx.createGain();
    chimeGain.gain.setValueAtTime(0.25, now);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
    chimeGain.connect(mainGain || ctx.destination);

    const baseFreqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Major triad)
    const baseFreq = baseFreqs[Math.floor(Math.random() * baseFreqs.length)] + freqOffset;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.3);

    osc.connect(chimeGain);
    osc.start(now);
    osc.stop(now + 1.9);
  } catch {
    // Ignore audio errors
  }
};

export const setSoundMode = (mode: 'drone' | 'shimmer' | 'silent') => {
  currentPreset = mode;
  if (!ctx || !mainGain || !filter) return;
  const now = ctx.currentTime;

  if (mode === 'silent') {
    mainGain.gain.setTargetAtTime(0, now, 0.3);
  } else if (mode === 'shimmer') {
    mainGain.gain.setTargetAtTime(0.35, now, 0.5);
    filter.type = 'bandpass';
    filter.frequency.setTargetAtTime(600, now, 0.5);
    filter.Q.setTargetAtTime(6.0, now, 0.5);
  } else {
    // drone
    mainGain.gain.setTargetAtTime(0.4, now, 0.5);
    filter.type = 'lowpass';
    filter.frequency.setTargetAtTime(220, now, 0.5);
    filter.Q.setTargetAtTime(3.5, now, 0.5);
  }
};

export const toggleMute = () => {
  isMuted = !isMuted;
  if (mainGain && ctx) {
    const target = isMuted ? 0 : 0.4;
    mainGain.gain.setTargetAtTime(target, ctx.currentTime, 0.2);
  }
  return isMuted;
};

export const getAudioEnergy = (): { low: number; high: number; average: number } => {
  if (!analyser || isMuted) return { low: 0, high: 0, average: 0 };
  analyser.getByteFrequencyData(freqDataArray);

  let lowSum = 0;
  let highSum = 0;
  let totalSum = 0;

  for (let i = 0; i < 8; i++) {
    lowSum += freqDataArray[i];
  }
  for (let i = 24; i < 48; i++) {
    highSum += freqDataArray[i];
  }
  for (let i = 0; i < 64; i++) {
    totalSum += freqDataArray[i];
  }

  return {
    low: lowSum / (8 * 255),
    high: highSum / (24 * 255),
    average: totalSum / (64 * 255),
  };
};
