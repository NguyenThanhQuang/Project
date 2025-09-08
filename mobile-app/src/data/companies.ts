export interface MockCompany {
  _id: string;
  name: string;
  logo?: string;
  rating?: number;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export const mockCompanies: MockCompany[] = [
  {
    _id: 'company1',
    name: 'Công ty TNHH Vận tải Phương Trang',
    logo: 'https://example.com/phuongtrang.png',
    rating: 4.5,
    description: 'Công ty vận tải hàng đầu miền Nam',
    phone: '1900 6067',
    email: 'info@phuongtrang.com.vn',
    address: 'Hồ Chí Minh'
  },
  {
    _id: 'company2',
    name: 'Công ty CP Vận tải Mai Linh',
    logo: 'https://example.com/mailinh.png',
    rating: 4.3,
    description: 'Dịch vụ vận tải chất lượng cao',
    phone: '1900 5454',
    email: 'contact@mailinh.vn',
    address: 'Hà Nội'
  },
  {
    _id: 'company3',
    name: 'Công ty TNHH Vận tải Thành Bưởi',
    logo: 'https://example.com/thanhbuoi.png',
    rating: 4.2,
    description: 'Vận tải đường dài uy tín',
    phone: '1900 6068',
    email: 'info@thanhbuoi.com',
    address: 'Hồ Chí Minh'
  },
  {
    _id: 'company4',
    name: 'Công ty TNHH Vận tải Hoàng Long',
    logo: 'https://example.com/hoanglong.png',
    rating: 4.1,
    description: 'Chuyên tuyến miền Trung - Nam',
    phone: '1900 6069',
    email: 'info@hoanglong.com.vn',
    address: 'Đà Nẵng'
  },
  {
    _id: 'company5',
    name: 'Công ty TNHH Vận tải Sao Việt',
    logo: 'https://example.com/saoviet.png',
    rating: 4.0,
    description: 'Vận tải hành khách chất lượng',
    phone: '1900 6070',
    email: 'contact@saoviet.com.vn',
    address: 'Hà Nội'
  }
];
