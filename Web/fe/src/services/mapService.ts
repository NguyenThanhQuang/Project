import api from "./api";

interface Waypoint {
  longitude: number;
  latitude: number;
}

export interface RouteInfo {
  polyline: string;
  duration: number;
  distance: number;
}

/**
 * @param waypoints Mảng các điểm toạ độ (kinh độ, vĩ độ)
 * @returns Promise chứa thông tin tuyến đường
 */
export const calculateRouteInfo = async (
  waypoints: Waypoint[]
): Promise<RouteInfo> => {
  const response = await api.post<RouteInfo>("/maps/calculate-route", {
    waypoints,
  });
  return response.data;
};
