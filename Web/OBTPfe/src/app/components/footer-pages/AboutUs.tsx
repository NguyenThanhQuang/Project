import { useLanguage } from '../LanguageContext';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Award, Users, MapPin, Shield, TrendingUp, Heart } from 'lucide-react';

interface AboutUsProps {
  onNavigate: (page: string) => void;
}

export function AboutUs({ onNavigate }: AboutUsProps) {
  const { language } = useLanguage();

  const milestones = [
    {
      year: '2025',
      title: language === 'vi' ? 'Ra mắt VeXe.com' : 'VeXe.com Launch',
      description: language === 'vi' 
        ? 'Nền tảng đặt vé xe khách trực tuyến chính thức hoạt động, kết nối hàng trăm nhà xe và hành khách trên toàn quốc.'
        : 'Online bus ticket booking platform officially launched, connecting hundreds of bus companies and passengers nationwide.'
    },
    {
      year: '2025',
      title: language === 'vi' ? '100+ Nhà xe' : '100+ Bus Companies',
      description: language === 'vi'
        ? 'Hợp tác với hơn 100 nhà xe uy tín, cung cấp hàng nghìn chuyến đi mỗi ngày.'
        : 'Partnered with over 100 reputable bus companies, offering thousands of trips daily.'
    },
    {
      year: '2025',
      title: language === 'vi' ? '500+ Tuyến đường' : '500+ Routes',
      description: language === 'vi'
        ? 'Phủ sóng toàn quốc với hơn 500 tuyến đường phổ biến, kết nối mọi miền đất nước.'
        : 'Nationwide coverage with over 500 popular routes, connecting all regions.'
    }
  ];

  const values = [
    {
      icon: Shield,
      title: language === 'vi' ? 'Uy tín & An toàn' : 'Trust & Safety',
      description: language === 'vi'
        ? 'Cam kết bảo vệ thông tin khách hàng và đảm bảo giao dịch an toàn 100%.'
        : 'Committed to protecting customer information and ensuring 100% secure transactions.'
    },
    {
      icon: Users,
      title: language === 'vi' ? 'Khách hàng là trọng tâm' : 'Customer-Centric',
      description: language === 'vi'
        ? 'Đặt lợi ích khách hàng lên hàng đầu, hỗ trợ 24/7 mọi lúc mọi nơi.'
        : 'Putting customers first, 24/7 support anytime, anywhere.'
    },
    {
      icon: TrendingUp,
      title: language === 'vi' ? 'Đổi mới không ngừng' : 'Continuous Innovation',
      description: language === 'vi'
        ? 'Ứng dụng công nghệ hiện đại để mang đến trải nghiệm đặt vé tốt nhất.'
        : 'Applying modern technology to deliver the best booking experience.'
    },
    {
      icon: Heart,
      title: language === 'vi' ? 'Tận tâm phục vụ' : 'Dedicated Service',
      description: language === 'vi'
        ? 'Luôn lắng nghe và cải thiện dịch vụ dựa trên phản hồi từ khách hàng.'
        : 'Always listening and improving services based on customer feedback.'
    }
  ];

  const stats = [
    { number: '100+', label: language === 'vi' ? 'Nhà xe' : 'Bus Companies' },
    { number: '500+', label: language === 'vi' ? 'Tuyến đường' : 'Routes' },
    { number: '10,000+', label: language === 'vi' ? 'Chuyến/ngày' : 'Daily Trips' },
    { number: '24/7', label: language === 'vi' ? 'Hỗ trợ' : 'Support' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <Header 
        onHomeClick={() => onNavigate('home')}
        onRoutesClick={() => onNavigate('routes')}
        onContactClick={() => onNavigate('contact')}
        onTicketLookupClick={() => onNavigate('ticket-lookup')}
        onLoginClick={() => {}}
        onHotlineClick={() => {}}
      />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center space-x-3 bg-blue-100 dark:bg-blue-900/30 px-6 py-3 rounded-full mb-6">
            <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-800 dark:text-blue-300 font-semibold">
              {language === 'vi' ? 'Về VeXe.com' : 'About VeXe.com'}
            </span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {language === 'vi' 
              ? 'Nền tảng đặt vé xe khách trực tuyến hàng đầu Việt Nam' 
              : 'Vietnam\'s Leading Online Bus Ticket Booking Platform'}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            {language === 'vi'
              ? 'VeXe.com được ra mắt năm 2025 với sứ mệnh kết nối hàng triệu hành khách với các nhà xe uy tín, mang đến trải nghiệm đặt vé nhanh chóng, tiện lợi và an toàn.'
              : 'VeXe.com was launched in 2025 with the mission to connect millions of passengers with reputable bus companies, providing a fast, convenient, and secure booking experience.'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'vi' ? 'Sứ mệnh' : 'Mission'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {language === 'vi'
                ? 'Kết nối mọi hành trình, mang đến trải nghiệm đặt vé xe khách trực tuyến tốt nhất cho người Việt. Chúng tôi cam kết xây dựng một hệ sinh thái giao thông hiện đại, minh bạch và đáng tin cậy.'
                : 'Connect every journey, providing the best online bus ticket booking experience for Vietnamese people. We are committed to building a modern, transparent, and reliable transportation ecosystem.'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'vi' ? 'Tầm nhìn' : 'Vision'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {language === 'vi'
                ? 'Trở thành nền tảng đặt vé xe khách số 1 Đông Nam Á vào năm 2030, tiên phong trong việc ứng dụng công nghệ AI và Big Data để tối ưu hóa trải nghiệm khách hàng.'
                : 'Become the #1 bus ticket booking platform in Southeast Asia by 2030, pioneering the application of AI and Big Data to optimize customer experience.'}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            {language === 'vi' ? 'Hành trình phát triển' : 'Our Journey'}
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-1 flex-1 bg-gradient-to-b from-blue-600 to-teal-500 mt-2" />
                  )}
                </div>
                
                <div className="flex-1 pb-12">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            {language === 'vi' ? 'Giá trị cốt lõi' : 'Core Values'}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all hover:scale-105 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-6">
            {language === 'vi' ? 'Tại sao chọn VeXe.com?' : 'Why Choose VeXe.com?'}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-5xl font-bold mb-2">🚀</div>
              <h3 className="text-xl font-bold mb-2">
                {language === 'vi' ? 'Nhanh chóng' : 'Fast'}
              </h3>
              <p className="text-blue-100">
                {language === 'vi' 
                  ? 'Đặt vé chỉ trong 30 giây' 
                  : 'Book tickets in just 30 seconds'}
              </p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">💰</div>
              <h3 className="text-xl font-bold mb-2">
                {language === 'vi' ? 'Giá tốt nhất' : 'Best Price'}
              </h3>
              <p className="text-blue-100">
                {language === 'vi' 
                  ? 'So sánh giá từ nhiều nhà xe' 
                  : 'Compare prices from multiple companies'}
              </p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">🔒</div>
              <h3 className="text-xl font-bold mb-2">
                {language === 'vi' ? 'An toàn' : 'Secure'}
              </h3>
              <p className="text-blue-100">
                {language === 'vi' 
                  ? 'Bảo mật thông tin 100%' 
                  : '100% information security'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            {language === 'vi' ? 'Đặt vé ngay' : 'Book Now'}
          </button>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}