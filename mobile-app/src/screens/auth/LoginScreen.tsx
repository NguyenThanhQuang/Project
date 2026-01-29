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
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { RootState, useAppDispatch } from "../../store/index-store";
import { login } from "../../store/authSlice";
import { ROUTES } from "../../theme";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleLogin = async () => {
    if (!formData.identifier.trim() || !formData.password.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      await dispatch(login(formData)).unwrap();
      // Navigation will be handled automatically by AppNavigator based on user role
    } catch (error: any) {
      Alert.alert("Lỗi đăng nhập", error || "Đăng nhập thất bại");
    }
  };

  const handleRegister = () => {
    navigation.navigate(ROUTES.Register as never);
  };

  const handleForgotPassword = () => {
    navigation.navigate(ROUTES.ForgotPassword as never);
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

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Chào mừng bạn trở lại!</Text>
            <Text style={styles.subtitleText}>Đăng nhập để tiếp tục</Text>

            {/* Email/Phone Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email hoặc số điện thoại"
                placeholderTextColor="#999"
                value={formData.identifier}
                onChangeText={(text) =>
                  setFormData({ ...formData, identifier: text })
                }
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
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

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={
                isLoading ||
                !formData.identifier.trim() ||
                !formData.password.trim()
              }
            >
              {isLoading ? (
                <Text style={styles.loginButtonText}>Đang đăng nhập...</Text>
              ) : (
                <Text style={styles.loginButtonText}>Đăng nhập</Text>
              )}
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Chưa có tài khoản? </Text>
                <TouchableOpacity onPress={handleRegister}>
                  <Text style={styles.registerLink}>Đăng ký ngay</Text>
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
  loginButton: {
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
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "white",
    fontSize: width * 0.05,
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
  },
  forgotPassword: {
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#0077be",
    fontSize: width * 0.04,
    fontWeight: "500",
  },
  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  registerText: {
    color: "#666",
    fontSize: width * 0.04,
  },
  registerLink: {
    color: "#0077be",
    fontSize: width * 0.04,
    fontWeight: "600",
  },
});

export default LoginScreen;
