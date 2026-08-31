import { Atom, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { QUANTUM_PRESETS } from "../data/presets";
import { ColorThemeId, QuantumStateId } from "../types";
import ControlPanel from "./ControlPanel";
import GuideModal from "./GuideModal";
import HoloCardModal from "./HoloCardModal";
import QuantumDock from "./QuantumDock";
import TelemetryPanel from "./TelemetryPanel";

interface UIOverlayProps {
  activeState: QuantumStateId;
  colorTheme: ColorThemeId;
  autoCycle: boolean;
  zoomDistance: number;
  cinematicOrbit: boolean;
  onSelectState: (state: QuantumStateId) => void;
  onToggleAutoCycle: () => void;
  onChangeColorTheme: (theme: ColorThemeId) => void;
  onToggleCinematicOrbit: () => void;
  onZoomChange: (newZoom: number) => void;
  onCaptureSnapshot: () => string | null;
}

export default function UIOverlay({
  activeState,
  colorTheme,
  autoCycle,
  zoomDistance,
  cinematicOrbit,
  onSelectState,
  onToggleAutoCycle,
  onChangeColorTheme,
  onToggleCinematicOrbit,
  onZoomChange,
  onCaptureSnapshot,
}: UIOverlayProps) {
  const [warpActive, setWarpActive] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [holoSnapshot, setHoloSnapshot] = useState<string | null>(null);
  const [showHoloModal, setShowHoloModal] = useState(false);

  const preset = QUANTUM_PRESETS[activeState];

  // Track pointer hold for Warp state & initial dismissal
  useEffect(() => {
    const handleDown = () => {
      setWarpActive(true);
      setHasInteracted(true);
    };
    const handleUp = () => setWarpActive(false);

    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);

    return () => {
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
    };
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key >= "1" && e.key <= "6") {
        const stateIdx = (parseInt(e.key, 10) - 1) as QuantumStateId;
        onSelectState(stateIdx);
      } else if (e.key.toLowerCase() === "c") {
        onToggleCinematicOrbit();
      } else if (e.key.toLowerCase() === "a") {
        onToggleAutoCycle();
      } else if (e.key.toLowerCase() === "h") {
        handleCaptureHolo();
      } else if (e.key.toLowerCase() === "g" || e.key === "?") {
        setShowGuide(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSelectState, onToggleCinematicOrbit, onToggleAutoCycle]);

  const handleCaptureHolo = () => {
    const dataUrl = onCaptureSnapshot();
    if (dataUrl) {
      setHoloSnapshot(dataUrl);
      setShowHoloModal(true);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 sm:p-6 md:p-8 text-white select-none">
      {/* TOP BAR */}
      <header className="flex items-center justify-between gap-4">
        {/* Brand & State Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/15 shadow-xl flex items-center gap-2">
            <Atom className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold tracking-[0.25em] text-white leading-none">
                AETHER
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-cyan-300/80 font-mono mt-0.5">
                Subatomic Quantum Field
              </span>
            </div>
          </div>

          {/* Active Preset Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
            <span className="text-white/60">State:</span>
            <span className="font-bold text-cyan-300">{preset.name}</span>
          </div>
        </div>

        {/* Control Action Panel */}
        <ControlPanel
          colorTheme={colorTheme}
          onChangeColorTheme={onChangeColorTheme}
          cinematicOrbit={cinematicOrbit}
          onToggleCinematicOrbit={onToggleCinematicOrbit}
          zoomDistance={zoomDistance}
          onZoomChange={onZoomChange}
          onCaptureSnapshot={handleCaptureHolo}
          onOpenGuide={() => setShowGuide(true)}
        />
      </header>

      {/* MIDDLE WORKSPACE (Telemetry on Left, Prompt on Center) */}
      <div className="flex items-center justify-between my-auto relative">
        {/* Real-time Telemetry Panel */}
        <TelemetryPanel preset={preset} zoomDistance={zoomDistance} />

        {/* Initial First-Time Discovery Prompt */}
        {!hasInteracted && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none transition-all duration-700 bg-black/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-2xl">
            <div className="flex items-center justify-center gap-2 text-cyan-300 font-mono text-xs uppercase tracking-[0.3em] mb-1">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Interactive Quantum Sandbox</span>
            </div>
            <p className="text-sm md:text-base font-medium text-white tracking-wide">
              Click & Hold to engage <span className="text-cyan-400 font-bold">Warp Drive</span>
            </p>
            <p className="text-xs text-white/50 font-mono mt-1">
              Tap anywhere to emit resonant shockwaves • Scroll to zoom scale
            </p>
          </div>
        )}
      </div>

      {/* BOTTOM SECTION (Interactive Dock & Quick Status) */}
      <footer className="flex flex-col gap-3">
        <div className="flex justify-between items-center text-[10px] font-mono text-white/40 px-2">
          <div className="flex items-center gap-3">
            <span>
              STATUS: <span className={warpActive ? "text-cyan-300 font-bold animate-pulse" : "text-white/80"}>
                {warpActive ? "RELATIVISTIC WARP ENGAGED" : "COHERENT"}
              </span>
            </span>
            <span className="hidden md:inline">• Keys [1-6]: Morph States</span>
            <span className="hidden md:inline">• [Space]: Singularity Pulse</span>
          </div>

          <div className="text-right">
            <span>SCALE: <span className="text-cyan-300">{preset.scaleMetric}</span></span>
          </div>
        </div>

        {/* Bottom Quantum Dock */}
        <QuantumDock
          activeState={activeState}
          autoCycle={autoCycle}
          onSelectState={onSelectState}
          onToggleAutoCycle={onToggleAutoCycle}
        />
      </footer>

      {/* MODALS */}
      {showHoloModal && (
        <HoloCardModal
          imageSrc={holoSnapshot}
          preset={preset}
          colorTheme={colorTheme}
          onClose={() => setShowHoloModal(false)}
        />
      )}

      {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
    </div>
  );
}
