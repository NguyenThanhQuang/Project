import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Box, Stars, Cloud, Plane } from '@react-three/drei';
import { Bus3D } from './Bus3D';
import { Environment3D } from './Environment3D';
import * as THREE from 'three';

interface BusData {
  id: string;
  number: string;
  position: [number, number, number];
  rotation: [number, number, number];
  isMoving: boolean;
  route: string;
  nextStop: string;
  color: string;
}

interface Map3DProps {
  buses?: BusData[];
  width?: string;
  height?: string;
  showControls?: boolean;
  selectedBusId?: string | null;
  onBusSelect?: (busId: string | null) => void;
}

const defaultBuses: BusData[] = [
  {
    id: '1',
    number: 'B01',
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    isMoving: true,
    route: 'Hà Nội - Hải Phòng',
    nextStop: 'Ga Hải Phòng',
    color: '#E53935'
  },
  {
    id: '2',
    number: 'B02',
    position: [10, 0, 5],
    rotation: [0, Math.PI / 4, 0],
    isMoving: false,
    route: 'Hà Nội - Đà Nẵng',
    nextStop: 'Trạm dừng Vinh',
    color: '#1E88E5'
  },
  {
    id: '3',
    number: 'B03',
    position: [-8, 0, -3],
    rotation: [0, -Math.PI / 6, 0],
    isMoving: true,
    route: 'TP.HCM - Cần Thơ',
    nextStop: 'Bến xe Cần Thơ',
    color: '#43A047'
  },
  {
    id: '4',
    number: 'B04',
    position: [15, 0, -10],
    rotation: [0, Math.PI / 2, 0],
    isMoving: true,
    route: 'Đà Nẵng - Huế',
    nextStop: 'Ga Huế',
    color: '#FB8C00'
  }
];

// Animated clouds component
const AnimatedClouds: React.FC = () => {
  const cloudRefs = useRef<THREE.Group[]>([]);

  useFrame((state) => {
    cloudRefs.current.forEach((cloud, index) => {
      if (cloud) {
        cloud.position.x += 0.01 * (index % 2 === 0 ? 1 : -1);
        if (cloud.position.x > 50) cloud.position.x = -50;
        if (cloud.position.x < -50) cloud.position.x = 50;
      }
    });
  });

  return (
    <group>
      {Array.from({ length: 8 }, (_, i) => (
        <Cloud
          key={i}
          ref={el => { if (el) cloudRefs.current[i] = el; }}
          position={[
            (Math.random() - 0.5) * 100,
            15 + Math.random() * 10,
            (Math.random() - 0.5) * 100
          ]}
          speed={0.1}
          opacity={0.4}
          segments={20}
          bounds={[8, 4, 4]}
          volume={6}
          color="#FFFFFF"
        />
      ))}
    </group>
  );
};

// Enhanced Road component
const Road: React.FC<{ start: [number, number, number], end: [number, number, number] }> = ({ start, end }) => {
  const direction = new THREE.Vector3().subVectors(
    new THREE.Vector3(...end),
    new THREE.Vector3(...start)
  );
  const length = direction.length();
  const midpoint = new THREE.Vector3().addVectors(
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ).multiplyScalar(0.5);

  const rotation = new THREE.Euler(0, Math.atan2(direction.x, direction.z), 0);

  return (
    <group position={[midpoint.x, midpoint.y, midpoint.z]} rotation={[rotation.x, rotation.y, rotation.z]}>
      {/* Road base */}
      <Box args={[1.2, 0.05, length]} position={[0, 0.025, 0]} receiveShadow>
        <meshStandardMaterial color="#2C2C2C" roughness={0.8} />
      </Box>
      
      {/* Center line */}
      <Box args={[0.05, 0.051, length]} position={[0, 0.051, 0]}>
        <meshStandardMaterial color="#FFEB3B" />
      </Box>
      
      {/* Side lines */}
      <Box args={[0.03, 0.051, length]} position={[0.58, 0.051, 0]}>
        <meshStandardMaterial color="#FFFFFF" />
      </Box>
      <Box args={[0.03, 0.051, length]} position={[-0.58, 0.051, 0]}>
        <meshStandardMaterial color="#FFFFFF" />
      </Box>
    </group>
  );
};

// Enhanced Bus Stop component
const BusStop: React.FC<{ position: [number, number, number], name: string }> = ({ position, name }) => {
  return (
    <group position={position}>
      {/* Base platform */}
      <Box args={[3, 0.2, 2]} position={[0, 0.1, 0]} receiveShadow>
        <meshStandardMaterial color="#E0E0E0" />
      </Box>
      
      {/* Main pole */}
      <Box args={[0.15, 4, 0.15]} position={[0, 2, 0]} castShadow>
        <meshPhysicalMaterial color="#1976D2" metalness={0.3} roughness={0.7} />
      </Box>
      
      {/* Sign board */}
      <Box args={[2.5, 1, 0.08]} position={[0, 3.5, 0]} castShadow>
        <meshPhysicalMaterial color="#FFFFFF" metalness={0.1} roughness={0.9} />
      </Box>
      
      {/* Sign border */}
      <Box args={[2.6, 1.1, 0.05]} position={[0, 3.5, -0.02]} castShadow>
        <meshStandardMaterial color="#1976D2" />
      </Box>
      
      {/* Station name */}
      <Text
        position={[0, 3.5, 0.05]}
        fontSize={0.15}
        color="#1976D2"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.2}
        lineHeight={1.2}
        font="/fonts/Inter-Bold.woff"
      >
        {name}
      </Text>
      
      {/* Shelter roof */}
      <Box args={[4, 0.1, 3]} position={[0.5, 3.8, 0]} castShadow>
        <meshStandardMaterial color="#37474F" metalness={0.2} roughness={0.8} />
      </Box>
      
      {/* Support beams */}
      <Box args={[0.1, 2, 0.1]} position={[2, 2.9, 1.4]} castShadow>
        <meshStandardMaterial color="#37474F" />
      </Box>
      <Box args={[0.1, 2, 0.1]} position={[2, 2.9, -1.4]} castShadow>
        <meshStandardMaterial color="#37474F" />
      </Box>
    </group>
  );
};

// Loading component
const LoadingSpinner: React.FC = () => (
  <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '18px',
    color: '#2196F3',
    fontWeight: 'bold'
  }}>
    🚌 Đang tải bản đồ 3D...
  </div>
);

export const Map3D: React.FC<Map3DProps> = ({
  buses = defaultBuses,
  width = '100%',
  height = '600px',
  showControls = true,
  selectedBusId = null,
  onBusSelect
}) => {
  const [animatedBuses, setAnimatedBuses] = useState(buses);

  // Animation cho xe bus di chuyển
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedBuses(prevBuses =>
        prevBuses.map(bus => {
          if (bus.isMoving) {
            const speed = 0.08;
            const newX = bus.position[0] + Math.sin(bus.rotation[1]) * speed;
            const newZ = bus.position[2] + Math.cos(bus.rotation[1]) * speed;
            
            const boundedX = Math.max(-25, Math.min(25, newX));
            const boundedZ = Math.max(-25, Math.min(25, newZ));
            
            return {
              ...bus,
              position: [boundedX, bus.position[1], boundedZ] as [number, number, number]
            };
          }
          return bus;
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width, height, position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
      <Suspense fallback={<LoadingSpinner />}>
        <Canvas
          camera={{ position: [35, 25, 35], fov: 50 }}
          shadows="soft"
          gl={{ 
            antialias: true, 
            alpha: false,
            powerPreference: "high-performance"
          }}
        >
          {/* Enhanced Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[30, 30, 15]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[4096, 4096]}
            shadow-camera-far={100}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
            shadow-bias={-0.0001}
          />
          
          {/* Fill light */}
          <directionalLight
            position={[-20, 15, -20]}
            intensity={0.3}
            color="#E3F2FD"
          />

          {/* Environment and Sky */}
          <Environment preset="city" />
          <Stars radius={300} depth={60} count={1000} factor={7} saturation={0} fade />
          
          {/* Animated Clouds */}
          <AnimatedClouds />

          {/* Enhanced Ground with texture-like pattern */}
          <Plane args={[200, 200]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
            <meshStandardMaterial 
              color="#8BC34A"
              roughness={0.8}
              metalness={0.1}
            />
          </Plane>

          {/* Detailed Roads */}
          <Road start={[-30, 0, -30]} end={[30, 0, 30]} />
          <Road start={[-30, 0, 30]} end={[30, 0, -30]} />
          <Road start={[0, 0, -30]} end={[0, 0, 30]} />
          <Road start={[-30, 0, 0]} end={[30, 0, 0]} />

          {/* Enhanced Bus stops */}
          <BusStop position={[-18, 0, -18]} name="Bến xe Mỹ Đình" />
          <BusStop position={[18, 0, 18]} name="Sân bay Nội Bài" />
          <BusStop position={[-18, 0, 18]} name="Ga Hà Nội" />
          <BusStop position={[18, 0, -18]} name="Ga Hải Phòng" />

          {/* Environment with buildings, trees, etc. */}
          <Environment3D />

          {/* Buses */}
          {animatedBuses.map(bus => (
            <group key={bus.id}>
              <Bus3D
                position={bus.position}
                rotation={bus.rotation}
                busNumber={bus.number}
                isMoving={bus.isMoving}
                color={bus.color}
                selected={selectedBusId === bus.id}
              />
              
              {/* Bus info when selected */}
              {selectedBusId === bus.id && (
                <group>
                  <Text
                    position={[bus.position[0], bus.position[1] + 4, bus.position[2]]}
                    fontSize={0.4}
                    color="#FFFFFF"
                    anchorX="center"
                    anchorY="bottom"
                    outlineWidth={0.05}
                    outlineColor="#000000"
                    maxWidth={8}
                    lineHeight={1.2}
                    font="/fonts/Inter-Bold.woff"
                  >
                    {`🚌 ${bus.route}\n📍 Tiếp theo: ${bus.nextStop}`}
                  </Text>
                  
                  {/* Info background */}
                  <Box 
                    args={[4.5, 1.2, 0.1]} 
                    position={[bus.position[0], bus.position[1] + 4, bus.position[2] - 0.2]}
                  >
                    <meshStandardMaterial 
                      color="#000000" 
                      transparent 
                      opacity={0.7} 
                    />
                  </Box>
                </group>
              )}
            </group>
          ))}

          {/* Enhanced Controls */}
          {showControls && (
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              maxDistance={80}
              minDistance={8}
              maxPolarAngle={Math.PI / 2.2}
              minPolarAngle={Math.PI / 6}
              enableDamping={true}
              dampingFactor={0.05}
            />
          )}
          
          {/* Fog for depth */}
          <fog attach="fog" args={['#E3F2FD', 50, 200]} />
        </Canvas>
      </Suspense>
    </div>
  );
}; 