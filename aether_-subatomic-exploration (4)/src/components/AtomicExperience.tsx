import { Canvas, useFrame } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { ColorThemeId, QuantumStateId } from "../types";
import AtomicParticles from "./AtomicParticles";

interface CameraRigProps {
  zoomDistance: number;
  cinematicOrbit: boolean;
}

function CameraRig({ zoomDistance, cinematicOrbit }: CameraRigProps) {
  const angleRef = useRef(0);
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.1);
    const camera = state.camera;

    if (cinematicOrbit) {
      angleRef.current += safeDelta * 0.25;
      const targetX = Math.sin(angleRef.current) * (zoomDistance * 0.5);
      const targetZ = Math.cos(angleRef.current) * zoomDistance;
      const targetY = Math.sin(angleRef.current * 0.7) * 1.5;
      camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), safeDelta * 2.5);
    } else {
      // Smoothly return angle to 0 for next activation
      angleRef.current += (0 - angleRef.current) * (safeDelta * 3.0);
      camera.position.lerp(new THREE.Vector3(0, 0, zoomDistance), safeDelta * 3.5);
    }

    // Always maintain center focus so particles never leave the field of view
    camera.lookAt(targetLookAt.current);
  });

  return null;
}

export interface ExperienceHandle {
  captureScreenshot: () => string | null;
}

interface AtomicExperienceProps {
  activeState: QuantumStateId;
  colorTheme: ColorThemeId;
  autoCycle: boolean;
  zoomDistance: number;
  cinematicOrbit: boolean;
  onStateChange: (newState: QuantumStateId) => void;
}

const AtomicExperience = forwardRef<ExperienceHandle, AtomicExperienceProps>(
  (
    {
      activeState,
      colorTheme,
      autoCycle,
      zoomDistance,
      cinematicOrbit,
      onStateChange,
    },
    ref
  ) => {
    const glRef = useRef<THREE.WebGLRenderer | null>(null);

    useImperativeHandle(ref, () => ({
      captureScreenshot: () => {
        if (!glRef.current) return null;
        try {
          return glRef.current.domElement.toDataURL("image/png");
        } catch {
          return null;
        }
      },
    }));

    return (
      <div className="absolute inset-0 bg-black overflow-hidden cursor-crosshair">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 58 }}
          dpr={Math.min(window.devicePixelRatio, 1.5)} // Keep max 1.5 DPR for low-spec performance
          gl={{
            preserveDrawingBuffer: true, // Required for screenshots
            antialias: false,
            alpha: false,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            glRef.current = gl;
          }}
        >
          <color attach="background" args={["#020005"]} />
          <CameraRig zoomDistance={zoomDistance} cinematicOrbit={cinematicOrbit} />
          <AtomicParticles
            activeState={activeState}
            colorTheme={colorTheme}
            autoCycle={autoCycle}
            onStateChange={onStateChange}
          />
        </Canvas>
      </div>
    );
  }
);

AtomicExperience.displayName = "AtomicExperience";

export default AtomicExperience;
