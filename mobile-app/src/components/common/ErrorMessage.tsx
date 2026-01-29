import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  showIcon?: boolean;
  variant?: 'error' | 'warning' | 'info';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  showIcon = true,
  variant = 'error',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          container: styles.warningContainer,
          text: styles.warningText,
          iconColor: '#FF9800',
        };
      case 'info':
        return {
          container: styles.infoContainer,
          text: styles.infoText,
          iconColor: '#2196F3',
        };
      default:
        return {
          container: styles.errorContainer,
          text: styles.errorText,
          iconColor: '#F44336',
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <View style={[styles.container, variantStyles.container]}>
      {showIcon && (
        <Ionicons 
          name={variant === 'error' ? 'alert-circle' : variant === 'warning' ? 'warning' : 'information-circle'} 
          size={24} 
          color={variantStyles.iconColor} 
        />
      )}
      
      <View style={styles.content}>
        <Text style={[styles.message, variantStyles.text]}>{message}</Text>
        
        {onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
  },
  warningContainer: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFE0B2',
  },
  infoContainer: {
    backgroundColor: '#E3F2FD',
    borderColor: '#BBDEFB',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    marginBottom: 12,
  },
  errorText: {
    color: '#D32F2F',
  },
  warningText: {
    color: '#E65100',
  },
  infoText: {
    color: '#1976D2',
  },
  retryButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 6,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

export default ErrorMessage;
