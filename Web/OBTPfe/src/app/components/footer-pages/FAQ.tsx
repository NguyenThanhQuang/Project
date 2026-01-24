import { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';

interface FAQProps {
  onNavigate: (page: string) => void;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export function FAQ({ onNavigate }: FAQProps) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const faqs: FAQItem[] = language === 'vi' ? [
    // HƯỚNG DẪN ĐẶT VÉ
    {
      category: 'booking',
      question: 'Làm thế nào để đặt vé xe trên VeXe.com?',
      answer: 'Bước 1: Nhập điểm đi, điểm đến và chọn ngày khởi hành trên thanh tìm kiếm. Bước 2: Chọn chuyến xe phù hợp từ danh sách kết quả (so sánh giá, nhà xe, giờ khởi hành). Bước 3: Chọn ghế ngồi trên sơ đồ xe (ghế màu xanh là ghế trống). Bước 4: Điền thông tin hành khách (họ tên, số điện thoại, email). Bước 5: Chọn phương thức thanh toán và hoàn tất đặt vé. Toàn bộ quy trình chỉ mất khoảng 2-3 phút!'
    },
    {
      category: 'booking',
      question: 'Tôi có thể đặt vé cho nhiều người cùng lúc không?',
      answer: 'Có, bạn hoàn toàn có thể đặt nhiều vé trong cùng một đơn hàng. Tại bước chọn ghế, hãy chọn số lượng ghế tương ứng với số hành khách. Sau đó điền đầy đủ thông tin cho từng hành khách. Lưu ý: Số điện thoại và email có thể giống nhau cho tất cả hành khách.'
    },
    {
      category: 'booking',
      question: 'Tôi có cần đăng ký tài khoản để đặt vé không?',
      answer: 'Không bắt buộc. Bạn có thể đặt vé với tư cách khách (Guest) mà không cần đăng ký. Tuy nhiên, việc tạo tài khoản sẽ giúp bạn: 1) Quản lý vé dễ dàng hơn, 2) Lưu lịch sử đặt vé, 3) Nhận ưu đãi độc quyền, 4) Đặt vé nhanh hơn lần sau (đã lưu thông tin), 5) Tích điểm thành viên.'
    },
    {
      category: 'booking',
      question: 'Tôi có thể đặt vé trước bao lâu?',
      answer: 'Bạn có thể đặt vé trước từ 1 đến 30 ngày tùy theo nhà xe. Hầu hết các nhà xe cho phép đặt trước 30 ngày. Một số tuyến hot (lễ, Tết) có thể mở bán sớm hơn. Khuyến nghị đặt trước ít nhất 1-3 ngày để có nhiều lựa chọn ghế và giá tốt.'
    },
    {
      category: 'booking',
      question: 'Làm sao để chọn được ghế ngồi ưng ý?',
      answer: 'Mẹo chọn ghế: 1) Ghế đầu xe: Thoáng mát, dễ lên xuống nhưng có thể hơi ồn. 2) Ghế giữa xe: Êm ái nhất, ít rung lắc. 3) Ghế cuối xe: Yên tĩnh nhưng có thể rung nhiều hơn. 4) Tầng dưới (xe giường nằm): Thuận tiện lên xuống. 5) Tầng trên: Yên tĩnh hơn, view đẹp. Sơ đồ ghế sẽ hiển thị ghế trống (xanh), ghế đã đặt (xám) và ghế đang chọn (vàng).'
    },
    {
      category: 'booking',
      question: 'Tôi có thể đổi thông tin hành khách sau khi đặt vé không?',
      answer: 'Có thể đổi trong vòng 4 giờ sau khi đặt vé và trước 12 giờ so với giờ khởi hành. Thông tin có thể đổi: Họ tên, số điện thoại (miễn phí). Thông tin KHÔNG thể đổi: Số ghế (phải hủy và đặt lại). Liên hệ hotline 1900 6067 hoặc vào "Vé của tôi" > "Chỉnh sửa thông tin".'
    },

    // THANH TOÁN
    {
      category: 'payment',
      question: 'Những hình thức thanh toán nào được hỗ trợ?',
      answer: 'VeXe.com hỗ trợ đa dạng phương thức: 1) Thẻ ATM nội địa (tất cả ngân hàng Việt Nam), 2) Thẻ Visa/MasterCard/JCB quốc tế, 3) Ví điện tử: MoMo, ZaloPay, VNPay, ShopeePay, 4) Chuyển khoản ngân hàng (QR Code), 5) Thanh toán tại cửa hàng tiện lợi (Circle K, FamilyMart), 6) Thanh toán tại văn phòng nhà xe (một số nhà xe). Tất cả giao dịch đều được bảo mật 100% theo tiêu chuẩn PCI-DSS.'
    },
    {
      category: 'payment',
      question: 'Tôi đã thanh toán nhưng chưa nhận được vé?',
      answer: 'Vé điện tử sẽ được gửi qua email và SMS trong vòng 5 phút sau khi thanh toán thành công. Nếu sau 10 phút vẫn chưa nhận được: 1) Kiểm tra thư mục Spam/Junk, 2) Kiểm tra số điện thoại/email đã nhập đúng chưa, 3) Đăng nhập tài khoản > "Vé của tôi" để xem vé, 4) Liên hệ hotline 1900 6067 (24/7) với mã đơn hàng để được hỗ trợ ngay. Mã đơn hàng được gửi qua SMS ngay sau thanh toán.'
    },
    {
      category: 'payment',
      question: 'Tôi có được hoàn tiền nếu thanh toán nhầm/trùng?',
      answer: 'Có. Trường hợp thanh toán trùng lặp hoặc lỗi hệ thống: 1) Số tiền sẽ được hoàn tự động trong 5-7 ngày làm việc, 2) Bạn sẽ nhận SMS/Email thông báo, 3) Nếu cần gấp, liên hệ hotline với mã giao dịch, chúng tôi sẽ xử lý ưu tiên trong 24h. Lưu ý giữ lại biên lai/SMS xác nhận thanh toán để đối chiếu.'
    },
    {
      category: 'payment',
      question: 'Thanh toán có an toàn không? Thông tin thẻ có bị lộ?',
      answer: 'An toàn tuyệt đối! VeXe.com: 1) Sử dụng mã hóa SSL 256-bit, 2) Tuân thủ chuẩn bảo mật PCI-DSS Level 1, 3) KHÔNG lưu trữ thông tin thẻ tín dụng/ghi nợ, 4) Mọi giao dịch qua cổng thanh toán của ngân hàng (VNPay, OnePay), 5) Xác thực OTP/3D Secure cho mọi giao dịch. Chúng tôi cam kết bảo mật thông tin khách hàng 100%.'
    },

    // CHÍNH SÁCH HOÀN VÉ
    {
      category: 'refund',
      question: 'Chính sách hủy vé và hoàn tiền như thế nào?',
      answer: 'Chính sách hoàn tiền theo thời gian hủy: 1) Hủy trước 24 giờ: Hoàn 70% giá vé, 2) Hủy từ 12-24 giờ: Hoàn 50%, 3) Hủy từ 4-12 giờ: Hoàn 30%, 4) Hủy dưới 4 giờ: KHÔNG hoàn tiền. Phí xử lý: 10.000đ/vé cho mọi trường hợp. Thời gian hoàn tiền: 5-7 ngày làm việc về tài khoản/thẻ gốc. Lưu ý: Thời gian tính từ giờ khởi hành ghi trên vé, không phải giờ hủy.'
    },
    {
      category: 'refund',
      question: 'Làm thế nào để hủy vé đã đặt?',
      answer: 'Cách hủy vé: Cách 1: Đăng nhập > "Vé của tôi" > Chọn vé cần hủy > "Hủy vé" > Xác nhận. Cách 2: Vào trang "Tra cứu vé" > Nhập mã đặt vé/SĐT > "Hủy vé". Cách 3: Gọi hotline 1900 6067 (có phí cuộc gọi). Sau khi hủy: Bạn nhận email/SMS xác nhận hủy vé và thông tin hoàn tiền. Tiền hoàn về phương thức thanh toán ban đầu trong 5-7 ngày.'
    },
    {
      category: 'refund',
      question: 'Tôi muốn đổi vé sang chuyến khác được không?',
      answer: 'Có thể đổi vé sang chuyến khác của cùng nhà xe nếu: 1) Còn chỗ trống trên chuyến mới, 2) Đổi trước giờ khởi hành ít nhất 4 tiếng. Phí đổi vé: 20.000đ/vé. Quy trình: Liên hệ hotline 1900 6067 hoặc "Vé của tôi" > "Đổi vé" > Chọn chuyến mới > Thanh toán phí (nếu chênh lệch giá). Nếu chuyến mới rẻ hơn: Hoàn chênh lệch sau 5-7 ngày. Nếu chuyến mới đắt hơn: Thanh toán thêm ngay.'
    },
    {
      category: 'refund',
      question: 'Trường hợp nào KHÔNG được hoàn tiền?',
      answer: 'Các trường hợp KHÔNG hoàn tiền: 1) Hủy vé trong vòng 4 giờ trước giờ khởi hành, 2) Không lên xe mà không thông báo (No-show), 3) Lên trễ sau giờ khởi hành, 4) Vi phạm quy định nhà xe (say xỉn, mang vật cấm...), 5) Vé khuyến mãi đặc biệt (ghi rõ "Không hoàn/đổi"), 6) Đã sử dụng một phần hành trình (vé khứ hồi). Khuyến nghị: Đọc kỹ điều khoản trước khi đặt vé.'
    },
    {
      category: 'refund',
      question: 'Nếu nhà xe hủy chuyến thì sao?',
      answer: 'Nếu nhà xe hủy chuyến: 1) Bạn được hoàn 100% tiền vé (không mất phí), 2) Nhận thông báo qua SMS/Email ngay lập tức, 3) VeXe.com hỗ trợ đặt chuyến khác MIỄN PHÍ (nếu muốn), 4) Hoàn tiền trong 3-5 ngày làm việc (nhanh hơn bình thường). Bạn cũng có thể yêu cầu bồi thường thêm nếu gây thiệt hại (ví dụ: lỡ việc quan trọng). Liên hệ hotline để được hỗ trợ ưu tiên.'
    },

    // VÉ ĐIỆN TỬ
    {
      category: 'ticket',
      question: 'Tôi có cần in vé giấy không?',
      answer: 'KHÔNG cần thiết. VeXe.com sử dụng 100% vé điện tử: 1) Chỉ cần xuất trình mã QR trên điện thoại khi lên xe, 2) Hoặc báo mã đặt vé + SĐT cho tài xế/nhân viên, 3) Vé được gửi qua Email và SMS (lưu cả hai). Tuy nhiên, một số nhà xe vẫn yêu cầu vé giấy (rất hiếm, sẽ ghi rõ khi đặt). Khuyến nghị: Chụp ảnh hoặc download vé về máy để xem offline.'
    },
    {
      category: 'ticket',
      question: 'Làm thế nào để tra cứu vé đã đặt?',
      answer: 'Cách tra cứu vé: Cách 1 (Có tài khoản): Đăng nhập > "Vé của tôi" > Xem tất cả vé đã đặt. Cách 2 (Không tài khoản): Vào trang "Tra cứu vé" > Nhập mã đặt vé HOẶC số điện thoại > Xem chi tiết. Cách 3: Kiểm tra Email/SMS đã nhận sau khi đặt vé. Cách 4: Gọi hotline 1900 6067 với thông tin đặt vé. Thông tin hiển thị: Mã vé, chuyến đi, thời gian, ghế ngồi, điểm đón/trả, mã QR.'
    },
    {
      category: 'ticket',
      question: 'Mã QR trên vé dùng để làm gì?',
      answer: 'Mã QR có 3 chức năng: 1) Check-in lên xe: Tài xế quét mã để xác nhận bạn đã đặt vé, 2) Tra cứu nhanh: Quét mã để xem chi tiết chuyến đi, 3) Bảo mật: Mỗi vé có mã QR duy nhất, không thể làm giả. Lưu ý: GIỮ MÃ QR BÍ MẬT, không chia sẻ lên mạng xã hội để tránh bị sử dụng trái phép. Nếu mất mã QR: Vào "Vé của tôi" để xem lại hoặc gọi hotline.'
    },
    {
      category: 'ticket',
      question: 'Điện thoại hết pin/mất mạng thì sao?',
      answer: 'Không vấn đề! Bạn vẫn có thể lên xe bằng cách: 1) Báo mã đặt vé (VD: BK123456) + số điện thoại cho nhân viên, 2) Báo họ tên + số ghế đã đặt, 3) Xuất trình CMND/CCCD (khớp với tên đặt vé). Nhà xe có danh sách hành khách đầy đủ nên sẽ đối chiếu được. Khuyến nghị: Chụp ảnh vé hoặc lưu file PDF vé vào máy để xem offline khi cần.'
    },

    // HỖ TRỢ & LIÊN HỆ
    {
      category: 'support',
      question: 'Tôi có thể liên hệ bộ phận CSKH như thế nào?',
      answer: 'VeXe.com hỗ trợ 24/7 qua nhiều kênh: 1) Hotline: 1900 6067 (24/7, phí cuộc gọi thông thường), 2) Email: support@vexe.com (phản hồi trong 24h), 3) Live Chat: Góc phải màn hình (8h-22h hàng ngày), 4) Facebook Messenger: facebook.com/vexe, 5) Văn phòng: 123 Đường ABC, Quận 1, TP.HCM (8h-17h, T2-T6). Khi liên hệ, chuẩn bị sẵn: Mã đặt vé, số điện thoại, email để được hỗ trợ nhanh chóng.'
    },
    {
      category: 'support',
      question: 'Thời gian xử lý yêu cầu hỗ trợ là bao lâu?',
      answer: 'Thời gian xử lý tùy loại yêu cầu: 1) Khẩn cấp (lỡ chuyến, vấn đề thanh toán): Xử lý NGAY (< 30 phút), 2) Hủy/Đổi vé: Trong ngày (< 4 giờ), 3) Câu hỏi thông tin: 1-2 giờ (giờ hành chính), 4) Khiếu nại phức tạp: 3-5 ngày làm việc, 5) Hoàn tiền: 5-7 ngày làm việc. Hotline 1900 6067 luôn sẵn sàng hỗ trợ khẩn cấp 24/7. Bạn sẽ nhận email/SMS xác nhận sau khi yêu cầu được tiếp nhận.'
    },
    {
      category: 'support',
      question: 'VeXe.com có ứng dụng mobile không?',
      answer: 'VeXe.com đang phát triển ứng dụng mobile cho iOS và Android, dự kiến ra mắt trong quý 2/2025. Tính năng app: 1) Đặt vé nhanh hơn, 2) Nhận thông báo real-time, 3) Quản lý vé offline, 4) Thanh toán 1 chạm, 5) Tích lũy điểm thưởng. Hiện tại: Website đã được tối ưu HOÀN TOÀN cho mobile (responsive) nên bạn có thể đặt vé dễ dàng trên điện thoại. Theo dõi fanpage để cập nhật ngày ra mắt app!'
    },
    {
      category: 'support',
      question: 'Tôi có thắc mắc về nhà xe (chất lượng, dịch vụ) thì hỏi ai?',
      answer: 'Về thông tin nhà xe: 1) Xem đánh giá từ khách hàng khác trên trang chuyến đi, 2) Gọi hotline nhà xe (có trên trang chi tiết), 3) Liên hệ VeXe.com để hỏi thông tin khách quan. Về chất lượng/dịch vụ: 1) Trong chuyến đi: Liên hệ trực tiếp nhà xe, 2) Sau chuyến đi: Gửi đánh giá trên VeXe.com, 3) Khiếu nại nghiêm trọng: Email complaint@vexe.com hoặc hotline. VeXe.com sẽ làm trung gian giải quyết nếu có tranh chấp.'
    },

    // KHUYẾN MÃI
    {
      category: 'promo',
      question: 'Làm sao để sử dụng mã khuyến mãi?',
      answer: 'Cách sử dụng mã khuyến mãi: Bước 1: Chọn chuyến xe và ghế như bình thường. Bước 2: Tại trang thanh toán, tìm ô "Mã giảm giá" hoặc "Promo Code". Bước 3: Nhập mã khuyến mãi (VD: NEWYEAR2025). Bước 4: Nhấn "Áp dụng". Bước 5: Giá vé sẽ tự động giảm, kiểm tra và hoàn tất thanh toán. Lưu ý: Mỗi đơn hàng chỉ áp dụng 1 mã, không cộng dồn. Một số mã có điều kiện (giá trị tối thiểu, tuyến cụ thể).'
    },
    {
      category: 'promo',
      question: 'Tôi có thể lấy mã khuyến mãi ở đâu?',
      answer: 'Nguồn mã khuyến mãi: 1) Email thành viên (gửi định kỳ), 2) SMS trong dịp lễ/sự kiện, 3) Facebook/Zalo fanpage VeXe.com, 4) Banner trên website (trang chủ), 5) Chương trình khách hàng thân thiết (tích điểm đổi mã), 6) Hợp tác với ngân hàng, ví điện tử. Mẹo: Đăng ký nhận email marketing để được gửi mã độc quyền. Follow fanpage để cập nhật flash sale. Sinh nhật bạn sẽ nhận mã giảm giá đặc biệt!'
    },
    {
      category: 'promo',
      question: 'Tại sao mã khuyến mãi của tôi không dùng được?',
      answer: 'Các lý do thường gặp: 1) Mã đã hết hạn (kiểm tra ngày hiệu lực), 2) Đơn hàng chưa đủ giá trị tối thiểu (VD: mã yêu cầu đơn từ 200k), 3) Mã chỉ áp dụng cho tuyến cụ thể (VD: chỉ TP.HCM - Đà Lạt), 4) Mã đã hết lượt sử dụng (có giới hạn), 5) Bạn đã dùng mã này trước đó (mã dùng 1 lần/khách), 6) Nhập sai mã (kiểm tra chính tả, hoa/thường). Nếu vẫn lỗi: Liên hệ hotline với mã code và ảnh chụp màn hình lỗi.'
    }
  ] : [
    // BOOKING GUIDE
    {
      category: 'booking',
      question: 'How to book bus tickets on VeXe.com?',
      answer: 'Step 1: Enter departure, destination and date on search bar. Step 2: Choose suitable trip from results (compare price, company, time). Step 3: Select seats on bus layout (green = available). Step 4: Fill passenger info (name, phone, email). Step 5: Choose payment method and complete booking. Whole process takes only 2-3 minutes!'
    },
    {
      category: 'booking',
      question: 'Can I book tickets for multiple people?',
      answer: 'Yes, you can book multiple tickets in one order. At seat selection step, choose number of seats matching number of passengers. Then fill complete info for each passenger. Note: Phone and email can be same for all passengers.'
    },
    {
      category: 'booking',
      question: 'Do I need to register an account to book tickets?',
      answer: 'Not required. You can book as guest without registration. However, creating account helps: 1) Manage tickets easier, 2) Save booking history, 3) Receive exclusive offers, 4) Faster booking next time (saved info), 5) Earn member points.'
    },
    {
      category: 'booking',
      question: 'How far in advance can I book tickets?',
      answer: 'You can book 1-30 days in advance depending on bus company. Most companies allow 30-day advance booking. Some popular routes (holidays, Tet) may open earlier. Recommend booking 1-3 days ahead for better seat selection and prices.'
    },
    {
      category: 'booking',
      question: 'How to choose the best seat?',
      answer: 'Seat tips: 1) Front seats: Airy, easy access but may be noisy. 2) Middle seats: Smoothest ride, less vibration. 3) Back seats: Quiet but more bumpy. 4) Lower deck (sleeper): Convenient access. 5) Upper deck: Quieter, better view. Seat map shows available (green), booked (gray), and selected (yellow).'
    },
    {
      category: 'booking',
      question: 'Can I change passenger info after booking?',
      answer: 'Yes, within 4 hours after booking and before 12 hours of departure. Changeable info: Name, phone (free). NON-changeable: Seat number (must cancel and rebook). Contact hotline 1900 6067 or "My Tickets" > "Edit Info".'
    },

    // PAYMENT
    {
      category: 'payment',
      question: 'What payment methods are supported?',
      answer: 'VeXe.com supports: 1) Domestic ATM cards (all Vietnamese banks), 2) Visa/MasterCard/JCB international cards, 3) E-wallets: MoMo, ZaloPay, VNPay, ShopeePay, 4) Bank transfer (QR Code), 5) Convenience store payment (Circle K, FamilyMart), 6) Bus office payment (some companies). All transactions 100% secured by PCI-DSS standard.'
    },
    {
      category: 'payment',
      question: 'I paid but haven\'t received the ticket?',
      answer: 'E-tickets sent via email and SMS within 5 minutes after successful payment. If not received after 10 minutes: 1) Check Spam/Junk folder, 2) Verify phone/email entered correctly, 3) Login account > "My Tickets" to view, 4) Contact hotline 1900 6067 (24/7) with order code for immediate support. Order code sent via SMS right after payment.'
    },
    {
      category: 'payment',
      question: 'Will I get refund if duplicate/wrong payment?',
      answer: 'Yes. For duplicate payment or system error: 1) Auto refund in 5-7 business days, 2) You receive SMS/Email notification, 3) If urgent, contact hotline with transaction code, we prioritize within 24h. Note: Keep receipt/SMS confirmation for verification.'
    },
    {
      category: 'payment',
      question: 'Is payment secure? Will card info be leaked?',
      answer: 'Absolutely safe! VeXe.com: 1) Uses SSL 256-bit encryption, 2) PCI-DSS Level 1 compliant, 3) Does NOT store credit/debit card info, 4) All transactions via bank gateways (VNPay, OnePay), 5) OTP/3D Secure authentication for all transactions. We guarantee 100% customer information security.'
    },

    // REFUND POLICY
    {
      category: 'refund',
      question: 'What is the cancellation and refund policy?',
      answer: 'Refund policy by cancellation time: 1) Cancel before 24h: 70% refund, 2) Cancel 12-24h: 50%, 3) Cancel 4-12h: 30%, 4) Cancel under 4h: NO refund. Processing fee: 10,000đ/ticket for all cases. Refund time: 5-7 business days to original account/card. Note: Time calculated from departure time on ticket, not cancellation time.'
    },
    {
      category: 'refund',
      question: 'How to cancel booked tickets?',
      answer: 'How to cancel: Method 1: Login > "My Tickets" > Select ticket > "Cancel" > Confirm. Method 2: Go to "Ticket Lookup" > Enter booking code/phone > "Cancel". Method 3: Call hotline 1900 6067 (call charges apply). After cancellation: Receive email/SMS confirming cancellation and refund info. Money refunds to original payment method in 5-7 days.'
    },
    {
      category: 'refund',
      question: 'Can I change ticket to another trip?',
      answer: 'Yes, can change to another trip of same bus company if: 1) Seats available on new trip, 2) Change at least 4 hours before departure. Change fee: 20,000đ/ticket. Process: Contact hotline 1900 6067 or "My Tickets" > "Change" > Select new trip > Pay fee (if price difference). If new trip cheaper: Refund difference after 5-7 days. If more expensive: Pay extra immediately.'
    },
    {
      category: 'refund',
      question: 'When NO refund is given?',
      answer: 'NO refund cases: 1) Cancel within 4 hours before departure, 2) No-show without notice, 3) Late after departure time, 4) Violate bus rules (drunk, prohibited items...), 5) Special promo tickets (marked "No refund/change"), 6) Partially used journey (round trip). Recommendation: Read terms carefully before booking.'
    },
    {
      category: 'refund',
      question: 'What if bus company cancels the trip?',
      answer: 'If company cancels: 1) 100% refund (no fee), 2) Immediate SMS/Email notification, 3) VeXe.com helps book another trip FREE (if desired), 4) Refund in 3-5 business days (faster than normal). You can also claim additional compensation if damages incurred (e.g. missed important event). Contact hotline for priority support.'
    },

    // E-TICKET
    {
      category: 'ticket',
      question: 'Do I need to print the ticket?',
      answer: 'NOT necessary. VeXe.com uses 100% e-tickets: 1) Just show QR code on phone when boarding, 2) Or tell booking code + phone to driver/staff, 3) Ticket sent via Email and SMS (save both). However, some companies still require paper (very rare, clearly stated when booking). Recommendation: Screenshot or download PDF ticket for offline viewing.'
    },
    {
      category: 'ticket',
      question: 'How to look up booked tickets?',
      answer: 'How to lookup: Method 1 (With account): Login > "My Tickets" > View all booked tickets. Method 2 (No account): Go to "Ticket Lookup" > Enter booking code OR phone > View details. Method 3: Check Email/SMS received after booking. Method 4: Call hotline 1900 6067 with booking info. Displayed info: Ticket code, trip, time, seat, pickup/drop points, QR code.'
    },
    {
      category: 'ticket',
      question: 'What is QR code on ticket for?',
      answer: 'QR code has 3 functions: 1) Check-in boarding: Driver scans to verify booking, 2) Quick lookup: Scan to view trip details, 3) Security: Each ticket has unique QR, cannot be faked. Note: KEEP QR SECRET, don\'t share on social media to prevent unauthorized use. If lost QR: Go to "My Tickets" to view again or call hotline.'
    },
    {
      category: 'ticket',
      question: 'What if phone battery dies/no internet?',
      answer: 'No problem! You can still board by: 1) Tell booking code (e.g. BK123456) + phone to staff, 2) Tell name + booked seat number, 3) Show ID card (matching booking name). Bus has full passenger list for verification. Recommendation: Screenshot ticket or save PDF to phone for offline viewing when needed.'
    },

    // SUPPORT & CONTACT
    {
      category: 'support',
      question: 'How can I contact customer service?',
      answer: 'VeXe.com supports 24/7 via: 1) Hotline: 1900 6067 (24/7, standard call charges), 2) Email: support@vexe.com (reply within 24h), 3) Live Chat: Bottom right screen (8am-10pm daily), 4) Facebook Messenger: facebook.com/vexe, 5) Office: 123 ABC Street, District 1, HCMC (8am-5pm, Mon-Fri). When contacting, prepare: Booking code, phone, email for quick support.'
    },
    {
      category: 'support',
      question: 'How long does support request take?',
      answer: 'Processing time by request type: 1) Urgent (missed trip, payment issue): IMMEDIATE (< 30 min), 2) Cancel/Change ticket: Same day (< 4 hours), 3) Info questions: 1-2 hours (business hours), 4) Complex complaints: 3-5 business days, 5) Refund: 5-7 business days. Hotline 1900 6067 always ready for 24/7 urgent support. You receive email/SMS confirmation after request received.'
    },
    {
      category: 'support',
      question: 'Does VeXe.com have mobile app?',
      answer: 'VeXe.com is developing mobile apps for iOS and Android, expected launch in Q2/2025. App features: 1) Faster booking, 2) Real-time notifications, 3) Offline ticket management, 4) One-tap payment, 5) Earn reward points. Currently: Website FULLY optimized for mobile (responsive) so you can easily book on phone. Follow fanpage for app launch updates!'
    },
    {
      category: 'support',
      question: 'I have questions about bus company (quality, service), who to ask?',
      answer: 'About bus info: 1) See customer reviews on trip page, 2) Call bus company hotline (on details page), 3) Contact VeXe.com for objective info. About quality/service: 1) During trip: Contact bus company directly, 2) After trip: Submit review on VeXe.com, 3) Serious complaints: Email complaint@vexe.com or hotline. VeXe.com mediates disputes if needed.'
    },

    // PROMO
    {
      category: 'promo',
      question: 'How to use promo codes?',
      answer: 'How to use promo: Step 1: Select trip and seats as normal. Step 2: At payment page, find "Discount Code" or "Promo Code" box. Step 3: Enter promo code (e.g. NEWYEAR2025). Step 4: Click "Apply". Step 5: Ticket price auto discounts, verify and complete payment. Note: Only 1 code per order, cannot combine. Some codes have conditions (min value, specific routes).'
    },
    {
      category: 'promo',
      question: 'Where can I get promo codes?',
      answer: 'Promo code sources: 1) Member emails (sent periodically), 2) SMS during holidays/events, 3) Facebook/Zalo fanpage VeXe.com, 4) Website banners (homepage), 5) Loyalty program (earn points exchange codes), 6) Partnership with banks, e-wallets. Tip: Subscribe to marketing emails for exclusive codes. Follow fanpage for flash sale updates. Birthday receives special discount code!'
    },
    {
      category: 'promo',
      question: 'Why doesn\'t my promo code work?',
      answer: 'Common reasons: 1) Code expired (check validity date), 2) Order not meeting min value (e.g. code requires 200k+), 3) Code only for specific routes (e.g. only HCMC - Dalat), 4) Code usage limit reached, 5) Already used this code before (1 use/customer), 6) Typo in code (check spelling, case). If still error: Contact hotline with code and screenshot of error.'
    }
  ];

  const categories = [
    { id: 'all', label: language === 'vi' ? 'Tất cả' : 'All', icon: '📚' },
    { id: 'booking', label: language === 'vi' ? 'Đặt vé' : 'Booking', icon: '🎫' },
    { id: 'payment', label: language === 'vi' ? 'Thanh toán' : 'Payment', icon: '💳' },
    { id: 'refund', label: language === 'vi' ? 'Hoàn/Đổi vé' : 'Refund/Change', icon: '🔄' },
    { id: 'ticket', label: language === 'vi' ? 'Vé điện tử' : 'E-Ticket', icon: '📱' },
    { id: 'support', label: language === 'vi' ? 'Hỗ trợ' : 'Support', icon: '💬' },
    { id: 'promo', label: language === 'vi' ? 'Khuyến mãi' : 'Promo', icon: '🎁' }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const currentFaqs = filteredFaqs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <Header 
        onHomeClick={() => onNavigate('home')}
        onRoutesClick={() => onNavigate('routes')}
        onContactClick={() => onNavigate('contact')}
        onTicketLookupClick={() => onNavigate('ticket-lookup')}
        onLoginClick={() => {}}
        onHotlineClick={() => {}} />

      <main className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center space-x-3 bg-blue-100 dark:bg-blue-900/30 px-6 py-3 rounded-full mb-6">
            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-800 dark:text-blue-300 font-semibold">
              {language === 'vi' ? 'Câu hỏi thường gặp' : 'Frequently Asked Questions'}
            </span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {language === 'vi' ? 'Chúng tôi có thể giúp gì cho bạn?' : 'How can we help you?'}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            {language === 'vi'
              ? 'Tìm câu trả lời nhanh chóng cho các thắc mắc của bạn'
              : 'Find quick answers to your questions'}
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'vi' ? 'Tìm kiếm câu hỏi...' : 'Search questions...'}
              className="w-full pl-16 pr-6 py-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 shadow-lg"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-500'
              }`}
            >
              <span className="text-xl">{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          {currentFaqs.length > 0 ? (
            <div className="space-y-4">
              {currentFaqs.map((faq, index) => {
                const isExpanded = expandedIndex === index;
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all"
                  >
                    <button
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                      <span className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-6 h-6 text-gray-400 flex-shrink-0 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {isExpanded && (
                      <div className="px-6 pb-6">
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {language === 'vi' 
                  ? 'Không tìm thấy câu hỏi phù hợp' 
                  : 'No matching questions found'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="max-w-4xl mx-auto mt-8 text-center">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-l-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              {language === 'vi' ? 'Trước' : 'Previous'}
            </button>
            <span className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              {language === 'vi' ? 'Tiếp theo' : 'Next'}
            </button>
          </div>
        )}

        {/* Still need help */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'vi' ? 'Vẫn cần hỗ trợ?' : 'Still need help?'}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {language === 'vi'
                ? 'Đội ngũ hỗ trợ 24/7 của chúng tôi luôn sẵn sàng giúp đỡ bạn'
                : 'Our 24/7 support team is always ready to help you'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('contact')}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                {language === 'vi' ? 'Liên hệ ngay' : 'Contact Us'}
              </button>
              <a
                href="tel:19006067"
                className="px-8 py-4 bg-blue-800 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                📞 1900 6067
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}