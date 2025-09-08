import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import { RootState } from "../store/index-store";

// Screens - Using new organized structure
import {
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  ChangePasswordScreen,
  HomeScreen,
  SearchTripsScreen,
  TripDetailsScreen,
  BookingScreen,
  BookingCheckoutScreen,
  MyBookingsScreen,
  ProfileScreen,
  LoyaltyProgramScreen,
  BusTrackingScreen,
} from "../screens/index-screen";

// Navigation
import BottomTabNavigator from "./BottomTabNavigator";

// Define navigation types - User-focused only
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

type MainStackParamList = {
  MainTabs: undefined;
  SearchTrips: undefined;
  TripDetails: { trip: any };
  Booking: { trip: any };
  BookingCheckout: { trip: any; selectedSeats: string[]; totalAmount: number };
  MyBookings: undefined;
  ChangePassword: undefined;
  Profile: undefined;
  LoyaltyProgram: undefined;
  BusTracking: { tripId?: string };
};

type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();

const AuthStackNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

const MainStackNavigator = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name="MainTabs" component={MainTabs} />
    <MainStack.Screen name="SearchTrips" component={SearchTripsScreen} />
    <MainStack.Screen name="TripDetails" component={TripDetailsScreen} />
    <MainStack.Screen name="Booking" component={BookingScreen} />
    <MainStack.Screen
      name="BookingCheckout"
      component={BookingCheckoutScreen}
    />
    <MainStack.Screen name="MyBookings" component={MyBookingsScreen} />
    <MainStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    <MainStack.Screen name="Profile" component={ProfileScreen} />
    <MainStack.Screen name="LoyaltyProgram" component={LoyaltyProgramScreen} />
    <MainStack.Screen name="BusTracking" component={BusTrackingScreen} />
  </MainStack.Navigator>
);

const MainTabs = () => {
  // Call useSelector at the top level - this is the correct way
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.auth.user);

  // Debug logging with useEffect to prevent infinite loops
  useEffect(() => {
    console.log("MainTabs - Auth state:", {
      isAuthenticated,
      userRole: user?.roles,
    });
  }, [isAuthenticated, user]);

  // All authenticated users use normal navigation
  return <BottomTabNavigator />;
};

const AppNavigator = () => {
  // Call useSelector at the top level - this is the correct way
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.auth.user);

  // Debug logging with useEffect to prevent infinite loops
  useEffect(() => {
    console.log("AppNavigator - Auth state:", {
      isAuthenticated,
      userRole: user?.roles,
    });
  }, [isAuthenticated, user]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainStackNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStackNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
