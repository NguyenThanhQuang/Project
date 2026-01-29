import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "../../store/index-store";

const { width, height } = Dimensions.get("window");

const RegisterScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async () => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password.trim()
    ) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Lỗi", "Email không đúng định dạng");
      return;
    }

    // Vietnamese phone number validation
    const phoneRegex =
      /^(0|\+84)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/;
    if (!phoneRegex.test(formData.phone)) {
      Alert.alert(
        "Lỗi",
        "Số điện thoại không đúng định dạng Việt Nam\n\nVí dụ: 0987654321, 0912345678, 0901234567"
      );
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      console.log("🔄 Đang đăng ký tài khoản...");
      console.log("Form data:", formData);

      const apiUrl = __DEV__
        ? "http://192.168.20.27:3000/api/auth/register"
        : "http://localhost:3000/api/auth/register";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("✅ Đăng ký thành công:", result);
        Alert.alert(
          "Đăng Ký Thành Công!",
          "Tài khoản của bạn đã được tạo. Vui lòng kiểm tra email để xác thực tài khoản.",
          [
            {
              text: "Đăng Nhập Ngay",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        console.error("❌ Lỗi đăng ký:", result);
        let errorMessage = "Đăng ký thất bại. Vui lòng thử lại.";

        if (result.message) {
          if (Array.isArray(result.message)) {
            errorMessage = result.message.join("\n");
          } else {
            errorMessage = result.message;
          }
        }

        Alert.alert("Lỗi Đăng Ký", errorMessage);
      }
    } catch (error: any) {
      console.error("❌ Lỗi network:", error);
      Alert.alert(
        "Lỗi Kết Nối",
        "Không thể kết nối đến máy chủ. Vui lòng kiểm tra internet và thử lại."
      );
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0077be" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={["#0077be", "#005a8b"]}
              style={styles.logoContainer}
            >
              <Ionicons name="bus" size={width * 0.15} color="white" />
              <Text style={styles.appTitle}>OBTP</Text>
              <Text style={styles.appSubtitle}>Đặt vé xe khách</Text>
            </LinearGradient>
          </View>

          {/* Register Form */}
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Tạo tài khoản mới</Text>
            <Text style={styles.subtitleText}>Tham gia cùng chúng tôi</Text>

            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Họ và tên"
                placeholderTextColor="#999"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
                autoCapitalize="words"
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="call-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                placeholderTextColor="#999"
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData({ ...formData, phone: text })
                }
                keyboardType="phone-pad"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                placeholderTextColor="#999"
                value={formData.password}
                onChangeText={(text) =>
                  setFormData({ ...formData, password: text })
                }
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Xác nhận mật khẩu"
                placeholderTextColor="#999"
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  setFormData({ ...formData, confirmPassword: text })
                }
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.registerButtonText}>Đang đăng ký...</Text>
              ) : (
                <Text style={styles.registerButtonText}>Đăng ký</Text>
              )}
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Đã có tài khoản? </Text>
                <TouchableOpacity onPress={handleBackToLogin}>
                  <Text style={styles.loginLink}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    paddingTop: height * 0.05,
    paddingBottom: height * 0.03,
  },
  logoContainer: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "white",
    marginTop: 5,
  },
  appSubtitle: {
    fontSize: width * 0.035,
    color: "white",
    textAlign: "center",
    marginTop: 2,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.02,
  },
  welcomeText: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: width * 0.04,
    color: "#666",
    textAlign: "center",
    marginBottom: height * 0.04,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: width * 0.045,
    color: "#333",
    paddingVertical: 16,
  },
  registerButton: {
    backgroundColor: "#0077be",
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonText: {
    color: "white",
    fontSize: width * 0.05,
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginText: {
    color: "#666",
    fontSize: width * 0.04,
  },
  loginLink: {
    color: "#0077be",
    fontSize: width * 0.04,
    fontWeight: "600",
  },
});

export default RegisterScreen;
