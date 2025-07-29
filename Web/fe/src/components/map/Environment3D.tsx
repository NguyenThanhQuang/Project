import React, { useMemo } from 'react';
import { Box, Cylinder, Sphere, Cone } from '@react-three/drei';
import * as THREE from 'three';

// Building component
interface BuildingProps {
  position: [number, number, number];
  height: number;
  width: number;
  depth: number;
  color: string;
}

const Building: React.FC<BuildingProps> = ({ position, height, width, depth, color }) => {
  const windowRows = Math.floor(height / 2);
  const windowCols = Math.max(2, Math.floor(width / 1.5));

  return (
    <group position={position}>
      {/* Building main structure */}
      <Box args={[width, height, depth]} position={[0, height / 2, 0]} castShadow>
        <meshPhysicalMaterial 
          color={color}
          metalness={0.1}
          roughness={0.7}
        />
      </Box>
      
      {/* Windows */}
      {Array.from({ length: windowRows }, (_, row) =>
        Array.from({ length: windowCols }, (_, col) => (
          <Box
            key={`${row}-${col}`}
            args={[0.4, 0.6, 0.02]}
            position={[
              (col - windowCols / 2 + 0.5) * 0.8,
              (row + 1) * 2 - 0.5,
              depth / 2 + 0.01
            ]}
          >
            <meshStandardMaterial 
              color={Math.random() > 0.3 ? "#FFF59D" : "#424242"}
              emissive={Math.random() > 0.3 ? "#FFF59D" : "#000000"}
              emissiveIntensity={Math.random() > 0.3 ? 0.2 : 0}
            />
          </Box>
        ))
      )}
      
      {/* Roof */}
      <Box args={[width + 0.2, 0.3, depth + 0.2]} position={[0, height + 0.15, 0]}>
        <meshStandardMaterial color="#424242" />
      </Box>
    </group>
  );
};

// Tree component
interface TreeProps {
  position: [number, number, number];
  scale?: number;
}

const Tree: React.FC<TreeProps> = ({ position, scale = 1 }) => {
  const trunkHeight = 2 * scale;
  const crownRadius = 1.2 * scale;

  return (
    <group position={position}>
      {/* Trunk */}
      <Cylinder args={[0.1 * scale, 0.15 * scale, trunkHeight]} position={[0, trunkHeight / 2, 0]}>
        <meshStandardMaterial color="#8D6E63" />
      </Cylinder>
      
      {/* Crown layers */}
      <Cone args={[crownRadius, 2 * scale]} position={[0, trunkHeight + scale, 0]}>
        <meshStandardMaterial color="#2E7D32" />
      </Cone>
      <Cone args={[crownRadius * 0.8, 1.5 * scale]} position={[0, trunkHeight + 1.2 * scale, 0]}>
        <meshStandardMaterial color="#388E3C" />
      </Cone>
      <Cone args={[crownRadius * 0.6, 1 * scale]} position={[0, trunkHeight + 1.8 * scale, 0]}>
        <meshStandardMaterial color="#4CAF50" />
      </Cone>
    </group>
  );
};

// Street lamp component
interface StreetLampProps {
  position: [number, number, number];
}

const StreetLamp: React.FC<StreetLampProps> = ({ position }) => {
  return (
    <group position={position}>
      {/* Pole */}
      <Cylinder args={[0.05, 0.08, 4]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#424242" metalness={0.8} roughness={0.2} />
      </Cylinder>
      
      {/* Light */}
      <Sphere args={[0.3]} position={[0, 4.2, 0]}>
        <meshStandardMaterial 
          color="#FFF59D" 
          emissive="#FFF59D" 
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </Sphere>
      
      {/* Light glow */}
      <pointLight
        position={[0, 4.2, 0]}
        color="#FFF59D"
        intensity={2}
        distance={15}
        decay={2}
      />
    </group>
  );
};

// Park area with benches
interface ParkProps {
  position: [number, number, number];
  size: number;
}

const Park: React.FC<ParkProps> = ({ position, size }) => {
  const trees = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      position: [
        position[0] + (Math.random() - 0.5) * size,
        position[1],
        position[2] + (Math.random() - 0.5) * size
      ] as [number, number, number],
      scale: 0.8 + Math.random() * 0.4
    }));
  }, [position, size]);

  return (
    <group>
      {/* Park ground */}
      <Box args={[size, 0.05, size]} position={position} receiveShadow>
        <meshStandardMaterial color="#4CAF50" />
      </Box>
      
      {/* Trees */}
      {trees.map((tree, index) => (
        <Tree key={index} position={tree.position} scale={tree.scale} />
      ))}
      
      {/* Bench */}
      <group position={[position[0], position[1] + 0.4, position[2] + size/3]}>
        <Box args={[1.5, 0.1, 0.4]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#8D6E63" />
        </Box>
        <Box args={[1.5, 0.8, 0.1]} position={[0, 0.4, 0.15]}>
          <meshStandardMaterial color="#8D6E63" />
        </Box>
      </group>
    </group>
  );
};

// Main Environment component
export const Environment3D: React.FC = () => {
  const buildings = useMemo(() => [
    { position: [-25, 0, -25] as [number, number, number], height: 12, width: 6, depth: 8, color: "#546E7A" },
    { position: [-25, 0, -15] as [number, number, number], height: 8, width: 5, depth: 6, color: "#78909C" },
    { position: [-25, 0, -5] as [number, number, number], height: 15, width: 7, depth: 7, color: "#607D8B" },
    { position: [25, 0, 25] as [number, number, number], height: 10, width: 6, depth: 9, color: "#795548" },
    { position: [25, 0, 15] as [number, number, number], height: 18, width: 8, depth: 6, color: "#8D6E63" },
    { position: [25, 0, 5] as [number, number, number], height: 6, width: 4, depth: 5, color: "#A1887F" },
    { position: [-30, 0, 20] as [number, number, number], height: 14, width: 9, depth: 7, color: "#37474F" },
    { position: [30, 0, -20] as [number, number, number], height: 11, width: 6, depth: 8, color: "#455A64" },
  ], []);

  const streetLamps = useMemo(() => [
    [-15, 0, -12] as [number, number, number],
    [15, 0, 12] as [number, number, number],
    [-12, 0, 15] as [number, number, number],
    [12, 0, -15] as [number, number, number],
    [0, 0, -18] as [number, number, number],
    [0, 0, 18] as [number, number, number],
    [-18, 0, 0] as [number, number, number],
    [18, 0, 0] as [number, number, number],
  ], []);

  const trees = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 80,
        0,
        (Math.random() - 0.5) * 80
      ] as [number, number, number],
      scale: 0.6 + Math.random() * 0.8
    })).filter(tree => {
      // Don't place trees too close to roads
      const roadDistance = Math.min(
        Math.abs(tree.position[0]),
        Math.abs(tree.position[2])
      );
      return roadDistance > 3;
    })
  , []);

  return (
    <group>
      {/* Buildings */}
      {buildings.map((building, index) => (
        <Building key={`building-${index}`} {...building} />
      ))}
      
      {/* Street lamps */}
      {streetLamps.map((position, index) => (
        <StreetLamp key={`lamp-${index}`} position={position} />
      ))}
      
      {/* Trees */}
      {trees.map((tree, index) => (
        <Tree key={`tree-${index}`} position={tree.position} scale={tree.scale} />
      ))}
      
      {/* Parks */}
      <Park position={[-20, 0, 5]} size={8} />
      <Park position={[18, 0, -8]} size={6} />
      
      {/* Water feature */}
      <group position={[8, 0, 8]}>
        <Cylinder args={[3, 3, 0.1]} position={[0, 0.05, 0]}>
          <meshPhysicalMaterial 
            color="#1976D2"
            metalness={0}
            roughness={0}
            transmission={0.9}
            transparent={true}
            opacity={0.8}
          />
        </Cylinder>
        {/* Fountain */}
        <Cylinder args={[0.2, 0.2, 1]} position={[0, 0.5, 0]}>
          <meshStandardMaterial color="#BDBDBD" />
        </Cylinder>
      </group>
    </group>
  );
}; 