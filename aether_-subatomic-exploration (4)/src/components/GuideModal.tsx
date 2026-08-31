import { Atom, Compass, MousePointer, Sparkles, Volume2, X, Zap } from "lucide-react";

interface GuideModalProps {
  onClose: () => void;
}

export default function GuideModal({ onClose }: GuideModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in pointer-events-auto select-none">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl bg-neutral-950/95 border border-cyan-500/30 shadow-[0_0_60px_rgba(0,240,255,0.2)] flex flex-col gap-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Atom className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-wider text-white">
                AETHER: Subatomic Exploration
              </h2>
              <p className="text-xs text-cyan-300/70 uppercase tracking-widest font-mono">
                3D Hackathon Experience Guide
              </p>
            </div>
          </div>
          <button
            id="btn-close-guide"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative & Wonder Concept */}
        <div className="text-xs text-white/80 leading-relaxed space-y-2">
          <p>
            <strong className="text-cyan-300 font-semibold">The Vision:</strong> Most web apps calculate practical problems; <strong className="text-white">Aether focuses on creating wonder</strong>. Journey from probabilistic Schrödinger electron orbitals down into quark-gluon plasma and the sub-Planckian quantum foam at 1.616 × 10⁻³⁵ m.
          </p>
          <p className="text-white/60">
            Engineered with raw <strong>WebGL GLSL Shaders</strong> and <strong>Web Audio procedural synthesis</strong> to achieve a breathtaking 60 FPS cinematic aesthetic with almost zero memory footprint.
          </p>
        </div>

        {/* Interactive Controls Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex gap-3 items-start">
            <Zap className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white uppercase text-[11px] tracking-wider">Click & Hold</div>
              <div className="text-white/60 text-[11px] mt-0.5">Engage relativistic Warp Drive, expand FOV & accelerate harmonic audio.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex gap-3 items-start">
            <MousePointer className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white uppercase text-[11px] tracking-wider">Click / Tap Anywhere</div>
              <div className="text-white/60 text-[11px] mt-0.5">Emit spherical quantum resonance shockwaves with crystalline chime chords.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex gap-3 items-start">
            <Compass className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white uppercase text-[11px] tracking-wider">Mouse Parallax & Scroll</div>
              <div className="text-white/60 text-[11px] mt-0.5">Tilt magnetic field perspective or zoom from atomic scale to quantum foam.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex gap-3 items-start">
            <Sparkles className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white uppercase text-[11px] tracking-wider">Keys 1 – 6 / Spacebar</div>
              <div className="text-white/60 text-[11px] mt-0.5">Directly select quantum topologies or trigger center core singularities.</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-[10px] font-mono text-white/40">
            GPU-ACCELERATED PROCEDURAL PARTICLE SYSTEM
          </span>
          <button
            id="btn-dismiss-guide"
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
          >
            Enter Subatomic Realm
          </button>
        </div>
      </div>
    </div>
  );
}
