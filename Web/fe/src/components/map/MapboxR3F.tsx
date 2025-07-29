import React, { useRef, useEffect, useCallback, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { 
  MAPBOX_ACCESS_TOKEN, 
  MAPBOX_FALLBACK_TOKEN,
  lngLatToWorld, 
  getVietnamMapCenter,
  VIETNAM_BUS_ROUTES,
  interpolateRoute,
  calculateBearing 
} from '../../utils/mapUtils';
import { Bus3D } from './Bus3D';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox access token with fallback
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

interface BusData {
  id: string;
  number: string;
  route: keyof typeof VIETNAM_BUS_ROUTES;
  progress: number; // 0-1 along the route
  isMoving: boolean;
  passengers: number;
  speed: number;
}

interface MapboxR3FProps {
  buses?: BusData[];
  selectedBusId?: string | null;
  onBusSelect?: (busId: string | null) => void;
  width?: string;
  height?: string;
}

// Custom WebGL Layer for R3F integration
class ThreeLayer {
  id = 'three-layer';
  type: 'custom' = 'custom';
  renderingMode: '3d' = '3d';
  
  private map!: mapboxgl.Map;
  private camera!: THREE.Camera;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private canvasRef!: React.RefObject<HTMLCanvasElement>;
  private buses: BusData[] = [];
  public busObjects: { [key: string]: THREE.Group } = {};
  private routeLines: THREE.Group = new THREE.Group();
  
  constructor(canvasRef: React.RefObject<HTMLCanvasElement>) {
    this.canvasRef = canvasRef;
  }

  onAdd(map: mapboxgl.Map, gl: WebGLRenderingContext) {
    this.map = map;
    
    // Create Three.js scene
    this.camera = new THREE.Camera();
    this.scene = new THREE.Scene();
    
    // Create renderer using Mapbox GL context
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.current!,
      context: gl,
      antialias: true
    });
    
    this.renderer.autoClear = false;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.setX(2048);
    directionalLight.shadow.mapSize.setY(2048);
    this.scene.add(directionalLight);
    
    // Add route lines
    this.scene.add(this.routeLines);
    this.createRouteLines();
  }

  createRouteLines() {
    const center = getVietnamMapCenter();
    
    Object.entries(VIETNAM_BUS_ROUTES).forEach(([routeId, route]) => {
      const interpolated = interpolateRoute(route.coordinates as [number, number][], 50);
      const points = interpolated.map(([lng, lat]) => {
        const [x, y, z] = lngLatToWorld(lng, lat, center[0], center[1], 8);
        return new THREE.Vector3(x, 0.1, z);
      });
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ 
        color: route.color,
        linewidth: 3,
        transparent: true,
        opacity: 0.8
      });
      
      const line = new THREE.Line(geometry, material);
      this.routeLines.add(line);
    });
  }

  updateBuses(buses: BusData[]) {
    this.buses = buses;
    
    // Remove old bus objects
    Object.values(this.busObjects).forEach(busObj => {
      this.scene.remove(busObj);
    });
    this.busObjects = {};
    
    // Add new bus objects
    buses.forEach(bus => {
      const busGroup = new THREE.Group();
      
      // Calculate position along route
      const route = VIETNAM_BUS_ROUTES[bus.route];
      const interpolated = interpolateRoute(route.coordinates as [number, number][], 100);
      const index = Math.floor(bus.progress * (interpolated.length - 1));
      const nextIndex = Math.min(index + 1, interpolated.length - 1);
      
      // Interpolate between current and next point
      const t = (bus.progress * (interpolated.length - 1)) - index;
      const [lng1, lat1] = interpolated[index];
      const [lng2, lat2] = interpolated[nextIndex];
      const lng = lng1 + (lng2 - lng1) * t;
      const lat = lat1 + (lat2 - lat1) * t;
      
      // Convert to 3D coordinates
      const center = getVietnamMapCenter();
      const [x, y, z] = lngLatToWorld(lng, lat, center[0], center[1], 8);
      
      // Calculate rotation based on direction
      const bearing = calculateBearing(lat1, lng1, lat2, lng2);
      const rotation = (bearing * Math.PI) / 180;
      
      busGroup.position.set(x, y, z);
      busGroup.rotation.y = rotation;
      
      // Store reference
      this.busObjects[bus.id] = busGroup;
      this.scene.add(busGroup);
    });
  }

  render(gl: WebGLRenderingContext, matrix: number[]) {
    const rotationX = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(1, 0, 0),
      Math.PI / 2
    );
    const rotationZ = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 0, 1),
      Math.PI
    );

    this.camera.projectionMatrix = new THREE.Matrix4()
      .fromArray(matrix)
      .multiply(rotationX)
      .multiply(rotationZ);
    
    this.renderer.resetState();
    this.renderer.render(this.scene, this.camera);
    this.map.triggerRepaint();
  }
}

// R3F Scene component that works with the Three layer
const R3FScene: React.FC<{
  buses: BusData[];
  selectedBusId?: string | null;
  layer?: ThreeLayer;
}> = ({ buses, selectedBusId, layer }) => {
  const { scene } = useThree();
  
  useEffect(() => {
    if (layer) {
      layer.updateBuses(buses);
    }
  }, [buses, layer]);

  useFrame(() => {
    // Animation updates happen here
    buses.forEach(bus => {
      const busObj = layer?.busObjects[bus.id];
      if (busObj && bus.isMoving) {
        // Animate wheels or other parts
      }
    });
  });

  return (
    <>
      {buses.map(bus => {
        const route = VIETNAM_BUS_ROUTES[bus.route];
        const interpolated = interpolateRoute(route.coordinates as [number, number][], 100);
        const index = Math.floor(bus.progress * (interpolated.length - 1));
        const nextIndex = Math.min(index + 1, interpolated.length - 1);
        
        const t = (bus.progress * (interpolated.length - 1)) - index;
        const [lng1, lat1] = interpolated[index];
        const [lng2, lat2] = interpolated[nextIndex];
        const lng = lng1 + (lng2 - lng1) * t;
        const lat = lat1 + (lat2 - lat1) * t;
        
        const center = getVietnamMapCenter();
        const [x, y, z] = lngLatToWorld(lng, lat, center[0], center[1], 8);
        
        const bearing = calculateBearing(lat1, lng1, lat2, lng2);
        const rotation = (bearing * Math.PI) / 180;
        
        return (
          <Bus3D
            key={bus.id}
            position={[x, y, z]}
            rotation={[0, rotation, 0]}
            busNumber={bus.number}
            isMoving={bus.isMoving}
            color={route.color}
            selected={selectedBusId === bus.id}
          />
        );
      })}
    </>
  );
};

const defaultBuses: BusData[] = [
  {
    id: '1',
    number: 'B01',
    route: 'hanoi-haiphong',
    progress: 0.3,
    isMoving: true,
    passengers: 32,
    speed: 65
  },
  {
    id: '2',
    number: 'B02',
    route: 'hanoi-danang',
    progress: 0.15,
    isMoving: false,
    passengers: 28,
    speed: 0
  },
  {
    id: '3',
    number: 'B03',
    route: 'hcm-cantho',
    progress: 0.7,
    isMoving: true,
    passengers: 45,
    speed: 70
  },
  {
    id: '4',
    number: 'B04',
    route: 'danang-hue',
    progress: 0.5,
    isMoving: true,
    passengers: 38,
    speed: 45
  }
];

export const MapboxR3F: React.FC<MapboxR3FProps> = ({
  buses = defaultBuses,
  selectedBusId,
  onBusSelect,
  width = '100%',
  height = '600px'
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [threeLayer, setThreeLayer] = useState<ThreeLayer | null>(null);
  const [animatedBuses, setAnimatedBuses] = useState(buses);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const center = getVietnamMapCenter();
    
    console.log('Initializing Mapbox with token:', MAPBOX_ACCESS_TOKEN.substring(0, 20) + '...');
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: 6,
        pitch: 45,
        bearing: 0,
        antialias: true,
        attributionControl: false
      });

      // Handle map errors
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError('Lỗi tải bản đồ: ' + e.error?.message || 'Unknown error');
        // Try fallback token
        mapboxgl.accessToken = MAPBOX_FALLBACK_TOKEN;
      });

      map.current.on('style.load', () => {
        console.log('Map style loaded successfully');
        setMapLoaded(true);
        setMapError(null);
      });
      // Add navigation controls
      if (map.current) {
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        // Add fullscreen control
        map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');
      }
    } catch (error) {
      console.error('Error initializing Mapbox:', error);
      setMapError('Không thể khởi tạo bản đồ');
    }

    if (map.current) {
      map.current.on('load', () => {
        if (!map.current || !canvasRef.current) return;
        
        // Create and add the Three.js layer
        const layer = new ThreeLayer(canvasRef as React.RefObject<HTMLCanvasElement>);
        setThreeLayer(layer);
        map.current.addLayer(layer);
        
        // Add route data as Mapbox layers
        Object.entries(VIETNAM_BUS_ROUTES).forEach(([routeId, route]) => {
          map.current!.addSource(routeId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: route.coordinates
              }
            }
          });

          map.current!.addLayer({
            id: `${routeId}-line`,
            type: 'line',
            source: routeId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': route.color,
              'line-width': 4,
              'line-opacity': 0.6
            }
          });
        });
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Animate buses
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedBuses(prevBuses =>
        prevBuses.map(bus => {
          if (bus.isMoving) {
            const speed = 0.002; // Adjust for desired movement speed
            const newProgress = (bus.progress + speed) % 1;
            return { ...bus, progress: newProgress };
          }
          return bus;
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Update Three.js layer when buses change
  useEffect(() => {
    if (threeLayer) {
      threeLayer.updateBuses(animatedBuses);
    }
  }, [animatedBuses, threeLayer]);

  return (
    <div style={{ width, height, position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      
      {/* Error overlay với fallback map */}
      {mapError && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          {/* Fallback SVG map */}
          <svg 
            width="200" 
            height="150" 
            viewBox="0 0 200 150" 
            style={{ marginBottom: '20px' }}
          >
            {/* Vietnam outline */}
            <path
              d="M50,20 L80,15 L120,25 L140,40 L160,70 L150,100 L130,130 L100,140 L70,135 L50,120 L40,90 L45,60 Z"
              fill="#4CAF50"
              stroke="#2196F3"
              strokeWidth="2"
            />
            {/* Cities */}
            <circle cx="90" cy="40" r="3" fill="#FF5722" />
            <text x="95" y="42" fontSize="8" fill="white">Hanoi</text>
            <circle cx="120" cy="85" r="3" fill="#FF5722" />
            <text x="125" y="87" fontSize="8" fill="white">Danang</text>
            <circle cx="100" cy="120" r="3" fill="#FF5722" />
            <text x="105" y="122" fontSize="8" fill="white">HCMC</text>
            
            {/* Bus routes */}
            <path d="M90,40 Q105,60 120,85" stroke="#FFD700" strokeWidth="2" fill="none" strokeDasharray="3,3" />
            <path d="M120,85 Q110,100 100,120" stroke="#FFD700" strokeWidth="2" fill="none" strokeDasharray="3,3" />
            
            {/* Animated buses */}
            <circle cx="95" cy="50" r="2" fill="#2196F3">
              <animateMotion dur="3s" repeatCount="indefinite">
                <path d="M0,0 Q15,20 30,45 Q20,35 0,60 Q-10,35 0,0" />
              </animateMotion>
            </circle>
          </svg>
          
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            textAlign: 'center',
            maxWidth: '300px'
          }}>
            <h3 style={{ color: '#FF5722', margin: '0 0 10px 0' }}>⚠️ Mapbox không khả dụng</h3>
            <p style={{ margin: '0 0 15px 0', color: '#333', fontSize: '14px' }}>{mapError}</p>
            <p style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#666' }}>
              Đang sử dụng bản đồ dự phòng. Hãy chuyển sang Fantasy 3D mode để có trải nghiệm tốt hơn.
            </p>
            <button 
              onClick={() => {
                setMapError(null);
                setMapLoaded(false);
                // Try to reinitialize with fallback token
                mapboxgl.accessToken = MAPBOX_FALLBACK_TOKEN;
                if (map.current) {
                  map.current.remove();
                  map.current = null;
                }
              }}
              style={{
                marginRight: '10px',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '5px',
                background: '#2196F3',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Thử lại
            </button>
            <button 
              onClick={() => {
                // Switch to fantasy mode
                window.location.hash = '#fantasy-mode';
              }}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '5px',
                background: '#4CAF50',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Fantasy 3D
            </button>
          </div>
        </div>
      )}
      
      {/* Loading overlay */}
      {!mapLoaded && !mapError && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1500
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #2196F3',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 10px'
            }}></div>
            <p style={{ margin: '0', color: '#333' }}>Đang tải bản đồ...</p>
          </div>
        </div>
      )}

      {/* Mapbox container */}
      <div
        ref={mapContainer}
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Hidden canvas for Three.js - Mapbox will use this */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
      
      {/* Overlay UI */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        maxWidth: '250px',
        zIndex: 1000
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
          🗺️ Bản đồ thực tế {mapLoaded ? '✅' : '⏳'}
        </h3>
        <p style={{ margin: '0', fontSize: '12px', opacity: 0.8 }}>
          {mapLoaded 
            ? 'Zoom/Pan để khám phá. Click xe bus để xem chi tiết.'
            : 'Đang kết nối đến Mapbox...'
          }
        </p>
      </div>

      {/* Bus info panel */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(255,255,255,0.95)',
        padding: '15px',
        borderRadius: '8px',
        maxWidth: '300px',
        zIndex: 1000,
        backdropFilter: 'blur(10px)'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#1976D2' }}>🚌 Xe bus đang hoạt động</h4>
        {animatedBuses.map(bus => {
          const route = VIETNAM_BUS_ROUTES[bus.route];
          return (
            <div
              key={bus.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px',
                margin: '5px 0',
                background: selectedBusId === bus.id ? route.color + '20' : '#f5f5f5',
                borderRadius: '6px',
                border: selectedBusId === bus.id ? `2px solid ${route.color}` : '1px solid #ddd',
                cursor: 'pointer',
                fontSize: '12px'
              }}
              onClick={() => onBusSelect?.(selectedBusId === bus.id ? null : bus.id)}
            >
              <div>
                <div style={{ fontWeight: 'bold', color: route.color }}>{bus.number}</div>
                <div style={{ opacity: 0.7 }}>{route.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div>{bus.isMoving ? '🚌' : '🅿️'} {bus.speed}km/h</div>
                <div style={{ opacity: 0.7 }}>{Math.round(bus.progress * 100)}% hoàn thành</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 