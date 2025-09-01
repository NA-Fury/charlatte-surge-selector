import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../lib/store'; // Adjust the import based on your file structure

interface VesselProps {
  diameter: number;
  length: number;
  orientation: 'Horizontal' | 'Vertical';
  color?: string;
  autoRotate?: boolean;
}

function Vessel({ diameter, length, orientation, color = '#0ea5e9', autoRotate = true }: VesselProps) {
  const meshRef = useRef<THREE.Group>(null);
  
  // Scale to reasonable 3D units (mm to meters / 1000, then scale down for viewport)
  const scaledDiameter = (diameter / 1000) * 0.5;
  const scaledLength = (length / 1000) * 0.5;
  const radius = scaledDiameter / 2;
  
  // Calculate cylinder length (total length minus two hemisphere caps)
  const cylinderLength = Math.max(0.1, scaledLength - scaledDiameter);
  
  useFrame((_, delta) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  // Rotate vessel based on orientation
  const rotation: [number, number, number] = 
    orientation === 'Vertical' ? [0, 0, Math.PI / 2] : [0, 0, 0];

  return (
    <group ref={meshRef} rotation={rotation}>
      {/* Main Cylinder Body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, cylinderLength, 32]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.3} 
          roughness={0.4}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {/* Left Hemisphere Cap */}
      <mesh position={[0, -cylinderLength / 2, 0]} castShadow receiveShadow>
        <sphereGeometry args={[radius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.3} 
          roughness={0.4}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {/* Right Hemisphere Cap */}
      <mesh 
        position={[0, cylinderLength / 2, 0]} 
        rotation={[Math.PI, 0, 0]}
        castShadow 
        receiveShadow
      >
        <sphereGeometry args={[radius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.3} 
          roughness={0.4}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {/* Weld Lines (visual detail) */}
      <mesh position={[0, -cylinderLength / 2, 0]}>
        <torusGeometry args={[radius, 0.005, 8, 48]} />
        <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, cylinderLength / 2, 0]}>
        <torusGeometry args={[radius, 0.005, 8, 48]} />
        <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Nozzles/Ports (visual details) */}
      {[0.3, -0.3].map((pos, i) => (
        <mesh key={i} position={[radius * 0.9, pos * cylinderLength, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.1, 16]} />
          <meshStandardMaterial color="#666" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export default function ThreeVessel({ 
  diameter, 
  length, 
  orientation = 'Horizontal',
  color,
  height = 400 
}: {
  diameter: number;
  length: number;
  orientation?: 'Horizontal' | 'Vertical';
  color?: string;
  height?: number;
}) {
  useStore(); // ensure provider; state not needed (removed unused variable warning)

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200" style={{ height }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[3, 2, 3]} fov={45} />
        <OrbitControls 
          enablePan={false} 
          minDistance={2} 
          maxDistance={8}
          maxPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={0.5}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} />
        
        {/* Environment for reflections */}
        <Environment preset="city" />
        
        {/* The Vessel */}
        <Vessel 
          diameter={diameter} 
          length={length} 
          orientation={orientation}
          color={color}
          autoRotate={false}
        />
        
        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
      </Canvas>
      
      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-4 text-xs text-slate-600 bg-white/80 backdrop-blur px-3 py-2 rounded-lg">
        🖱️ Drag to rotate • Scroll to zoom
      </div>
      
      {/* Dimensions Overlay */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-3 rounded-lg shadow-lg">
        <div className="text-xs text-slate-500 mb-1">Dimensions</div>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-xs text-slate-600">Ø</span>
            <span className="text-sm font-semibold">{diameter} mm</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-xs text-slate-600">L</span>
            <span className="text-sm font-semibold">{length} mm</span>
          </div>
        </div>
      </div>
    </div>
  );
}