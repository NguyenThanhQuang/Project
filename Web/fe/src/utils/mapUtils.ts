import * as THREE from 'three';

// Mapbox constants - Updated with a more reliable public token
export const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p1dDBkZjNjMWxsYzQzbzJuMzlyOWxoOSJ9.VCH4J7xYmI7dSPCRj7DMCA'; // Public demo token

// Fallback token if the above doesn't work
export const MAPBOX_FALLBACK_TOKEN = 'pk.eyJ1IjoibWFwYm94LWdsLWpzIiwiYSI6ImNrcGRiN2JnYjEwa3EycHBra2U4N3FyYWwifQ.R4Cs8xdhZl_vH9Vj_4YOPw';

// Earth radius in meters
const EARTH_RADIUS = 6371008.8;

// Scale factor for 3D visualization
export const WORLD_SCALE = 1000;

/**
 * Convert latitude/longitude to Web Mercator coordinates
 */
export function lngLatToWebMercator(lng: number, lat: number): [number, number] {
  const x = (lng * Math.PI) / 180;
  const y = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 180 / 2));
  return [x * EARTH_RADIUS, y * EARTH_RADIUS];
}

/**
 * Convert Web Mercator to 3D world coordinates for R3F
 */
export function webMercatorToWorld(
  mercatorX: number, 
  mercatorY: number, 
  centerLng: number, 
  centerLat: number,
  zoom: number = 14
): [number, number, number] {
  const [centerX, centerY] = lngLatToWebMercator(centerLng, centerLat);
  
  // Scale based on zoom level
  const scale = Math.pow(2, zoom - 14) * WORLD_SCALE;
  
  const x = (mercatorX - centerX) / scale;
  const z = -(mercatorY - centerY) / scale; // Negative Z for correct orientation
  
  return [x, 0, z];
}

/**
 * Convert lat/lng directly to 3D world coordinates
 */
export function lngLatToWorld(
  lng: number, 
  lat: number, 
  centerLng: number, 
  centerLat: number,
  zoom: number = 14
): [number, number, number] {
  const [mercatorX, mercatorY] = lngLatToWebMercator(lng, lat);
  return webMercatorToWorld(mercatorX, mercatorY, centerLng, centerLat, zoom);
}

/**
 * Convert 3D world coordinates back to lat/lng
 */
export function worldToLngLat(
  x: number,
  z: number,
  centerLng: number,
  centerLat: number,
  zoom: number = 14
): [number, number] {
  const [centerMercatorX, centerMercatorY] = lngLatToWebMercator(centerLng, centerLat);
  const scale = Math.pow(2, zoom - 14) * WORLD_SCALE;
  
  const mercatorX = centerMercatorX + x * scale;
  const mercatorY = centerMercatorY - z * scale; // Negative Z conversion
  
  const lng = (mercatorX / EARTH_RADIUS) * (180 / Math.PI);
  const lat = (Math.atan(Math.exp(mercatorY / EARTH_RADIUS)) - Math.PI / 4) * 2 * (180 / Math.PI);
  
  return [lng, lat];
}

/**
 * Calculate distance between two lat/lng points in meters
 */
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c;
}

/**
 * Generate route points along a path for smooth movement
 */
export function interpolateRoute(
  points: [number, number][],
  segments: number = 100
): [number, number][] {
  if (points.length < 2) return points;
  
  const interpolated: [number, number][] = [];
  
  for (let i = 0; i < points.length - 1; i++) {
    const [lng1, lat1] = points[i];
    const [lng2, lat2] = points[i + 1];
    
    for (let j = 0; j < segments; j++) {
      const t = j / segments;
      const lng = lng1 + (lng2 - lng1) * t;
      const lat = lat1 + (lat2 - lat1) * t;
      interpolated.push([lng, lat]);
    }
  }
  
  // Add the last point
  interpolated.push(points[points.length - 1]);
  return interpolated;
}

/**
 * Calculate bearing between two points
 */
export function calculateBearing(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  
  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
  
  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
}

/**
 * Vietnam bus routes data - real coordinates
 */
export const VIETNAM_BUS_ROUTES = {
  'hanoi-haiphong': {
    name: 'Hà Nội - Hải Phòng',
    coordinates: [
      [105.8342, 21.0285], // Hà Nội
      [105.8631, 21.0245], // Gia Lâm
      [106.0825, 21.0244], // Bắc Ninh
      [106.1621, 20.9463], // Hải Dương
      [106.6807, 20.8449]  // Hải Phòng
    ] as [number, number][],
    color: '#E53935',
    distance: 120
  },
  'hanoi-danang': {
    name: 'Hà Nội - Đà Nẵng',
    coordinates: [
      [105.8342, 21.0285], // Hà Nội
      [105.6745, 20.4589], // Ninh Bình
      [105.8768, 18.6731], // Vinh
      [106.0438, 17.4739], // Đông Hới
      [107.5951, 16.4637], // Huế
      [108.2022, 16.0544]  // Đà Nẵng
    ] as [number, number][],
    color: '#1E88E5',
    distance: 791
  },
  'hcm-cantho': {
    name: 'TP.HCM - Cần Thơ',
    coordinates: [
      [106.6297, 10.8231], // TP.HCM
      [106.4238, 10.6779], // Bình Chánh
      [106.1621, 10.4526], // Mỹ Tho
      [105.7851, 10.0359]   // Cần Thơ
    ] as [number, number][],
    color: '#43A047',
    distance: 169
  },
  'danang-hue': {
    name: 'Đà Nẵng - Huế',
    coordinates: [
      [108.2022, 16.0544], // Đà Nẵng
      [108.0505, 16.2042], // Đèo Hải Vân
      [107.5951, 16.4637]  // Huế
    ] as [number, number][],
    color: '#FB8C00',
    distance: 108
  }
};

/**
 * Get map center for Vietnam
 */
export function getVietnamMapCenter(): [number, number] {
  return [106.9, 16.0]; // Center of Vietnam
}

/**
 * Create GeoJSON for route
 */
export function createRouteGeoJSON(coordinates: [number, number][]) {
  return {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates
    }
  };
} 