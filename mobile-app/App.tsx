import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { store } from "./src/store/index-store";
import AppNavigator from "./src/navigation/AppNavigator";
import { useAppDispatch } from "./src/store/index-store";
import { loadUser } from "./src/store/authSlice";
import { appInitService } from "./src/services/common/appInitService";

function AppContent() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize app with proper network connectivity check
    const initializeApp = async () => {
      try {
        console.log("🚀 Initializing app...");

        // Use the proper app initialization service
        const initResult = await appInitService.initializeApp();

        if (initResult.initializationSuccess) {
          console.log("✅ App initialization completed");
          // Load user data after successful initialization
          dispatch(loadUser());
        } else {
          console.log("⚠️ App initialization completed with issues");
          // Still try to load user data (might work with cached data)
          dispatch(loadUser());
        }
      } catch (error) {
        console.error("❌ App initialization failed:", error);
        // Still try to load user data (might work with cached data)
        dispatch(loadUser());
      }
    };

    initializeApp();
  }, [dispatch]);

  return <AppNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </SafeAreaProvider>
  );
}
