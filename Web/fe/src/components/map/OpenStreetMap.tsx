import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Box, Typography, Paper, Chip, Card, CardContent, Avatar, IconButton, Button, Divider } from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import SpeedIcon from '@mui/icons-material/Speed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import { ROUTES, getBusDataForMap } from '../../data/busData';

// CSS styles for highway elements
const highwayStyles = `
  .highway-route {
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  }
  
  .highway-route-background {
    z-index: 1;
  }
  
  .highway-label {
    z-index: 1000 !important;
  }
  
  .highway-label div {
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    backdrop-filter: blur(4px);
  }
  
  .route-label {
    z-index: 999 !important;
  }
  
  .route-label div {
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  }
  
  .custom-bus-icon {
    z-index: 1001 !important;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  }
  
  .leaflet-popup-content-wrapper {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }
  
  .leaflet-popup-tip {
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = highwayStyles;
  document.head.appendChild(styleSheet);
}

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface OpenStreetMapProps {
  selectedBusId?: string | null;
  onBusSelect?: (busId: string | null) => void;
  width?: string;
  height?: string;
  enableBooking?: boolean;
}

// Sử dụng dữ liệu từ hệ thống trung tâm
const REAL_BUSES = getBusDataForMap().filter((bus): bus is NonNullable<typeof bus> => bus !== null);

// Type definition for the bus data
type BusData = typeof REAL_BUSES[0];

// Custom bus icon
const createBusIcon = (isSelected: boolean, isMoving: boolean) => {
  const color = isSelected ? '#FFD700' : (isMoving ? '#2196F3' : '#FF5722');
  const svgIcon = `
    <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="8" width="24" height="16" rx="3" fill="${color}" stroke="white" stroke-width="2"/>
      <rect x="6" y="11" width="4" height="3" fill="#87CEEB"/>
      <rect x="11" y="11" width="4" height="3" fill="#87CEEB"/>
      <rect x="16" y="11" width="4" height="3" fill="#87CEEB"/>
      <rect x="21" y="11" width="4" height="3" fill="#87CEEB"/>
      <circle cx="9" cy="26" r="2" fill="black"/>
      <circle cx="21" cy="26" r="2" fill="black"/>
      <rect x="12" y="17" width="6" height="2" fill="white"/>
      ${isMoving ? '<circle cx="27" cy="6" r="3" fill="#4CAF50"><animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite"/></circle>' : ''}
    </svg>
  `;
  
  return L.divIcon({
    html: svgIcon,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
    className: 'custom-bus-icon'
  });
};

// Component BusPopup riêng để xử lý đặt vé
const BusPopup: React.FC<{ bus: BusData; enableBooking?: boolean }> = ({ bus, enableBooking = false }) => {
  const navigate = useNavigate();

  const handleBookTicket = () => {
    // Navigate to booking page with trip parameters
    const searchParams = new URLSearchParams({
      trip: bus.id,
      seats: '1',
      date: new Date().toISOString().split('T')[0]
    });
    
    navigate(`/booking-checkout?${searchParams.toString()}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Get highway information
  const getHighwayInfo = (routeId: string) => {
    const highwayMap: { [key: string]: { code: string; name: string; description: string } } = {
      'hanoi-haiphong': {
        code: 'QL5',
        name: 'Quốc lộ 5',
        description: 'Tuyến giao thông huyết mạch Hà Nội - Hải Phòng'
      },
      'hanoi-danang': {
        code: 'QL1A',
        name: 'Quốc lộ 1A',
        description: 'Tuyến Bắc Nam chính của Việt Nam'
      },
      'hcm-cantho': {
        code: 'QL1A → QL80',
        name: 'Quốc lộ 1A chuyển QL80',
        description: 'Tuyến kết nối miền Đông - Tây Nam Bộ'
      },
      'danang-hue': {
        code: 'QL1A',
        name: 'Quốc lộ 1A (Đèo Hải Vân)',
        description: 'Tuyến nổi tiếng qua Đèo Hải Vân'
      }
    };
    return highwayMap[routeId] || { code: 'QL', name: 'Quốc lộ', description: 'Tuyến quốc lộ' };
  };

  const route = ROUTES[bus.route as keyof typeof ROUTES];
  const highwayInfo = getHighwayInfo(bus.route);

  return (
    <div style={{ minWidth: '320px', maxWidth: '400px' }}>
      {/* Header với thông tin xe */}
      <Box sx={{ borderBottom: '2px solid #e0e0e0', pb: 2, mb: 2 }}>
        <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          🚌 <strong>{bus.number}</strong>
          <Chip 
            label={bus.status === 'moving' ? 'Đang chạy' : 'Dừng'}
            color={bus.status === 'moving' ? 'success' : 'warning'}
            size="small"
            sx={{ ml: 1 }}
          />
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          🛣️ <strong>{highwayInfo.code}</strong> - {highwayInfo.description}
        </Typography>
      </Box>

      {/* Thông tin tuyến đường */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" gutterBottom>
          <strong>📍 Tuyến:</strong> {route.name}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>👨‍✈️ Tài xế:</strong> {bus.driver}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>🕐 Khởi hành:</strong> {bus.departureTime} → <strong>Đến:</strong> {bus.arrivalTime}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>📍 Vị trí hiện tại:</strong> {bus.nextStop}
        </Typography>
      </Box>

      {/* Thông tin vận hành */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">Tốc độ</Typography>
          <Typography variant="h6" color="primary">{bus.speed} km/h</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">Hành khách</Typography>
          <Typography variant="h6" color="success.main">{bus.passengers}/{bus.maxPassengers}</Typography>
        </Box>
      </Box>

      {/* Thông tin đặt vé (nếu có thể đặt) */}
      {enableBooking && bus.booking && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ p: 1.5, bgcolor: 'primary.50', borderRadius: 2, mb: 2 }}>
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              💺 Thông tin đặt vé:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">
                <AttachMoneyIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Giá vé:
              </Typography>
              <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {formatPrice(bus.booking.price)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">
                <EventSeatIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Ghế trống:
              </Typography>
              <Typography variant="body1" color={bus.booking.availableSeats > 5 ? 'success.main' : 'warning.main'}>
                {bus.booking.availableSeats} ghế
              </Typography>
            </Box>
          </Box>

          {bus.booking.availableSeats > 0 ? (
            <Button
              variant="contained"
              startIcon={<BookOnlineIcon />}
              onClick={handleBookTicket}
              fullWidth
              sx={{
                py: 1.5,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #0288D1 90%)',
                },
                borderRadius: 2,
                fontWeight: 'bold'
              }}
            >
              Đặt vé ngay - {formatPrice(bus.booking.price)}
            </Button>
          ) : (
            <Button
              variant="outlined"
              disabled
              fullWidth
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              Hết chỗ trống
            </Button>
          )}
        </>
      )}

      {/* Thông tin bổ sung */}
      <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary', textAlign: 'center', fontStyle: 'italic' }}>
        🔄 Cập nhật thời gian thực • 📱 Theo dõi vị trí chính xác
      </Typography>
    </div>
  );
};

// Component để animate buses
const AnimatedBuses: React.FC<{
  buses: BusData[];
  selectedBusId?: string | null;
  onBusSelect?: (busId: string | null) => void;
  enableBooking?: boolean;
}> = ({ buses, selectedBusId, onBusSelect, enableBooking = false }) => {
  const [animatedBuses, setAnimatedBuses] = useState(buses);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedBuses(prevBuses => 
        prevBuses.map(bus => {
          if (bus.isMoving) {
            const route = ROUTES[bus.route as keyof typeof ROUTES];
            const coordinates = route.coordinates;
            const totalPoints = coordinates.length - 1;
            
            // Tính toán vị trí mới dựa trên tiến độ hiện tại
            const currentProgress = bus.progress;
            const segmentIndex = Math.floor(currentProgress * totalPoints);
            const segmentProgress = (currentProgress * totalPoints) % 1;
            
            if (segmentIndex < totalPoints) {
              const startPoint = coordinates[segmentIndex];
              const endPoint = coordinates[segmentIndex + 1];
              
              // Tính toán vị trí mới với interpolation mượt
              const newLat = startPoint[0] + (endPoint[0] - startPoint[0]) * segmentProgress;
              const newLng = startPoint[1] + (endPoint[1] - startPoint[1]) * segmentProgress;
              
              // Tính toán tốc độ di chuyển dựa trên khoảng cách thực tế
              const distanceBetweenPoints = Math.sqrt(
                Math.pow(endPoint[0] - startPoint[0], 2) + 
                Math.pow(endPoint[1] - startPoint[1], 2)
              );
              
              // Điều chỉnh tốc độ dựa trên tốc độ xe và khoảng cách
              // Tốc độ cao hơn trên quốc lộ, chậm hơn trong thành phố
              let speedMultiplier = 0.0008; // Tốc độ cơ bản
              
              // Điều chỉnh tốc độ theo loại đoạn đường
              if (route.id === 'hanoi-danang') {
                // Quốc lộ 1A - tốc độ cao
                speedMultiplier = 0.0012;
              } else if (route.id === 'hanoi-haiphong') {
                // Quốc lộ 5 - tốc độ trung bình
                speedMultiplier = 0.001;
              } else if (route.id === 'danang-hue') {
                // Đèo Hải Vân - tốc độ chậm do địa hình
                if (segmentIndex >= 8 && segmentIndex <= 20) {
                  speedMultiplier = 0.0005; // Chậm khi qua đèo
                } else {
                  speedMultiplier = 0.0008;
                }
              }
              
              // Điều chỉnh tốc độ dựa trên khoảng cách giữa các điểm
              if (distanceBetweenPoints > 0.01) {
                speedMultiplier *= 0.7; // Chậm hơn trên đoạn đường dài
              } else if (distanceBetweenPoints < 0.005) {
                speedMultiplier *= 1.5; // Nhanh hơn trên đoạn đường ngắn
              }
              
              // Mô phỏng dừng tại các trạm (giảm tốc độ tại một số điểm)
              const isNearStation = Math.abs(segmentProgress - 0.5) < 0.1; // Gần giữa đoạn đường
              const shouldSlowDown = Math.random() < 0.1; // 10% cơ hội giảm tốc độ
              
              if (isNearStation && shouldSlowDown) {
                speedMultiplier *= 0.3; // Giảm tốc độ đáng kể
              }
              
              // Cập nhật tiến độ với tốc độ đã điều chỉnh
              const newProgress = (currentProgress + speedMultiplier) % 1;
              
              // Cập nhật thông tin vị trí hiện tại (tên địa điểm gần nhất)
              let currentLocation = 'Đang di chuyển';
              const routeNames: { [key: string]: string[] } = {
                'hanoi-haiphong': [
                  'Hà Nội', 'Đại lộ Thăng Long', 'Cầu Thanh Trì', 'Gia Lâm', 'QL5',
                  'Vành đai 3', 'Trâu Quỳ', 'Yên Viên', 'Kiến Hưng', 'Hải Dương',
                  'Kim Thành', 'Thanh Hà', 'Cẩm Giàng', 'Chí Linh', 'Thanh Miện',
                  'Kiến Thụy', 'Hải Phòng'
                ],
                'hanoi-danang': [
                  'Hà Nội', 'Hà Đông', 'Xuân Mai', 'Ninh Bình', 'Thanh Hóa', 
                  'Nghệ An', 'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị', 'Huế', 'Đà Nẵng'
                ],
                'hcm-cantho': [
                  'TP.HCM', 'Bình Chánh', 'Long An', 'Tiền Giang', 'Đồng Tháp',
                  'An Giang', 'Cần Thơ'
                ],
                'danang-hue': [
                  'Đà Nẵng', 'Hòa Vang', 'Đèo Hải Vân', 'Lăng Cô', 'Phú Lộc',
                  'Phong Điền', 'Huế'
                ]
              };
              
              const locationNames = routeNames[route.id] || [];
              if (locationNames.length > 0) {
                const locationIndex = Math.floor((segmentIndex / totalPoints) * locationNames.length);
                currentLocation = locationNames[Math.min(locationIndex, locationNames.length - 1)];
              }
              
              return {
                ...bus,
                currentPosition: [newLat, newLng] as [number, number],
                progress: newProgress,
                nextStop: currentLocation,
                // Cập nhật trạng thái dựa trên tốc độ hiện tại
                status: speedMultiplier < 0.0004 ? 'stopped' as any : 'moving' as any,
                speed: Math.round((speedMultiplier * 100000) + 30) // Tốc độ ước lượng km/h
              } as any;
            }
          }
          return bus;
        })
      );
    }, 800); // Giảm interval để di chuyển mượt mà hơn

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {animatedBuses.map(bus => (
        <Marker
          key={bus.id}
          position={bus.currentPosition}
          icon={createBusIcon(selectedBusId === bus.id, bus.isMoving)}
          eventHandlers={{
            click: () => onBusSelect?.(selectedBusId === bus.id ? null : bus.id)
          }}
        >
          <Popup>
            <BusPopup bus={bus} enableBooking={enableBooking} />
          </Popup>
        </Marker>
      ))}
    </>
  );
};

// Component để center map trên bus được chọn
const CenterOnBus: React.FC<{ busId: string | null | undefined }> = ({ busId }) => {
  const map = useMap();
  
  useEffect(() => {
    if (busId) {
      const bus = REAL_BUSES.find(b => b.id === busId);
      if (bus) {
        map.setView(bus.currentPosition, 12);
      }
    }
  }, [busId, map]);
  
  return null;
};

export const OpenStreetMap: React.FC<OpenStreetMapProps> = ({
  selectedBusId,
  onBusSelect,
  width = '100%',
  height = '800px',
  enableBooking = false
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const selectedBus = REAL_BUSES.find(bus => bus.id === selectedBusId);
  const centerPosition: [number, number] = selectedBus?.currentPosition || [16.047079, 108.206230]; // Đà Nẵng

  return (
    <Paper elevation={6} sx={{ p: 2, height, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ color: '#1976D2', fontWeight: 'bold' }}>
          🗺️ Bản đồ thực tế - Theo dõi xe buýt
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            label={`${currentTime.toLocaleTimeString('vi-VN')}`}
            color="primary"
            size="small"
            icon={<AccessTimeIcon />}
          />
          <Chip 
            label={`${REAL_BUSES.length} xe đang hoạt động`}
            color="success"
            size="small"
            icon={<DirectionsBusIcon />}
          />
        </Box>
      </Box>

      <Box sx={{ position: 'relative', height: 'calc(100% - 80px)', borderRadius: 2, overflow: 'hidden' }}>
        <MapContainer
          center={centerPosition}
          zoom={8}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Hiển thị tuyến đường */}
          {Object.entries(ROUTES).map(([routeId, route]) => (
            <React.Fragment key={routeId}>
              <Polyline
                positions={route.coordinates}
                color={route.color}
                weight={6}
                opacity={0.9}
                dashArray="10, 5"
                className="highway-route"
              />
              {/* Tuyến đường nền để tạo hiệu ứng viền */}
              <Polyline
                positions={route.coordinates}
                color="#FFFFFF"
                weight={8}
                opacity={0.5}
                className="highway-route-background"
              />
              {/* Marker cho điểm đầu và cuối tuyến */}
              <Marker
                position={route.coordinates[0]}
                icon={L.divIcon({
                  html: `<div style="background: ${route.color}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; white-space: nowrap;">${route.name.split(' - ')[0]}</div>`,
                  className: 'route-label',
                  iconSize: [0, 0],
                  iconAnchor: [0, 0]
                })}
              />
              <Marker
                position={route.coordinates[route.coordinates.length - 1]}
                icon={L.divIcon({
                  html: `<div style="background: ${route.color}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; white-space: nowrap;">${route.name.split(' - ')[1]}</div>`,
                  className: 'route-label',
                  iconSize: [0, 0],
                  iconAnchor: [0, 0]
                })}
              />
              {/* Nhãn quốc lộ ở giữa tuyến */}
              {route.coordinates.length > 5 && (
                <Marker
                  position={route.coordinates[Math.floor(route.coordinates.length / 2)]}
                  icon={L.divIcon({
                    html: `<div style="background: rgba(255,255,255,0.9); color: ${route.color}; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; border: 2px solid ${route.color}; white-space: nowrap;">
                      ${routeId === 'hanoi-haiphong' ? 'QL5' : 
                        routeId === 'hanoi-danang' ? 'QL1A' : 
                        routeId === 'hcm-cantho' ? 'QL1A → QL80' : 
                        routeId === 'danang-hue' ? 'QL1A (Đèo Hải Vân)' : 'QL'}
                    </div>`,
                    className: 'highway-label',
                    iconSize: [0, 0],
                    iconAnchor: [0, -15]
                  })}
                />
              )}
            </React.Fragment>
          ))}

          {/* Hiển thị xe buýt */}
          <AnimatedBuses
            buses={REAL_BUSES}
            selectedBusId={selectedBusId}
            onBusSelect={onBusSelect}
            enableBooking={enableBooking}
          />

          {/* Center on selected bus */}
          <CenterOnBus busId={selectedBusId} />
        </MapContainer>

        {/* Control buttons */}
        <Box sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          <IconButton
            sx={{ 
              background: 'white',
              boxShadow: 2,
              '&:hover': { background: '#f5f5f5' }
            }}
            onClick={() => {
              if (mapRef.current) {
                mapRef.current.setView([16.047079, 108.206230], 6);
              }
            }}
          >
            <MyLocationIcon />
          </IconButton>
        </Box>

        {/* Legend */}
        <Box sx={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          background: 'rgba(255,255,255,0.95)',
          p: 2,
          borderRadius: 2,
          minWidth: 250,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0,0,0,0.1)'
        }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            🗺️ Bản đồ theo dõi xe bus
          </Typography>
          
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            Trạng thái xe bus:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box sx={{ width: 14, height: 14, background: '#2196F3', borderRadius: '50%' }} />
            <Typography variant="body2">Đang di chuyển trên quốc lộ</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box sx={{ width: 14, height: 14, background: '#FF5722', borderRadius: '50%' }} />
            <Typography variant="body2">Dừng tại trạm/nghỉ</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box sx={{ width: 14, height: 14, background: '#FFD700', borderRadius: '50%' }} />
            <Typography variant="body2">Xe được chọn</Typography>
          </Box>

          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Hệ thống quốc lộ:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box sx={{ width: 20, height: 3, background: '#FF5722', borderRadius: 1 }} />
            <Typography variant="body2">QL5: Hà Nội - Hải Phòng</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box sx={{ width: 20, height: 3, background: '#2196F3', borderRadius: 1 }} />
            <Typography variant="body2">QL1A: Hà Nội - Đà Nẵng</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box sx={{ width: 20, height: 3, background: '#4CAF50', borderRadius: 1 }} />
            <Typography variant="body2">QL1A→QL80: HCM - Cần Thơ</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 20, height: 3, background: '#9C27B0', borderRadius: 1 }} />
            <Typography variant="body2">QL1A: Đà Nẵng - Huế (Đèo Hải Vân)</Typography>
          </Box>

          <Typography variant="caption" sx={{ display: 'block', mt: 1.5, fontStyle: 'italic', color: 'text.secondary' }}>
            💡 Nhấn vào xe bus để xem chi tiết & đặt vé
          </Typography>
        </Box>
      </Box>

      {/* Selected bus info */}
      {selectedBus && (
        <Card sx={{
          position: 'absolute',
          top: 100,
          right: 20,
          minWidth: 300,
          maxWidth: 400,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#2196F3' }}>
                <DirectionsBusIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">{selectedBus.number}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {ROUTES[selectedBus.route as keyof typeof ROUTES].name}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Tài xế</Typography>
                <Typography variant="body1">{selectedBus.driver}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Trạng thái</Typography>
                <Chip 
                  label={selectedBus.status === 'moving' ? 'Đang di chuyển' : 'Đang dừng'}
                  color={selectedBus.status === 'moving' ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Tốc độ</Typography>
                <Typography variant="body1">{selectedBus.speed} km/h</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Hành khách</Typography>
                <Typography variant="body1">{selectedBus.passengers}/{selectedBus.maxPassengers}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Khởi hành</Typography>
                <Typography variant="body1">{selectedBus.departureTime}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Dự kiến đến</Typography>
                <Typography variant="body1">{selectedBus.arrivalTime}</Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">Trạm tiếp theo</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {selectedBus.nextStop}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </Paper>
  );
}; 