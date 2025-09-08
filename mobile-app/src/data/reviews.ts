// Mock Reviews Data
export interface MockReview {
  id: string;
  userId: string;
  tripId: string;
  companyId: string;
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
  createdAt: string;
  updatedAt?: string;
  isVerified: boolean;
  helpfulCount: number;
  images?: string[];
  tags: string[];
}

export const mockReviews: MockReview[] = [
  {
    id: 'review1',
    userId: 'user1',
    tripId: 'trip1',
    companyId: 'company1',
    rating: 5,
    title: 'Chuyến xe rất tốt, tài xế thân thiện',
    comment: 'Chuyến xe từ Hồ Chí Minh đến Đà Lạt rất thuận lợi. Xe sạch sẽ, tài xế lái xe an toàn và thân thiện. Thời gian khởi hành đúng giờ, đến đích sớm hơn dự kiến. Rất hài lòng với dịch vụ!',
    pros: ['Xe sạch sẽ', 'Tài xế thân thiện', 'Đúng giờ', 'An toàn'],
    cons: ['Không có wifi'],
    createdAt: '2024-01-15T14:30:00Z',
    isVerified: true,
    helpfulCount: 12,
    tags: ['Đúng giờ', 'An toàn', 'Thân thiện'],
  },
  {
    id: 'review2',
    userId: 'user2',
    tripId: 'trip2',
    companyId: 'company2',
    rating: 4,
    title: 'Dịch vụ tốt, giá cả hợp lý',
    comment: 'Chuyến xe từ Hà Nội đến Hạ Long khá tốt. Xe đẹp, ghế ngồi thoải mái. Tài xế lái xe cẩn thận. Chỉ có điều không có wifi và ổ cắm sạc. Nhìn chung là hài lòng.',
    pros: ['Xe đẹp', 'Ghế thoải mái', 'Tài xế cẩn thận', 'Giá hợp lý'],
    cons: ['Không có wifi', 'Không có ổ cắm sạc'],
    createdAt: '2024-01-14T16:45:00Z',
    isVerified: true,
    helpfulCount: 8,
    tags: ['Giá hợp lý', 'Thoải mái', 'Cẩn thận'],
  },
  {
    id: 'review3',
    userId: 'user3',
    tripId: 'trip3',
    companyId: 'company1',
    rating: 3,
    title: 'Chuyến xe bình thường',
    comment: 'Chuyến xe từ Đà Nẵng đến Huế khá bình thường. Xe không quá sạch nhưng cũng không quá bẩn. Tài xế lái xe ổn, đến đích đúng giờ. Không có gì đặc biệt.',
    pros: ['Đúng giờ', 'Tài xế ổn'],
    cons: ['Xe không sạch lắm', 'Không có wifi', 'Ghế cứng'],
    createdAt: '2024-01-13T12:20:00Z',
    isVerified: false,
    helpfulCount: 3,
    tags: ['Đúng giờ', 'Bình thường'],
  },
  {
    id: 'review4',
    userId: 'user4',
    tripId: 'trip4',
    companyId: 'company3',
    rating: 2,
    title: 'Không hài lòng với dịch vụ',
    comment: 'Chuyến xe từ Cần Thơ đến Hồ Chí Minh không tốt. Xe cũ, ghế ngồi không thoải mái. Tài xế lái xe ẩu, thường xuyên phanh gấp. Đến đích muộn hơn dự kiến.',
    pros: ['Giá rẻ'],
    cons: ['Xe cũ', 'Ghế không thoải mái', 'Tài xế ẩu', 'Muộn giờ'],
    createdAt: '2024-01-12T18:15:00Z',
    isVerified: true,
    helpfulCount: 15,
    tags: ['Giá rẻ', 'Xe cũ', 'Muộn giờ'],
  },
  {
    id: 'review5',
    userId: 'user5',
    tripId: 'trip5',
    companyId: 'company2',
    rating: 5,
    title: 'Trải nghiệm tuyệt vời!',
    comment: 'Chuyến xe từ Nha Trang đến Đà Lạt thực sự tuyệt vời! Xe mới, hiện đại với wifi và ổ cắm sạc. Tài xế rất chuyên nghiệp và thân thiện. Cảm giác như đi du lịch cao cấp!',
    pros: ['Xe mới hiện đại', 'Có wifi', 'Có ổ cắm sạc', 'Tài xế chuyên nghiệp', 'Thân thiện'],
    cons: ['Giá hơi cao'],
    createdAt: '2024-01-11T20:30:00Z',
    isVerified: true,
    helpfulCount: 25,
    tags: ['Xe mới', 'Hiện đại', 'Chuyên nghiệp', 'Thân thiện'],
  },
  {
    id: 'review6',
    userId: 'user6',
    tripId: 'trip6',
    companyId: 'company1',
    rating: 4,
    title: 'Dịch vụ tốt, đáng tin cậy',
    comment: 'Chuyến xe từ Vũng Tàu về Hồ Chí Minh rất tốt. Xe sạch sẽ, tài xế lái xe an toàn. Thời gian khởi hành và đến đích đều đúng giờ. Dịch vụ đáng tin cậy.',
    pros: ['Xe sạch sẽ', 'Tài xế an toàn', 'Đúng giờ', 'Đáng tin cậy'],
    cons: ['Không có wifi'],
    createdAt: '2024-01-10T15:45:00Z',
    isVerified: true,
    helpfulCount: 18,
    tags: ['Đúng giờ', 'An toàn', 'Đáng tin cậy'],
  },
  {
    id: 'review7',
    userId: 'user7',
    tripId: 'trip7',
    companyId: 'company3',
    rating: 1,
    title: 'Trải nghiệm tồi tệ',
    comment: 'Chuyến xe từ Biên Hòa đến Vũng Tàu thực sự tồi tệ. Xe rất cũ và bẩn, ghế ngồi cứng và không thoải mái. Tài xế lái xe ẩu và thô lỗ. Không bao giờ sử dụng dịch vụ này nữa.',
    pros: ['Không có'],
    cons: ['Xe cũ và bẩn', 'Ghế cứng', 'Tài xế ẩu', 'Tài xế thô lỗ', 'Muộn giờ'],
    createdAt: '2024-01-09T11:20:00Z',
    isVerified: false,
    helpfulCount: 22,
    tags: ['Xe cũ', 'Bẩn', 'Thô lỗ'],
  },
  {
    id: 'review8',
    userId: 'user8',
    tripId: 'trip8',
    companyId: 'company2',
    rating: 5,
    title: 'Dịch vụ 5 sao!',
    comment: 'Chuyến xe từ Đà Lạt về Hồ Chí Minh thực sự 5 sao! Xe mới, sạch sẽ, có wifi và ổ cắm sạc. Tài xế rất chuyên nghiệp và thân thiện. Đến đích sớm hơn dự kiến. Rất hài lòng!',
    pros: ['Xe mới', 'Sạch sẽ', 'Có wifi', 'Có ổ cắm sạc', 'Tài xế chuyên nghiệp', 'Đến sớm'],
    cons: ['Không có'],
    createdAt: '2024-01-08T19:00:00Z',
    isVerified: true,
    helpfulCount: 30,
    tags: ['5 sao', 'Xe mới', 'Chuyên nghiệp', 'Đến sớm'],
  },
];

// Helper functions
export const getReviewsByTripId = (tripId: string): MockReview[] => {
  return mockReviews.filter(review => review.tripId === tripId);
};

export const getReviewsByCompanyId = (companyId: string): MockReview[] => {
  return mockReviews.filter(review => review.companyId === companyId);
};

export const getReviewsByUserId = (userId: string): MockReview[] => {
  return mockReviews.filter(review => review.userId === userId);
};

export const getReviewsByRating = (rating: number): MockReview[] => {
  return mockReviews.filter(review => review.rating === rating);
};

export const getAverageRating = (companyId?: string): number => {
  const reviews = companyId 
    ? mockReviews.filter(review => review.companyId === companyId)
    : mockReviews;
  
  if (reviews.length === 0) return 0;
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((totalRating / reviews.length) * 10) / 10;
};

export const getRatingDistribution = (companyId?: string): Record<number, number> => {
  const reviews = companyId 
    ? mockReviews.filter(review => review.companyId === companyId)
    : mockReviews;
  
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  reviews.forEach(review => {
    distribution[review.rating]++;
  });
  
  return distribution;
};

export const addReview = (review: Omit<MockReview, 'id' | 'createdAt' | 'helpfulCount'>): MockReview => {
  const newReview: MockReview = {
    ...review,
    id: `review${Date.now()}`,
    createdAt: new Date().toISOString(),
    helpfulCount: 0,
  };
  
  mockReviews.push(newReview);
  return newReview;
};

export const updateReview = (reviewId: string, updates: Partial<MockReview>): MockReview | null => {
  const review = mockReviews.find(r => r.id === reviewId);
  if (!review) return null;
  
  Object.assign(review, updates, { updatedAt: new Date().toISOString() });
  return review;
};

export const deleteReview = (reviewId: string): boolean => {
  const index = mockReviews.findIndex(r => r.id === reviewId);
  if (index === -1) return false;
  
  mockReviews.splice(index, 1);
  return true;
};

export const markReviewAsHelpful = (reviewId: string): void => {
  const review = mockReviews.find(r => r.id === reviewId);
  if (review) {
    review.helpfulCount++;
  }
};
