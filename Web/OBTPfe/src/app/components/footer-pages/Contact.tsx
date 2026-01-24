import { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

interface ContactProps {
  onNavigate: (page: string) => void;
}

export function Contact({ onNavigate }: ContactProps) {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: Phone,
      title: language === 'vi' ? 'Hotline 24/7' : '24/7 Hotline',
      value: '1900 6067',
      link: 'tel:19006067',
      description: language === 'vi' ? 'Hỗ trợ mọi lúc mọi nơi' : 'Support anytime, anywhere'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'support@vexe.com',
      link: 'mailto:support@vexe.com',
      description: language === 'vi' ? 'Phản hồi trong 24h' : 'Reply within 24h'
    },
    {
      icon: MapPin,
      title: language === 'vi' ? 'Địa chỉ' : 'Address',
      value: language === 'vi' ? '123 Đường ABC, Quận 1, TP. Hồ Chí Minh' : '123 ABC Street, District 1, Ho Chi Minh City',
      link: 'https://maps.google.com',
      description: language === 'vi' ? 'Ghé thăm văn phòng' : 'Visit our office'
    },
    {
      icon: Clock,
      title: language === 'vi' ? 'Giờ làm việc' : 'Working Hours',
      value: language === 'vi' ? 'Hỗ trợ 24/7' : '24/7 Support',
      link: '',
      description: language === 'vi' ? 'Luôn sẵn sàng phục vụ' : 'Always ready to serve'
    }
  ];

  const socialLinks = [
    { icon: Facebook, name: 'Facebook', url: 'https://facebook.com/vexe', color: 'bg-blue-600' },
    { icon: Twitter, name: 'Twitter', url: 'https://twitter.com/vexe', color: 'bg-sky-500' },
    { icon: Instagram, name: 'Instagram', url: 'https://instagram.com/vexe', color: 'bg-pink-600' },
    { icon: Youtube, name: 'Youtube', url: 'https://youtube.com/vexe', color: 'bg-red-600' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert(language === 'vi' ? 'Vui lòng điền đầy đủ thông tin!' : 'Please fill all required fields!');
      return;
    }
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <Header 
        onHomeClick={() => onNavigate('home')}
        onRoutesClick={() => onNavigate('routes')}
        onContactClick={() => onNavigate('contact-us')}
        onTicketLookupClick={() => onNavigate('ticket-lookup')}
        onLoginClick={() => {}}
        onHotlineClick={() => {}}
      />

      <main className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center space-x-3 bg-blue-100 dark:bg-blue-900/30 px-6 py-3 rounded-full mb-6">
            <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-800 dark:text-blue-300 font-semibold">
              {language === 'vi' ? 'Liên hệ với chúng tôi' : 'Contact Us'}
            </span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {language === 'vi' ? 'Chúng Tôi Luôn Lắng Nghe' : 'We\'re Always Listening'}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {language === 'vi'
              ? 'Có thắc mắc? Cần hỗ trợ? Đừng ngần ngại liên hệ với đội ngũ hỗ trợ 24/7 của chúng tôi'
              : 'Have questions? Need support? Don\'t hesitate to contact our 24/7 support team'}
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all hover:scale-105 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                {item.link ? (
                  <a
                    href={item.link}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline block mb-2"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-gray-900 dark:text-white font-semibold mb-2">
                    {item.value}
                  </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {language === 'vi' ? 'Gửi tin nhắn' : 'Send Message'}
            </h2>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {language === 'vi' ? 'Đã gửi thành công!' : 'Sent Successfully!'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'vi'
                    ? 'Chúng tôi sẽ phản hồi trong vòng 24 giờ'
                    : 'We will respond within 24 hours'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'vi' ? 'Họ và tên' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={language === 'vi' ? 'Nguyễn Văn A' : 'John Doe'}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'vi' ? 'Số điện thoại' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0909 123 456"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'vi' ? 'Chủ đề' : 'Subject'}
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{language === 'vi' ? 'Chọn chủ đề' : 'Select subject'}</option>
                    <option value="booking">{language === 'vi' ? 'Hỗ trợ đặt vé' : 'Booking Support'}</option>
                    <option value="refund">{language === 'vi' ? 'Hoàn/Hủy vé' : 'Refund/Cancel'}</option>
                    <option value="payment">{language === 'vi' ? 'Vấn đề thanh toán' : 'Payment Issue'}</option>
                    <option value="complaint">{language === 'vi' ? 'Khiếu nại' : 'Complaint'}</option>
                    <option value="other">{language === 'vi' ? 'Khác' : 'Other'}</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'vi' ? 'Nội dung' : 'Message'} *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={language === 'vi' ? 'Nhập nội dung tin nhắn...' : 'Enter your message...'}
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Send className="w-5 h-5" />
                  <span>{language === 'vi' ? 'Gửi tin nhắn' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Map & Social */}
          <div className="space-y-6">
            {/* Map */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden h-64">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-teal-100 dark:from-blue-900/20 dark:to-teal-900/20 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-700 dark:text-gray-300 font-semibold">
                    {language === 'vi' ? 'Bản đồ văn phòng' : 'Office Map'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    123 ABC, Q1, TP.HCM
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {language === 'vi' ? 'Kết nối với chúng tôi' : 'Connect With Us'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-3 p-4 ${social.color} text-white rounded-xl hover:shadow-lg transition-all hover:scale-105`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="font-semibold">{social.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">
                {language === 'vi' ? 'Liên kết nhanh' : 'Quick Links'}
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('faq')}
                  className="w-full text-left px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                >
                  {language === 'vi' ? '❓ Câu hỏi thường gặp' : '❓ FAQs'}
                </button>
                <button
                  onClick={() => onNavigate('feedback')}
                  className="w-full text-left px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                >
                  {language === 'vi' ? '📝 Góp ý - Khiếu nại' : '📝 Feedback'}
                </button>
                <a
                  href="tel:19006067"
                  className="block px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                >
                  {language === 'vi' ? '📞 Gọi ngay: 1900 6067' : '📞 Call: 1900 6067'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ CTA */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'vi' ? 'Tìm câu trả lời nhanh?' : 'Looking for Quick Answers?'}
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              {language === 'vi'
                ? 'Xem trang Câu hỏi thường gặp để tìm giải pháp ngay lập tức'
                : 'Check our FAQ page for instant solutions'}
            </p>
            <button
              onClick={() => onNavigate('faq')}
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              {language === 'vi' ? 'Xem FAQ' : 'View FAQ'}
            </button>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}