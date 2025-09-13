export interface ReviewFormData {
  bookingId: string;
  tripId: string;
  rating: number;
  comment?: string;
  isAnonymous: boolean;
  contactPhone?: string;
}
