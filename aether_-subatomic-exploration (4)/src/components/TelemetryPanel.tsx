import { useEffect, useState } from "react";
import { getAudioEnergy } from "../lib/audio";
import { QuantumPreset } from "../types";

interface TelemetryPanelProps {
  preset: QuantumPreset;
  zoomDistance: number;
}

export default function TelemetryPanel({ preset, zoomDistance }: TelemetryPanelProps) {
  const [audioLevels, setAudioLevels] = useState({ low: 0, high: 0, average: 0 });
  const [coherence, setCoherence] = useState(99.4);
  const [entropy, setEntropy] = useState(0.042);

  useEffect(() => {
    const interval = setInterval(() => {
      const energy = getAudioEnergy();
      setAudioLevels(energy);
      setCoherence(+(98.5 + Math.random() * 1.4).toFixed(2));
      setEntropy(+(0.035 + energy.average * 0.08).toFixed(4));
    }, 80);

    return () => clearInterval(interval);
  }, []);

  // Calculate zoom scale order of magnitude
  const currentScale = (10 / zoomDistance).toFixed(2);

  return (
    <div className="hidden lg:flex flex-col gap-3 p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white/80 font-mono text-xs w-72 pointer-events-auto select-none shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="font-semibold tracking-wider text-cyan-300 uppercase">Telemetry</span>
        </div>
        <span className="text-[10px] text-white/40 tracking-widest">QUANTUM-v3.8</span>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="bg-white/5 p-2 rounded border border-white/5">
          <div className="text-white/40 text-[9px] uppercase tracking-wider">Spatial Scale</div>
          <div className="font-bold text-white text-xs mt-0.5">{preset.scaleMetric}</div>
        </div>
        <div className="bg-white/5 p-2 rounded border border-white/5">
          <div className="text-white/40 text-[9px] uppercase tracking-wider">Energy State</div>
          <div className="font-bold text-cyan-300 text-xs mt-0.5">{preset.energyLevel}</div>
        </div>
        <div className="bg-white/5 p-2 rounded border border-white/5">
          <div className="text-white/40 text-[9px] uppercase tracking-wider">Spin / Vector</div>
          <div className="font-bold text-purple-300 text-xs mt-0.5">{preset.spinQuantum}</div>
        </div>
        <div className="bg-white/5 p-2 rounded border border-white/5">
          <div className="text-white/40 text-[9px] uppercase tracking-wider">Coherence</div>
          <div className="font-bold text-emerald-400 text-xs mt-0.5">{coherence}%</div>
        </div>
      </div>

      {/* Scientific Formula Banner */}
      <div className="bg-black/60 px-2.5 py-1.5 rounded border border-white/5 text-[10px] text-center text-cyan-200/90 font-serif italic tracking-wide">
        {preset.formula}
      </div>

      {/* Audio & Waveform Frequency Spectrogram */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex justify-between text-[9px] text-white/50 uppercase tracking-wider">
          <span>Wave Resonance</span>
          <span>S: {entropy} J/K</span>
        </div>
        <div className="flex items-end gap-1 h-7 bg-white/5 px-2 py-1 rounded border border-white/5">
          {Array.from({ length: 16 }).map((_, i) => {
            const val = i < 6 
              ? Math.max(0.15, audioLevels.low * (1.2 - i * 0.1) + Math.random() * 0.1)
              : Math.max(0.1, audioLevels.high * (0.8 + Math.sin(i)) + Math.random() * 0.15);
            return (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-cyan-500 via-purple-500 to-pink-400 rounded-xs transition-all duration-75"
                style={{ height: `${Math.min(100, Math.max(15, val * 100))}%` }}
              />
            );
          })}
        </div>
      </div>

      {/* Dynamic Magnification */}
      <div className="flex justify-between text-[10px] text-white/40 border-t border-white/5 pt-2">
        <span>Focal Depth: {currentScale}×</span>
        <span className="text-cyan-400">16,000 PART</span>
      </div>
    </div>
  );
}
