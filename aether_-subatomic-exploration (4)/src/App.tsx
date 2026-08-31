import { useCallback, useEffect, useRef, useState } from "react";
import AtomicExperience, { ExperienceHandle } from "./components/AtomicExperience";
import UIOverlay from "./components/UIOverlay";
import { ColorThemeId, QuantumStateId } from "./types";

export default function App() {
  const [activeState, setActiveState] = useState<QuantumStateId>(0);
  const [colorTheme, setColorTheme] = useState<ColorThemeId>("cyber");
  const [autoCycle, setAutoCycle] = useState(true);
  const [zoomDistance, setZoomDistance] = useState(10);
  const [cinematicOrbit, setCinematicOrbit] = useState(false);

  const experienceRef = useRef<ExperienceHandle>(null);

  // Wheel zoom handler
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Prevent default browser scrolling
      e.preventDefault();
      setZoomDistance((prev) => {
        const delta = e.deltaY * 0.015;
        return Math.min(22, Math.max(4.5, prev + delta));
      });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  const handleCaptureSnapshot = useCallback(() => {
    if (experienceRef.current) {
      return experienceRef.current.captureScreenshot();
    }
    return null;
  }, []);

  return (
    <main className="relative w-full h-screen bg-black overflow-hidden font-sans select-none">
      <AtomicExperience
        ref={experienceRef}
        activeState={activeState}
        colorTheme={colorTheme}
        autoCycle={autoCycle}
        zoomDistance={zoomDistance}
        cinematicOrbit={cinematicOrbit}
        onStateChange={setActiveState}
      />

      <UIOverlay
        activeState={activeState}
        colorTheme={colorTheme}
        autoCycle={autoCycle}
        zoomDistance={zoomDistance}
        cinematicOrbit={cinematicOrbit}
        onSelectState={(state) => {
          setAutoCycle(false);
          setActiveState(state);
        }}
        onToggleAutoCycle={() => setAutoCycle((prev) => !prev)}
        onChangeColorTheme={setColorTheme}
        onToggleCinematicOrbit={() => setCinematicOrbit((prev) => !prev)}
        onZoomChange={setZoomDistance}
        onCaptureSnapshot={handleCaptureSnapshot}
      />

      {/* Zero-performance-cost CSS visual enhancements */}
      <div className="lens-vignette" />
      <div className="film-grain" />
    </main>
  );
}
