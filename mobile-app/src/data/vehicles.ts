export interface MockVehicle {
  _id: string;
  type: string;
  totalSeats: number;
  licensePlate: string;
  companyId: string;
  driverId?: string;
  status: 'active' | 'maintenance' | 'inactive';
}

export const mockVehicles: MockVehicle[] = [
  {
    _id: 'vehicle1',
    type: 'Xe khách 45 chỗ',
    totalSeats: 45,
    licensePlate: '51F-12345',
    companyId: 'company1',
    status: 'active'
  },
  {
    _id: 'vehicle2',
    type: 'Xe khách 35 chỗ',
    totalSeats: 35,
    licensePlate: '51F-67890',
    companyId: 'company2',
    status: 'active'
  },
  {
    _id: 'vehicle3',
    type: 'Xe khách 29 chỗ',
    totalSeats: 29,
    licensePlate: '51F-11111',
    companyId: 'company3',
    status: 'active'
  }
];
