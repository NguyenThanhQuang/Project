/**
 * Định nghĩa cấu trúc dữ liệu cho một chuyến đi
 * khi được lấy bởi Company Admin.
 */
export interface CompanyTrip {
  _id: string;
  route: {
    fromLocationId: { name: string; province: string };
    toLocationId: { name: string; province: string };
  };
  vehicleId: {
    type: string;
    vehicleNumber: string;
  };
  departureTime: string;
  price: number;
  status: "scheduled" | "departed" | "arrived" | "cancelled";
  seats: {
    seatNumber: string;
    status: "available" | "held" | "booked";
  }[];
}

/**
 * Định nghĩa cấu trúc dữ liệu cho một chiếc xe
 * khi được lấy bởi Company Admin.
 */
export interface CompanyVehicle {
  _id: string;
  vehicleNumber: string;
  type: string;
  totalSeats: number;
  status: "active" | "maintenance" | "inactive";
}
