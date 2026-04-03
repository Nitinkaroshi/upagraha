import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import type { Mesh, Points } from 'three';
import * as THREE from 'three';
import { generateSampleObjects, orbitalPosition, type SpaceObject } from '@/lib/orbital';
import type { ParsedSatellite } from '@/lib/celestrak';

const EARTH_SCALE = 1;
const KM_TO_UNITS = EARTH_SCALE / 6371;

function Earth() {
  const meshRef = useRef<Mesh>(null);

  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Dark ocean with subtle gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#060610');
    grad.addColorStop(0.5, '#080812');
    grad.addColorStop(1, '#060610');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Landmasses - more detailed
    const continents = [
      // North America
      [{ x: 100, y: 80, w: 100, h: 50 }, { x: 110, y: 100, w: 70, h: 70 }, { x: 90, y: 90, w: 40, h: 30 }],
      // South America
      [{ x: 180, y: 210, w: 50, h: 90 }, { x: 175, y: 200, w: 40, h: 40 }],
      // Europe
      [{ x: 470, y: 70, w: 80, h: 40 }, { x: 460, y: 90, w: 30, h: 30 }],
      // Africa
      [{ x: 480, y: 150, w: 70, h: 120 }, { x: 490, y: 140, w: 50, h: 50 }],
      // Asia
      [{ x: 560, y: 60, w: 180, h: 100 }, { x: 620, y: 50, w: 100, h: 60 }, { x: 580, y: 120, w: 80, h: 50 }],
      // India
      [{ x: 620, y: 140, w: 40, h: 55 }],
      // Australia
      [{ x: 760, y: 270, w: 80, h: 60 }],
      // Antarctica hint
      [{ x: 0, y: 460, w: 1024, h: 52 }],
    ];

    continents.forEach((patches) => {
      patches.forEach((p) => {
        // Base land
        ctx.fillStyle = '#121218';
        ctx.beginPath();
        ctx.ellipse(p.x + p.w / 2, p.y + p.h / 2, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Texture detail
        for (let i = 0; i < 25; i++) {
          const bright = 0.02 + Math.random() * 0.05;
          ctx.fillStyle = `rgba(255, 255, 255, ${bright})`;
          ctx.beginPath();
          ctx.arc(p.x + Math.random() * p.w, p.y + Math.random() * p.h, 2 + Math.random() * 6, 0, Math.PI * 2);
          ctx.fill();
        }

        // City lights (tiny bright dots)
        for (let i = 0; i < 5; i++) {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.15 + Math.random() * 0.2})`;
          ctx.beginPath();
          ctx.arc(p.x + Math.random() * p.w, p.y + Math.random() * p.h, 0.5 + Math.random() * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 24; i++) {
      ctx.beginPath();
      ctx.moveTo((i * 1024) / 24, 0);
      ctx.lineTo((i * 1024) / 24, 512);
      ctx.stroke();
    }
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (i * 512) / 12);
      ctx.lineTo(1024, (i * 512) / 12);
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.04;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[EARTH_SCALE, 64, 64]} />
      <meshStandardMaterial map={earthTexture} roughness={0.85} metalness={0.05} />
    </mesh>
  );
}

function Atmosphere() {
  return (
    <>
      <mesh>
        <sphereGeometry args={[EARTH_SCALE * 1.008, 64, 64]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[EARTH_SCALE * 1.04, 64, 64]} />
        <meshStandardMaterial color="#aaccff" transparent opacity={0.015} side={THREE.BackSide} />
      </mesh>
    </>
  );
}

interface OrbitalObjectsProps {
  objects: SpaceObject[];
  onSelect?: (obj: SpaceObject | null) => void;
}

function OrbitalObjects({ objects, onSelect }: OrbitalObjectsProps) {
  const pointsRef = useRef<Points>(null);
  const timeRef = useRef(0);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(objects.length * 3);
    const col = new Float32Array(objects.length * 3);

    objects.forEach((obj, i) => {
      const [x, y, z] = orbitalPosition(obj.altitude, obj.inclination, obj.raan, 0, obj.meanAnomaly);
      pos[i * 3] = x * KM_TO_UNITS;
      pos[i * 3 + 1] = z * KM_TO_UNITS;
      pos[i * 3 + 2] = y * KM_TO_UNITS;

      if (obj.type === 'satellite') {
        col[i * 3] = 1; col[i * 3 + 1] = 1; col[i * 3 + 2] = 1;
      } else if (obj.type === 'debris') {
        col[i * 3] = 0.45; col[i * 3 + 1] = 0.45; col[i * 3 + 2] = 0.45;
      } else {
        col[i * 3] = 0.65; col[i * 3 + 1] = 0.65; col[i * 3 + 2] = 0.65;
      }
    });

    return { positions: pos, colors: col };
  }, [objects]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    timeRef.current += delta * 50;

    const posAttr = pointsRef.current.geometry.getAttribute('position');
    const posArray = posAttr.array as Float32Array;

    objects.forEach((obj, i) => {
      const [x, y, z] = orbitalPosition(obj.altitude, obj.inclination, obj.raan, timeRef.current, obj.meanAnomaly);
      posArray[i * 3] = x * KM_TO_UNITS;
      posArray[i * 3 + 1] = z * KM_TO_UNITS;
      posArray[i * 3 + 2] = y * KM_TO_UNITS;
    });

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.012} vertexColors transparent opacity={0.9} sizeAttenuation />
    </points>
  );
}

function OrbitRings() {
  return (
    <>
      {[400, 800, 2000].map((alt, i) => {
        const radius = (6371 + alt) * KM_TO_UNITS;
        return (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius - 0.001, radius + 0.001, 128]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.04} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </>
  );
}

/** Overlay showing live count */
function LiveCounter({ count, label }: { count: number; label: string }) {
  return (
    <Html position={[0, -1.6, 0]} center>
      <div className="text-center pointer-events-none select-none">
        <div className="text-white/60 text-xs font-mono tracking-wider">
          <span className="text-white font-bold">{count.toLocaleString()}</span> {label}
        </div>
      </div>
    </Html>
  );
}

interface SceneProps {
  satellites?: ParsedSatellite[];
  showCounter?: boolean;
}

function Scene({ satellites, showCounter }: SceneProps) {
  const { camera } = useThree();

  // Convert ParsedSatellite to SpaceObject format
  const objects: SpaceObject[] = useMemo(() => {
    if (satellites && satellites.length > 0) {
      return satellites.map((s) => ({
        id: s.id,
        name: s.name,
        type: s.type === 'unknown' ? 'satellite' as const : s.type,
        altitude: s.altitude,
        inclination: s.inclination,
        raan: s.raan,
        meanAnomaly: s.meanAnomaly,
        size: s.type === 'debris' ? 0.4 : 0.8,
      }));
    }
    return generateSampleObjects(800);
  }, [satellites]);

  useEffect(() => {
    camera.position.set(2.5, 1.5, 2.5);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-5, -3, -5]} intensity={0.15} color="#ffffff" />
      <Stars radius={100} depth={50} count={2500} factor={2} fade speed={0.3} />
      <Earth />
      <Atmosphere />
      <OrbitRings />
      <OrbitalObjects objects={objects} />
      {showCounter && <LiveCounter count={objects.length} label="objects tracked" />}
      <OrbitControls
        enablePan={false}
        minDistance={1.5}
        maxDistance={6}
        autoRotate
        autoRotateSpeed={0.3}
        enableDamping
      />
    </>
  );
}

interface EarthGlobeProps {
  className?: string;
  satellites?: ParsedSatellite[];
  showCounter?: boolean;
}

export default function EarthGlobe({ className = '', satellites, showCounter }: EarthGlobeProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ fov: 45, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene satellites={satellites} showCounter={showCounter} />
      </Canvas>
    </div>
  );
}
