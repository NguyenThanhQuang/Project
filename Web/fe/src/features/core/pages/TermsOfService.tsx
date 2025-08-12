import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Alert,
  Chip,
} from '@mui/material';
import { Gavel, Security, DirectionsBus, Phone } from '@mui/icons-material';

const TermsOfService: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Chip
          icon={<Gavel />}
          label="Điều khoản dịch vụ"
          color="primary"
          sx={{ mb: 2, px: 2, py: 1, fontSize: '1rem' }}
        />
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
          ĐIỀU KHOẢN VÀ ĐIỀU KIỆN SỬ DỤNG DỊCH VỤ
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
          Nền tảng đặt vé xe khách trực tuyến BusBooking
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Phiên bản hiệu lực từ ngày: {new Date().toLocaleDateString('vi-VN')}
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
          I. ĐIỀU KHOẢN VÀ QUY ĐỊNH CHUNG
        </Typography>

        <Card sx={{ mb: 3, bgcolor: 'primary.50' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              Điều 1. Giải thích từ ngữ và từ viết tắt
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="1. &quot;Biểu phí&quot;" 
                  secondary="là các loại phí thuế theo quy định của Nhà xe và Nhà chức trách có thẩm quyền;"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="2. &quot;Bến xe khách&quot;" 
                  secondary="là công trình thuộc kết cấu hạ tầng giao thông đường bộ thực hiện chức năng phục vụ xe khách đón, trả hành khách và các dịch vụ hỗ trợ vận tải hành khách;"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="3. &quot;Chúng tôi&quot; / &quot;BusBooking&quot;" 
                  secondary="là nền tảng đặt vé xe khách trực tuyến BusBooking, cung cấp dịch vụ kết nối hành khách với các nhà xe;"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="4. &quot;Điểm đón/trả&quot;" 
                  secondary="là điểm khởi hành và điểm đến theo lịch trong hành trình của khách hàng;"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="5. &quot;Điều kiện bất khả kháng&quot;" 
                  secondary="là sự kiện xảy ra mang tính khách quan và nằm ngoài tầm kiểm soát của các bên bao gồm nhưng không giới hạn đến động đất, bão, lũ lụt, lốc, sóng thần, lở đất, hỏa hoạn, chiến tranh, bạo động, nổi loạn, đình công và các thảm họa khác, sự thay đổi chính sách hoặc ngăn cấm của cơ quan có thẩm quyền;"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="6. &quot;Điều kiện vận chuyển&quot;" 
                  secondary="là các yêu cầu, nội dung của BusBooking và nhà xe thông báo đến hành khách liên quan đến các dịch vụ vận chuyển, bao gồm các thông tin được thể hiện trên vé/phiếu xác nhận và/hoặc trên website, ứng dụng di động;"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="7. &quot;Hành khách&quot;" 
                  secondary="là bất kỳ cá nhân nào sử dụng dịch vụ của BusBooking để đặt vé xe khách;"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="8. &quot;Hành lý&quot;" 
                  secondary="là những vật phẩm, đồ dùng tư trang và tài sản cá nhân của hành khách mang theo, sử dụng trong chuyến đi của mình;"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="9. &quot;Hợp đồng vận chuyển&quot;" 
                  secondary="là các thỏa thuận giữa nhà xe và hành khách trong việc cung cấp các dịch vụ vận chuyển được thể hiện bằng vé điện tử hoặc hình thức khác có giá trị tương đương;"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="10. &quot;Hóa đơn điện tử&quot;" 
                  secondary="hóa đơn có mã hoặc không có mã của cơ quan thuế được thể hiện ở dạng dữ liệu điện tử do BusBooking hoặc nhà xe cung cấp dịch vụ;"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="11. &quot;Mã tra cứu&quot;" 
                  secondary="là mã số bao gồm 9 ký tự được hiển thị trong thông tin mua vé, dùng cho việc tra cứu hóa đơn điện tử sau khi khách hàng thanh toán thành công;"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="12. &quot;Mã đặt vé&quot;" 
                  secondary="là các thông tin chi tiết của hành khách đã được nhập vào hệ thống đặt giữ chỗ của BusBooking thông qua website hoặc ứng dụng di động, tổng đài hoặc đại lý;"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="13. &quot;Nhà xe&quot;" 
                  secondary="là các công ty vận tải hành khách đã đăng ký và được phê duyệt trên nền tảng BusBooking;"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="14. &quot;Thông tin cá nhân&quot;" 
                  secondary="là dữ liệu cá nhân của hành khách được BusBooking thu thập, xử lý và lưu trữ nhằm mục đích cung cấp dịch vụ đặt vé;"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="15. &quot;Vé điện tử&quot;" 
                  secondary="là bằng chứng xác nhận hợp đồng vận chuyển giữa hành khách và nhà xe thông qua nền tảng BusBooking. Có giá trị đối với hành khách có tên và hành trình được ghi rõ trong vé;"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="16. &quot;QR Code&quot;" 
                  secondary="là mã vạch điện tử được tạo tự động cho mỗi vé, dùng để check-in nhanh chóng tại bến xe;"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, bgcolor: 'secondary.50' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              Điều 2. Quy định đặt vé trực tuyến
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3, color: 'text.primary', fontWeight: 600 }}>
              1. Phạm vi áp dụng
            </Typography>
            <Typography variant="body1" paragraph>
              Dịch vụ đặt vé trực tuyến được áp dụng cho các chuyến xe của các nhà xe đối tác đã được xác minh trên nền tảng BusBooking. 
              Khách hàng có thể đăng ký tài khoản miễn phí hoặc đặt vé với tư cách khách vãng lai.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3, color: 'text.primary', fontWeight: 600 }}>
              2. Quy trình đặt chỗ
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="a) Xác nhận thông tin"
                  secondary="Quý khách vui lòng kiểm tra cẩn thận các thông tin vé trước khi tiến hành xác nhận đặt vé và thanh toán. Bằng việc thanh toán, Quý khách chấp nhận giờ khởi hành, vị trí ghế ngồi và các điều khoản dịch vụ."
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="b) Xác nhận đặt chỗ"
                  secondary="Đặt chỗ chỉ được xác nhận sau khi việc thanh toán tiền vé đã hoàn tất đồng thời BusBooking cung cấp cho hành khách mã đặt vé và QR Code."
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="c) Trách nhiệm của BusBooking"
                  secondary="Chúng tôi sẽ không chịu trách nhiệm về bất kỳ tổn thất nào mà hành khách có thể phải chịu từ việc đặt chỗ thông qua bất kỳ tổ chức/cá nhân nào không phải là BusBooking hoặc đối tác được ủy quyền."
                />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 3, color: 'text.primary', fontWeight: 600 }}>
              3. Xác nhận thanh toán
            </Typography>
            <Typography variant="body1" paragraph>
              Sau khi hoàn thành việc thanh toán vé trực tuyến, Quý khách sẽ nhận được:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText secondary="• Email xác nhận thông tin chi tiết vé đã đặt" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="• SMS hoặc thông báo push qua ứng dụng di động chứa mã giao dịch và QR Code" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="• Vé điện tử có thể tải xuống từ ứng dụng hoặc website" />
              </ListItem>
            </List>

            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Lưu ý quan trọng:</strong>
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText secondary="• BusBooking không chịu trách nhiệm nếu Quý khách nhập sai thông tin liên lạc dẫn đến không nhận được xác nhận" />
                </ListItem>
                <ListItem>
                  <ListItemText secondary="• Email xác nhận có thể đi vào hộp thư rác, vui lòng kiểm tra kỹ" />
                </ListItem>
                <ListItem>
                  <ListItemText secondary="• Nếu sau 30 phút chưa nhận được xác nhận, vui lòng liên hệ hotline: 1900 xxxx" />
                </ListItem>
              </List>
            </Alert>

            <Typography variant="h6" gutterBottom sx={{ mt: 3, color: 'text.primary', fontWeight: 600 }}>
              4. Bảo đảm an toàn giao dịch
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="a) Quản lý thông tin"
                  secondary="BusBooking sử dụng các công nghệ bảo mật tiên tiến để bảo vệ thông tin thanh toán và dữ liệu cá nhân của khách hàng. Chúng tôi có quyền chấm dứt quyền truy cập nếu phát hiện hoạt động gian lận."
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="b) Kiểm soát giao dịch"
                  secondary="Tất cả giao dịch thanh toán đều được mã hóa SSL và tuân thủ tiêu chuẩn bảo mật PCI DSS. Tuy nhiên, không có hệ thống nào đảm bảo 100% an toàn trên Internet."
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, bgcolor: 'info.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              5. Chính sách hủy/đổi/hoàn vé
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ fontWeight: 500 }}>
              a) Quy định hoàn trả tiền do lỗi giao dịch:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText secondary="• Giao dịch không thành công nhưng đã bị trừ tiền" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="• Lỗi hệ thống dẫn đến đặt vé trùng lặp" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="• Thời gian hoàn trả: 3-7 ngày làm việc" />
              </ListItem>
            </List>

            <Typography variant="body1" paragraph sx={{ fontWeight: 500, mt: 2 }}>
              b) Quy định hủy/đổi vé:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText secondary="• Chỉ được thay đổi vé 1 lần duy nhất" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="• Phí hủy vé: 10% - 30% giá vé tùy thuộc thời gian hủy" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="• Thời hạn: Trước 24h so với giờ khởi hành" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="• Liên hệ: Hotline 1900 xxxx hoặc qua ứng dụng di động" />
              </ListItem>
            </List>

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Chính sách đặc biệt:</strong> Trong trường hợp bất khả kháng (thiên tai, dịch bệnh), 
                BusBooking hỗ trợ đổi/hoàn vé miễn phí hoặc giữ nguyên giá trị vé trong 12 tháng.
              </Typography>
            </Alert>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, bgcolor: 'warning.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              6. Kênh đặt vé chính thức
            </Typography>
            <Typography variant="body1" paragraph>
              BusBooking khuyến cáo khách hàng chỉ đặt vé qua các kênh chính thức:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText secondary="• Website: www.busBooking.com" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="• Ứng dụng di động BusBooking (iOS & Android)" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="• Hotline: 1900 xxxx" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="• Các đại lý được ủy quyền chính thức" />
              </ListItem>
            </List>
            
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Cảnh báo:</strong> BusBooking không chịu trách nhiệm đối với các vé mua từ nguồn không chính thức. 
                Khách hàng có hành vi gian lận, đầu cơ vé có thể bị từ chối dịch vụ.
              </Typography>
            </Alert>
          </CardContent>
        </Card>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
          Điều 3: Quy định vận chuyển
        </Typography>

        <Card sx={{ mb: 3, bgcolor: 'success.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              1. Đối tượng hành khách
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="a) Trẻ em dưới 6 tuổi"
                  secondary="Cao từ 1.3m trở xuống, cân nặng dưới 30kg thì không phải mua vé nhưng phải có người lớn đi cùng"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="b) Phụ nữ có thai"
                  secondary="Cần đảm bảo sức khỏe và có thể yêu cầu giấy xác nhận từ bác sĩ đối với thai kỳ trên 32 tuần"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="c) Người cao tuổi"
                  secondary="Khách hàng trên 70 tuổi nên có người thân đi cùng và thông báo tình trạng sức khỏe khi đặt vé"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, bgcolor: 'info.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              2. Quy định hành lý
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="a) Hành lý xách tay"
                  secondary="Tối đa 7kg, kích thước không quá 56cm x 36cm x 23cm"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="b) Hành lý ký gửi"
                  secondary="Tổng trọng lượng không vượt quá 20kg, đối với hành lý quá khổ cần liên hệ trước"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="c) Vật phẩm cấm"
                  secondary="Chất dễ cháy nổ, vũ khí, ma túy, động vật sống (trừ thú cưng có giấy tờ hợp lệ và thông báo trước)"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, bgcolor: 'warning.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              3. Yêu cầu khi lên xe
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="a) Thời gian có mặt"
                  secondary="Trước 30 phút (ngày thường) hoặc 60 phút (ngày lễ, tết) so với giờ khởi hành"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="b) Giấy tờ cần thiết"
                  secondary="QR Code/mã đặt vé, CMND/CCCD/hộ chiếu (với trẻ em cần giấy khai sinh)"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="c) Quy tắc trên xe"
                  secondary="Không hút thuốc, uống rượu bia, ăn thức ăn có mùi, không vứt rác, giữ trật tự và yên tĩnh"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
          II. CHÍNH SÁCH BẢO MẬT
        </Typography>

        <Card sx={{ mb: 3, bgcolor: 'primary.50' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              Điều 1. Quy định chung
            </Typography>
            <Typography variant="body1" paragraph>
              1. BusBooking cam kết bảo vệ thông tin cá nhân của khách hàng theo quy định pháp luật về bảo vệ dữ liệu cá nhân. 
              Mọi thông tin được thu thập, sử dụng và xử lý trong khuôn khổ cung cấp dịch vụ đặt vé xe khách.
            </Typography>
            <Typography variant="body1" paragraph>
              2. Bằng việc sử dụng dịch vụ, khách hàng đồng ý với việc thu thập và xử lý dữ liệu cá nhân theo chính sách này. 
              Khách hàng cam kết cung cấp thông tin chính xác và đầy đủ.
            </Typography>
            <Typography variant="body1" paragraph>
              3. BusBooking có thể cập nhật chính sách bảo mật theo thời gian để phù hợp với quy định pháp luật và 
              tiến bộ công nghệ. Khách hàng nên thường xuyên xem lại chính sách này.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, bgcolor: 'secondary.50' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              Điều 2. Thu thập và sử dụng thông tin
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3, color: 'text.primary', fontWeight: 600 }}>
              1. Thông tin thu thập
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="a) Thông tin cơ bản"
                  secondary="Họ tên, số điện thoại, email, địa chỉ, phương thức thanh toán"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="b) Thông tin sử dụng"
                  secondary="Lịch sử đặt vé, tùy chọn tìm kiếm, đánh giá và phản hồi"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="c) Thông tin thiết bị"
                  secondary="Địa chỉ IP, loại trình duyệt, hệ điều hành, vị trí địa lý (nếu được phép)"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="d) Cookies và công nghệ tương tự"
                  secondary="Để cải thiện trải nghiệm người dùng và phân tích hành vi sử dụng"
                />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 3, color: 'text.primary', fontWeight: 600 }}>
              2. Mục đích sử dụng
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText secondary="• Xử lý đặt vé và cung cấp dịch vụ khách hàng" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="• Xác thực danh tính và bảo mật tài khoản" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="• Gửi thông báo về trạng thái đặt vé và chuyến đi" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="• Cải thiện chất lượng dịch vụ và phát triển tính năng mới" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="• Marketing và chương trình khuyến mãi (nếu khách hàng đồng ý)" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="• Tuân thủ quy định pháp luật và giải quyết tranh chấp" />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, bgcolor: 'info.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              3. Chia sẻ thông tin
            </Typography>
            <Typography variant="body1" paragraph>
              BusBooking chỉ chia sẻ thông tin cá nhân trong các trường hợp sau:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="a) Với sự đồng ý"
                  secondary="Khi có sự chấp thuận rõ ràng của khách hàng"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="b) Với đối tác dịch vụ"
                  secondary="Nhà xe, đối tác thanh toán, nhà cung cấp dịch vụ hỗ trợ (trong phạm vi cần thiết)"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="c) Yêu cầu pháp lý"
                  secondary="Khi có yêu cầu từ cơ quan nhà nước có thẩm quyền"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="d) Bảo vệ quyền lợi"
                  secondary="Để bảo vệ quyền, tài sản và an toàn của BusBooking và người dùng"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, bgcolor: 'success.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              4. Bảo mật và lưu trữ dữ liệu
            </Typography>
            <Typography variant="body1" paragraph>
              a) Biện pháp bảo mật:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText secondary="• Mã hóa dữ liệu SSL/TLS cho tất cả giao dịch" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="• Hệ thống tường lửa và giám sát bảo mật 24/7" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="• Kiểm soát truy cập nghiêm ngặt với nhân viên" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="• Sao lưu dữ liệu định kỳ và kế hoạch phục hồi thảm họa" />
              </ListItem>
            </List>
            
            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
              b) Thời gian lưu trữ:
            </Typography>
            <Typography variant="body2" paragraph>
              Dữ liệu được lưu trữ tối thiểu 24 tháng kể từ lần sử dụng cuối cùng hoặc theo quy định pháp luật. 
              Khách hàng có thể yêu cầu xóa dữ liệu cá nhân bất kỳ lúc nào.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, bgcolor: 'warning.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              5. Quyền của khách hàng
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="a) Quyền truy cập"
                  secondary="Xem và cập nhật thông tin cá nhân qua tài khoản người dùng"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="b) Quyền chỉnh sửa"
                  secondary="Sửa đổi thông tin không chính xác hoặc không đầy đủ"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="c) Quyền xóa"
                  secondary="Yêu cầu xóa dữ liệu cá nhân (có thể ảnh hưởng đến việc sử dụng dịch vụ)"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="d) Quyền rút lại đồng ý"
                  secondary="Hủy đăng ký nhận thông tin marketing bất kỳ lúc nào"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="e) Quyền khiếu nại"
                  secondary="Gửi khiếu nại về việc xử lý dữ liệu cá nhân đến BusBooking hoặc cơ quan có thẩm quyền"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
          III. ĐIỀU KHOẢN CUỐI
        </Typography>

        <Card sx={{ mb: 3, bgcolor: 'error.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              1. Trách nhiệm và giới hạn
            </Typography>
            <Typography variant="body1" paragraph>
              a) BusBooking đóng vai trò là nền tảng kết nối giữa hành khách và nhà xe. Chúng tôi không chịu trách nhiệm về:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText secondary="• Chất lượng dịch vụ vận chuyển của nhà xe" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="• Sự chậm trễ, hủy chuyến do nguyên nhân từ nhà xe" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="• Mất mát, hư hại hành lý trong quá trình vận chuyển" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="• Thiệt hại do điều kiện bất khả kháng" />
              </ListItem>
            </List>
            
            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
              b) Trách nhiệm tối đa của BusBooking không vượt quá giá trị vé đã thanh toán.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, bgcolor: 'success.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              2. Thay đổi điều khoản
            </Typography>
            <Typography variant="body1" paragraph>
              BusBooking có quyền thay đổi, bổ sung các điều khoản này bất kỳ lúc nào. 
              Các thay đổi sẽ có hiệu lực kể từ ngày công bố trên website và ứng dụng di động. 
              Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi được coi là chấp nhận các điều khoản mới.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, bgcolor: 'info.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              3. Giải quyết tranh chấp
            </Typography>
            <Typography variant="body1" paragraph>
              Mọi tranh chấp phát sinh sẽ được giải quyết thông qua thương lượng, hòa giải. 
              Nếu không thể thỏa thuận, tranh chấp sẽ được giải quyết tại Tòa án có thẩm quyền tại Việt Nam 
              theo pháp luật Việt Nam.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: 'primary.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              4. Thông tin liên hệ
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Phone sx={{ color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Hotline hỗ trợ khách hàng: 1900 xxxx
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hoạt động 24/7 để hỗ trợ quý khách
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DirectionsBus sx={{ color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Email: support@busBooking.com
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Phản hồi trong vòng 24 giờ
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Security sx={{ color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Website: www.busBooking.com
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Nền tảng đặt vé xe khách hàng đầu Việt Nam
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Paper>

      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          © 2024 BusBooking. Tất cả quyền được bảo lưu.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Điều khoản này có hiệu lực từ ngày {new Date().toLocaleDateString('vi-VN')}
        </Typography>
      </Box>
    </Container>
  );
};

export default TermsOfService;