export interface MockUser {
  _id: string;
  email: string;
  name: string;
  phone: string;
  role: 'user' | 'admin' | 'company_admin';
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const mockUsers: MockUser[] = [
  {
    _id: 'user1',
    email: 'user@example.com',
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    role: 'user',
    avatar: 'https://via.placeholder.com/150',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'admin1',
    email: 'admin@example.com',
    name: 'Admin System',
    phone: '0987654321',
    role: 'admin',
    avatar: 'https://via.placeholder.com/150',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'company_admin1',
    email: 'company@example.com',
    name: 'Company Admin',
    phone: '0111222333',
    role: 'company_admin',
    avatar: 'https://via.placeholder.com/150',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
