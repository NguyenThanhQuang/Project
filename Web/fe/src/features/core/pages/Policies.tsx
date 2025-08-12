import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from "@mui/material";
import {
  CreditCard,
  DirectionsBus,
  ChildCare,
  Pets,
  LocalHospital,
  Assignment,
  Info,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

const Policies: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Placeholder content - ADMIN: NỘI DUNG CẦN ĐƯỢC THAY THẾ
  const PolicyContent: React.FC<{
    title: string;
    children: React.ReactNode;
  }> = ({ title, children }) => (
    <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, mb: 3, color: "primary.main" }}
      >
        {title}
      </Typography>
      {children}
    </Paper>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <PolicyContent title="Chính Sách Hoàn Vé">
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                📋 Chính sách hoàn vé linh hoạt để đảm bảo quyền lợi khách hàng
              </Typography>
            </Alert>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Điều kiện hoàn vé
            </Typography>
            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Vé có thể hoàn trả trước 24 giờ khởi hành"
                  secondary="Áp dụng cho tất cả các loại vé thường"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Vé khuyến mãi có thể hoàn trả trước 48 giờ"
                  secondary="Phí hoàn vé sẽ cao hơn so với vé thường"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Vé VIP có thể hoàn trả trước 12 giờ"
                  secondary="Ưu đãi đặc biệt cho khách hàng VIP"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Cancel sx={{ color: "error.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Không hoàn vé trong vòng 2 giờ trước khởi hành"
                  secondary="Trừ trường hợp khẩn cấp có xác nhận"
                />
              </ListItem>
            </List>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Bảng phí hoàn vé
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                Hoàn vé trước 24 giờ:
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                • Vé thường: Phí 5% giá trị vé
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                • Vé khuyến mãi: Phí 10% giá trị vé
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 2 }}>
                • Vé VIP: Phí 3% giá trị vé
              </Typography>

              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                Hoàn vé từ 2-24 giờ:
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                • Vé thường: Phí 20% giá trị vé
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                • Vé khuyến mãi: Phí 30% giá trị vé
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 2 }}>
                • Vé VIP: Phí 15% giá trị vé
              </Typography>

              <Typography
                variant="body1"
                sx={{ fontWeight: 600, mb: 1, color: "error.main" }}
              >
                Hoàn vé dưới 2 giờ:
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, color: "error.main" }}>
                • Không được hoàn vé (trừ trường hợp khẩn cấp)
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quy trình hoàn vé
            </Typography>
            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemIcon>
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    1
                  </Typography>
                </ListItemIcon>
                <ListItemText
                  primary="Đăng nhập tài khoản và vào mục 'Vé của tôi'"
                  secondary="Hoặc sử dụng mã đặt vé và email để tra cứu"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    2
                  </Typography>
                </ListItemIcon>
                <ListItemText
                  primary="Chọn vé cần hoàn và nhấn 'Yêu cầu hoàn vé'"
                  secondary="Hệ thống sẽ tự động tính phí hoàn vé"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    3
                  </Typography>
                </ListItemIcon>
                <ListItemText
                  primary="Điền lý do hoàn vé và xác nhận thông tin"
                  secondary="Thông tin tài khoản ngân hàng để hoàn tiền"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    4
                  </Typography>
                </ListItemIcon>
                <ListItemText
                  primary="Nhận email xác nhận và chờ xử lý"
                  secondary="Thời gian xử lý: 1-3 ngày làm việc"
                />
              </ListItem>
            </List>

            <Alert severity="warning" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Lưu ý:</strong> Trong trường hợp xe gặp sự cố, chậm trễ
                hoặc hủy chuyến do công ty, khách hàng sẽ được hoàn 100% giá trị
                vé mà không mất phí.
              </Typography>
            </Alert>
          </PolicyContent>
        );

      case 1:
        return (
          <PolicyContent title="Chính Sách Đi Xe">
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                🚌 Quy định toàn diện để đảm bảo an toàn và thoải mái cho hành
                khách
              </Typography>
            </Alert>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quy định về hành lý
            </Typography>
            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Hành lý xách tay: Tối đa 7kg, kích thước 56x36x23cm"
                  secondary="Được mang lên xe và để ở khoang hành lý trên đầu"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Hành lý ký gửi: Tối đa 20kg, kích thước 80x50x30cm"
                  secondary="Được để ở khoang hành lý dưới xe, miễn phí"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Hành lý quá cỡ: Phí 50.000đ/kg vượt mức"
                  secondary="Cần thông báo trước khi đặt vé"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Cancel sx={{ color: "error.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Cấm mang: Chất dễ cháy, nổ, độc hại, vũ khí"
                  secondary="Thực phẩm có mùi nặng, động vật sống (trừ thú cưng được phép)"
                />
              </ListItem>
            </List>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quy định an toàn
            </Typography>
            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Bắt buộc thắt dây an toàn trong suốt hành trình"
                  secondary="Áp dụng cho tất cả ghế có dây an toàn"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Không được di chuyển khi xe đang chạy"
                  secondary="Trừ trường hợp khẩn cấp có sự hướng dẫn của tài xế"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Tuyệt đối không mở cửa xe khi đang di chuyển"
                  secondary="Chỉ được mở cửa khi xe dừng hoàn toàn"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Cancel sx={{ color: "error.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Cấm hút thuốc, uống rượu bia trên xe"
                  secondary="Vi phạm sẽ bị từ chối phục vụ và xuống xe"
                />
              </ListItem>
            </List>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Lịch trình và thời gian
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                Thời gian có mặt:
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                • Tại bến xe: Trước 30 phút so với giờ khởi hành
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 2 }}>
                • Tại điểm đón: Trước 15 phút so với giờ dự kiến
              </Typography>

              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                Thời gian chờ:
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                • Tại bến xe: Tối đa 15 phút sau giờ khởi hành
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 2 }}>
                • Tại điểm đón: Tối đa 5 phút sau giờ dự kiến
              </Typography>

              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                Thời gian nghỉ:
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                • Mỗi 2 giờ: Nghỉ 15 phút (ăn nhẹ, vệ sinh)
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 2 }}>
                • Chuyến dài {">"} 8 giờ: Nghỉ 30 phút (ăn cơm)
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quy định về hành vi
            </Typography>
            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Giữ gìn vệ sinh chung và không gây tiếng ồn"
                  secondary="Tôn trọng hành khách khác"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Sử dụng tai nghe khi nghe nhạc, xem phim"
                  secondary="Âm lượng điện thoại ở mức thấp"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Cancel sx={{ color: "error.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Cấm ăn đồ có mùi nặng, cay nồng"
                  secondary="Cấm để rác bừa bãi trong xe"
                />
              </ListItem>
            </List>

            <Alert severity="warning" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Lưu ý:</strong> Hành khách vi phạm nghiêm trọng các quy
                định có thể bị từ chối phục vụ và phải xuống xe tại điểm dừng
                gần nhất mà không được hoàn vé.
              </Typography>
            </Alert>
          </PolicyContent>
        );

      case 2:
        return (
          <PolicyContent title="Chính Sách Trẻ Em">
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                👶 Chính sách ưu đãi đặc biệt dành cho trẻ em và gia đình
              </Typography>
            </Alert>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Phân loại độ tuổi và giá vé
            </Typography>
            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Trẻ em dưới 2 tuổi: Miễn phí vé"
                  secondary="Ngồi cùng người lớn, không có ghế riêng"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Trẻ em từ 2-5 tuổi: Giảm 50% giá vé"
                  secondary="Có ghế riêng, cần có người lớn đi cùng"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Trẻ em từ 6-12 tuổi: Giảm 25% giá vé"
                  secondary="Có ghế riêng, khuyến khích có người lớn đi cùng"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Học sinh, sinh viên: Giảm 10% giá vé"
                  secondary="Xuất trình thẻ học sinh/sinh viên hợp lệ"
                />
              </ListItem>
            </List>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quy định đi cùng người lớn
            </Typography>
            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Trẻ dưới 6 tuổi: Bắt buộc có người lớn đi cùng"
                  secondary="Tỷ lệ 1 người lớn : 2 trẻ em tối đa"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Trẻ từ 6-12 tuổi: Khuyến khích có người lớn"
                  secondary="Có thể đi một mình với giấy chứng nhận của phụ huynh"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Trẻ từ 13-16 tuổi: Có thể đi một mình"
                  secondary="Cần có giấy chứng nhận và liên lạc của phụ huynh"
                />
              </ListItem>
            </List>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Dịch vụ đặc biệt cho trẻ em
            </Typography>
            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Ghế ngồi ưu tiên gần lối đi"
                  secondary="Thuận tiện cho việc chăm sóc trẻ"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Hỗ trợ xe đẩy, ghế ngồi trẻ em"
                  secondary="Cần đăng ký trước khi đi"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Tư vấn và hỗ trợ trong suốt hành trình"
                  secondary="Nhân viên được đào tạo chuyên biệt"
                />
              </ListItem>
            </List>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quy định an toàn cho trẻ em
            </Typography>
            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Trẻ dưới 1m20: Bắt buộc sử dụng ghế an toàn"
                  secondary="Công ty cung cấp miễn phí khi đăng ký trước"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Luôn có người lớn giám sát"
                  secondary="Không để trẻ em một mình trên xe"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Cancel sx={{ color: "error.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Cấm trẻ em di chuyển tự do trong xe"
                  secondary="Đặc biệt khi xe đang chạy"
                />
              </ListItem>
            </List>

            <Alert severity="success" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Khuyến mãi đặc biệt:</strong> Gia đình có từ 4 người trở
                lên sẽ được giảm thêm 5% tổng giá trị vé. Áp dụng cho tất cả các
                chuyến đi.
              </Typography>
            </Alert>
          </PolicyContent>
        );

      case 3:
        return (
          <PolicyContent title="Chính Sách Thú Cưng">
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                🐕 Chính sách thân thiện với thú cưng để mang theo "người bạn
                nhỏ"
              </Typography>
            </Alert>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Loại thú cưng được phép
            </Typography>
            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Chó nhỏ: Dưới 10kg, giống chó cảnh"
                  secondary="Chihuahua, Poodle, Pug, Shih Tzu, v.v."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Mèo cảnh: Tất cả các giống mèo nhà"
                  secondary="Cần có giấy chứng nhận nguồn gốc"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Thú cưng nhỏ: Thỏ, chuột hamster, chim cảnh"
                  secondary="Trong lồng phù hợp, không gây tiếng ồn"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Cancel sx={{ color: "error.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Cấm: Chó lớn, động vật hoang dã, bò sát"
                  secondary="Động vật có khả năng gây nguy hiểm"
                />
              </ListItem>
            </List>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Điều kiện và quy định
            </Typography>
            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Giấy chứng nhận tiêm phòng đầy đủ"
                  secondary="Vaccine dại, vaccine 5 bệnh, còn hiệu lực"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Giấy chứng nhận sức khỏe từ thú y"
                  secondary="Không quá 7 ngày kể từ ngày khám"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Lồng vận chuyển phù hợp"
                  secondary="Đảm bảo thông thoáng, an toàn cho thú cưng"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Đăng ký trước tối thiểu 24 giờ"
                  secondary="Để chuẩn bị chỗ ngồi phù hợp"
                />
              </ListItem>
            </List>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Bảng giá dịch vụ
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                Phí vận chuyển thú cưng:
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                • Chó/mèo dưới 5kg: 200.000đ/chuyến
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                • Chó/mèo từ 5-10kg: 300.000đ/chuyến
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 2 }}>
                • Thú cưng nhỏ khác: 150.000đ/chuyến
              </Typography>

              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                Dịch vụ bổ sung:
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                • Cho thuê lồng vận chuyển: 100.000đ/chuyến
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                • Dịch vụ chăm sóc đặc biệt: 200.000đ/chuyến
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 2 }}>
                • Bảo hiểm thú cưng: 50.000đ/chuyến
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quy định trong suốt hành trình
            </Typography>
            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Thú cưng phải ở trong lồng/túi vận chuyển"
                  secondary="Không được thả tự do trong xe"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Chủ thú cưng chịu trách nhiệm hoàn toàn"
                  secondary="Bao gồm vệ sinh, tiếng ồn, và an toàn"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Ưu tiên sắp xếp chỗ ngồi phù hợp"
                  secondary="Tránh gây phiền toái cho hành khách khác"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Cancel sx={{ color: "error.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Cấm cho thú cưng ăn uống trên xe"
                  secondary="Trừ nước uống khi cần thiết"
                />
              </ListItem>
            </List>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Trường hợp khẩn cấp
            </Typography>
            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Hỗ trợ y tế cơ bản cho thú cưng"
                  secondary="Liên hệ bác sĩ thú y gần nhất"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Dừng xe khẩn cấp khi cần thiết"
                  secondary="Đảm bảo an toàn cho thú cưng và hành khách"
                />
              </ListItem>
            </List>

            <Alert severity="warning" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Lưu ý:</strong> Thú cưng gây tiếng ồn, mùi hôi hoặc làm
                phiền hành khách khác có thể bị từ chối phục vụ. Vui lòng chuẩn
                bị kỹ lưỡng trước khi đi.
              </Typography>
            </Alert>
          </PolicyContent>
        );

      case 4:
        return (
          <PolicyContent title="Chính Sách Tai Nạn & Bảo Hiểm">
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                🛡️ Chính sách bảo hiểm toàn diện để bảo vệ an toàn hành khách
              </Typography>
            </Alert>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Bảo hiểm hành khách
            </Typography>
            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Bảo hiểm tai nạn cá nhân: 200 triệu đồng/người"
                  secondary="Tự động áp dụng cho tất cả hành khách"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Bảo hiểm y tế: 50 triệu đồng/người"
                  secondary="Chi phí điều trị do tai nạn trong hành trình"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Bảo hiểm hành lý: 10 triệu đồng/người"
                  secondary="Bồi thường hành lý bị mất mát, hư hỏng"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Bảo hiểm trách nhiệm dân sự: 1 tỷ đồng/vụ"
                  secondary="Bảo vệ công ty và hành khách"
                />
              </ListItem>
            </List>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quy trình xử lý tai nạn
            </Typography>
            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemIcon>
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    1
                  </Typography>
                </ListItemIcon>
                <ListItemText
                  primary="Ưu tiên cấp cứu và an toàn"
                  secondary="Gọi cấp cứu 115, đưa nạn nhân đến bệnh viện gần nhất"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    2
                  </Typography>
                </ListItemIcon>
                <ListItemText
                  primary="Báo cáo ngay cho công ty và cảnh sát"
                  secondary="Hotline khẩn cấp: 1900-xxxx (24/7)"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    3
                  </Typography>
                </ListItemIcon>
                <ListItemText
                  primary="Lập biên bản và thu thập bằng chứng"
                  secondary="Chụp ảnh hiện trường, lấy lời khai nhân chứng"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    4
                  </Typography>
                </ListItemIcon>
                <ListItemText
                  primary="Thông báo cho gia đình nạn nhân"
                  secondary="Hỗ trợ liên lạc và các thủ tục cần thiết"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    5
                  </Typography>
                </ListItemIcon>
                <ListItemText
                  primary="Khởi tạo quy trình bảo hiểm"
                  secondary="Nộp hồ sơ cho công ty bảo hiểm trong 24 giờ"
                />
              </ListItem>
            </List>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Mức bồi thường cụ thể
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                Tai nạn thân thể:
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                • Tử vong: 200 triệu đồng
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                • Thương tật vĩnh viễn: 50-200 triệu đồng
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 2 }}>
                • Thương tích điều trị: 100% chi phí y tế
              </Typography>

              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                Bồi thường hành lý:
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                • Mất mát hoàn toàn: 100% giá trị (tối đa 10 triệu)
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                • Hư hỏng một phần: Theo mức độ hư hỏng
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 2 }}>
                • Trì hoãn hành lý: 500.000đ/ngày
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Hỗ trợ khẩn cấp
            </Typography>
            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Hỗ trợ chi phí y tế ban đầu"
                  secondary="Tạm ứng ngay cho điều trị khẩn cấp"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Hỗ trợ gia đình nạn nhân"
                  secondary="Chi phí đi lại, ăn ở cho người thân"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Dịch vụ tư vấn pháp lý miễn phí"
                  secondary="Hỗ trợ thủ tục bảo hiểm và pháp lý"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Hỗ trợ tâm lý cho nạn nhân"
                  secondary="Dịch vụ tư vấn tâm lý chuyên nghiệp"
                />
              </ListItem>
            </List>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Trường hợp không được bồi thường
            </Typography>
            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemIcon>
                  <Cancel sx={{ color: "error.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Hành khách vi phạm nghiêm trọng quy định"
                  secondary="Không thắt dây an toàn, vi phạm an toàn"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Cancel sx={{ color: "error.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Hành khách trong tình trạng say rượu"
                  secondary="Hoặc sử dụng chất kích thích"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Cancel sx={{ color: "error.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Thiên tai, chiến tranh, khủng bố"
                  secondary="Các sự kiện bất khả kháng"
                />
              </ListItem>
            </List>

            <Alert severity="success" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Cam kết:</strong> Chúng tôi cam kết xử lý bồi thường
                trong vòng 30 ngày kể từ khi nhận đủ hồ sơ hợp lệ. Hotline hỗ
                trợ: 1900-xxxx (24/7).
              </Typography>
            </Alert>
          </PolicyContent>
        );

      case 5:
        return (
          <PolicyContent title="Điều Khoản Chung">
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                📋 Điều khoản và điều kiện chung khi sử dụng dịch vụ
              </Typography>
            </Alert>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Điều khoản sử dụng dịch vụ
            </Typography>
            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Khách hàng phải tuân thủ mọi quy định của công ty"
                  secondary="Các quy định về an toàn, vệ sinh, và hành vi"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Thông tin đặt vé phải chính xác và trung thực"
                  secondary="Sai thông tin có thể dẫn đến từ chối phục vụ"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: "success.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Thanh toán đầy đủ trước khi sử dụng dịch vụ"
                  secondary="Không được nợ phí hoặc thanh toán giả"
                />
              </ListItem>
            </List>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quyền và nghĩa vụ của khách hàng
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                Quyền lợi của khách hàng:
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                • Được phục vụ đúng theo cam kết dịch vụ
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                • Được bảo vệ thông tin cá nhân
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                • Được khiếu nại khi có vấn đề
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 2 }}>
                • Được bồi thường theo quy định
              </Typography>

              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                Nghĩa vụ của khách hàng:
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                • Thanh toán đầy đủ và đúng hạn
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                • Tuân thủ các quy định an toàn
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 1 }}>
                • Tôn trọng nhân viên và hành khách khác
              </Typography>
              <Typography variant="body2" sx={{ ml: 2, mb: 2 }}>
                • Bảo vệ tài sản của công ty
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Giải quyết tranh chấp
            </Typography>
            <List sx={{ mb: 3 }}>
              <ListItem>
                <ListItemIcon>
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    1
                  </Typography>
                </ListItemIcon>
                <ListItemText
                  primary="Liên hệ trực tiếp với bộ phận chăm sóc khách hàng"
                  secondary="Hotline: 1900-xxxx hoặc email: support@busapp.com"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    2
                  </Typography>
                </ListItemIcon>
                <ListItemText
                  primary="Đàm phán và thương lượng thiện chí"
                  secondary="Thời gian xử lý: 7-15 ngày làm việc"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    3
                  </Typography>
                </ListItemIcon>
                <ListItemText
                  primary="Khiếu nại lên cơ quan quản lý nhà nước"
                  secondary="Nếu không giải quyết được ở bước 2"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    4
                  </Typography>
                </ListItemIcon>
                <ListItemText
                  primary="Giải quyết tại tòa án theo quy định pháp luật"
                  secondary="Phương án cuối cùng cho các tranh chấp lớn"
                />
              </ListItem>
            </List>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Luật áp dụng:</strong> Các điều khoản này tuân thủ theo
                pháp luật Việt Nam và quy định của Bộ Giao thông Vận tải về vận
                tải hành khách bằng xe ô tô.
              </Typography>
            </Alert>
          </PolicyContent>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h2"
          sx={{ fontWeight: 700, mb: 2, color: "primary.main" }}
        >
          Chính Sách & Điều Khoản
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          Tìm hiểu về các chính sách, quy định và điều khoản khi sử dụng dịch vụ
          của chúng tôi
        </Typography>
      </Box>

      {/* Policy Categories */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{ textAlign: "center", p: 3, borderRadius: 3, boxShadow: 3 }}
          >
            <CardContent>
              <CreditCard sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Chính Sách Hoàn Vé
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quy định về điều kiện và phí hoàn vé
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{ textAlign: "center", p: 3, borderRadius: 3, boxShadow: 3 }}
          >
            <CardContent>
              <DirectionsBus
                sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Chính Sách Đi Xe
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quy định về hành lý, an toàn và lịch trình
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{ textAlign: "center", p: 3, borderRadius: 3, boxShadow: 3 }}
          >
            <CardContent>
              <ChildCare sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Chính Sách Trẻ Em
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Độ tuổi miễn vé và ưu đãi cho trẻ em
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{ textAlign: "center", p: 3, borderRadius: 3, boxShadow: 3 }}
          >
            <CardContent>
              <Pets sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Chính Sách Thú Cưng
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quy định về việc đem thú cưng lên xe
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{ textAlign: "center", p: 3, borderRadius: 3, boxShadow: 3 }}
          >
            <CardContent>
              <LocalHospital
                sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Chính Sách Tai Nạn
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bảo hiểm và xử lý khi có tai nạn
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{ textAlign: "center", p: 3, borderRadius: 3, boxShadow: 3 }}
          >
            <CardContent>
              <Assignment sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Điều Khoản Chung
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Các điều khoản và điều kiện chung
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Policy Tabs */}
      <Paper elevation={2} sx={{ borderRadius: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: "1px solid #e0e0e0",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              py: 3,
            },
          }}
        >
          <Tab icon={<CreditCard />} iconPosition="start" label="Hoàn Vé" />
          <Tab icon={<DirectionsBus />} iconPosition="start" label="Đi Xe" />
          <Tab icon={<ChildCare />} iconPosition="start" label="Trẻ Em" />
          <Tab icon={<Pets />} iconPosition="start" label="Thú Cưng" />
          <Tab icon={<LocalHospital />} iconPosition="start" label="Tai Nạn" />
          <Tab icon={<Assignment />} iconPosition="start" label="Điều Khoản" />
        </Tabs>

        <Box sx={{ p: 4 }}>{renderTabContent()}</Box>
      </Paper>

      {/* Contact for Questions */}
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Paper
          elevation={1}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: "primary.main",
            color: "white",
          }}
        >
          <Info sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Có câu hỏi về chính sách?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Liên hệ với chúng tôi qua hotline 1900-xxxx hoặc email
            support@busapp.com
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Thời gian hỗ trợ: 24/7
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Policies;
