import { useLanguage } from '../LanguageContext';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle } from 'lucide-react';

interface PrivacyProps {
  onNavigate: (page: string) => void;
}

export function Privacy({ onNavigate }: PrivacyProps) {
  const { language } = useLanguage();

  const highlights = [
    {
      icon: Lock,
      title: language === 'vi' ? 'Mã hóa SSL' : 'SSL Encryption',
      description: language === 'vi' 
        ? 'Tất cả dữ liệu được mã hóa khi truyền tải'
        : 'All data is encrypted during transmission'
    },
    {
      icon: Shield,
      title: language === 'vi' ? 'Bảo mật 100%' : '100% Secure',
      description: language === 'vi'
        ? 'Tuân thủ tiêu chuẩn PCI-DSS'
        : 'PCI-DSS compliant'
    },
    {
      icon: Eye,
      title: language === 'vi' ? 'Không chia sẻ' : 'No Sharing',
      description: language === 'vi'
        ? 'Không bán thông tin cho bên thứ ba'
        : 'Never sell info to third parties'
    },
    {
      icon: UserCheck,
      title: language === 'vi' ? 'Quyền kiểm soát' : 'Your Control',
      description: language === 'vi'
        ? 'Bạn có quyền truy cập & xóa dữ liệu'
        : 'You can access & delete your data'
    }
  ];

  const sections = language === 'vi' ? [
    {
      title: '1. Thu thập thông tin',
      icon: Database,
      content: [
        {
          subtitle: 'Thông tin chúng tôi thu thập:',
          items: [
            'Thông tin cá nhân: Họ tên, số điện thoại, địa chỉ email, CMND/CCCD (nếu cần)',
            'Thông tin thanh toán: Loại thẻ, 4 số cuối thẻ (không lưu trữ số thẻ đầy đủ)',
            'Thông tin giao dịch: Lịch sử đặt vé, hủy vé, hoàn tiền',
            'Thông tin kỹ thuật: Địa chỉ IP, loại thiết bị, trình duyệt, hệ điều hành',
            'Dữ liệu sử dụng: Trang đã xem, thời gian truy cập, hành vi tìm kiếm'
          ]
        },
        {
          subtitle: 'Phương thức thu thập:',
          items: [
            'Trực tiếp từ bạn khi đăng ký tài khoản, đặt vé',
            'Tự động thông qua cookies và công nghệ tương tự',
            'Từ các nguồn hợp pháp khác (nếu có sự đồng ý)'
          ]
        }
      ]
    },
    {
      title: '2. Sử dụng thông tin',
      icon: UserCheck,
      content: [
        {
          subtitle: 'Chúng tôi sử dụng thông tin của bạn để:',
          items: [
            'Xử lý đơn đặt vé và cung cấp dịch vụ đã yêu cầu',
            'Gửi xác nhận đặt vé, vé điện tử, thông báo chuyến đi',
            'Xử lý thanh toán và phát hiện gian lận',
            'Cải thiện chất lượng dịch vụ và trải nghiệm người dùng',
            'Gửi thông tin khuyến mãi, ưu đãi (với sự đồng ý của bạn)',
            'Tuân thủ nghĩa vụ pháp lý và giải quyết tranh chấp',
            'Phân tích dữ liệu để cá nhân hóa nội dung'
          ]
        }
      ]
    },
    {
      title: '3. Chia sẻ thông tin',
      icon: Shield,
      content: [
        {
          subtitle: 'Chúng tôi có thể chia sẻ thông tin với:',
          items: [
            'Nhà xe: Chỉ thông tin cần thiết để thực hiện chuyến đi (tên, SĐT, số ghế)',
            'Đối tác thanh toán: Để xử lý giao dịch an toàn',
            'Nhà cung cấp dịch vụ: Email marketing, phân tích dữ liệu (theo hợp đồng bảo mật)',
            'Cơ quan nhà nước: Khi có yêu cầu hợp pháp hoặc bắt buộc theo luật',
            'Bên thứ ba khác: Chỉ khi có sự đồng ý rõ ràng của bạn'
          ]
        },
        {
          subtitle: 'Chúng tôi KHÔNG bao giờ:',
          items: [
            'Bán thông tin cá nhân cho bất kỳ bên thứ ba nào',
            'Chia sẻ thông tin thanh toán đầy đủ',
            'Sử dụng thông tin cho mục đích ngoài phạm vi đã thông báo'
          ]
        }
      ]
    },
    {
      title: '4. Bảo mật thông tin',
      icon: Lock,
      content: [
        {
          subtitle: 'Biện pháp bảo mật:',
          items: [
            'Mã hóa SSL/TLS 256-bit cho mọi giao dịch',
            'Tuân thủ chuẩn bảo mật PCI-DSS Level 1',
            'Tường lửa và hệ thống phát hiện xâm nhập',
            'Kiểm soát truy cập nghiêm ngặt theo vai trò',
            'Sao lưu dữ liệu định kỳ và mã hóa',
            'Đào tạo nhân viên về an ninh thông tin',
            'Kiểm tra bảo mật định kỳ bởi bên thứ ba'
          ]
        }
      ]
    },
    {
      title: '5. Cookies và công nghệ theo dõi',
      icon: Eye,
      content: [
        {
          subtitle: 'Chúng tôi sử dụng cookies để:',
          items: [
            'Ghi nhớ đăng nhập và tùy chọn của bạn',
            'Phân tích lưu lượng truy cập và hành vi người dùng',
            'Cải thiện hiệu suất và bảo mật website',
            'Hiển thị quảng cáo có liên quan (nếu có)'
          ]
        },
        {
          subtitle: 'Loại cookies:',
          items: [
            'Cookies cần thiết: Không thể tắt, cần cho hoạt động cơ bản',
            'Cookies chức năng: Ghi nhớ tùy chọn của bạn',
            'Cookies phân tích: Google Analytics, Facebook Pixel',
            'Cookies marketing: Quảng cáo được nhắm mục tiêu'
          ]
        },
        {
          subtitle: 'Quản lý cookies:',
          items: [
            'Bạn có thể quản lý/xóa cookies qua cài đặt trình duyệt',
            'Tắt cookies có thể ảnh hưởng đến một số tính năng',
            'Truy cập cài đặt cookie trên website để tùy chỉnh'
          ]
        }
      ]
    },
    {
      title: '6. Quyền của bạn',
      icon: UserCheck,
      content: [
        {
          subtitle: 'Bạn có quyền:',
          items: [
            'Truy cập: Xem thông tin cá nhân chúng tôi đang lưu trữ',
            'Chỉnh sửa: Cập nhật thông tin không chính xác hoặc lỗi thời',
            'Xóa: Yêu cầu xóa dữ liệu cá nhân (trừ khi bắt buộc lưu trữ)',
            'Hạn chế: Yêu cầu hạn chế xử lý thông tin',
            'Di chuyển: Yêu cầu chuyển dữ liệu sang dịch vụ khác',
            'Phản đối: Từ chối nhận email marketing',
            'Rút lại đồng ý: Hủy đồng ý đã cấp bất kỳ lúc nào'
          ]
        },
        {
          subtitle: 'Cách thực hiện quyền:',
          items: [
            'Đăng nhập tài khoản > Cài đặt > Quyền riêng tư',
            'Gửi email đến privacy@vexe.com',
            'Gọi hotline 1900 6067',
            'Chúng tôi sẽ phản hồi trong vòng 30 ngày'
          ]
        }
      ]
    },
    {
      title: '7. Lưu trữ dữ liệu',
      icon: Database,
      content: [
        {
          subtitle: 'Thời gian lưu trữ:',
          items: [
            'Thông tin tài khoản: Cho đến khi bạn yêu cầu xóa',
            'Lịch sử giao dịch: 5 năm (theo quy định pháp luật)',
            'Dữ liệu marketing: 3 năm hoặc đến khi rút lại đồng ý',
            'Logs hệ thống: 12 tháng',
            'Sau thời gian này, dữ liệu sẽ được xóa hoặc ẩn danh hóa'
          ]
        }
      ]
    },
    {
      title: '8. Quyền riêng tư của trẻ em',
      icon: AlertCircle,
      content: [
        {
          subtitle: '',
          items: [
            'Dịch vụ không dành cho trẻ em dưới 13 tuổi',
            'Chúng tôi không cố ý thu thập thông tin từ trẻ em',
            'Nếu phát hiện, dữ liệu sẽ được xóa ngay lập tức',
            'Phụ huynh có trách nhiệm giám sát việc sử dụng của con em'
          ]
        }
      ]
    },
    {
      title: '9. Cập nhật chính sách',
      icon: AlertCircle,
      content: [
        {
          subtitle: '',
          items: [
            'Chính sách này có thể được cập nhật định kỳ',
            'Thay đổi quan trọng sẽ được thông báo qua email',
            'Phiên bản mới sẽ có hiệu lực sau 30 ngày công bố',
            'Tiếp tục sử dụng dịch vụ đồng nghĩa chấp nhận thay đổi',
            'Bạn nên kiểm tra chính sách thường xuyên'
          ]
        }
      ]
    },
    {
      title: '10. Liên hệ',
      icon: UserCheck,
      content: [
        {
          subtitle: 'Nếu bạn có thắc mắc về Chính sách bảo mật, liên hệ:',
          items: [
            'Email: privacy@vexe.com',
            'Hotline: 1900 6067',
            'Địa chỉ: 123 Đường ABC, Quận 1, TP. Hồ Chí Minh',
            'Thời gian: 24/7',
            'Chúng tôi cam kết phản hồi trong vòng 48 giờ'
          ]
        }
      ]
    }
  ] : [
    {
      title: '1. Information Collection',
      icon: Database,
      content: [
        {
          subtitle: 'Information we collect:',
          items: [
            'Personal info: Name, phone, email, ID number (if required)',
            'Payment info: Card type, last 4 digits (full card number not stored)',
            'Transaction info: Booking history, cancellations, refunds',
            'Technical info: IP address, device type, browser, OS',
            'Usage data: Pages viewed, access time, search behavior'
          ]
        },
        {
          subtitle: 'Collection methods:',
          items: [
            'Directly from you when registering, booking',
            'Automatically through cookies and similar tech',
            'From other legal sources (with consent)'
          ]
        }
      ]
    },
    {
      title: '2. Information Use',
      icon: UserCheck,
      content: [
        {
          subtitle: 'We use your information to:',
          items: [
            'Process bookings and provide requested services',
            'Send booking confirmations, e-tickets, trip notifications',
            'Process payments and detect fraud',
            'Improve service quality and user experience',
            'Send promotional offers (with your consent)',
            'Comply with legal obligations and resolve disputes',
            'Analyze data to personalize content'
          ]
        }
      ]
    },
    {
      title: '3. Information Sharing',
      icon: Shield,
      content: [
        {
          subtitle: 'We may share information with:',
          items: [
            'Bus companies: Only necessary info for trip (name, phone, seat)',
            'Payment partners: To process secure transactions',
            'Service providers: Email marketing, analytics (under confidentiality)',
            'Government agencies: When legally required',
            'Other third parties: Only with your explicit consent'
          ]
        },
        {
          subtitle: 'We NEVER:',
          items: [
            'Sell personal information to any third party',
            'Share full payment information',
            'Use information beyond stated purposes'
          ]
        }
      ]
    },
    {
      title: '4. Information Security',
      icon: Lock,
      content: [
        {
          subtitle: 'Security measures:',
          items: [
            'SSL/TLS 256-bit encryption for all transactions',
            'PCI-DSS Level 1 compliance',
            'Firewall and intrusion detection systems',
            'Strict role-based access control',
            'Regular encrypted data backups',
            'Staff training on information security',
            'Regular third-party security audits'
          ]
        }
      ]
    },
    {
      title: '5. Cookies and Tracking',
      icon: Eye,
      content: [
        {
          subtitle: 'We use cookies to:',
          items: [
            'Remember login and your preferences',
            'Analyze traffic and user behavior',
            'Improve website performance and security',
            'Display relevant ads (if any)'
          ]
        },
        {
          subtitle: 'Cookie types:',
          items: [
            'Essential cookies: Cannot disable, needed for basic functions',
            'Functional cookies: Remember your preferences',
            'Analytics cookies: Google Analytics, Facebook Pixel',
            'Marketing cookies: Targeted advertising'
          ]
        },
        {
          subtitle: 'Cookie management:',
          items: [
            'Manage/delete cookies via browser settings',
            'Disabling cookies may affect some features',
            'Access cookie settings on website to customize'
          ]
        }
      ]
    },
    {
      title: '6. Your Rights',
      icon: UserCheck,
      content: [
        {
          subtitle: 'You have the right to:',
          items: [
            'Access: View personal info we store',
            'Edit: Update incorrect or outdated info',
            'Delete: Request deletion of personal data (unless required)',
            'Restrict: Request limited processing',
            'Portability: Request data transfer to another service',
            'Object: Refuse marketing emails',
            'Withdraw consent: Cancel granted consent anytime'
          ]
        },
        {
          subtitle: 'How to exercise rights:',
          items: [
            'Login account > Settings > Privacy',
            'Email privacy@vexe.com',
            'Call hotline 1900 6067',
            'We respond within 30 days'
          ]
        }
      ]
    },
    {
      title: '7. Data Retention',
      icon: Database,
      content: [
        {
          subtitle: 'Retention periods:',
          items: [
            'Account info: Until deletion request',
            'Transaction history: 5 years (legal requirement)',
            'Marketing data: 3 years or until consent withdrawal',
            'System logs: 12 months',
            'After this period, data deleted or anonymized'
          ]
        }
      ]
    },
    {
      title: '8. Children\'s Privacy',
      icon: AlertCircle,
      content: [
        {
          subtitle: '',
          items: [
            'Service not for children under 13',
            'We don\'t knowingly collect children\'s info',
            'If detected, data deleted immediately',
            'Parents responsible for monitoring children\'s use'
          ]
        }
      ]
    },
    {
      title: '9. Policy Updates',
      icon: AlertCircle,
      content: [
        {
          subtitle: '',
          items: [
            'Policy may be updated periodically',
            'Important changes notified via email',
            'New version effective 30 days after publication',
            'Continued use means accepting changes',
            'Check policy regularly'
          ]
        }
      ]
    },
    {
      title: '10. Contact',
      icon: UserCheck,
      content: [
        {
          subtitle: 'For Privacy Policy questions, contact:',
          items: [
            'Email: privacy@vexe.com',
            'Hotline: 1900 6067',
            'Address: 123 ABC Street, District 1, HCMC',
            'Hours: 24/7',
            'We respond within 48 hours'
          ]
        }
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
          <div className="inline-flex items-center space-x-3 bg-green-100 dark:bg-green-900/30 px-6 py-3 rounded-full mb-6">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-300 font-semibold">
              {language === 'vi' ? 'Chính sách bảo mật' : 'Privacy Policy'}
            </span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {language === 'vi' ? 'Chính Sách Bảo Mật' : 'Privacy Policy'}
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {language === 'vi'
              ? 'Cập nhật lần cuối: 05 Tháng 1, 2025'
              : 'Last updated: January 05, 2025'}
          </p>

          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            {language === 'vi'
              ? 'VeXe.com cam kết bảo vệ quyền riêng tư của bạn. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.'
              : 'VeXe.com is committed to protecting your privacy. This policy explains how we collect, use and protect your personal information.'}
          </p>
        </div>

        {/* Highlights */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-teal-500 rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>
                
                <div className="space-y-6">
                  {section.content.map((subsection, subIndex) => (
                    <div key={subIndex}>
                      {subsection.subtitle && (
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                          {subsection.subtitle}
                        </h3>
                      )}
                      <ul className="space-y-2">
                        {subsection.items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-start space-x-3"
                          >
                            <span className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0">●</span>
                            <span className="text-gray-600 dark:text-gray-400 leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gradient-to-r from-green-600 to-teal-500 rounded-3xl p-8 text-white text-center">
            <Shield className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">
              {language === 'vi' ? 'Bảo mật là ưu tiên hàng đầu' : 'Security is Our Top Priority'}
            </h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              {language === 'vi'
                ? 'Chúng tôi sử dụng công nghệ bảo mật tiên tiến nhất để đảm bảo thông tin của bạn luôn an toàn. Nếu có thắc mắc, đừng ngần ngại liên hệ.'
                : 'We use the most advanced security technology to ensure your information is always safe. If you have questions, don\'t hesitate to contact us.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('contact')}
                className="px-8 py-4 bg-white text-green-600 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                {language === 'vi' ? 'Liên hệ' : 'Contact'}
              </button>
              <a
                href="mailto:privacy@vexe.com"
                className="px-8 py-4 bg-green-800 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                privacy@vexe.com
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}