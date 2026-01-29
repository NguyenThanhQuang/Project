import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store/index-store";
import { changePassword, clearAuthStatus } from "../../store/authSlice";
import { ROUTES } from "../../theme";

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { status, error, successMessage } = useSelector(
    (state: RootState) => state.auth
  );

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [clientError, setClientError] = useState("");

  const loading = status === "loading";

  // Password validation function
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const validCount = [
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    ].filter(Boolean).length;

    return {
      isValid:
        minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar,
      strength: validCount,
      checks: {
        minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
      },
    };
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 2) return "#dc3545";
    if (strength <= 3) return "#ffc107";
    if (strength <= 4) return "#17a2b8";
    return "#28a745";
  };

  const getPasswordStrengthLabel = (strength: number) => {
    if (strength <= 2) return "Yếu";
    if (strength <= 3) return "Trung bình";
    if (strength <= 4) return "Mạnh";
    return "Rất mạnh";
  };

  useEffect(() => {
    return () => {
      dispatch(clearAuthStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      Alert.alert("Thành công", "Mật khẩu đã được thay đổi thành công!");
      navigation.goBack();
    }
  }, [successMessage, navigation]);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setClientError("");
    if (error) dispatch(clearAuthStatus());
  };

  const handleSubmit = () => {
    setClientError("");
    dispatch(clearAuthStatus());

    if (
      formData.currentPassword &&
      formData.currentPassword === formData.newPassword
    ) {
      setClientError("Mật khẩu mới không được trùng với mật khẩu hiện tại.");
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      setClientError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    if (formData.newPassword.length < 8) {
      setClientError("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }

    const passwordValidation = validatePassword(formData.newPassword);
    if (!passwordValidation.isValid) {
      setClientError("Mật khẩu mới không đáp ứng đủ các yêu cầu về bảo mật.");
      return;
    }

    dispatch(changePassword(formData));
  };

  const passwordValidation = validatePassword(formData.newPassword);
  const isPasswordMatch =
    formData.newPassword === formData.confirmNewPassword &&
    formData.confirmNewPassword !== "";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={["#0077be", "#004c8b"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Đổi mật khẩu</Text>

          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Error Messages */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#dc3545" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {clientError && (
          <View style={styles.warningContainer}>
            <Ionicons name="warning" size={20} color="#ffc107" />
            <Text style={styles.warningText}>{clientError}</Text>
          </View>
        )}

        {/* Current Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Mật khẩu hiện tại</Text>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu hiện tại"
              placeholderTextColor="#999"
              value={formData.currentPassword}
              onChangeText={(text) =>
                handleInputChange("currentPassword", text)
              }
              secureTextEntry={!showCurrentPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              <Ionicons
                name={showCurrentPassword ? "eye-off" : "eye"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* New Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Mật khẩu mới</Text>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu mới"
              placeholderTextColor="#999"
              value={formData.newPassword}
              onChangeText={(text) => handleInputChange("newPassword", text)}
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Ionicons
                name={showNewPassword ? "eye-off" : "eye"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* Password Strength Indicator */}
          {formData.newPassword.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBar}>
                <View
                  style={[
                    styles.strengthFill,
                    {
                      width: `${(passwordValidation.strength / 5) * 100}%`,
                      backgroundColor: getPasswordStrengthColor(
                        passwordValidation.strength
                      ),
                    },
                  ]}
                />
              </View>
              <Text style={styles.strengthText}>
                Độ mạnh: {getPasswordStrengthLabel(passwordValidation.strength)}
              </Text>
            </View>
          )}

          {/* Password Requirements */}
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Yêu cầu mật khẩu:</Text>
            <View style={styles.requirementItem}>
              <Ionicons
                name={
                  passwordValidation.checks.minLength
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={16}
                color={
                  passwordValidation.checks.minLength ? "#28a745" : "#dc3545"
                }
              />
              <Text style={styles.requirementText}>Ít nhất 8 ký tự</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons
                name={
                  passwordValidation.checks.hasUpperCase
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={16}
                color={
                  passwordValidation.checks.hasUpperCase ? "#28a745" : "#dc3545"
                }
              />
              <Text style={styles.requirementText}>Có chữ hoa</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons
                name={
                  passwordValidation.checks.hasLowerCase
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={16}
                color={
                  passwordValidation.checks.hasLowerCase ? "#28a745" : "#dc3545"
                }
              />
              <Text style={styles.requirementText}>Có chữ thường</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons
                name={
                  passwordValidation.checks.hasNumbers
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={16}
                color={
                  passwordValidation.checks.hasNumbers ? "#28a745" : "#dc3545"
                }
              />
              <Text style={styles.requirementText}>Có số</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons
                name={
                  passwordValidation.checks.hasSpecialChar
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={16}
                color={
                  passwordValidation.checks.hasSpecialChar
                    ? "#28a745"
                    : "#dc3545"
                }
              />
              <Text style={styles.requirementText}>Có ký tự đặc biệt</Text>
            </View>
          </View>
        </View>

        {/* Confirm New Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Xác nhận mật khẩu mới</Text>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mật khẩu mới"
              placeholderTextColor="#999"
              value={formData.confirmNewPassword}
              onChangeText={(text) =>
                handleInputChange("confirmNewPassword", text)
              }
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* Password Match Indicator */}
          {formData.confirmNewPassword.length > 0 && (
            <View style={styles.matchContainer}>
              <Ionicons
                name={isPasswordMatch ? "checkmark-circle" : "close-circle"}
                size={16}
                color={isPasswordMatch ? "#28a745" : "#dc3545"}
              />
              <Text
                style={[
                  styles.matchText,
                  { color: isPasswordMatch ? "#28a745" : "#dc3545" },
                ]}
              >
                {isPasswordMatch ? "Mật khẩu khớp" : "Mật khẩu không khớp"}
              </Text>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Đổi mật khẩu</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8d7da",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: "#721c24",
    marginLeft: 10,
    flex: 1,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3cd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  warningText: {
    color: "#856404",
    marginLeft: 10,
    flex: 1,
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  passwordInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: "#333",
  },
  eyeButton: {
    padding: 8,
  },
  strengthContainer: {
    marginTop: 10,
  },
  strengthBar: {
    height: 4,
    backgroundColor: "#e9ecef",
    borderRadius: 2,
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  requirementsContainer: {
    marginTop: 15,
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  requirementText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  matchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  matchText: {
    fontSize: 12,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: "#0077be",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ChangePasswordScreen;
