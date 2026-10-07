"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, RoundedBox, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

function StatusDot({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.055, 18, 18]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.65} />
    </mesh>
  );
}

function MiniRow({
  y,
  width,
  accent,
}: {
  y: number;
  width: number;
  accent: string;
}) {
  return (
    <group position={[0, y, 0.045]}>
      <mesh position={[-0.85, 0, 0]}>
        <circleGeometry args={[0.075, 24]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[-0.36, 0.03, 0]}>
        <boxGeometry args={[0.6, 0.035, 0.012]} />
        <meshStandardMaterial color="#dbeafe" />
      </mesh>
      <mesh position={[-0.36, -0.06, 0]}>
        <boxGeometry args={[0.62, 0.026, 0.012]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      <mesh position={[0.54, -0.015, 0]}>
        <boxGeometry args={[width, 0.1, 0.012]} />
        <meshStandardMaterial color={accent} />
      </mesh>
    </group>
  );
}

function DashboardScreen() {
  return (
    <Float speed={1.05} rotationIntensity={0.08} floatIntensity={0.18}>
      <group position={[0, 0.35, 0]} rotation={[-0.06, -0.06, 0]}>
        <RoundedBox args={[3.35, 2.05, 0.14]} radius={0.08} smoothness={5}>
          <meshPhysicalMaterial
            color="#0b1727"
            roughness={0.22}
            metalness={0.45}
            clearcoat={0.8}
            clearcoatRoughness={0.18}
          />
        </RoundedBox>

        <mesh position={[0, 0.86, 0.08]}>
          <boxGeometry args={[3.08, 0.16, 0.016]} />
          <meshStandardMaterial color="#10b981" emissive="#047857" emissiveIntensity={0.38} />
        </mesh>

        <group position={[-0.95, 0.35, 0.09]}>
          <mesh>
            <circleGeometry args={[0.28, 36]} />
            <meshStandardMaterial color="#34d399" emissive="#059669" emissiveIntensity={0.28} />
          </mesh>
          <mesh position={[0.52, 0.08, 0]}>
            <boxGeometry args={[0.76, 0.07, 0.014]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0.46, -0.08, 0]}>
            <boxGeometry args={[0.88, 0.045, 0.014]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        </group>

        <group position={[0.15, -0.16, 0]}>
          <MiniRow y={0.12} width={0.72} accent="#34d399" />
          <MiniRow y={-0.2} width={0.5} accent="#fbbf24" />
          <MiniRow y={-0.52} width={0.64} accent="#38bdf8" />
        </group>

        <group position={[1.12, -0.34, 0.09]}>
          {[0, 0.2, 0.4, 0.6].map((height, index) => (
            <mesh key={index} position={[-0.48 + index * 0.28, height / 2, 0]}>
              <boxGeometry args={[0.14, 0.22 + height, 0.018]} />
              <meshStandardMaterial color={index === 1 ? "#fbbf24" : "#10b981"} />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
}

function IdBadge() {
  return (
    <Float speed={1.25} rotationIntensity={0.12} floatIntensity={0.22}>
      <group position={[-2.08, -0.95, 0.4]} rotation={[0.12, 0.36, -0.08]}>
        <RoundedBox args={[1.22, 1.58, 0.08]} radius={0.08} smoothness={5}>
          <meshPhysicalMaterial color="#f8fafc" roughness={0.38} metalness={0.04} />
        </RoundedBox>
        <mesh position={[0, 0.62, 0.05]}>
          <boxGeometry args={[1.04, 0.16, 0.012]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
        <mesh position={[0, 0.18, 0.052]}>
          <circleGeometry args={[0.24, 32]} />
          <meshStandardMaterial color="#bae6fd" />
        </mesh>
        <mesh position={[0, -0.18, 0.052]}>
          <boxGeometry args={[0.68, 0.055, 0.012]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, -0.34, 0.052]}>
          <boxGeometry args={[0.82, 0.035, 0.012]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[0, -0.52, 0.052]}>
          <boxGeometry args={[0.52, 0.18, 0.012]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
      </group>
    </Float>
  );
}

function ComplianceCards() {
  return (
    <Float speed={0.9} rotationIntensity={0.1} floatIntensity={0.16}>
      <group position={[2.18, -0.62, 0.22]} rotation={[0.08, -0.32, 0.08]}>
        {[0, 1, 2].map((item) => (
          <group key={item} position={[0, item * 0.36, item * -0.02]}>
            <RoundedBox args={[1.14, 0.26, 0.06]} radius={0.05} smoothness={4}>
              <meshStandardMaterial color={item === 1 ? "#123047" : "#102237"} roughness={0.3} />
            </RoundedBox>
            <StatusDot
              position={[-0.45, 0, 0.045]}
              color={item === 1 ? "#fbbf24" : "#34d399"}
            />
            <mesh position={[0.08, 0.04, 0.05]}>
              <boxGeometry args={[0.56, 0.035, 0.01]} />
              <meshStandardMaterial color="#dbeafe" />
            </mesh>
            <mesh position={[-0.02, -0.05, 0.05]}>
              <boxGeometry args={[0.72, 0.026, 0.01]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
          </group>
        ))}
      </group>
    </Float>
  );
}

function SceneRig() {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.055;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -1.78, -0.12]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.8, 72]} />
        <meshStandardMaterial color="#09251f" transparent opacity={0.78} />
      </mesh>
      <mesh position={[0, -1.74, -0.12]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.14, 0.018, 12, 120]} />
        <meshStandardMaterial color="#34d399" emissive="#047857" emissiveIntensity={0.72} />
      </mesh>
      <DashboardScreen />
      <IdBadge />
      <ComplianceCards />
      <StatusDot position={[-1.58, 0.94, 0.7]} color="#34d399" />
      <StatusDot position={[1.68, 1.04, 0.45]} color="#fbbf24" />
      <StatusDot position={[0.95, -1.2, 0.52]} color="#38bdf8" />
    </group>
  );
}

export default function SimpleLoginScene() {
  return (
    <aside className="login-scene" aria-label="Simple 3D workforce records visualization">
      <div className="scene-panel-content">
        <div className="scene-copy">
          <span>Employee Record System</span>
          <h2>Workforce data, safety documents, and pass expiry tracking in one place.</h2>
          <p>Built for daily operations teams managing worker profiles, compliance dates, and site readiness.</p>
        </div>
        <div className="scene-visual" aria-hidden="true">
          <Canvas camera={{ position: [0, 0.35, 6.2], fov: 42 }} dpr={[1, 1.5]}>
            <color attach="background" args={["#081426"]} />
            <ambientLight intensity={1.55} />
            <directionalLight position={[3, 4, 4]} intensity={3.1} color="#fff7ed" />
            <pointLight position={[-3, -0.5, 3]} intensity={8} distance={8} color="#10b981" />
            <pointLight position={[3, 2, 2]} intensity={6} distance={7} color="#38bdf8" />
            <Sparkles count={22} scale={6.4} size={1.35} speed={0.12} opacity={0.28} color="#a7f3d0" />
            <SceneRig />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.18}
              minPolarAngle={1.05}
              maxPolarAngle={2.05}
            />
          </Canvas>
        </div>
      </div>
    </aside>
  );
}
