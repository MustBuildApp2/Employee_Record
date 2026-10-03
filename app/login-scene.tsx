"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, OrbitControls, RoundedBox, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import type { Group, Mesh, Points } from "three";

function OrbitCore() {
  const coreRef = useRef<Group>(null);
  const ringRef = useRef<Mesh>(null);
  const pointRef = useRef<Points>(null);

  useFrame((_, delta) => {
    if (coreRef.current) coreRef.current.rotation.y += delta * 0.18;
    if (ringRef.current) ringRef.current.rotation.z -= delta * 0.12;
    if (pointRef.current) pointRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group ref={coreRef} scale={1.05}>
      <mesh>
        <icosahedronGeometry args={[1.2, 3]} />
        <meshPhysicalMaterial color="#047857" roughness={0.16} metalness={0.55} clearcoat={1} clearcoatRoughness={0.12} />
      </mesh>
      <mesh scale={1.03}>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshBasicMaterial color="#6ee7b7" wireframe transparent opacity={0.36} />
      </mesh>
      <mesh scale={1.3}>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.12} />
      </mesh>
      <mesh ref={ringRef} rotation={[1.2, 0.3, 0.4]}>
        <torusGeometry args={[1.78, 0.025, 16, 100]} />
        <meshStandardMaterial color="#34d399" emissive="#059669" emissiveIntensity={0.7} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh rotation={[-0.85, 0.5, -0.25]}>
        <torusGeometry args={[1.58, 0.018, 12, 100]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0369a1" emissiveIntensity={0.65} metalness={0.8} roughness={0.25} />
      </mesh>
      <points ref={pointRef}>
        <sphereGeometry args={[1.52, 24, 16]} />
        <pointsMaterial color="#a7f3d0" size={0.025} transparent opacity={0.55} sizeAttenuation />
      </points>
      {[ 
        [-0.7, 0.6, 1.3],
        [0.8, -0.5, 1.2],
        [0.3, 0.9, 0.9],
        [-1, -0.5, 0.9],
      ].map((position, index) => (
        <mesh key={index} position={position as [number, number, number]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial color={index % 2 ? "#fbbf24" : "#34d399"} emissive={index % 2 ? "#f59e0b" : "#059669"} emissiveIntensity={1.2} />
        </mesh>
      ))}
    </group>
  );
}

function NetworkLines() {
  const points = [
    [-2.6, 1.45, -0.2],
    [-1.2, 0.7, 0.2],
    [0, 0, 0],
    [1.35, 0.9, -0.1],
    [2.55, 1.45, -0.4],
    [1.55, -1.1, 0.25],
    [0.2, -1.7, -0.1],
    [-1.5, -1.05, 0.1],
  ] as [number, number, number][];
  const links = [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [5, 6], [6, 7], [7, 2]];

  return (
    <group>
      {links.map(([from, to], index) => (
        <Line
          key={index}
          points={[points[from], points[to]]}
          color={index % 3 === 0 ? "#fbbf24" : "#10b981"}
          lineWidth={0.8}
          transparent
          opacity={0.25}
        />
      ))}
      {points.map((position, index) => (
        <mesh key={`node-${index}`} position={position} scale={index === 2 ? 1.4 : 1}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshBasicMaterial color={index % 3 === 0 ? "#fbbf24" : "#6ee7b7"} />
        </mesh>
      ))}
    </group>
  );
}

function CredentialCard({ position, rotation, accent }: {
  position: [number, number, number];
  rotation: [number, number, number];
  accent: string;
}) {
  return (
    <Float speed={1.2} rotationIntensity={0.18} floatIntensity={0.28}>
      <group position={position} rotation={rotation} scale={0.72}>
        <RoundedBox args={[1.55, 0.95, 0.07]} radius={0.07} smoothness={4}>
        <meshPhysicalMaterial color="#14263a" roughness={0.22} metalness={0.72} clearcoat={0.5} />
        </RoundedBox>
        <mesh position={[0, 0.35, 0.042]}>
          <planeGeometry args={[1.42, 0.12]} />
          <meshStandardMaterial color={accent} />
        </mesh>
        <mesh position={[-0.48, 0.04, 0.045]}>
          <circleGeometry args={[0.2, 24]} />
          <meshStandardMaterial color={accent} />
        </mesh>
        <mesh position={[0.22, 0.12, 0.045]}>
          <boxGeometry args={[0.55, 0.05, 0.01]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.14, 0, 0.045]}>
          <boxGeometry args={[0.7, 0.035, 0.01]} />
          <meshStandardMaterial color="#6ee7b7" />
        </mesh>
        <mesh position={[0.08, -0.1, 0.045]}>
          <boxGeometry args={[0.82, 0.03, 0.01]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      </group>
    </Float>
  );
}

export default function LoginScene() {
  return (
    <aside className="login-scene" aria-label="Interactive workforce network visualization">
      <div className="scene-panel-content">
        <div className="scene-visual" aria-hidden="true">
          <Canvas camera={{ position: [0, 0.25, 7.4], fov: 40 }} dpr={[1, 1.5]}>
            <color attach="background" args={["#0a1526"]} />
            <ambientLight intensity={1.45} />
            <directionalLight position={[4, 5, 4]} intensity={3.3} color="#fff8e7" />
            <pointLight position={[-3, -1, 3]} intensity={14} distance={9} color="#10b981" />
            <pointLight position={[3, 2, 1]} intensity={10} distance={7} color="#0ea5e9" />
            <Sparkles count={55} scale={8} size={1.8} speed={0.28} opacity={0.48} color="#6ee7b7" />
            <group position={[0, 0.15, 0]}>
              <NetworkLines />
              <OrbitCore />
              <CredentialCard position={[-2.35, 1.25, -0.1]} rotation={[0.12, 0.38, -0.08]} accent="#10b981" />
              <CredentialCard position={[2.35, 1.15, -0.3]} rotation={[-0.08, -0.4, 0.08]} accent="#f59e0b" />
              <CredentialCard position={[2.05, -1.45, 0.1]} rotation={[0.1, -0.28, -0.1]} accent="#0284c7" />
              <CredentialCard position={[-2.15, -1.35, -0.1]} rotation={[-0.08, 0.3, 0.08]} accent="#a78bfa" />
            </group>
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.18} minPolarAngle={1.05} maxPolarAngle={2.1} />
          </Canvas>
        </div>
      </div>
    </aside>
  );
}
