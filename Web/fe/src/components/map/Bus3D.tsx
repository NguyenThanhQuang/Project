import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text, RoundedBox, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

interface Bus3DProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  busNumber: string;
  isMoving?: boolean;
  color?: string;
  selected?: boolean;
}

export const Bus3D: React.FC<Bus3DProps> = ({
  position,
  rotation = [0, 0, 0],
  busNumber,
  isMoving = false,
  color = '#2E7D32',
  selected = false
}) => {
  const busRef = useRef<THREE.Group>(null);
  const wheelRefs = useRef<THREE.Mesh[]>([]);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (busRef.current) {
      // Gentle floating animation when selected
      if (selected) {
        busRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      } else {
        busRef.current.position.y = position[1];
      }
      
      // Wheel rotation animation
      if (isMoving && wheelRefs.current) {
        wheelRefs.current.forEach(wheel => {
          if (wheel) {
            wheel.rotation.x += delta * 8;
          }
        });
      }

      // Subtle scale animation on hover
      const targetScale = hovered || selected ? 1.05 : 1;
      busRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group 
      ref={busRef} 
      position={position} 
      rotation={rotation}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Bus Body - Main */}
      <RoundedBox args={[5, 2.5, 2]} radius={0.1} position={[0, 0.5, 0]} castShadow>
        <meshPhysicalMaterial 
          color={color}
          metalness={0.7}
          roughness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>
      
      {/* Bus Front */}
      <RoundedBox args={[0.8, 2.2, 1.8]} radius={0.1} position={[2.6, 0.4, 0]} castShadow>
        <meshPhysicalMaterial 
          color={color}
          metalness={0.7}
          roughness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>
      
      {/* Windshield */}
      <Box args={[0.1, 1.5, 1.6]} position={[3, 0.4, 0]}>
        <meshPhysicalMaterial 
          color="#E3F2FD"
          metalness={0}
          roughness={0}
          transmission={0.9}
          transparent={true}
          opacity={0.8}
        />
      </Box>
      
      {/* Side Windows */}
      <Box args={[4.8, 1, 0.1]} position={[0, 1, 0.95]}>
        <meshPhysicalMaterial 
          color="#E3F2FD"
          metalness={0}
          roughness={0}
          transmission={0.85}
          transparent={true}
          opacity={0.7}
        />
      </Box>
      
      <Box args={[4.8, 1, 0.1]} position={[0, 1, -0.95]}>
        <meshPhysicalMaterial 
          color="#E3F2FD"
          metalness={0}
          roughness={0}
          transmission={0.85}
          transparent={true}
          opacity={0.7}
        />
      </Box>

      {/* Roof */}
      <RoundedBox args={[4.8, 0.2, 1.8]} radius={0.05} position={[0, 1.6, 0]}>
        <meshStandardMaterial color="#FAFAFA" />
      </RoundedBox>

      {/* Door */}
      <Box args={[0.1, 1.8, 0.8]} position={[1.5, 0.3, 1.01]}>
        <meshStandardMaterial color="#424242" />
      </Box>

      {/* Headlights */}
      <Cylinder args={[0.2, 0.2, 0.1]} rotation={[0, 0, Math.PI/2]} position={[3.1, 0.2, 0.6]}>
        <meshStandardMaterial color="#FFFDE7" emissive="#FFF59D" emissiveIntensity={0.5} />
      </Cylinder>
      <Cylinder args={[0.2, 0.2, 0.1]} rotation={[0, 0, Math.PI/2]} position={[3.1, 0.2, -0.6]}>
        <meshStandardMaterial color="#FFFDE7" emissive="#FFF59D" emissiveIntensity={0.5} />
      </Cylinder>

      {/* Taillights */}
      <Cylinder args={[0.15, 0.15, 0.1]} rotation={[0, 0, Math.PI/2]} position={[-2.6, 0.2, 0.6]}>
        <meshStandardMaterial color="#FF1744" emissive="#FF5252" emissiveIntensity={0.3} />
      </Cylinder>
      <Cylinder args={[0.15, 0.15, 0.1]} rotation={[0, 0, Math.PI/2]} position={[-2.6, 0.2, -0.6]}>
        <meshStandardMaterial color="#FF1744" emissive="#FF5252" emissiveIntensity={0.3} />
      </Cylinder>

      {/* Wheels - Front Left */}
      <group position={[1.8, -0.8, -1.1]}>
        <Cylinder ref={el => { if (el) wheelRefs.current[0] = el; }} args={[0.5, 0.5, 0.3]} rotation={[0, 0, Math.PI/2]}>
          <meshStandardMaterial color="#212121" />
        </Cylinder>
        <Cylinder args={[0.3, 0.3, 0.31]} rotation={[0, 0, Math.PI/2]}>
          <meshStandardMaterial color="#757575" metalness={0.8} roughness={0.2} />
        </Cylinder>
      </group>
      
      {/* Wheels - Front Right */}
      <group position={[1.8, -0.8, 1.1]}>
        <Cylinder ref={el => { if (el) wheelRefs.current[1] = el; }} args={[0.5, 0.5, 0.3]} rotation={[0, 0, Math.PI/2]}>
          <meshStandardMaterial color="#212121" />
        </Cylinder>
        <Cylinder args={[0.3, 0.3, 0.31]} rotation={[0, 0, Math.PI/2]}>
          <meshStandardMaterial color="#757575" metalness={0.8} roughness={0.2} />
        </Cylinder>
      </group>
      
      {/* Wheels - Rear Left */}
      <group position={[-1.8, -0.8, -1.1]}>
        <Cylinder ref={el => { if (el) wheelRefs.current[2] = el; }} args={[0.5, 0.5, 0.3]} rotation={[0, 0, Math.PI/2]}>
          <meshStandardMaterial color="#212121" />
        </Cylinder>
        <Cylinder args={[0.3, 0.3, 0.31]} rotation={[0, 0, Math.PI/2]}>
          <meshStandardMaterial color="#757575" metalness={0.8} roughness={0.2} />
        </Cylinder>
      </group>
      
      {/* Wheels - Rear Right */}
      <group position={[-1.8, -0.8, 1.1]}>
        <Cylinder ref={el => { if (el) wheelRefs.current[3] = el; }} args={[0.5, 0.5, 0.3]} rotation={[0, 0, Math.PI/2]}>
          <meshStandardMaterial color="#212121" />
        </Cylinder>
        <Cylinder args={[0.3, 0.3, 0.31]} rotation={[0, 0, Math.PI/2]}>
          <meshStandardMaterial color="#757575" metalness={0.8} roughness={0.2} />
        </Cylinder>
      </group>

      {/* Bus Number - Front */}
      <Text
        position={[3.2, 0.8, 0]}
        rotation={[0, -Math.PI/2, 0]}
        fontSize={0.4}
        color="#FFF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
        font="/fonts/Inter-Bold.woff"
      >
        {busNumber}
      </Text>
      
      {/* Bus Number - Side */}
      <Text
        position={[0, 1.2, 1.05]}
        fontSize={0.3}
        color="#FFF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
        font="/fonts/Inter-Bold.woff"
      >
        {busNumber}
      </Text>

      {/* Status indicator */}
      {isMoving && (
        <mesh position={[0, 2.5, 0]}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color="#4CAF50" />
        </mesh>
      )}

      {/* Selection highlight */}
      {selected && (
        <mesh position={[0, -1, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <ringGeometry args={[3, 3.5, 32]} />
          <meshBasicMaterial color="#2196F3" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}; 