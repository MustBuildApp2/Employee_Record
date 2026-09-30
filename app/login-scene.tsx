"use client";

import { CalendarClock, ClipboardList, UsersRound } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import type { Group, Mesh } from "three";

function OrbitCore() {
  const coreRef = useRef<Group>(null);
  const ringRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (coreRef.current) coreRef.current.rotation.y += delta * 0.18;
    if (ringRef.current) ringRef.current.rotation.z -= delta * 0.12;
  });

  return (
    <group ref={coreRef} scale={0.72}>
      <mesh>
        <icosahedronGeometry args={[1.2, 3]} />
        <meshPhysicalMaterial color="#047857" roughness={0.2} metalness={0.4} clearcoat={1} />
      </mesh>
      <mesh scale={1.03}>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.28} />
      </mesh>
      <mesh ref={ringRef} rotation={[1.2, 0.3, 0.4]}>
        <torusGeometry args={[1.75, 0.03, 16, 100]} />
        <meshStandardMaterial color="#10b981" metalness={0.8} roughness={0.3} />
      </mesh>
      {[
        [-0.7, 0.6, 1.3],
        [0.8, -0.5, 1.2],
        [0.3, 0.9, 0.9],
      ].map((position, index) => (
        <mesh key={index} position={position as [number, number, number]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={index === 1 ? "#f59e0b" : "#10b981"} emissive="#059669" emissiveIntensity={0.5} />
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
          <meshPhysicalMaterial color="#1e293b" roughness={0.25} metalness={0.6} />
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

const features = [
  {
    title: "Employee Records",
    description: "Organised employee profiles",
    icon: UsersRound,
  },
  {
    title: "Expiry Tracking",
    description: "Upcoming document renewals",
    icon: CalendarClock,
  },
  {
    title: "Document Overview",
    description: "Review recorded document status",
    icon: ClipboardList,
  },
];

export default function LoginScene() {
  return (
    <aside className="login-scene" aria-label="Workforce management features">
      <div className="scene-panel-content">
        <div className="scene-eyebrow">T2C AI NEXUS</div>
        <h2>Workforce Management</h2>
        <p className="scene-intro">
          Keep employee information and work documentation organised in one place.
        </p>

        <div className="scene-visual" aria-hidden="true">
          <Canvas camera={{ position: [0, 0.2, 6.8], fov: 42 }} dpr={[1, 1.5]}>
            <color attach="background" args={["#0a1526"]} />
            <ambientLight intensity={1.2} />
            <directionalLight position={[4, 5, 4]} intensity={2.8} color="#fff8e7" />
            <pointLight position={[-3, -1, 3]} intensity={10} distance={8} color="#10b981" />
            <Sparkles count={22} scale={6} size={1.8} speed={0.3} opacity={0.4} color="#6ee7b7" />
            <group position={[0, 0.1, 0]}>
              <OrbitCore />
              <CredentialCard position={[-2, 0.95, -0.1]} rotation={[0.12, 0.38, -0.08]} accent="#10b981" />
              <CredentialCard position={[2, 0.65, -0.3]} rotation={[-0.08, -0.4, 0.08]} accent="#f59e0b" />
              <CredentialCard position={[1.55, -1.15, 0.1]} rotation={[0.1, -0.28, -0.1]} accent="#0284c7" />
            </group>
          </Canvas>
        </div>

        <div className="scene-feature-list">
          {features.map(({ title, description, icon: Icon }) => (
            <div className="scene-feature-card" key={title}>
              <span className="scene-feature-icon">
                <Icon size={19} aria-hidden="true" />
              </span>
              <span>
                <strong>{title}</strong>
                <small>{description}</small>
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
