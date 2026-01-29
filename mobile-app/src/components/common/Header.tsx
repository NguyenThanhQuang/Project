import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  showBackButton?: boolean;
  gradient?: boolean;
  gradientColors?: readonly [string, string];
}

const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  rightComponent,
  showBackButton = true,
  gradient = true,
  gradientColors = ['#007AFF', '#0056CC'] as readonly [string, string],
}) => {
  const HeaderContent = () => (
    <View style={styles.headerContent}>
      {showBackButton && onBack ? (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <View style={styles.backButton} />
      )}
      
      <Text style={styles.headerTitle}>{title}</Text>
      
      <View style={styles.headerRight}>
        {rightComponent}
      </View>
    </View>
  );

  if (gradient) {
    return (
      <>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={gradientColors} style={styles.header}>
          <HeaderContent />
        </LinearGradient>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, styles.headerNoGradient]}>
        <HeaderContent />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerNoGradient: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
    width: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
    alignItems: 'center',
  },
});

export default Header;
