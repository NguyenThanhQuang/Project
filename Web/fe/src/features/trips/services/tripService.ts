import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import api from "../../../services/api";
import type {
  Company,
  FilterOptions,
  FrontendSeat,
  SearchTripsResponse,
  SeatStatus,
  TripDetailView,
  TripSearchResult,
} from "../../../types";
import type { PopularRoute, PopulatedTrip } from "../types/trip";
dayjs.extend(duration);

interface SearchTripsParams {
  from: string;
  to: string;
  date: string;
  passengers: number;
}

const extractFilterOptions = (trips: TripSearchResult[]): FilterOptions => {
  const companies = new Map<
    string,
    Pick<Company, "_id" | "name" | "logoUrl">
  >();
  const vehicleTypes = new Set<string>();
  let maxPrice = 0;

  trips.forEach((trip) => {
    if (trip.companyId) {
      companies.set(trip.companyId._id, trip.companyId);
    }
    if (trip.vehicleId) {
      vehicleTypes.add(trip.vehicleId.type);
    }
    if (trip.price > maxPrice) {
      maxPrice = trip.price;
    }
  });

  return {
    companies: Array.from(companies.values()),
    vehicleTypes: Array.from(vehicleTypes),
    maxPrice: maxPrice > 0 ? maxPrice : 1000000,
  };
};

export const searchTrips = async (
  params: SearchTripsParams
): Promise<SearchTripsResponse> => {
  try {
    const response = await api.get<TripSearchResult[]>("/trips", { params });
    const trips = response.data;

    const filters = extractFilterOptions(trips);

    return { trips, filters };
  } catch (error) {
    console.error("Error searching trips:", error);
    return {
      trips: [],
      filters: { companies: [], vehicleTypes: [], maxPrice: 0 },
    };
  }
};

const mapPopulatedTripToView = (trip: PopulatedTrip): TripDetailView => {
  const calculateDuration = (start: string, end: string): string => {
    const startTime = dayjs(start);
    const endTime = dayjs(end);
    const diff = dayjs.duration(endTime.diff(startTime));
    const hours = Math.floor(diff.asHours());
    const minutes = diff.minutes();
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`.trim();
  };

  const generateFrontendSeats = (): {
    seats: FrontendSeat[];
    floors: 1 | 2;
  } => {
    const frontendSeats: FrontendSeat[] = [];
    const { seatMap, seatMapFloor2, floors: vehicleFloors } = trip.vehicleId;

    const backendSeatStatusMap = new Map<string, SeatStatus>();
    trip.seats.forEach((s) => {
      backendSeatStatusMap.set(s.seatNumber, s.status);
    });

    if (seatMap && seatMap.layout) {
      seatMap.layout.forEach((row, rowIndex) => {
        row.forEach((seatNumber, colIndex) => {
          if (seatNumber) {
            const seatNumStr = String(seatNumber);
            frontendSeats.push({
              id: seatNumStr,
              seatNumber: seatNumStr,
              status: backendSeatStatusMap.get(seatNumStr) || "booked",
              price: trip.price,
              position: { row: rowIndex, column: colIndex },
              floor: 1,
              type: "normal",
            });
          }
        });
      });
    }

    if (vehicleFloors > 1 && seatMapFloor2 && seatMapFloor2.layout) {
      seatMapFloor2.layout.forEach((row, rowIndex) => {
        row.forEach((seatNumber, colIndex) => {
          if (seatNumber) {
            const seatNumStr = String(seatNumber);
            frontendSeats.push({
              id: seatNumStr,
              seatNumber: seatNumStr,
              status: backendSeatStatusMap.get(seatNumStr) || "booked",
              price: trip.price,
              position: { row: rowIndex, column: colIndex },
              floor: 2,
              type: "normal",
            });
          }
        });
      });
    }

    if (frontendSeats.length === 0) {
      trip.seats.forEach((backendSeat, index) => {
        frontendSeats.push({
          id: backendSeat.seatNumber,
          seatNumber: backendSeat.seatNumber,
          status: backendSeat.status,
          price: trip.price,
          position: { row: Math.floor(index / 5), column: index % 5 },
          floor: backendSeat.seatNumber.startsWith("B") ? 2 : 1,
          type: "normal",
        });
      });
    }

    return { seats: frontendSeats, floors: vehicleFloors > 1 ? 2 : 1 };
  };

  const { seats: frontendSeats, floors } = generateFrontendSeats();

  return {
    _id: trip._id,
    companyName: trip.companyId.name,
    companyLogo: trip.companyId.logoUrl,
    vehicleType: trip.vehicleId.type,
    departureTime: new Date(trip.departureTime).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    arrivalTime: new Date(trip.expectedArrivalTime).toLocaleTimeString(
      "vi-VN",
      { hour: "2-digit", minute: "2-digit" }
    ),
    duration: calculateDuration(trip.departureTime, trip.expectedArrivalTime),
    fromLocation: trip.route.fromLocationId.name,
    toLocation: trip.route.toLocationId.name,
    price: trip.price,
    status: trip.status,
    amenities:
      trip.vehicleId.description?.split(",").map((item) => item.trim()) ?? [],
    seats: frontendSeats,
    routeStops: trip.route.stops.map((stop) => ({
      id: stop.locationId._id,
      name: stop.locationId.name,
      arrivalTime: new Date(stop.expectedArrivalTime).toLocaleTimeString(
        "vi-VN",
        { hour: "2-digit", minute: "2-digit" }
      ),
      departureTime: stop.expectedDepartureTime
        ? new Date(stop.expectedDepartureTime).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : undefined,
      status: stop.status,
    })),
    polyline: trip.route.polyline,
    seatLayout: {
      rows: trip.vehicleId.seatMap?.rows ?? 10,
      columns: trip.vehicleId.seatMap?.cols ?? 5,
      aisleAfterColumn: 2,
      floors: floors,
    },
  };
};

export const getTripDetails = async (
  tripId: string
): Promise<TripDetailView | null> => {
  try {
    const response = await api.get<PopulatedTrip>(`/trips/${tripId}`);
    return mapPopulatedTripToView(response.data);
  } catch (error) {
    console.error(`Error fetching details for trip ${tripId}:`, error);
    return null;
  }
};

export const getPopularRoutes = async (): Promise<PopularRoute[]> => {
  try {
    const response = await api.get<PopularRoute[]>("/trips/popular");
    return response.data;
  } catch (error) {
    console.error("Error fetching popular routes:", error);
    return [];
  }
};
