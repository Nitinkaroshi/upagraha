import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import type { Mesh, Points } from 'three';
import * as THREE from 'three';
import { generateSampleObjects, orbitalPosition, type SpaceObject } from '@/lib/orbital';

const EARTH_SCALE = 1;
const KM_TO_UNITS = EARTH_SCALE / 6371;

function Earth() {
  const meshRef = useRef<Mesh>(null);

  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Dark ocean
    ctx.fillStyle = '#080808';
    ctx.fillRect(0, 0, 512, 256);

    // White/light gray landmasses
    const landPatches = [
      { x: 60, y: 50, w: 80, h: 60 },
      { x: 100, y: 130, w: 40, h: 70 },
      { x: 240, y: 40, w: 50, h: 40 },
      { x: 250, y: 90, w: 50, h: 80 },
      { x: 300, y: 30, w: 120, h: 80 },
      { x: 390, y: 150, w: 50, h: 40 },
      { x: 320, y: 80, w: 25, h: 35 },
    ];

    landPatches.forEach((patch) => {
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.ellipse(patch.x + patch.w / 2, patch.y + patch.h / 2, patch.w / 2, patch.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < 15; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.02 + Math.random() * 0.04})`;
        ctx.beginPath();
        ctx.arc(patch.x + Math.random() * patch.w, patch.y + Math.random() * patch.h, 3 + Math.random() * 8, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo((i * 512) / 12, 0);
      ctx.lineTo((i * 512) / 12, 256);
      ctx.stroke();
    }
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (i * 256) / 6);
      ctx.lineTo(512, (i * 256) / 6);
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.05;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[EARTH_SCALE, 64, 64]} />
      <meshStandardMaterial map={earthTexture} roughness={0.9} metalness={0.05} />
    </mesh>
  );
}

function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[EARTH_SCALE * 1.012, 64, 64]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.04} side={THREE.BackSide} />
    </mesh>
  );
}

function OrbitalObjects({ objects }: { objects: SpaceObject[] }) {
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

      // Monochrome with subtle variation: satellites brighter, debris dimmer
      if (obj.type === 'satellite') {
        col[i * 3] = 0.9; col[i * 3 + 1] = 0.9; col[i * 3 + 2] = 0.95;
      } else if (obj.type === 'debris') {
        col[i * 3] = 0.5; col[i * 3 + 1] = 0.5; col[i * 3 + 2] = 0.5;
      } else {
        col[i * 3] = 0.7; col[i * 3 + 1] = 0.7; col[i * 3 + 2] = 0.7;
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
      <pointsMaterial size={0.012} vertexColors transparent opacity={0.85} sizeAttenuation />
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
            <meshBasicMaterial color="#ffffff" transparent opacity={0.06} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </>
  );
}

function Scene() {
  const objects = useMemo(() => generateSampleObjects(800), []);
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(2.5, 1.5, 2.5);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-5, -3, -5]} intensity={0.15} color="#ffffff" />
      <Stars radius={100} depth={50} count={2000} factor={2} fade speed={0.3} />
      <Earth />
      <Atmosphere />
      <OrbitRings />
      <OrbitalObjects objects={objects} />
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

export default function EarthGlobe({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ fov: 45, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
