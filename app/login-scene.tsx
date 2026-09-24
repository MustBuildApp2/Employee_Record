"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";

function HolographicCredential({ position, rotation, accent, title, number }: {
  position: [number, number, number];
  rotation: [number, number, number];
  accent: string;
  title: string;
  number: string;
}) {
  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.5}>
      <group position={position} rotation={rotation}>
        {/* Pass Card Base with metallic frosted look */}
        <RoundedBox args={[1.55, 0.95, 0.07]} radius={0.07} smoothness={4}>
          <meshPhysicalMaterial
            color="#1e293b"
            roughness={0.2}
            metalness={0.65}
            clearcoat={0.9}
            clearcoatRoughness={0.15}
          />
        </RoundedBox>

        {/* Outer glowing border rim */}
        <mesh position={[0, 0, 0.038]}>
          <planeGeometry args={[1.51, 0.91]} />
          <meshBasicMaterial color="#0f766e" transparent opacity={0.6} />
        </mesh>

        {/* Top Header Strip */}
        <mesh position={[0, 0.35, 0.042]}>
          <planeGeometry args={[1.42, 0.12]} />
          <meshStandardMaterial color={accent} roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Worker Avatar Placeholder Hologram */}
        <mesh position={[-0.48, 0.04, 0.045]}>
          <circleGeometry args={[0.2, 32]} />
          <meshStandardMaterial color={accent} roughness={0.2} metalness={0.7} />
        </mesh>
        <mesh position={[-0.48, 0.04, 0.047]}>
          <circleGeometry args={[0.16, 32]} />
          <meshBasicMaterial color="#d8f3ea" />
        </mesh>

        {/* Data Bars / Micro text simulation */}
        <mesh position={[0.22, 0.12, 0.045]}>
          <boxGeometry args={[0.55, 0.05, 0.01]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        <mesh position={[0.14, 0.0, 0.045]}>
          <boxGeometry args={[0.7, 0.035, 0.01]} />
          <meshStandardMaterial color="#6ee7b7" roughness={0.4} />
        </mesh>
        <mesh position={[0.08, -0.1, 0.045]}>
          <boxGeometry args={[0.82, 0.03, 0.01]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.4} />
        </mesh>

        {/* Chip / Security hologram */}
        <mesh position={[-0.48, -0.26, 0.045]}>
          <boxGeometry args={[0.22, 0.16, 0.01]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Barcode Lines */}
        <mesh position={[0.25, -0.26, 0.045]}>
          <boxGeometry args={[0.65, 0.1, 0.01]} />
          <meshStandardMaterial color="#475569" roughness={0.8} />
        </mesh>
      </group>
    </Float>
  );
}

function OrbitCore() {
  const coreRef = useRef<Group>(null);
  const ring1Ref = useRef<Mesh>(null);
  const ring2Ref = useRef<Mesh>(null);
  const ring3Ref = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.22;
      coreRef.current.rotation.x = Math.sin(t * 0.35) * 0.09;
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z -= delta * 0.16;
    if (ring2Ref.current) ring2Ref.current.rotation.x += delta * 0.14;
    if (ring3Ref.current) ring3Ref.current.rotation.y += delta * 0.2;
  });

  return (
    <group ref={coreRef}>
      {/* Central Emerald Nucleus */}
      <mesh>
        <icosahedronGeometry args={[1.2, 3]} />
        <meshPhysicalMaterial
          color="#047857"
          roughness={0.15}
          metalness={0.4}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.4}
          ior={1.4}
        />
      </mesh>

      {/* Wireframe Matrix Aura */}
      <mesh scale={1.03}>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Golden Compliance Orbital Rings */}
      <mesh ref={ring1Ref} rotation={[1.2, 0.3, 0.4]}>
        <torusGeometry args={[1.8, 0.032, 16, 100]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} emissive="#78350f" emissiveIntensity={0.25} />
      </mesh>

      <mesh ref={ring2Ref} rotation={[0.4, 1.2, 0.2]}>
        <torusGeometry args={[2.05, 0.02, 16, 100]} />
        <meshStandardMaterial color="#10b981" metalness={0.8} roughness={0.3} emissive="#065f46" emissiveIntensity={0.4} />
      </mesh>

      <mesh ref={ring3Ref} rotation={[-0.8, -0.4, 0.9]}>
        <torusGeometry args={[2.3, 0.012, 12, 100]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.7} roughness={0.3} emissive="#0369a1" emissiveIntensity={0.3} />
      </mesh>

      {/* Orbital Satellite Nodes (Workforce Data Points) */}
      {[
        [-0.7, 0.6, 1.3],
        [0.8, -0.5, 1.2],
        [0.3, 0.9, 0.9],
        [-1.1, -0.4, 0.7],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.09, 20, 20]} />
          <meshStandardMaterial
            color={idx === 1 ? "#f59e0b" : idx === 2 ? "#38bdf8" : "#10b981"}
            emissive={idx === 1 ? "#b45309" : "#059669"}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

function DataPillars() {
  const pillars = useMemo(() => [
    { x: -1.4, h: 0.8, c: "#10b981" },
    { x: -1.0, h: 1.3, c: "#f59e0b" },
    { x: -0.6, h: 1.8, c: "#059669" },
    { x: -0.2, h: 1.1, c: "#38bdf8" },
    { x: 0.2, h: 1.5, c: "#10b981" },
  ], []);

  return (
    <group position={[0, -0.2, -0.8]}>
      {pillars.map((p, i) => (
        <Float key={i} speed={1 + i * 0.2} floatIntensity={0.15}>
          <RoundedBox args={[0.2, p.h, 0.2]} radius={0.04} position={[p.x, -2.1 + p.h / 2, 0]}>
            <meshStandardMaterial color={p.c} metalness={0.5} roughness={0.3} />
          </RoundedBox>
        </Float>
      ))}
    </group>
  );
}

export default function LoginScene() {
  return (
    <div className="login-scene" aria-hidden="true">
      <Canvas camera={{ position: [0, 0.2, 6.8], fov: 42 }} dpr={[1, 1.8]}>
        <color attach="background" args={["#0a1526"]} />
        <ambientLight intensity={1.3} />
        <directionalLight position={[5, 6, 4]} intensity={3.5} color="#fff8e7" />
        <directionalLight position={[-5, -3, -2]} intensity={1.2} color="#059669" />
        <pointLight position={[-4, -1, 3]} intensity={16} distance={10} color="#10b981" />
        <pointLight position={[4, -2, 2]} intensity={14} distance={9} color="#f59e0b" />
        <pointLight position={[0, 4, 2]} intensity={10} distance={8} color="#38bdf8" />

        {/* Ambient floating quantum particles */}
        <Sparkles count={45} scale={7} size={2.2} speed={0.4} opacity={0.5} color="#6ee7b7" />

        <group position={[0.35, 0.15, 0]}>
          <OrbitCore />
          <HolographicCredential
            position={[-2.4, 1.25, -0.1]}
            rotation={[0.12, 0.38, -0.08]}
            accent="#10b981"
            title="WORK PERMIT"
            number="WP-923184"
          />
          <HolographicCredential
            position={[2.45, 0.9, -0.3]}
            rotation={[-0.08, -0.4, 0.08]}
            accent="#f59e0b"
            title="S PASS COMPLIANCE"
            number="SP-713942"
          />
          <HolographicCredential
            position={[1.8, -1.35, 0.1]}
            rotation={[0.1, -0.28, -0.1]}
            accent="#0284c7"
            title="CSOC / BCSS CERT"
            number="CSOC-28414"
          />
          <DataPillars />
        </group>
      </Canvas>

      <div className="scene-caption">
        <div className="scene-status-badge">
          <span className="pulse-dot" />
          <span>Workforce Intelligence • Active</span>
        </div>
        <strong>Precision Operations & Verification</strong>
        <p>Centralized workforce intelligence, statutory credential monitoring, and real-time personnel verification.</p>
        <div className="scene-metrics-strip">
          <div>
            <span>99.4%</span>
            <small>Audit Readiness</small>
          </div>
          <div>
            <span>3-Tier</span>
            <small>Expiry Radar</small>
          </div>
          <div>
            <span>Instant</span>
            <small>Digital Passes</small>
          </div>
        </div>
      </div>
    </div>
  );
}
