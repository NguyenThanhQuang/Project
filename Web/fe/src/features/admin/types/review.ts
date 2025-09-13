export interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
}

export interface AdminReview {
  _id: string;
  userId?: PopulatedUser;
  displayName: string;
  tripId: string;
  companyId: string;
  bookingId: string;
  rating: number;
  comment?: string;
  isAnonymous: boolean;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  editCount: number;
}
