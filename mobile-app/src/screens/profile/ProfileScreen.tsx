import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { RootState, useAppDispatch } from "../../store/index-store";
import { logout } from "../../store/authSlice";
import { ROUTES } from "../../theme";

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = Array.isArray(user?.roles) && user?.roles.includes("admin");

  const handleLogout = async () => {
    try {
      Alert.alert("Xác nhận đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: async () => {
            await dispatch(logout());
            Alert.alert("Thành công", "Đã đăng xuất thành công!");
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại.");
    }
  };

  const handleNavigateToMyBookings = () => {
    navigation.navigate(ROUTES.MyBookings as never);
  };

  const handleNavigateToChangePassword = () => {
    navigation.navigate(ROUTES.ChangePassword as never);
  };

  const handleNavigateToLoyaltyProgram = () => {
    // TODO: Navigate to loyalty program screen
    // navigation.navigate('LoyaltyProgram' as never);
  };

  const handleNavigateToCompanyRegistration = () => {
    navigation.navigate(ROUTES.CompanyRegistration as never);
  };

  const handleNavigateToAdminPanel = () => {
    navigation.navigate(ROUTES.AdminPanel as never);
  };

  const handleNavigateToSettings = () => {
    // TODO: Navigate to settings screen
    // navigation.navigate('Settings' as never);
  };

  const handleNavigateToHelp = () => {
    // TODO: Navigate to help screen
    // navigation.navigate('Help' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={60} color="#0077be" />
            </View>
            <Text style={styles.userName}>{user?.name || "User"}</Text>
            <Text style={styles.userEmail}>
              {user?.email || "user@example.com"}
            </Text>
          </View>

          <View style={styles.menuSection}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleNavigateToChangePassword}
            >
              <Ionicons name="person-outline" size={24} color="#666" />
              <Text style={styles.menuText}>Thông tin cá nhân</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleNavigateToMyBookings}
            >
              <Ionicons name="bookmark-outline" size={24} color="#666" />
              <Text style={styles.menuText}>Vé đã đặt</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleNavigateToLoyaltyProgram}
            >
              <Ionicons name="star-outline" size={24} color="#666" />
              <Text style={styles.menuText}>
                Chương trình khách hàng thân thiết
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleNavigateToCompanyRegistration}
            >
              <Ionicons name="business-outline" size={24} color="#666" />
              <Text style={styles.menuText}>Đăng ký nhà xe</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            {isAdmin && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleNavigateToAdminPanel}
              >
                <Ionicons name="shield-outline" size={24} color="#1976d2" />
                <Text
                  style={[
                    styles.menuText,
                    { color: "#1976d2", fontWeight: "600" },
                  ]}
                >
                  Admin Panel
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#1976d2" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleNavigateToSettings}
            >
              <Ionicons name="settings-outline" size={24} color="#666" />
              <Text style={styles.menuText}>Cài đặt</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleNavigateToHelp}
            >
              <Ionicons name="help-circle-outline" size={24} color="#666" />
              <Text style={styles.menuText}>Trợ giúp</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#dc3545" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafb",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f8ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a2332",
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
  },
  menuSection: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#1a2332",
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#dc3545",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    color: "#dc3545",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
});

export default ProfileScreen;
