import { useLanguage } from '../LanguageContext';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { FileText, CheckCircle } from 'lucide-react';

interface TermsProps {
  onNavigate: (page: string) => void;
}

export function Terms({ onNavigate }: TermsProps) {
  const { language } = useLanguage();

  const sections = language === 'vi' ? [
    {
      title: '1. Điều khoản chung',
      content: [
        'Bằng việc truy cập và sử dụng website VeXe.com, bạn đồng ý tuân thủ các điều khoản và điều kiện sử dụng dưới đây.',
        'VeXe.com là nền tảng kết nối giữa hành khách và các nhà xe, chúng tôi không trực tiếp vận hành các chuyến xe.',
        'Chúng tôi có quyền thay đổi, chỉnh sửa hoặc cập nhật điều khoản này bất kỳ lúc nào mà không cần thông báo trước.',
        'Người dùng có trách nhiệm thường xuyên kiểm tra các điều khoản để cập nhật những thay đổi mới nhất.'
      ]
    },
    {
      title: '2. Quy định về đặt vé',
      content: [
        'Người đặt vé phải cung cấp thông tin chính xác, đầy đủ và trung thực khi thực hiện giao dịch.',
        'Mỗi vé được đặt chỉ có giá trị cho một hành khách và một chuyến đi cụ thể.',
        'VeXe.com không chịu trách nhiệm nếu thông tin do khách hàng cung cấp không chính xác dẫn đến không thể sử dụng vé.',
        'Khách hàng có trách nhiệm kiểm tra kỹ thông tin vé trước khi thanh toán.',
        'Vé điện tử sẽ được gửi qua email và SMS sau khi thanh toán thành công.'
      ]
    },
    {
      title: '3. Thanh toán',
      content: [
        'VeXe.com chấp nhận nhiều hình thức thanh toán: thẻ ATM, thẻ tín dụng, ví điện tử, chuyển khoản ngân hàng.',
        'Mọi giao dịch thanh toán được thực hiện qua cổng thanh toán bảo mật, tuân thủ tiêu chuẩn PCI-DSS.',
        'Giá vé hiển thị đã bao gồm VAT và các loại phí liên quan (trừ phí dịch vụ nếu có).',
        'Trong trường hợp thanh toán thất bại, số tiền sẽ được hoàn lại vào tài khoản trong 5-7 ngày làm việc.',
        'VeXe.com không lưu trữ thông tin thẻ tín dụng/ghi nợ của khách hàng.'
      ]
    },
    {
      title: '4. Chính sách hủy và hoàn vé',
      content: [
        'Khách hàng có thể hủy vé trước giờ khởi hành theo quy định của từng nhà xe.',
        'Phí hủy vé: Hủy trước 24h (hoàn 70%), 12-24h (hoàn 50%), 4-12h (hoàn 30%), dưới 4h (không hoàn).',
        'Phí xử lý hủy vé: 10.000đ/vé cho mọi trường hợp.',
        'Thời gian hoàn tiền: 5-7 ngày làm việc kể từ khi yêu cầu hủy được chấp nhận.',
        'Không hoàn tiền trong trường hợp khách hàng không lên xe mà không thông báo trước.',
        'Một số loại vé khuyến mãi hoặc vé ưu đãi có thể không được hoàn/đổi.'
      ]
    },
    {
      title: '5. Trách nhiệm của VeXe.com',
      content: [
        'VeXe.com cam kết cung cấp thông tin chính xác về chuyến xe, giá vé, thời gian khởi hành.',
        'Chúng tôi không chịu trách nhiệm về chất lượng dịch vụ, sự chậm trễ hoặc sự cố xảy ra trong quá trình vận chuyển.',
        'VeXe.com sẽ hỗ trợ giải quyết tranh chấp giữa khách hàng và nhà xe trong khả năng có thể.',
        'Chúng tôi có quyền từ chối hoặc hủy đơn đặt vé nếu phát hiện gian lận hoặc vi phạm điều khoản.',
        'VeXe.com cam kết bảo mật thông tin cá nhân của khách hàng theo chính sách riêng tư.'
      ]
    },
    {
      title: '6. Trách nhiệm của khách hàng',
      content: [
        'Khách hàng có trách nhiệm có mặt tại điểm đón trước giờ khởi hành ít nhất 15 phút.',
        'Mang theo giấy tờ tùy thân hợp lệ và vé điện tử khi lên xe.',
        'Tuân thủ quy định của nhà xe về hành lý, vật nuôi, và các quy tắc an toàn khác.',
        'Không sử dụng dịch vụ cho mục đích bất hợp pháp hoặc vi phạm pháp luật.',
        'Chịu trách nhiệm về tài khoản và mật khẩu cá nhân, thông báo ngay nếu phát hiện sử dụng trái phép.'
      ]
    },
    {
      title: '7. Giới hạn trách nhiệm',
      content: [
        'VeXe.com không chịu trách nhiệm về bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên hoặc hậu quả nào phát sinh từ việc sử dụng dịch vụ.',
        'Chúng tôi không đảm bảo rằng dịch vụ sẽ hoạt động liên tục, không gián đoạn hoặc không có lỗi.',
        'VeXe.com không chịu trách nhiệm về mất mát hoặc thiệt hại do sự cố kỹ thuật, hệ thống, hoặc lỗi của bên thứ ba.',
        'Trách nhiệm tối đa của VeXe.com bị giới hạn ở giá trị vé đã thanh toán.'
      ]
    },
    {
      title: '8. Quyền sở hữu trí tuệ',
      content: [
        'Mọi nội dung trên website VeXe.com (logo, thiết kế, văn bản, hình ảnh) đều thuộc quyền sở hữu của chúng tôi.',
        'Nghiêm cấm sao chép, phân phối, hoặc sử dụng nội dung cho mục đích thương mại mà không có sự cho phép.',
        'Khách hàng được cấp quyền sử dụng giới hạn, không độc quyền để truy cập và sử dụng dịch vụ.',
        'Vi phạm quyền sở hữu trí tuệ có thể bị truy cứu trách nhiệm pháp lý.'
      ]
    },
    {
      title: '9. Luật áp dụng và giải quyết tranh chấp',
      content: [
        'Các điều khoản này được điều chỉnh và giải thích theo luật pháp Việt Nam.',
        'Mọi tranh chấp phát sinh sẽ được giải quyết thông qua thương lượng, hòa giải.',
        'Nếu không đạt được thỏa thuận, tranh chấp sẽ được đưa ra Tòa án có thẩm quyền tại TP. Hồ Chí Minh.',
        'VeXe.com khuyến khích khách hàng liên hệ bộ phận CSKH trước khi thực hiện các thủ tục pháp lý.'
      ]
    },
    {
      title: '10. Liên hệ',
      content: [
        'Nếu có bất kỳ thắc mắc nào về Điều khoản sử dụng, vui lòng liên hệ:',
        'Email: legal@vexe.com',
        'Hotline: 1900 6067',
        'Địa chỉ: 123 Đường ABC, Quận 1, TP. Hồ Chí Minh',
        'Thời gian hỗ trợ: 24/7'
      ]
    }
  ] : [
    {
      title: '1. General Terms',
      content: [
        'By accessing and using VeXe.com website, you agree to comply with the following terms and conditions.',
        'VeXe.com is a platform connecting passengers and bus companies; we do not directly operate bus trips.',
        'We reserve the right to change, modify or update these terms at any time without prior notice.',
        'Users are responsible for regularly checking the terms to stay updated with the latest changes.'
      ]
    },
    {
      title: '2. Booking Regulations',
      content: [
        'Bookers must provide accurate, complete and truthful information when making transactions.',
        'Each booked ticket is only valid for one passenger and one specific trip.',
        'VeXe.com is not responsible if incorrect customer information leads to ticket unusability.',
        'Customers are responsible for carefully checking ticket information before payment.',
        'E-tickets will be sent via email and SMS after successful payment.'
      ]
    },
    {
      title: '3. Payment',
      content: [
        'VeXe.com accepts multiple payment methods: ATM cards, credit cards, e-wallets, bank transfers.',
        'All payment transactions are made through secure payment gateways, complying with PCI-DSS standards.',
        'Displayed ticket prices include VAT and related fees (excluding service fees if any).',
        'In case of payment failure, the amount will be refunded to the account within 5-7 business days.',
        'VeXe.com does not store customer credit/debit card information.'
      ]
    },
    {
      title: '4. Cancellation and Refund Policy',
      content: [
        'Customers can cancel tickets before departure according to each bus company\'s regulations.',
        'Cancellation fees: Before 24h (70% refund), 12-24h (50%), 4-12h (30%), under 4h (no refund).',
        'Cancellation processing fee: 10,000đ/ticket for all cases.',
        'Refund time: 5-7 business days from when cancellation request is accepted.',
        'No refund if customer doesn\'t board without prior notice.',
        'Some promotional or discounted tickets may not be refundable/changeable.'
      ]
    },
    {
      title: '5. VeXe.com Responsibilities',
      content: [
        'VeXe.com commits to providing accurate information about trips, fares, departure times.',
        'We are not responsible for service quality, delays or incidents during transportation.',
        'VeXe.com will support resolving disputes between customers and bus companies when possible.',
        'We reserve the right to refuse or cancel bookings if fraud or violation is detected.',
        'VeXe.com commits to protecting customer personal information according to privacy policy.'
      ]
    },
    {
      title: '6. Customer Responsibilities',
      content: [
        'Customers must be present at pickup point at least 15 minutes before departure.',
        'Bring valid identification and e-ticket when boarding.',
        'Comply with bus company regulations on luggage, pets, and other safety rules.',
        'Not use the service for illegal purposes or law violations.',
        'Be responsible for personal account and password, notify immediately if unauthorized use detected.'
      ]
    },
    {
      title: '7. Limitation of Liability',
      content: [
        'VeXe.com is not liable for any direct, indirect, incidental or consequential damages arising from service use.',
        'We do not guarantee that the service will operate continuously, uninterrupted or error-free.',
        'VeXe.com is not responsible for losses or damages due to technical issues, system, or third-party errors.',
        'VeXe.com\'s maximum liability is limited to the paid ticket value.'
      ]
    },
    {
      title: '8. Intellectual Property Rights',
      content: [
        'All content on VeXe.com website (logo, design, text, images) is our property.',
        'Strictly prohibited to copy, distribute, or use content for commercial purposes without permission.',
        'Customers are granted limited, non-exclusive rights to access and use the service.',
        'Intellectual property rights violations may be subject to legal prosecution.'
      ]
    },
    {
      title: '9. Applicable Law and Dispute Resolution',
      content: [
        'These terms are governed and interpreted according to Vietnamese law.',
        'All arising disputes will be resolved through negotiation and mediation.',
        'If no agreement is reached, disputes will be submitted to competent Court in Ho Chi Minh City.',
        'VeXe.com encourages customers to contact customer service before taking legal procedures.'
      ]
    },
    {
      title: '10. Contact',
      content: [
        'If you have any questions about the Terms of Use, please contact:',
        'Email: legal@vexe.com',
        'Hotline: 1900 6067',
        'Address: 123 ABC Street, District 1, Ho Chi Minh City',
        'Support time: 24/7'
      ]
    }
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
        {/* Hero */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center space-x-3 bg-blue-100 dark:bg-blue-900/30 px-6 py-3 rounded-full mb-6">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-800 dark:text-blue-300 font-semibold">
              {language === 'vi' ? 'Điều khoản sử dụng' : 'Terms of Service'}
            </span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {language === 'vi' ? 'Điều Khoản Sử Dụng Dịch Vụ' : 'Terms of Service'}
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {language === 'vi'
              ? 'Cập nhật lần cuối: 05 Tháng 1, 2025'
              : 'Last updated: January 05, 2025'}
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  {language === 'vi' ? 'Lưu ý quan trọng' : 'Important Notice'}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {language === 'vi'
                    ? 'Vui lòng đọc kỹ các điều khoản và điều kiện dưới đây trước khi sử dụng dịch vụ của VeXe.com. Việc sử dụng dịch vụ đồng nghĩa với việc bạn đã đọc, hiểu và đồng ý với tất cả các điều khoản này.'
                    : 'Please read carefully the following terms and conditions before using VeXe.com services. Using the service means you have read, understood and agreed to all these terms.'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start space-x-3"
                    >
                      <span className="text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0">●</span>
                      <span className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              {language === 'vi' ? 'Cần hỗ trợ thêm?' : 'Need More Help?'}
            </h3>
            <p className="text-blue-100 mb-6">
              {language === 'vi'
                ? 'Nếu bạn có bất kỳ thắc mắc nào về Điều khoản sử dụng, đừng ngần ngại liên hệ với chúng tôi'
                : 'If you have any questions about the Terms of Service, don\'t hesitate to contact us'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('contact')}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                {language === 'vi' ? 'Liên hệ ngay' : 'Contact Us'}
              </button>
              <button
                onClick={() => onNavigate('faq')}
                className="px-8 py-4 bg-blue-800 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                {language === 'vi' ? 'Xem FAQ' : 'View FAQ'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}