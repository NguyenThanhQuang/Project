export type LocationType =
  | "bus_station"
  | "company_office"
  | "pickup_point"
  | "rest_stop"
  | "city"
  | "other";

export interface LocationData {
  _id: string;
  name: string;
  slug: string;
  province: string;
  district?: string;
  fullAddress: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  type: LocationType;
  images?: string[];
  isActive: boolean;
}
