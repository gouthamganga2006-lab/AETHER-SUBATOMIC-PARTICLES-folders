import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { COLOR_THEMES } from "../data/presets";
import { getAudioEnergy, initAudio, setWarpAudio, triggerQuantumChime } from "../lib/audio";
import { ColorThemeId, QuantumStateId } from "../types";

const COUNT = 16000; // Perfect balance of breathtaking density and 60fps on 2GB / Core 2 Duo

const vertexShader = `
uniform float uTime;
uniform float uState;
uniform float uWarp;
uniform float uAudioLow;
uniform float uAudioHigh;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uShockOrigin;
uniform float uShockTime;

attribute vec3 aParams; // x: radius, y: angle, z: speed
attribute vec3 aSeed;   // x: random phase, y: cluster id, z: height
varying vec3 vColor;
varying float vAlphaFactor;

void main() {
    float r = aParams.x;
    float angle = aParams.y;
    float speed = aParams.z;
    float seed = aSeed.x;
    float cluster = aSeed.y;

    // Time speed modulation with audio bass kick
    float t = uTime * (1.0 + uAudioLow * 0.4);

    // -------------------------------------------------------------
    // TOPOLOGY 0: HYDROGEN-1 ORBITAL (Schrödinger Probability Cloud)
    // -------------------------------------------------------------
    float orbitSpeed = speed * 1.5;
    float orbitalTilt = sin(angle * 2.0 + t * 0.2) * 0.4;
    vec3 state0 = vec3(
        cos(angle + t * orbitSpeed) * (r * 2.4 + sin(t + angle * 3.0) * 0.2),
        sin(angle + t * orbitSpeed) * (r * 2.4 + sin(t + angle * 3.0) * 0.2),
        (sin(angle * 4.0 + t * 0.8) + cos(seed * 6.28)) * (r * 0.7) + orbitalTilt
    );

    // -------------------------------------------------------------
    // TOPOLOGY 1: QUARK-GLUON PLASMA (3-body Triad Quark Nucleus)
    // -------------------------------------------------------------
    float triadAngle = cluster * (6.28318 / 3.0) + t * 1.2;
    vec3 quarkCenter = vec3(cos(triadAngle) * 0.6, sin(triadAngle) * 0.6, sin(t * 2.0 + cluster) * 0.3);
    float pulse = (0.2 + (r * 0.18)) + sin(t * 16.0 + seed * 6.28) * (0.05 + uAudioLow * 0.12);
    vec3 state1 = quarkCenter + vec3(
        cos(angle * 4.0 + t * 2.0) * sin(speed * 12.0) * pulse,
        sin(angle * 4.0 + t * 2.0) * sin(speed * 12.0) * pulse,
        cos(speed * 12.0) * pulse
    );

    // -------------------------------------------------------------
    // TOPOLOGY 2: QUANTUM SUPERPOSITION (Standing Wave Interference)
    // -------------------------------------------------------------
    float waveX = (seed - 0.5) * 6.0;
    float waveY = (fract(seed * 13.37) - 0.5) * 6.0;
    float interference = sin(waveX * 4.0 + t * 2.0) * cos(waveY * 4.0 + t * 1.5);
    vec3 state2 = vec3(
        waveX,
        waveY,
        interference * (0.6 + uAudioHigh * 0.5) + sin(t * 3.0 + angle) * 0.15
    );

    // -------------------------------------------------------------
    // TOPOLOGY 3: PAIR ANNIHILATION (Colliding Binary Vortices)
    // -------------------------------------------------------------
    float spiralSide = cluster > 1.5 ? 1.0 : -1.0;
    float spiralR = r * (0.8 + 0.4 * sin(t * 3.0));
    float spiralAngle = angle + spiralSide * (t * 4.0 + r * 2.0);
    vec3 vortexCenter = vec3(spiralSide * (0.9 * cos(t * 1.5)), spiralSide * (0.5 * sin(t * 1.5)), 0.0);
    vec3 state3 = vortexCenter + vec3(
        cos(spiralAngle) * spiralR,
        sin(spiralAngle) * spiralR,
        sin(spiralAngle * 3.0) * (spiralR * 0.5) + (seed - 0.5) * 0.6
    );

    // -------------------------------------------------------------
    // TOPOLOGY 4: PLANCK SINGULARITY (Hyperspace Wormhole Tunnel)
    // -------------------------------------------------------------
    float tunnelSpeed = speed * 30.0 + 15.0;
    float tunnelZ = mod(angle * 18.0 - t * tunnelSpeed, 45.0) - 22.5;
    float tunnelRadius = (r * 0.8 + 1.2) * (1.0 + (tunnelZ + 22.5) * 0.04);
    vec3 state4 = vec3(
        cos(angle * 6.0 + t * speed * 2.0) * tunnelRadius,
        sin(angle * 6.0 + t * speed * 2.0) * tunnelRadius,
        tunnelZ
    );

    // -------------------------------------------------------------
    // TOPOLOGY 5: HYPERSPACE SINGULARITY (Gravitational Warp Convergence)
    // -------------------------------------------------------------
    // Particles converge rapidly inward from wide cosmic space into a microscopic singularity core
    float warpCycle = fract(seed * 7.13 + t * (0.35 + speed * 0.8));
    float pinchZ = (1.0 - warpCycle) * 32.0 - 12.0; // flies from Z=+20 towards Z=-12
    float funnelRadius = pow(warpCycle, 2.2) * (r * 4.5 + 0.15);
    float vortexTwist = angle * 4.0 + (1.0 / (warpCycle + 0.08)) * 1.5 + t * 4.0;
    // High-frequency quantum jitter near the singularity core
    float coreJitter = (1.0 - warpCycle) * 0.08 * sin(t * 40.0 + angle * 12.0);
    vec3 state5 = vec3(
        cos(vortexTwist) * (funnelRadius + coreJitter),
        sin(vortexTwist) * (funnelRadius + coreJitter),
        pinchZ
    );

    // -------------------------------------------------------------
    // SMOOTH BLENDING BETWEEN 6 STATES
    // -------------------------------------------------------------
    float st = mod(uState, 6.0);
    float w0 = max(0.0, 1.0 - abs(st - 0.0));
    float w1 = max(0.0, 1.0 - abs(st - 1.0));
    float w2 = max(0.0, 1.0 - abs(st - 2.0));
    float w3 = max(0.0, 1.0 - abs(st - 3.0));
    float w4 = max(0.0, 1.0 - abs(st - 4.0));
    float w5 = max(0.0, 1.0 - abs(st - 5.0));
    // Wrap around 5 -> 0
    if (st > 5.0) {
        w0 = max(w0, st - 5.0);
        w5 = max(0.0, 1.0 - (st - 5.0));
    }

    vec3 pos = state0 * w0 + state1 * w1 + state2 * w2 + state3 * w3 + state4 * w4 + state5 * w5;

    // Organic drift
    pos.x += sin(t * 0.4 + aParams.y) * 0.15;
    pos.y += cos(t * 0.3 + aParams.x) * 0.15;

    // -------------------------------------------------------------
    // SHOCKWAVE DISPLACEMENT & EXCITATION
    // -------------------------------------------------------------
    float shockDist = length(pos - uShockOrigin);
    float shockPhase = uShockTime * 14.0 - shockDist * 4.0;
    float shockFactor = 0.0;
    if (uShockTime > 0.0 && uShockTime < 2.5) {
        float wave = sin(shockPhase);
        float envelope = exp(-shockDist * 0.35) * exp(-uShockTime * 1.6);
        shockFactor = clamp(wave * envelope, -1.0, 1.0);
        vec3 shockDir = shockDist > 0.001 ? normalize(pos - uShockOrigin) : vec3(0.0, 0.0, 1.0);
        pos += shockDir * (shockFactor * 0.85);
    }

    // -------------------------------------------------------------
    // WARP DRIVE HYPERSPACE STRETCH
    // -------------------------------------------------------------
    pos.z -= uWarp * (speed * 70.0 + r * 6.0);
    pos.x *= (1.0 - uWarp * 0.35);
    pos.y *= (1.0 - uWarp * 0.35);

    // -------------------------------------------------------------
    // DYNAMIC COLOR BLENDING
    // -------------------------------------------------------------
    float colorMixer = sin(t * 0.2 + seed * 6.28) * 0.5 + 0.5;
    vec3 baseCol = mix(uColorA, uColorB, colorMixer);
    if (cluster > 1.8) {
        baseCol = mix(baseCol, uColorC, 0.7);
    }

    // Brightness excitation during shockwave and high audio
    vec3 excitedCol = baseCol + vec3(abs(shockFactor) * 0.8) + vec3(uAudioHigh * 0.4);
    vColor = excitedCol;
    vAlphaFactor = 1.0 + abs(shockFactor) * 1.5 + uAudioLow * 0.6;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Perspective Point Size (Audio-reactive and Depth-scaled)
    float baseSize = (14.0 * r + 2.5) * (1.0 + uAudioHigh * 0.4 + abs(shockFactor) * 0.8);
    gl_PointSize = clamp(baseSize * (1.0 / -mvPosition.z) * (1.0 + uWarp * 0.6), 1.0, 64.0);
    gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
varying vec3 vColor;
varying float vAlphaFactor;

void main() {
    vec2 xy = gl_PointCoord.xy - vec2(0.5);
    float ll = length(xy);
    
    // Smooth radial glow
    float alpha = clamp(1.0 - (ll * 2.0), 0.0, 1.0);
    alpha = pow(alpha, 1.7) * vAlphaFactor;

    if (alpha < 0.015) discard;

    gl_FragColor = vec4(vColor, clamp(alpha, 0.0, 1.0));
}
`;

interface AtomicParticlesProps {
  activeState: QuantumStateId;
  colorTheme: ColorThemeId;
  autoCycle: boolean;
  onStateChange: (newState: QuantumStateId) => void;
}

export default function AtomicParticles({
  activeState,
  colorTheme,
  autoCycle,
  onStateChange,
}: AtomicParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { camera, raycaster, scene } = useThree();

  const timeRef = useRef(0);
  const stateInterpolatedRef = useRef<number>(activeState);
  const warpRef = useRef(0);
  const warpTargetRef = useRef(0);

  // Shockwave tracking
  const shockOriginRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const shockTimeRef = useRef<number>(999.0);

  // Setup interaction listeners
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      initAudio();
      
      // Calculate 3D position for shockwave origin
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const pointer = new THREE.Vector2(
        (clientX / window.innerWidth) * 2 - 1,
        -(clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(pointer, camera);
      const worldPos = raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(10));
      shockOriginRef.current.copy(worldPos);
      shockTimeRef.current = 0.0;

      triggerQuantumChime();
      setWarpAudio(true);
      warpTargetRef.current = 1.0;
    };

    const handlePointerUp = () => {
      setWarpAudio(false);
      warpTargetRef.current = 0.0;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        initAudio();
        shockOriginRef.current.set(0, 0, 0);
        shockTimeRef.current = 0.0;
        triggerQuantumChime(200);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [camera, raycaster]);

  // Buffer Geometry Attributes
  const { positions, params, seeds } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const prm = new Float32Array(COUNT * 3);
    const sed = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      pos[i3] = 0;
      pos[i3 + 1] = 0;
      pos[i3 + 2] = 0;

      // Params: x = radius, y = angle, z = speed
      prm[i3] = Math.random() * 2.2 + 0.4;
      prm[i3 + 1] = Math.random() * Math.PI * 2;
      prm[i3 + 2] = (Math.random() - 0.5) * 0.6;

      // Seeds: x = random phase, y = cluster id (0, 1, 2), z = random height
      sed[i3] = Math.random();
      sed[i3 + 1] = Math.floor(Math.random() * 3);
      sed[i3 + 2] = (Math.random() - 0.5) * 2;
    }

    return { positions: pos, params: prm, seeds: sed };
  }, []);

  const themeConfig = COLOR_THEMES[colorTheme];

  const uniforms = useMemo(() => {
    const colA = new THREE.Color(themeConfig.colorA);
    const colB = new THREE.Color(themeConfig.colorB);
    const colC = new THREE.Color(themeConfig.colorC);

    return {
      uTime: { value: 0 },
      uState: { value: activeState },
      uWarp: { value: 0 },
      uAudioLow: { value: 0 },
      uAudioHigh: { value: 0 },
      uColorA: { value: colA },
      uColorB: { value: colB },
      uColorC: { value: colC },
      uShockOrigin: { value: new THREE.Vector3(0, 0, 0) },
      uShockTime: { value: 999.0 },
    };
  }, []);

  // Update uniforms when theme changes
  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uColorA.value.set(themeConfig.colorA);
    materialRef.current.uniforms.uColorB.value.set(themeConfig.colorB);
    materialRef.current.uniforms.uColorC.value.set(themeConfig.colorC);
  }, [colorTheme, themeConfig]);

  useFrame((state, delta) => {
    if (!materialRef.current) return;
    const safeDelta = Math.min(delta, 0.1);

    // Audio reactivity
    const audioData = getAudioEnergy();

    // Smooth Warp Interpolation
    warpRef.current += (warpTargetRef.current - warpRef.current) * (safeDelta * 4.0);

    // Accumulate Time
    timeRef.current += safeDelta * (0.6 + warpRef.current * 3.2);

    // State Transition handling (Auto-cycle or Manual target)
    if (autoCycle) {
      // Loop smoothly through 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 0
      stateInterpolatedRef.current = (timeRef.current * 0.12) % 6.0;
      const currentInt = Math.floor(stateInterpolatedRef.current) as QuantumStateId;
      if (currentInt !== activeState) {
        onStateChange(currentInt);
      }
    } else {
      // Smoothly glide to the manually selected state
      let diff = activeState - stateInterpolatedRef.current;
      // Shortest angle wrap around
      if (diff > 3.0) diff -= 6.0;
      if (diff < -3.0) diff += 6.0;
      stateInterpolatedRef.current += diff * (safeDelta * 2.5);
      if (stateInterpolatedRef.current < 0) stateInterpolatedRef.current += 6.0;
      stateInterpolatedRef.current = stateInterpolatedRef.current % 6.0;
    }

    // Update shockwave timer
    if (shockTimeRef.current < 5.0) {
      shockTimeRef.current += safeDelta;
    }

    // Apply to uniforms
    materialRef.current.uniforms.uTime.value = timeRef.current;
    materialRef.current.uniforms.uState.value = stateInterpolatedRef.current;
    materialRef.current.uniforms.uWarp.value = warpRef.current;
    materialRef.current.uniforms.uAudioLow.value = audioData.low;
    materialRef.current.uniforms.uAudioHigh.value = audioData.high;
    materialRef.current.uniforms.uShockOrigin.value.copy(shockOriginRef.current);
    materialRef.current.uniforms.uShockTime.value = shockTimeRef.current;

    // FOV Stretching for warp
    const cam = state.camera as THREE.PerspectiveCamera;
    const targetFov = 58 + warpRef.current * 48;
    if (Math.abs(cam.fov - targetFov) > 0.1) {
      cam.fov = targetFov;
      cam.updateProjectionMatrix();
    }

    // Parallax mouse tilt
    const targetX = (state.pointer.x * Math.PI) / 7;
    const targetY = (state.pointer.y * Math.PI) / 7;
    if (pointsRef.current) {
      const parallaxStrength = 0.04 * (1.0 - warpRef.current * 0.75);
      pointsRef.current.rotation.y += (targetX - pointsRef.current.rotation.y) * parallaxStrength;
      pointsRef.current.rotation.x += (-targetY - pointsRef.current.rotation.x) * parallaxStrength;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aParams" count={COUNT} array={params} itemSize={3} />
        <bufferAttribute attach="attributes-aSeed" count={COUNT} array={seeds} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
