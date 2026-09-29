'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingTabCard({ position, color, title, label, delay = 0 }: { position: [number, number, number]; color: string; title: string; label: string; delay?: number }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() + delay;
    meshRef.current.position.y = position[1] + Math.sin(t * 1.2) * 0.15;
    meshRef.current.rotation.z = Math.cos(t * 0.8) * 0.04;
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Card Base */}
      <RoundedBox args={[1.6, 0.7, 0.08]} radius={0.06} smoothness={4}>
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.2}
          roughness={0.2}
          envMapIntensity={0.8}
        />
      </RoundedBox>

      {/* Top Accent Strip */}
      <mesh position={[0, 0.32, 0.045]}>
        <planeGeometry args={[1.5, 0.05]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Title Text */}
      <Text
        position={[-0.6, 0.08, 0.05]}
        fontSize={0.11}
        color="#f8fafc"
        anchorX="left"
        anchorY="middle"
      >
        {title}
      </Text>

      {/* Label Subtitle */}
      <Text
        position={[-0.6, -0.12, 0.05]}
        fontSize={0.08}
        color="#94a3b8"
        anchorX="left"
        anchorY="middle"
      >
        {label}
      </Text>

      {/* Save indicator dot */}
      <mesh position={[0.6, 0, 0.05]}>
        <circleGeometry args={[0.06, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function MainBrowserWindow({ mousePos }: { mousePos: React.MutableRefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    // Smooth lerp follow cursor pointer
    const targetX = mousePos.current.y * 0.18;
    const targetY = mousePos.current.x * 0.25;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);
  });

  return (
    <group ref={groupRef}>
      {/* Outer Glass Frame */}
      <RoundedBox args={[5.2, 3.4, 0.15]} radius={0.15} smoothness={4} position={[0, 0, 0]}>
        <meshPhysicalMaterial
          color="#0b0f19"
          transmission={0.6}
          opacity={0.9}
          transparent
          roughness={0.15}
          metalness={0.1}
          clearcoat={0.8}
          ior={1.2}
        />
      </RoundedBox>

      {/* Frame Border Glow */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[5.3, 3.5]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.15} />
      </mesh>

      {/* Browser Window Header Bar */}
      <mesh position={[0, 1.45, 0.08]}>
        <planeGeometry args={[5.0, 0.35]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} />
      </mesh>

      {/* Window Controls (Red, Yellow, Green dots) */}
      <mesh position={[-2.2, 1.45, 0.1]}>
        <circleGeometry args={[0.06, 16]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[-2.0, 1.45, 0.1]}>
        <circleGeometry args={[0.06, 16]} />
        <meshBasicMaterial color="#eab308" />
      </mesh>
      <mesh position={[-1.8, 1.45, 0.1]}>
        <circleGeometry args={[0.06, 16]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>

      {/* Address Bar */}
      <mesh position={[0, 1.45, 0.09]}>
        <planeGeometry args={[2.8, 0.2]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      <Text position={[0, 1.45, 0.11]} fontSize={0.09} color="#64748b" anchorX="center" anchorY="middle">
        workspace://project-formicx
      </Text>

      {/* Core Saved Central Badge */}
      <group position={[0, 0, 0.3]}>
        <RoundedBox args={[2.2, 0.9, 0.1]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color="#4f46e5" metalness={0.4} roughness={0.2} />
        </RoundedBox>
        <Text position={[0, 0.12, 0.06]} fontSize={0.16} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
          Workspace Saved
        </Text>
        <Text position={[0, -0.15, 0.06]} fontSize={0.1} color="#c7d2fe" anchorX="center" anchorY="middle">
          12 tabs · 3 groups · 0ms restore
        </Text>
      </group>

      {/* Floating Interactive Tab Cards Inside Scene */}
      <FloatingTabCard position={[-1.7, 0.6, 0.45]} color="#6366f1" title="Formicx API" label="Lambda Docs" delay={0} />
      <FloatingTabCard position={[1.7, 0.7, 0.55]} color="#a855f7" title="Quantum Paper" label="Arxiv Pre-print" delay={1.2} />
      <FloatingTabCard position={[-1.6, -0.7, 0.5]} color="#3b82f6" title="AWS Console" label="us-east-1" delay={2.4} />
      <FloatingTabCard position={[1.6, -0.6, 0.4]} color="#10b981" title="Project Notes" label="Markdown" delay={3.6} />

      {/* Subtle Background Glowing Distorted Sphere */}
      <mesh position={[0, 0, -1.2]}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <MeshDistortMaterial color="#4f46e5" speed={1.5} distort={0.3} radius={1} transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

export function WorkspaceScene() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check user reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (reducedMotion) {
    return (
      <div className="w-full h-[420px] rounded-3xl bg-slate-900/60 border border-slate-800 flex items-center justify-center p-8 text-center">
        <div className="max-w-md space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">3D</div>
          <h4 className="text-lg font-bold text-white">Interactive 3D Workspace Scene</h4>
          <p className="text-sm text-slate-400">Reduced motion mode enabled. 12 tabs, 3 groups, scroll positions preserved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[420px] md:h-[500px] rounded-3xl overflow-hidden border border-indigo-500/20 shadow-2xl shadow-indigo-950/40 bg-slate-950/60 backdrop-blur-xl">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} />
        <pointLight position={[-10, -10, -5]} color="#a855f7" intensity={1.5} />
        
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
          <MainBrowserWindow mousePos={mousePos} />
        </Float>
      </Canvas>
    </div>
  );
}
