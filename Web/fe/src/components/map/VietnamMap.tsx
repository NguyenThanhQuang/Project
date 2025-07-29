import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';

interface VietnamMapProps {
  selectedBusId?: string | null;
  onBusSelect?: (busId: string | null) => void;
  width?: string;
  height?: string;
}

interface Province {
  id: string;
  name: string;
  path: string;
  color: string;
  capital: string;
  busRoutes: string[];
}

interface Highway {
  id: string;
  name: string;
  path: string;
  color: string;
  width: number;
}

// Dữ liệu các tỉnh thành Việt Nam (simplified)
const VIETNAM_PROVINCES: Province[] = [
  // Miền Bắc
  { id: 'hanoi', name: 'Hà Nội', path: 'M280,120 L300,115 L320,120 L315,140 L295,145 L275,135 Z', color: '#FF5722', capital: 'Hà Nội', busRoutes: ['HN-HP', 'HN-DN', 'HN-HCM'] },
  { id: 'haiphong', name: 'Hải Phòng', path: 'M320,120 L340,118 L345,135 L325,138 L320,125 Z', color: '#2196F3', capital: 'Hải Phòng', busRoutes: ['HN-HP'] },
  { id: 'quangninh', name: 'Quảng Ninh', path: 'M345,100 L370,95 L375,115 L350,120 L345,105 Z', color: '#4CAF50', capital: 'Hạ Long', busRoutes: [] },
  { id: 'laokai', name: 'Lào Cai', path: 'M220,80 L250,75 L255,95 L225,100 L220,85 Z', color: '#9C27B0', capital: 'Lào Cai', busRoutes: [] },
  { id: 'dienbien', name: 'Điện Biên', path: 'M180,100 L210,95 L215,115 L185,120 L180,105 Z', color: '#FF9800', capital: 'Điện Biên Phủ', busRoutes: [] },
  { id: 'sonla', name: 'Sơn La', path: 'M210,115 L240,110 L245,130 L215,135 L210,120 Z', color: '#607D8B', capital: 'Sơn La', busRoutes: [] },
  { id: 'hoabinh', name: 'Hòa Bình', path: 'M240,130 L270,125 L275,145 L245,150 L240,135 Z', color: '#795548', capital: 'Hòa Bình', busRoutes: [] },
  { id: 'ninhbinh', name: 'Ninh Bình', path: 'M275,145 L305,140 L310,160 L280,165 L275,150 Z', color: '#E91E63', capital: 'Ninh Bình', busRoutes: ['HN-DN'] },
  { id: 'thaibinh', name: 'Thái Bình', path: 'M305,140 L330,135 L335,155 L310,160 L305,145 Z', color: '#673AB7', capital: 'Thái Bình', busRoutes: [] },
  { id: 'hanam', name: 'Hà Nam', path: 'M280,165 L310,160 L315,180 L285,185 L280,170 Z', color: '#3F51B5', capital: 'Phủ Lý', busRoutes: [] },
  
  // Miền Trung
  { id: 'thanhhoa', name: 'Thanh Hóa', path: 'M260,185 L290,180 L295,200 L265,205 L260,190 Z', color: '#009688', capital: 'Thanh Hóa', busRoutes: ['HN-DN'] },
  { id: 'nghean', name: 'Nghệ An', path: 'M265,205 L295,200 L300,220 L270,225 L265,210 Z', color: '#4CAF50', capital: 'Vinh', busRoutes: ['HN-DN'] },
  { id: 'hatinh', name: 'Hà Tĩnh', path: 'M270,225 L300,220 L305,240 L275,245 L270,230 Z', color: '#8BC34A', capital: 'Hà Tĩnh', busRoutes: [] },
  { id: 'quangbinh', name: 'Quảng Bình', path: 'M275,245 L305,240 L310,260 L280,265 L275,250 Z', color: '#CDDC39', capital: 'Đồng Hới', busRoutes: ['HN-DN'] },
  { id: 'quangtri', name: 'Quảng Trị', path: 'M280,265 L310,260 L315,280 L285,285 L280,270 Z', color: '#FFC107', capital: 'Đông Hà', busRoutes: [] },
  { id: 'thuathienhue', name: 'Thừa Thiên Huế', path: 'M285,285 L315,280 L320,300 L290,305 L285,290 Z', color: '#FF9800', capital: 'Huế', busRoutes: ['HN-DN', 'DN-HUE'] },
  { id: 'danang', name: 'Đà Nẵng', path: 'M290,305 L320,300 L325,320 L295,325 L290,310 Z', color: '#FF5722', capital: 'Đà Nẵng', busRoutes: ['HN-DN', 'DN-HUE'] },
  { id: 'quangnam', name: 'Quảng Nam', path: 'M295,325 L325,320 L330,340 L300,345 L295,330 Z', color: '#795548', capital: 'Tam Ky', busRoutes: [] },
  { id: 'quangngai', name: 'Quảng Ngãi', path: 'M300,345 L330,340 L335,360 L305,365 L300,350 Z', color: '#9E9E9E', capital: 'Quảng Ngãi', busRoutes: [] },
  { id: 'binhdinh', name: 'Bình Định', path: 'M305,365 L335,360 L340,380 L310,385 L305,370 Z', color: '#607D8B', capital: 'Quy Nhơn', busRoutes: [] },
  { id: 'phuyen', name: 'Phú Yên', path: 'M310,385 L340,380 L345,400 L315,405 L310,390 Z', color: '#455A64', capital: 'Tuy Hòa', busRoutes: [] },
  { id: 'khanhhoa', name: 'Khánh Hòa', path: 'M315,405 L345,400 L350,420 L320,425 L315,410 Z', color: '#37474F', capital: 'Nha Trang', busRoutes: [] },
  { id: 'ninhthuan', name: 'Ninh Thuận', path: 'M320,425 L350,420 L355,440 L325,445 L320,430 Z', color: '#263238', capital: 'Phan Rang', busRoutes: [] },
  { id: 'binhthuan', name: 'Bình Thuận', path: 'M325,445 L355,440 L360,460 L330,465 L325,450 Z', color: '#3E2723', capital: 'Phan Thiết', busRoutes: [] },
  
  // Miền Nam
  { id: 'hcm', name: 'TP.HCM', path: 'M280,500 L310,495 L315,515 L285,520 L280,505 Z', color: '#FF5722', capital: 'TP.HCM', busRoutes: ['HN-HCM', 'HCM-CT'] },
  { id: 'binhduong', name: 'Bình Dương', path: 'M285,480 L315,475 L320,495 L290,500 L285,485 Z', color: '#E91E63', capital: 'Thủ Dầu Một', busRoutes: [] },
  { id: 'dongnai', name: 'Đồng Nai', path: 'M315,495 L345,490 L350,510 L320,515 L315,500 Z', color: '#9C27B0', capital: 'Biên Hòa', busRoutes: [] },
  { id: 'baria', name: 'Bà Rịa - Vũng Tàu', path: 'M320,515 L350,510 L355,530 L325,535 L320,520 Z', color: '#673AB7', capital: 'Vũng Tàu', busRoutes: [] },
  { id: 'tayninh', name: 'Tây Ninh', path: 'M250,480 L280,475 L285,495 L255,500 L250,485 Z', color: '#3F51B5', capital: 'Tây Ninh', busRoutes: [] },
  { id: 'longan', name: 'Long An', path: 'M255,500 L285,495 L290,515 L260,520 L255,505 Z', color: '#2196F3', capital: 'Tân An', busRoutes: ['HCM-CT'] },
  { id: 'tiengiang', name: 'Tiền Giang', path: 'M260,520 L290,515 L295,535 L265,540 L260,525 Z', color: '#03A9F4', capital: 'Mỹ Tho', busRoutes: ['HCM-CT'] },
  { id: 'benltre', name: 'Bến Tre', path: 'M265,540 L295,535 L300,555 L270,560 L265,545 Z', color: '#00BCD4', capital: 'Bến Tre', busRoutes: [] },
  { id: 'travinh', name: 'Trà Vinh', path: 'M270,560 L300,555 L305,575 L275,580 L270,565 Z', color: '#009688', capital: 'Trà Vinh', busRoutes: [] },
  { id: 'vinhlong', name: 'Vĩnh Long', path: 'M275,580 L305,575 L310,595 L280,600 L275,585 Z', color: '#4CAF50', capital: 'Vĩnh Long', busRoutes: [] },
  { id: 'cantho', name: 'Cần Thơ', path: 'M280,600 L310,595 L315,615 L285,620 L280,605 Z', color: '#8BC34A', capital: 'Cần Thơ', busRoutes: ['HCM-CT'] },
  { id: 'angiang', name: 'An Giang', path: 'M240,580 L270,575 L275,595 L245,600 L240,585 Z', color: '#CDDC39', capital: 'Long Xuyên', busRoutes: [] },
  { id: 'dongthap', name: 'Đồng Tháp', path: 'M245,600 L275,595 L280,615 L250,620 L245,605 Z', color: '#FFEB3B', capital: 'Cao Lãnh', busRoutes: [] },
  { id: 'kiengiang', name: 'Kiên Giang', path: 'M220,600 L250,595 L255,615 L225,620 L220,605 Z', color: '#FFC107', capital: 'Rạch Giá', busRoutes: [] },
  { id: 'camau', name: 'Cà Mau', path: 'M250,620 L280,615 L285,635 L255,640 L250,625 Z', color: '#FF9800', capital: 'Cà Mau', busRoutes: [] },
];

// Các tuyến đường cao tốc chính
const VIETNAM_HIGHWAYS: Highway[] = [
  { id: 'ql1', name: 'Quốc lộ 1A', path: 'M280,120 L290,140 L295,180 L300,220 L305,260 L310,300 L315,340 L320,380 L325,420 L330,460 L310,500 L290,520', color: '#FF5722', width: 4 },
  { id: 'ql2', name: 'Quốc lộ 2', path: 'M280,120 L260,100 L240,90 L220,85', color: '#2196F3', width: 3 },
  { id: 'ql3', name: 'Quốc lộ 3', path: 'M280,120 L270,110 L250,100 L230,95', color: '#4CAF50', width: 3 },
  { id: 'ql4', name: 'Quốc lộ 4', path: 'M280,120 L260,110 L240,105 L220,100', color: '#9C27B0', width: 3 },
  { id: 'ql5', name: 'Quốc lộ 5', path: 'M280,120 L300,118 L320,120 L340,118', color: '#FF9800', width: 3 },
  { id: 'ql6', name: 'Quốc lộ 6', path: 'M280,120 L260,125 L240,130 L220,135', color: '#795548', width: 3 },
  { id: 'ql9', name: 'Quốc lộ 9', path: 'M285,285 L265,285 L245,285 L225,285', color: '#607D8B', width: 3 },
  { id: 'ql14', name: 'Quốc lộ 14', path: 'M315,340 L295,350 L275,360 L255,370 L235,380', color: '#455A64', width: 3 },
  { id: 'ql51', name: 'Quốc lộ 51', path: 'M310,500 L330,510 L350,520', color: '#37474F', width: 3 },
  { id: 'ql91', name: 'Quốc lộ 91', path: 'M280,600 L260,605 L240,610 L220,615', color: '#263238', width: 3 },
];

// Dữ liệu xe buýt mẫu
const VIETNAM_BUSES = [
  { id: 'bus1', number: 'HN-001', route: 'Hà Nội → Hải Phòng', position: [300, 118], progress: 0.6, isMoving: true },
  { id: 'bus2', number: 'DN-002', route: 'Đà Nẵng → Huế', position: [307, 292], progress: 0.3, isMoving: true },
  { id: 'bus3', number: 'HCM-003', route: 'TP.HCM → Cần Thơ', position: [295, 557], progress: 0.8, isMoving: true },
  { id: 'bus4', number: 'HN-004', route: 'Hà Nội → Đà Nẵng', position: [297, 262], progress: 0.4, isMoving: true },
  { id: 'bus5', number: 'HCM-005', route: 'TP.HCM → Vũng Tàu', position: [337, 512], progress: 0.7, isMoving: false },
];

export const VietnamMap: React.FC<VietnamMapProps> = ({
  selectedBusId,
  onBusSelect,
  width = '100%',
  height = '800px'
}) => {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [animatedBuses, setAnimatedBuses] = useState(VIETNAM_BUSES);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Animate buses
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedBuses(prev => 
        prev.map(bus => {
          if (bus.isMoving) {
            // Simple animation along route
            const speed = 0.001;
            const newProgress = (bus.progress + speed) % 1;
            return { ...bus, progress: newProgress };
          }
          return bus;
        })
      );
      setCurrentTime(new Date());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <Paper elevation={6} sx={{ p: 2, height, background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white', textAlign: 'center', mb: 2 }}>
        🗺️ Bản đồ Việt Nam - Hệ thống xe buýt liên tỉnh
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Chip 
          label={`Cập nhật: ${currentTime.toLocaleTimeString('vi-VN')}`}
          sx={{ background: 'rgba(255,255,255,0.9)', color: '#1976D2' }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', height: 'calc(100% - 120px)' }}>
        <svg
          width="600"
          height="700"
          viewBox="0 0 600 700"
          style={{ 
            background: 'linear-gradient(135deg, #87CEEB 0%, #E0F6FF 50%, #98FB98 100%)',
            borderRadius: '10px',
            border: '2px solid #fff'
          }}
        >
          {/* Biển Đông */}
          <rect x="350" y="0" width="250" height="700" fill="url(#seaGradient)" />
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="seaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#4FC3F7', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#29B6F6', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="dropShadow">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.3)" />
            </filter>
          </defs>

          {/* Các tỉnh thành */}
          {VIETNAM_PROVINCES.map(province => (
            <path
              key={province.id}
              d={province.path}
              fill={hoveredProvince === province.id ? '#FFD700' : province.color}
              stroke="white"
              strokeWidth="1"
              opacity={hoveredProvince === province.id ? 1 : 0.8}
              style={{ 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                filter: hoveredProvince === province.id ? 'url(#dropShadow)' : 'none'
              }}
              onMouseEnter={() => setHoveredProvince(province.id)}
              onMouseLeave={() => setHoveredProvince(null)}
            />
          ))}

          {/* Tên các tỉnh thành chính */}
          {VIETNAM_PROVINCES.filter(p => ['hanoi', 'hcm', 'danang', 'cantho', 'haiphong'].includes(p.id)).map(province => {
            const coords = province.path.match(/M(\d+),(\d+)/);
            if (coords) {
              const x = parseInt(coords[1]);
              const y = parseInt(coords[2]);
              return (
                <text
                  key={`${province.id}-label`}
                  x={x}
                  y={y}
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  style={{ pointerEvents: 'none', textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
                >
                  {province.name}
                </text>
              );
            }
            return null;
          })}

          {/* Các tuyến đường cao tốc */}
          {VIETNAM_HIGHWAYS.map(highway => (
            <path
              key={highway.id}
              d={highway.path}
              fill="none"
              stroke={highway.color}
              strokeWidth={highway.width}
              strokeDasharray={highway.id === 'ql1' ? 'none' : '5,5'}
              opacity={0.9}
              style={{ filter: 'url(#dropShadow)' }}
            />
          ))}

          {/* Xe buýt */}
          {animatedBuses.map(bus => (
            <g key={bus.id}>
              {/* Bus body */}
              <rect
                x={bus.position[0] - 8}
                y={bus.position[1] - 4}
                width="16"
                height="8"
                fill={selectedBusId === bus.id ? '#FFD700' : '#2196F3'}
                stroke="white"
                strokeWidth="1"
                rx="2"
                style={{ 
                  cursor: 'pointer',
                  filter: 'url(#dropShadow)',
                  transform: selectedBusId === bus.id ? 'scale(1.2)' : 'scale(1)',
                  transformOrigin: `${bus.position[0]}px ${bus.position[1]}px`,
                  transition: 'transform 0.3s ease'
                }}
                onClick={() => onBusSelect?.(selectedBusId === bus.id ? null : bus.id)}
              />
              
              {/* Bus windows */}
              <rect
                x={bus.position[0] - 6}
                y={bus.position[1] - 3}
                width="4"
                height="2"
                fill="#87CEEB"
                style={{ pointerEvents: 'none' }}
              />
              <rect
                x={bus.position[0] - 1}
                y={bus.position[1] - 3}
                width="4"
                height="2"
                fill="#87CEEB"
                style={{ pointerEvents: 'none' }}
              />
              
              {/* Bus number */}
              <text
                x={bus.position[0]}
                y={bus.position[1] - 10}
                fill="white"
                fontSize="8"
                fontWeight="bold"
                textAnchor="middle"
                style={{ pointerEvents: 'none', textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
              >
                {bus.number}
              </text>
              
              {/* Movement indicator */}
              {bus.isMoving && (
                <circle
                  cx={bus.position[0] + 10}
                  cy={bus.position[1] - 8}
                  r="2"
                  fill="#4CAF50"
                  style={{ pointerEvents: 'none' }}
                >
                  <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          ))}

          {/* Legend */}
          <g transform="translate(20, 20)">
            <rect x="0" y="0" width="150" height="80" fill="rgba(0,0,0,0.8)" rx="5" />
            <text x="75" y="15" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">Chú thích</text>
            
            <rect x="10" y="25" width="12" height="6" fill="#2196F3" />
            <text x="25" y="30" fill="white" fontSize="8">Xe buýt</text>
            
            <circle cx="16" cy="40" r="2" fill="#4CAF50" />
            <text x="25" y="43" fill="white" fontSize="8">Đang di chuyển</text>
            
            <line x1="10" y1="55" x2="22" y2="55" stroke="#FF5722" strokeWidth="2" />
            <text x="25" y="58" fill="white" fontSize="8">Quốc lộ chính</text>
            
            <line x1="10" y1="68" x2="22" y2="68" stroke="#607D8B" strokeWidth="2" strokeDasharray="2,2" />
            <text x="25" y="71" fill="white" fontSize="8">Quốc lộ phụ</text>
          </g>
        </svg>
      </Box>

      {/* Province info panel */}
      {hoveredProvince && (
        <Box sx={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          background: 'rgba(255,255,255,0.95)',
          p: 2,
          borderRadius: 2,
          minWidth: 200,
          backdropFilter: 'blur(10px)'
        }}>
          {(() => {
            const province = VIETNAM_PROVINCES.find(p => p.id === hoveredProvince);
            return province ? (
              <>
                <Typography variant="h6" sx={{ color: province.color, fontWeight: 'bold' }}>
                  {province.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Thủ phủ: {province.capital}
                </Typography>
                {province.busRoutes.length > 0 && (
                  <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                    Tuyến xe buýt: {province.busRoutes.join(', ')}
                  </Typography>
                )}
              </>
            ) : null;
          })()}
        </Box>
      )}
    </Paper>
  );
}; 