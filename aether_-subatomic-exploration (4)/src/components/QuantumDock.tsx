import { Pause, Play } from "lucide-react";
import { QUANTUM_PRESETS } from "../data/presets";
import { triggerQuantumChime } from "../lib/audio";
import { QuantumStateId } from "../types";

interface QuantumDockProps {
  activeState: QuantumStateId;
  autoCycle: boolean;
  onSelectState: (state: QuantumStateId) => void;
  onToggleAutoCycle: () => void;
}

export default function QuantumDock({
  activeState,
  autoCycle,
  onSelectState,
  onToggleAutoCycle,
}: QuantumDockProps) {
  const states: QuantumStateId[] = [0, 1, 2, 3, 4, 5];

  const handleSelect = (id: QuantumStateId) => {
    triggerQuantumChime((id + 1) * 80);
    onSelectState(id);
  };

  return (
    <div className="w-full max-w-4xl mx-auto pointer-events-auto select-none">
      <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        {/* Auto Cycle Toggle Button */}
        <button
          id="btn-toggle-autocycle"
          onClick={onToggleAutoCycle}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
            autoCycle
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.25)]"
              : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5"
          }`}
          title={autoCycle ? "Pause automatic sequence" : "Resume automatic continuous sequence"}
        >
          {autoCycle ? (
            <>
              <Pause className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span className="hidden sm:inline">Auto</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-white/70 fill-white/70" />
              <span className="hidden sm:inline">Manual</span>
            </>
          )}
        </button>

        {/* State Selector Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 flex-1 overflow-x-auto no-scrollbar py-0.5 px-1">
          {states.map((id) => {
            const item = QUANTUM_PRESETS[id];
            const isActive = activeState === id;

            return (
              <button
                key={id}
                id={`btn-state-${id}`}
                onClick={() => handleSelect(id)}
                className={`relative flex-1 min-w-[70px] sm:min-w-[120px] px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-left transition-all duration-300 group border ${
                  isActive
                    ? "bg-gradient-to-br from-cyan-950/70 to-purple-950/70 border-cyan-400/60 shadow-[0_0_20px_rgba(0,240,255,0.2)] text-white scale-[1.02]"
                    : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 text-white/60 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold tracking-widest ${isActive ? "text-cyan-300" : "text-white/40"}`}>
                    0{id + 1}
                  </span>
                  <span className={`text-[10px] font-serif px-1.5 py-0.2 rounded ${isActive ? "bg-cyan-400/20 text-cyan-200" : "text-white/30"}`}>
                    {item.symbol}
                  </span>
                </div>

                <div className="mt-0.5 truncate">
                  <div className={`text-xs font-semibold tracking-wide truncate ${isActive ? "text-white" : "text-white/80"}`}>
                    {item.name}
                  </div>
                  <div className="hidden sm:block text-[9px] text-white/40 truncate tracking-tight">
                    {item.subtitle}
                  </div>
                </div>

                {/* Active Underline Glow */}
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
