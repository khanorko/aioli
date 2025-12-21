"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleNetworkProps {
  count?: number;
  connectionDistance?: number;
  color?: string;
  mouseInfluence?: number;
}

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  size: number; // Varying sizes for more interesting look
  brightness: number; // Varying brightness
}

export function ParticleNetwork({
  count = 100,
  connectionDistance = 2.2,
  color = "#2D5BFF", // Plasma blue from design system
  mouseInfluence = 0.3,
}: ParticleNetworkProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const glowMeshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const { size, viewport } = useThree();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const actualCount = isMobile ? Math.floor(count * 0.5) : count;

  // Initialize particles with varying sizes
  const particles = useMemo(() => {
    const arr: Particle[] = [];
    const spread = isMobile ? 7 : 10;

    for (let i = 0; i < actualCount; i++) {
      // Some particles are "hub" nodes (larger) - reduced sizes for better readability
      const isHub = Math.random() < 0.12;
      const size = isHub ? 0.035 + Math.random() * 0.025 : 0.012 + Math.random() * 0.015;

      const position = new THREE.Vector3(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread * 0.7, // Slightly less vertical spread
        (Math.random() - 0.5) * 4
      );

      arr.push({
        position: position.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.004,
          (Math.random() - 0.5) * 0.004,
          (Math.random() - 0.5) * 0.002
        ),
        size,
        brightness: isHub ? 1 : 0.5 + Math.random() * 0.5,
      });
    }
    return arr;
  }, [actualCount, isMobile]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Line geometry for connections
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const maxConnections = actualCount * actualCount;
    const positions = new Float32Array(maxConnections * 6);
    const colors = new Float32Array(maxConnections * 6); // For gradient lines
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setDrawRange(0, 0);
    return geometry;
  }, [actualCount]);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: (e.clientX / size.width) * 2 - 1,
        y: -(e.clientY / size.height) * 2 + 1,
      };
    };

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [size, isMobile]);

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current || !glowMeshRef.current || !linesRef.current) return;

    const time = state.clock.elapsedTime;
    const positions = lineGeometry.attributes.position.array as Float32Array;
    const colors = lineGeometry.attributes.color.array as Float32Array;
    let lineIndex = 0;

    // Color for lines (plasma blue)
    const lineColor = new THREE.Color(color);

    particles.forEach((particle, i) => {
      // Gentle floating motion
      particle.position.x += particle.velocity.x;
      particle.position.y += particle.velocity.y;
      particle.position.z += Math.sin(time * 0.3 + i * 0.5) * 0.002;

      // Gentle pulsing for brightness
      const pulse = 0.8 + Math.sin(time * 2 + i) * 0.2;

      // Boundary wrap
      const boundaryX = isMobile ? 4 : 5.5;
      const boundaryY = isMobile ? 3.5 : 4;
      if (Math.abs(particle.position.x) > boundaryX) particle.velocity.x *= -1;
      if (Math.abs(particle.position.y) > boundaryY) particle.velocity.y *= -1;
      if (Math.abs(particle.position.z) > 2.5) particle.velocity.z *= -1;

      // Mouse influence (desktop only)
      if (!isMobile) {
        const mouseWorld = new THREE.Vector3(
          mousePosition.current.x * viewport.width * 0.5,
          mousePosition.current.y * viewport.height * 0.5,
          0
        );
        const dist = particle.position.distanceTo(mouseWorld);
        if (dist < 2.5) {
          const force = (2.5 - dist) * mouseInfluence * 0.008;
          const direction = new THREE.Vector3()
            .subVectors(particle.position, mouseWorld)
            .normalize();
          particle.position.add(direction.multiplyScalar(force));
        }
      }

      // Update main particle instance
      dummy.position.copy(particle.position);
      dummy.scale.setScalar(particle.size * pulse);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);

      // Update glow instance (larger, more diffuse for blur effect)
      dummy.scale.setScalar(particle.size * 5 * pulse);
      dummy.updateMatrix();
      glowMeshRef.current!.setMatrixAt(i, dummy.matrix);

      // Calculate connections
      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j];
        const dist = particle.position.distanceTo(other.position);

        if (dist < connectionDistance) {
          // Opacity based on distance (closer = more opaque)
          const alpha = 1 - dist / connectionDistance;

          positions[lineIndex * 6] = particle.position.x;
          positions[lineIndex * 6 + 1] = particle.position.y;
          positions[lineIndex * 6 + 2] = particle.position.z;
          positions[lineIndex * 6 + 3] = other.position.x;
          positions[lineIndex * 6 + 4] = other.position.y;
          positions[lineIndex * 6 + 5] = other.position.z;

          // Set colors with alpha falloff
          colors[lineIndex * 6] = lineColor.r * alpha;
          colors[lineIndex * 6 + 1] = lineColor.g * alpha;
          colors[lineIndex * 6 + 2] = lineColor.b * alpha;
          colors[lineIndex * 6 + 3] = lineColor.r * alpha;
          colors[lineIndex * 6 + 4] = lineColor.g * alpha;
          colors[lineIndex * 6 + 5] = lineColor.b * alpha;

          lineIndex++;
        }
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    glowMeshRef.current.instanceMatrix.needsUpdate = true;
    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;
    lineGeometry.setDrawRange(0, lineIndex * 2);
  });

  return (
    <group>
      {/* Glow layer (behind particles) - softer, more diffuse */}
      <instancedMesh ref={glowMeshRef} args={[undefined, undefined, actualCount]}>
        <circleGeometry args={[1, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>

      {/* Main particle nodes - reduced opacity for readability */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, actualCount]}>
        <circleGeometry args={[1, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>

      {/* Connection lines - subtle */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
