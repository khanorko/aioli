"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, ReactNode } from "react";

interface Scene3DProps {
  children: ReactNode;
}

export function Scene3D({ children }: Scene3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        {children}
      </Suspense>
      <ambientLight intensity={0.5} />
    </Canvas>
  );
}
