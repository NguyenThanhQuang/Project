// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Container,
//   Paper,
//   Grid,
//   Chip,
//   Card,
//   CardContent,
//   Avatar,
//   LinearProgress,
//   Fade,
//   Zoom,
//   Backdrop,
//   CircularProgress,
//   Tabs,
//   Tab,
// } from "@mui/material";
// import { OpenStreetMap } from "../../../components/map/OpenStreetMap";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import SpeedIcon from "@mui/icons-material/Speed";
// import GroupIcon from "@mui/icons-material/Group";
// import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
// import SettingsIcon from "@mui/icons-material/Settings";
// import GpsFixedIcon from "@mui/icons-material/GpsFixed";

// interface BusStatus {
//   id: string;
//   number: string;
//   route: string;
//   currentLocation: string;
//   nextStop: string;
//   estimatedArrival: string;
//   speed: number;
//   delay: number;
//   passengers: number;
//   status: "moving" | "stopped" | "maintenance";
//   fuelLevel: number;
//   gpsStatus: "active" | "inactive";
//   distance: number;
// }

// const busStatuses: BusStatus[] = [
//   {
//     id: "1",
//     number: "B01",
//     route: "Hà Nội - Hải Phòng",
//     currentLocation: "Quốc lộ 5, Km 45",
//     nextStop: "Ga Hải Phòng",
//     estimatedArrival: "15:30",
//     speed: 65,
//     delay: 0,
//     passengers: 32,
//     status: "moving",
//     fuelLevel: 78,
//     gpsStatus: "active",
//     distance: 25.5,
//   },
//   {
//     id: "2",
//     number: "B02",
//     route: "Hà Nội - Đà Nẵng",
//     currentLocation: "Trạm dừng Vinh",
//     nextStop: "Ga Đồng Hới",
//     estimatedArrival: "18:45",
//     speed: 0,
//     delay: 5,
//     passengers: 28,
//     status: "stopped",
//     fuelLevel: 65,
//     gpsStatus: "active",
//     distance: 0,
//   },
//   {
//     id: "3",
//     number: "B03",
//     route: "TP.HCM - Cần Thơ",
//     currentLocation: "Quốc lộ 1A, Km 120",
//     nextStop: "Bến xe Cần Thơ",
//     estimatedArrival: "16:15",
//     speed: 70,
//     delay: 0,
//     passengers: 45,
//     status: "moving",
//     fuelLevel: 82,
//     gpsStatus: "active",
//     distance: 18.2,
//   },
//   {
//     id: "4",
//     number: "B04",
//     route: "Đà Nẵng - Huế",
//     currentLocation: "Đèo Hải Vân",
//     nextStop: "Ga Huế",
//     estimatedArrival: "14:20",
//     speed: 45,
//     delay: 0,
//     passengers: 38,
//     status: "moving",
//     fuelLevel: 71,
//     gpsStatus: "active",
//     distance: 12.8,
//   },
// ];

// const getStatusConfig = (status: string) => {
//   switch (status) {
//     case "moving":
//       return {
//         color: "#4CAF50",
//         text: "Đang di chuyển",
//         icon: "🚌",
//         bgColor: "#E8F5E8",
//       };
//     case "stopped":
//       return {
//         color: "#FF9800",
//         text: "Đang dừng",
//         icon: "🅿️",
//         bgColor: "#FFF3E0",
//       };
//     case "maintenance":
//       return {
//         color: "#F44336",
//         text: "Bảo trì",
//         icon: "🔧",
//         bgColor: "#FFEBEE",
//       };
//     default:
//       return {
//         color: "#9E9E9E",
//         text: "Không xác định",
//         icon: "❓",
//         bgColor: "#F5F5F5",
//       };
//   }
// };

// const StatCard: React.FC<{
//   title: string;
//   value: string | number;
//   subtitle?: string;
//   color: string;
//   icon: React.ReactNode;
// }> = ({ title, value, subtitle, color, icon }) => (
//   <Zoom in={true} style={{ transitionDelay: "100ms" }}>
//     <Card
//       elevation={3}
//       sx={{
//         height: "100%",
//         background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
//         border: `1px solid ${color}30`,
//         transition: "transform 0.2s ease, box-shadow 0.2s ease",
//         "&:hover": {
//           transform: "translateY(-4px)",
//           boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
//         },
//       }}
//     >
//       <CardContent sx={{ textAlign: "center", p: 3 }}>
//         <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
//           <Avatar sx={{ bgcolor: color, width: 50, height: 50 }}>{icon}</Avatar>
//         </Box>
//         <Typography variant="h4" sx={{ fontWeight: "bold", color, mb: 1 }}>
//           {value}
//         </Typography>
//         <Typography variant="body1" sx={{ fontWeight: "medium", mb: 0.5 }}>
//           {title}
//         </Typography>
//         {subtitle && (
//           <Typography variant="body2" color="text.secondary">
//             {subtitle}
//           </Typography>
//         )}
//       </CardContent>
//     </Card>
//   </Zoom>
// );

// export const BusTracking: React.FC = () => {
//   const [selectedBus, setSelectedBus] = useState<string | null>(null);
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);

//     // Simulate loading
//     setTimeout(() => setLoading(false), 1500);

//     return () => clearInterval(timer);
//   }, []);

//   if (loading) {
//     return (
//       <Backdrop open={loading} sx={{ color: "#fff", zIndex: 9999 }}>
//         <Box sx={{ textAlign: "center" }}>
//           <CircularProgress size={60} sx={{ mb: 2 }} />
//           <Typography variant="h6">Đang tải hệ thống theo dõi 3D...</Typography>
//         </Box>
//       </Backdrop>
//     );
//   }

//   return (
//     <Container maxWidth="xl" sx={{ py: 4 }}>
//       {/* Header */}
//       <Fade in={true} timeout={800}>
//         <Box sx={{ mb: 4, textAlign: "center" }}>
//           <Typography
//             variant="h3"
//             component="h1"
//             gutterBottom
//             sx={{
//               fontWeight: "bold",
//               background:
//                 "linear-gradient(45deg, #2196F3 30%, #21CBF3 70%, #00BCD4 90%)",
//               backgroundClip: "text",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               mb: 2,
//             }}
//           >
//             🚌 Theo dõi & Đặt vé xe bus
//           </Typography>
//           <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
//             Theo dõi vị trí xe bus và đặt vé trực tiếp từ bản đồ
//           </Typography>
//           <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//             💡 <strong>Tip:</strong> Nhấn vào biểu tượng xe bus trên bản đồ để
//             xem thông tin chi tiết và đặt vé ngay!
//           </Typography>
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 2,
//               justifyContent: "center",
//             }}
//           >
//             <Chip
//               label={`Cập nhật: ${currentTime.toLocaleTimeString("vi-VN")}`}
//               color="primary"
//               variant="outlined"
//               icon={<AccessTimeIcon />}
//             />
//           </Box>
//         </Box>
//       </Fade>

//       {/* Quick Stats - Thu nhỏ để tiết kiệm không gian */}
//       <Fade in={true} timeout={1000}>
//         <Grid container spacing={2} sx={{ mb: 3 }}>
//           <Grid item={true} xs={6} sm={3}>
//             <StatCard
//               title="Tổng số xe"
//               value={busStatuses.length}
//               color="#2196F3"
//               icon={<DirectionsBusIcon />}
//             />
//           </Grid>
//           <Grid item={true} xs={6} sm={3}>
//             <StatCard
//               title="Đang di chuyển"
//               value={busStatuses.filter((b) => b.status === "moving").length}
//               subtitle="Hoạt động bình thường"
//               color="#4CAF50"
//               icon={<SpeedIcon />}
//             />
//           </Grid>
//           <Grid item={true} xs={6} sm={3}>
//             <StatCard
//               title="Đang dừng"
//               value={busStatuses.filter((b) => b.status === "stopped").length}
//               subtitle="Tại trạm dừng"
//               color="#FF9800"
//               icon={<LocationOnIcon />}
//             />
//           </Grid>
//           <Grid item={true} xs={6} sm={3}>
//             <StatCard
//               title="Tổng hành khách"
//               value={busStatuses.reduce((sum, b) => sum + b.passengers, 0)}
//               subtitle="Trên tất cả xe"
//               color="#9C27B0"
//               icon={<GroupIcon />}
//             />
//           </Grid>
//         </Grid>
//       </Fade>

//       <Grid container spacing={2}>
//         {/* Map 3D - Tăng kích thước để chiếm chủ đạo */}
//         <Grid item xs={12} lg={9}>
//           <Fade in={true} timeout={1200}>
//             <Paper
//               elevation={6}
//               sx={{
//                 p: 2,
//                 height: "800px",
//                 background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
//                 border: "1px solid rgba(33, 150, 243, 0.12)",
//               }}
//             >
//               <Typography
//                 variant="h5"
//                 gutterBottom
//                 sx={{
//                   fontWeight: "bold",
//                   color: "#1976D2",
//                   mb: 2,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 1,
//                 }}
//               >
//                 <GpsFixedIcon /> Bản đồ OpenStreetMap
//               </Typography>
//               <OpenStreetMap
//                 height="750px"
//                 selectedBusId={selectedBus}
//                 onBusSelect={setSelectedBus}
//                 enableBooking={true}
//               />
//             </Paper>
//           </Fade>
//         </Grid>

//         {/* Enhanced Bus Status Panel - Giảm kích thước */}
//         <Grid item xs={12} lg={3}>
//           <Fade in={true} timeout={1400}>
//             <Paper
//               elevation={6}
//               sx={{
//                 height: "800px",
//                 overflow: "hidden",
//                 background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                 color: "white",
//               }}
//             >
//               <Box
//                 sx={{ p: 3, borderBottom: "1px solid rgba(255,255,255,0.1)" }}
//               >
//                 <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
//                   📊 Trạng thái xe bus
//                 </Typography>
//                 <Typography variant="body2" sx={{ opacity: 0.8 }}>
//                   Click vào xe để xem chi tiết
//                 </Typography>
//               </Box>

//               <Box
//                 sx={{ height: "calc(100% - 120px)", overflow: "auto", p: 2 }}
//               >
//                 {busStatuses.map((bus, index) => {
//                   const statusConfig = getStatusConfig(bus.status);
//                   const isSelected = selectedBus === bus.id;

//                   return (
//                     <Zoom
//                       key={bus.id}
//                       in={true}
//                       style={{ transitionDelay: `${index * 150}ms` }}
//                     >
//                       <Card
//                         sx={{
//                           mb: 2,
//                           cursor: "pointer",
//                           background: isSelected
//                             ? "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)"
//                             : "rgba(255,255,255,0.1)",
//                           backdropFilter: "blur(10px)",
//                           border: isSelected
//                             ? "2px solid #FFD700"
//                             : "1px solid rgba(255,255,255,0.2)",
//                           transition: "all 0.3s ease",
//                           "&:hover": {
//                             transform: "translateY(-2px)",
//                             background: "rgba(255,255,255,0.15)",
//                             boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
//                           },
//                         }}
//                         onClick={() =>
//                           setSelectedBus(isSelected ? null : bus.id)
//                         }
//                       >
//                         <CardContent sx={{ p: 2.5 }}>
//                           {/* Bus header */}
//                           <Box
//                             sx={{
//                               display: "flex",
//                               justifyContent: "space-between",
//                               alignItems: "center",
//                               mb: 2,
//                             }}
//                           >
//                             <Box
//                               sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: 1,
//                               }}
//                             >
//                               <Avatar
//                                 sx={{
//                                   bgcolor: statusConfig.color,
//                                   width: 40,
//                                   height: 40,
//                                   fontSize: "1.2rem",
//                                 }}
//                               >
//                                 {statusConfig.icon}
//                               </Avatar>
//                               <Box>
//                                 <Typography
//                                   variant="h6"
//                                   sx={{
//                                     fontWeight: "bold",
//                                     color: isSelected ? "#1976D2" : "inherit",
//                                   }}
//                                 >
//                                   {bus.number}
//                                 </Typography>
//                                 <Chip
//                                   label={statusConfig.text}
//                                   size="small"
//                                   sx={{
//                                     backgroundColor: statusConfig.color,
//                                     color: "white",
//                                     fontWeight: "bold",
//                                     fontSize: "0.7rem",
//                                   }}
//                                 />
//                               </Box>
//                             </Box>

//                             {bus.status === "moving" && (
//                               <Chip
//                                 label={`${bus.speed} km/h`}
//                                 size="small"
//                                 color="success"
//                                 icon={<SpeedIcon />}
//                               />
//                             )}
//                           </Box>

//                           {/* Route */}
//                           <Typography
//                             variant="body1"
//                             sx={{
//                               mb: 2,
//                               fontWeight: "medium",
//                               color: isSelected ? "#1976D2" : "inherit",
//                             }}
//                           >
//                             🛣️ {bus.route}
//                           </Typography>

//                           {/* Current location & Next stop */}
//                           <Box sx={{ mb: 2 }}>
//                             <Box
//                               sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 mb: 1,
//                               }}
//                             >
//                               <LocationOnIcon
//                                 sx={{ fontSize: 16, mr: 1, color: "#FF5722" }}
//                               />
//                               <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                                 {bus.currentLocation}
//                               </Typography>
//                             </Box>
//                             <Box
//                               sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 mb: 1,
//                               }}
//                             >
//                               <DirectionsBusIcon
//                                 sx={{ fontSize: 16, mr: 1, color: "#2196F3" }}
//                               />
//                               <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                                 Tiếp theo: {bus.nextStop}
//                               </Typography>
//                             </Box>
//                             <Box sx={{ display: "flex", alignItems: "center" }}>
//                               <AccessTimeIcon
//                                 sx={{ fontSize: 16, mr: 1, color: "#4CAF50" }}
//                               />
//                               <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                                 Dự kiến: {bus.estimatedArrival}
//                                 {bus.delay > 0 && (
//                                   <Chip
//                                     label={`+${bus.delay}min`}
//                                     size="small"
//                                     color="warning"
//                                     sx={{
//                                       ml: 1,
//                                       fontSize: "0.6rem",
//                                       height: "18px",
//                                     }}
//                                   />
//                                 )}
//                               </Typography>
//                             </Box>
//                           </Box>

//                           {/* Progress bars */}
//                           <Box sx={{ mb: 2 }}>
//                             <Box sx={{ mb: 1 }}>
//                               <Box
//                                 sx={{
//                                   display: "flex",
//                                   justifyContent: "space-between",
//                                   mb: 0.5,
//                                 }}
//                               >
//                                 <Typography
//                                   variant="body2"
//                                   sx={{ fontSize: "0.8rem" }}
//                                 >
//                                   👥 Hành khách
//                                 </Typography>
//                                 <Typography
//                                   variant="body2"
//                                   sx={{ fontSize: "0.8rem" }}
//                                 >
//                                   {bus.passengers}/50
//                                 </Typography>
//                               </Box>
//                               <LinearProgress
//                                 variant="determinate"
//                                 value={(bus.passengers / 50) * 100}
//                                 sx={{
//                                   height: 6,
//                                   borderRadius: 3,
//                                   "& .MuiLinearProgress-bar": {
//                                     backgroundColor:
//                                       bus.passengers > 40
//                                         ? "#FF5722"
//                                         : "#4CAF50",
//                                   },
//                                 }}
//                               />
//                             </Box>

//                             <Box>
//                               <Box
//                                 sx={{
//                                   display: "flex",
//                                   justifyContent: "space-between",
//                                   mb: 0.5,
//                                 }}
//                               >
//                                 <Typography
//                                   variant="body2"
//                                   sx={{ fontSize: "0.8rem" }}
//                                 >
//                                   ⛽ Nhiên liệu
//                                 </Typography>
//                                 <Typography
//                                   variant="body2"
//                                   sx={{ fontSize: "0.8rem" }}
//                                 >
//                                   {bus.fuelLevel}%
//                                 </Typography>
//                               </Box>
//                               <LinearProgress
//                                 variant="determinate"
//                                 value={bus.fuelLevel}
//                                 sx={{
//                                   height: 6,
//                                   borderRadius: 3,
//                                   "& .MuiLinearProgress-bar": {
//                                     backgroundColor:
//                                       bus.fuelLevel < 30
//                                         ? "#FF5722"
//                                         : "#2196F3",
//                                   },
//                                 }}
//                               />
//                             </Box>
//                           </Box>

//                           {/* Expanded info when selected */}
//                           {isSelected && (
//                             <Fade in={true} timeout={300}>
//                               <Box
//                                 sx={{
//                                   pt: 2,
//                                   borderTop: "1px solid rgba(255,255,255,0.3)",
//                                   background: "rgba(255,255,255,0.1)",
//                                   borderRadius: 2,
//                                   p: 2,
//                                   mt: 2,
//                                 }}
//                               >
//                                 <Typography
//                                   variant="body2"
//                                   sx={{ fontWeight: "bold", mb: 2 }}
//                                 >
//                                   📊 Thông tin chi tiết:
//                                 </Typography>
//                                 <Grid container spacing={1}>
//                                   <Grid item xs={6}>
//                                     <Typography
//                                       variant="body2"
//                                       sx={{ fontSize: "0.8rem" }}
//                                     >
//                                       🎯 Tỷ lệ lấp đầy:{" "}
//                                       {Math.round((bus.passengers / 50) * 100)}%
//                                     </Typography>
//                                   </Grid>
//                                   <Grid item xs={6}>
//                                     <Typography
//                                       variant="body2"
//                                       sx={{ fontSize: "0.8rem" }}
//                                     >
//                                       📡 GPS:{" "}
//                                       {bus.gpsStatus === "active"
//                                         ? "✅ Hoạt động"
//                                         : "❌ Mất tín hiệu"}
//                                     </Typography>
//                                   </Grid>
//                                   <Grid item xs={6}>
//                                     <Typography
//                                       variant="body2"
//                                       sx={{ fontSize: "0.8rem" }}
//                                     >
//                                       🔧 Động cơ: ✅ Bình thường
//                                     </Typography>
//                                   </Grid>
//                                   <Grid item xs={6}>
//                                     <Typography
//                                       variant="body2"
//                                       sx={{ fontSize: "0.8rem" }}
//                                     >
//                                       🛣️ Khoảng cách: {bus.distance}km
//                                     </Typography>
//                                   </Grid>
//                                 </Grid>
//                               </Box>
//                             </Fade>
//                           )}
//                         </CardContent>
//                       </Card>
//                     </Zoom>
//                   );
//                 })}
//               </Box>
//             </Paper>
//           </Fade>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };
