import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email của bạn');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Lỗi', 'Vui lòng nhập email hợp lệ');
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement password reset API call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      Alert.alert(
        'Thành công!',
        'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0077be" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
              colors={['#0077be', '#005a8b']}
              style={styles.logoContainer}
            >
              <Ionicons name="lock-open" size={width * 0.15} color="white" />
              <Text style={styles.appTitle}>Quên mật khẩu</Text>
              <Text style={styles.appSubtitle}>Đặt lại mật khẩu của bạn</Text>
            </LinearGradient>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Đặt lại mật khẩu</Text>
            <Text style={styles.subtitleText}>
              Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
            </Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập email của bạn"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.resetButtonText}>Đang gửi...</Text>
              ) : (
                <Text style={styles.resetButtonText}>Gửi hướng dẫn</Text>
              )}
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.backToLogin} onPress={handleBackToLogin}>
                <Ionicons name="arrow-back" size={20} color="#0077be" />
                <Text style={styles.backToLoginText}>Quay lại đăng nhập</Text>
              </TouchableOpacity>
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
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: height * 0.05,
    paddingBottom: height * 0.03,
  },
  logoContainer: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  appSubtitle: {
    fontSize: width * 0.035,
    color: 'white',
    textAlign: 'center',
    marginTop: 2,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.02,
  },
  welcomeText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: width * 0.04,
    color: '#666',
    textAlign: 'center',
    marginBottom: height * 0.04,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
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
    color: '#333',
    paddingVertical: 16,
  },
  resetButton: {
    backgroundColor: '#0077be',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  resetButtonText: {
    color: 'white',
    fontSize: width * 0.05,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  backToLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  backToLoginText: {
    color: '#0077be',
    fontSize: width * 0.04,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ForgotPasswordScreen;
