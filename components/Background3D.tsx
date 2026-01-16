"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, Suspense, useEffect } from "react";
import * as THREE from "three";

function TorusKnotMesh({ color = "#6366f1" }: { color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    // Slow drift rotation
    meshRef.current.rotation.x = time * 0.05;
    meshRef.current.rotation.y = time * 0.08;

    // Subtle cursor following
    const targetX = mouseRef.current.x * 0.5;
    const targetY = mouseRef.current.y * 0.5;

    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.02;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.02;
  });

  return (
    <mesh ref={meshRef} scale={viewport.width > 10 ? 2.5 : 1.8}>
      <torusKnotGeometry args={[1, 0.3, 128, 16, 2, 3]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.15} />
    </mesh>
  );
}

function GlowEffect({ color = "#8b5cf6" }: { color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = time * 0.03;
    meshRef.current.rotation.y = time * 0.05;

    // Pulsing scale
    const scale = 2.6 + Math.sin(time * 0.5) * 0.1;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 64, 8, 2, 3]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.05} />
    </mesh>
  );
}

import { useTheme } from "next-themes";

function Scene({
  primaryColor,
  accentColor,
}: {
  primaryColor?: string;
  accentColor?: string;
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <>
      <ambientLight intensity={isLight ? 1.5 : 0.5} />
      <pointLight position={[10, 10, 10]} intensity={isLight ? 2 : 1} />
      <TorusKnotMesh color={primaryColor} />
      <GlowEffect color={accentColor} />
    </>
  );
}

interface Background3DProps {
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
}

export default function Background3D({
  primaryColor = "#6366f1",
  accentColor = "#8b5cf6",
}: Background3DProps) {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none transition-colors duration-1000 bg-background">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene primaryColor={primaryColor} accentColor={accentColor} />
        </Suspense>
      </Canvas>

      {/* Gradient overlay for depth - using theme-aware background color */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, var(--background) 80%)`,
        }}
      />
    </div>
  );
}
