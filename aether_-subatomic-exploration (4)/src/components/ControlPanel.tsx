import {
  Camera,
  Compass,
  Info,
  Maximize2,
  Minimize2,
  Palette,
  Volume2,
  VolumeX,
  Zap,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { useState } from "react";
import { COLOR_THEMES } from "../data/presets";
import { setSoundMode, toggleMute, triggerQuantumChime } from "../lib/audio";
import { ColorThemeId } from "../types";

interface ControlPanelProps {
  colorTheme: ColorThemeId;
  onChangeColorTheme: (theme: ColorThemeId) => void;
  cinematicOrbit: boolean;
  onToggleCinematicOrbit: () => void;
  zoomDistance: number;
  onZoomChange: (newZoom: number) => void;
  onCaptureSnapshot: () => void;
  onOpenGuide: () => void;
}

export default function ControlPanel({
  colorTheme,
  onChangeColorTheme,
  cinematicOrbit,
  onToggleCinematicOrbit,
  zoomDistance,
  onZoomChange,
  onCaptureSnapshot,
  onOpenGuide,
}: ControlPanelProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleMute = () => {
    const muted = toggleMute();
    setIsMuted(muted);
  };

  const handleZoom = (delta: number) => {
    const nextZoom = Math.min(22, Math.max(4, zoomDistance + delta));
    onZoomChange(nextZoom);
    triggerQuantumChime(50);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const themes = Object.values(COLOR_THEMES);

  return (
    <div className="flex items-center gap-2 pointer-events-auto select-none">
      {/* Theme Picker Dropdown Toggle */}
      <div className="relative">
        <button
          id="btn-theme-picker"
          onClick={() => setShowThemePicker(!showThemePicker)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/25 text-white/80 hover:text-white transition-all text-xs font-mono"
          title="Change Color Spectrum Theme"
        >
          <Palette className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline capitalize">{COLOR_THEMES[colorTheme].name}</span>
        </button>

        {showThemePicker && (
          <div className="absolute right-0 top-full mt-2 w-48 p-2 rounded-xl bg-black/85 backdrop-blur-xl border border-white/15 shadow-2xl z-50 flex flex-col gap-1">
            <div className="text-[10px] uppercase font-mono tracking-wider text-white/40 px-2 py-1">
              Quantum Spectrums
            </div>
            {themes.map((t) => (
              <button
                key={t.id}
                id={`btn-theme-${t.id}`}
                onClick={() => {
                  onChangeColorTheme(t.id);
                  setShowThemePicker(false);
                  triggerQuantumChime(150);
                }}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all text-left ${
                  colorTheme === t.id
                    ? "bg-white/15 text-white border border-white/20"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{t.name}</span>
                <div className="flex items-center gap-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: t.colorA }}
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: t.colorB }}
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cinematic Orbit Toggle */}
      <button
        id="btn-cinematic-orbit"
        onClick={onToggleCinematicOrbit}
        className={`p-2 rounded-xl backdrop-blur-md border transition-all text-xs ${
          cinematicOrbit
            ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.3)]"
            : "bg-black/40 hover:bg-black/60 border-white/10 hover:border-white/25 text-white/70 hover:text-white"
        }`}
        title={cinematicOrbit ? "Disable 360° Cinematic Orbit" : "Enable 360° Cinematic Camera Orbit"}
      >
        <Compass className={`w-4 h-4 ${cinematicOrbit ? "animate-spin" : ""}`} />
      </button>

      {/* Zoom Controls */}
      <div className="hidden sm:flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-0.5">
        <button
          id="btn-zoom-in"
          onClick={() => handleZoom(-2)}
          className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all"
          title="Zoom Into Nucleus"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <div className="w-[1px] h-3 bg-white/10 mx-0.5" />
        <button
          id="btn-zoom-out"
          onClick={() => handleZoom(2)}
          className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all"
          title="Zoom Out to Macro"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Audio Mute/Unmute */}
      <button
        id="btn-toggle-audio"
        onClick={handleToggleMute}
        className="p-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/25 text-white/70 hover:text-white transition-all text-xs"
        title={isMuted ? "Unmute Synthesizer" : "Mute Synthesizer"}
      >
        {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
      </button>

      {/* Capture Holo-Card Snapshot */}
      <button
        id="btn-capture-holo"
        onClick={onCaptureSnapshot}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-pink-600/30 to-purple-600/30 hover:from-pink-600/50 hover:to-purple-600/50 backdrop-blur-md border border-pink-500/40 hover:border-pink-400 text-white transition-all text-xs font-mono shadow-[0_0_15px_rgba(255,0,128,0.2)]"
        title="Capture High-Res Holographic Telemetry Card"
      >
        <Camera className="w-3.5 h-3.5 text-pink-300" />
        <span className="hidden sm:inline">Holo-Card</span>
      </button>

      {/* Guide Info */}
      <button
        id="btn-open-guide"
        onClick={onOpenGuide}
        className="p-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/25 text-white/70 hover:text-white transition-all"
        title="Show Interactive Guide & Physics Lore"
      >
        <Info className="w-4 h-4 text-cyan-300" />
      </button>

      {/* Fullscreen Toggle */}
      <button
        id="btn-fullscreen"
        onClick={handleToggleFullscreen}
        className="hidden md:flex p-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/25 text-white/70 hover:text-white transition-all"
        title="Toggle Fullscreen"
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
