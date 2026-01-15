"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function TorusKnotMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  // Track mouse position
  if (typeof window !== "undefined") {
    window.addEventListener("mousemove", (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    });
  }

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    // Slow drift rotation
    meshRef.current.rotation.x = time * 0.05;
    meshRef.current.rotation.y = time * 0.08;

    // Subtle cursor following
    const targetX = mouseRef.current.x * 0.3;
    const targetY = mouseRef.current.y * 0.3;

    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.02;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.02;
  });

  return (
    <mesh ref={meshRef} scale={viewport.width > 10 ? 2.5 : 1.8}>
      <torusKnotGeometry args={[1, 0.3, 128, 16, 2, 3]} />
      <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.15} />
    </mesh>
  );
}

function GlowEffect() {
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
      <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.05} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <TorusKnotMesh />
      <GlowEffect />
    </>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
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
          <Scene />
        </Suspense>
      </Canvas>

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, #050505 70%)",
        }}
      />
    </div>
  );
}
