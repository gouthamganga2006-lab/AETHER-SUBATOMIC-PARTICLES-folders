import { Download, Share2, Sparkles, X } from "lucide-react";
import { COLOR_THEMES } from "../data/presets";
import { ColorThemeId, QuantumPreset } from "../types";

interface HoloCardModalProps {
  imageSrc: string | null;
  preset: QuantumPreset;
  colorTheme: ColorThemeId;
  onClose: () => void;
}

export default function HoloCardModal({
  imageSrc,
  preset,
  colorTheme,
  onClose,
}: HoloCardModalProps) {
  const theme = COLOR_THEMES[colorTheme];

  const handleDownload = () => {
    if (!imageSrc) return;
    const a = document.createElement("a");
    a.href = imageSrc;
    a.download = `Aether-${preset.name.replace(/\s+/g, "_")}-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in pointer-events-auto select-none">
      <div className="relative w-full max-w-xl p-6 rounded-3xl bg-neutral-950/90 border border-cyan-500/40 shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col gap-5 overflow-hidden">
        {/* Ambient Top Glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-32 blur-3xl opacity-40 pointer-events-none rounded-full"
          style={{ backgroundColor: theme.colorA }}
        />

        {/* Header Bar */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
              Holographic Quantum Telemetry Card
            </span>
          </div>
          <button
            id="btn-close-holo-modal"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Canvas Preview Container */}
        <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black aspect-video flex items-center justify-center group shadow-inner">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Subatomic Render Snapshot"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-white/40 text-xs font-mono">Generating Render Matrix...</div>
          )}

          {/* Holographic HUD Overlay on Card */}
          <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/40 font-mono">
            <div className="flex justify-between items-start text-[10px] text-white/70">
              <div>
                <div className="font-bold text-white tracking-widest text-sm">{preset.name}</div>
                <div className="text-cyan-300">{preset.subtitle}</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-white/10 border border-white/20 text-white">
                {preset.symbol}
              </span>
            </div>

            <div className="flex justify-between items-end text-[9px] text-white/60 border-t border-white/10 pt-2">
              <div>
                <div>SCALE: <span className="text-white">{preset.scaleMetric}</span></div>
                <div>ENERGY: <span className="text-cyan-300">{preset.energyLevel}</span></div>
              </div>
              <div className="text-right">
                <div>THEME: <span className="text-pink-300 uppercase">{theme.name}</span></div>
                <div>AETHER-AI HACKATHON 2026</div>
              </div>
            </div>
          </div>
        </div>

        {/* Lore Description */}
        <div className="text-xs text-white/70 font-sans leading-relaxed bg-white/5 p-3.5 rounded-xl border border-white/5">
          <p className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider mb-1">
            Physical Topology:
          </p>
          {preset.description}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 z-10">
          <button
            id="btn-cancel-holo"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            Dismiss
          </button>
          <button
            id="btn-download-holo"
            onClick={handleDownload}
            disabled={!imageSrc}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG Card</span>
          </button>
        </div>
      </div>
    </div>
  );
}
