import { useState } from "react";
import { DriverLogin } from "./DriverLogin";
import { DriverRegister } from "./DriverRegister";
import { DriverHome } from "./DriverHome";
import { TripDetail } from "./TripDetail";
import { QRScanner } from "./QRScanner";
import { DriverProfile } from "./DriverProfile";
import { DriverProfileDetail } from "./DriverProfileDetail";
import { Navigation } from "./Navigation";
import { TripHistory } from "./TripHistory";
import { Earnings } from "./Earnings";
import { Notifications } from "./Notifications";
import { ChangePassword } from "./ChangePassword";
import { Achievements } from "./Achievements";
import { Settings } from "./Settings";

type Screen =
  | "login"
  | "register"
  | "home"
  | "trip-detail"
  | "qr-scanner"
  | "profile"
  | "profile-detail"
  | "navigation"
  | "trip-history"
  | "earnings"
  | "notifications"
  | "change-password"
  | "achievements"
  | "settings";

interface DriverAppProps {
  onLogout?: () => void;
}

export function DriverApp({ onLogout }: DriverAppProps = {}) {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [driverData, setDriverData] = useState({
    name: "Nguyễn Văn Tài",
    id: "TX001",
    phone: "0123456789",
  });

  const handleLoginSuccess = (data: {
    name: string;
    id: string;
    phone: string;
  }) => {
    setDriverData(data);
    setCurrentScreen("home");
  };

  const handleRegisterSuccess = () => {
    setCurrentScreen("login");
  };

  const handleBackToCustomer = () => {
    setCurrentScreen("login");
    onLogout?.();
  };

  const handleTripClick = (tripId: string) => {
    setSelectedTripId(tripId);
    setCurrentScreen("trip-detail");
  };

  const handleScanSuccess = (passengerName: string, seatNumber: string) => {
    console.log("Passenger checked in:", passengerName, seatNumber);
  };

  const handleLogout = () => {
    setCurrentScreen("login");
  };

  return (
    <div className="driver-app">
      {currentScreen === "login" && (
        <DriverLogin
          onLoginSuccess={handleLoginSuccess}
          onBack={handleBackToCustomer}
          onRegisterClick={() => setCurrentScreen("register")}
        />
      )}

      {currentScreen === "register" && (
        <DriverRegister
          onRegisterSuccess={handleRegisterSuccess}
          onBackToLogin={() => setCurrentScreen("login")}
          onBackToHome={handleBackToCustomer}
        />
      )}

      {currentScreen === "home" && (
        <DriverHome
          driverName={driverData.name}
          onTripClick={handleTripClick}
          onProfileClick={() => setCurrentScreen("profile")}
          onNavigationClick={() => setCurrentScreen("navigation")}
          onHistoryClick={() => setCurrentScreen("trip-history")}
          onEarningsClick={() => setCurrentScreen("earnings")}
          onSettingsClick={() => setCurrentScreen("settings")}
          onNotificationsClick={() => setCurrentScreen("notifications")}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === "trip-detail" && selectedTripId && (
        <TripDetail
          tripId={selectedTripId}
          onBack={() => setCurrentScreen("home")}
          onScanQR={() => setCurrentScreen("qr-scanner")}
        />
      )}

      {currentScreen === "qr-scanner" && (
        <QRScanner
          onClose={() => setCurrentScreen("trip-detail")}
          onScanSuccess={handleScanSuccess}
        />
      )}

      {currentScreen === "profile" && (
        <DriverProfile
          driverName={driverData.name}
          employeeCode={driverData.id}
          onBack={() => setCurrentScreen("home")}
          onLogout={handleLogout}
          onProfileDetailClick={() => setCurrentScreen("profile-detail")}
          onHistoryClick={() => setCurrentScreen("trip-history")}
          onNotificationsClick={() => setCurrentScreen("notifications")}
          onChangePasswordClick={() => setCurrentScreen("change-password")}
          onAchievementsClick={() => setCurrentScreen("achievements")}
        />
      )}

      {currentScreen === "profile-detail" && (
        <DriverProfileDetail
          driverName={driverData.name}
          employeeCode={driverData.id}
          onBack={() => setCurrentScreen("profile")}
        />
      )}

      {currentScreen === "navigation" && (
        <Navigation
          onBack={() => setCurrentScreen("home")}
          destination="Đà Lạt"
          estimatedArrival="14:30"
        />
      )}

      {currentScreen === "trip-history" && (
        <TripHistory
          onBack={() => setCurrentScreen("profile")}
          driverName={driverData.name}
        />
      )}

      {currentScreen === "earnings" && (
        <Earnings onBack={() => setCurrentScreen("home")} />
      )}

      {currentScreen === "notifications" && (
        <Notifications onBack={() => setCurrentScreen("home")} />
      )}

      {currentScreen === "change-password" && (
        <ChangePassword onBack={() => setCurrentScreen("profile")} />
      )}

      {currentScreen === "achievements" && (
        <Achievements onBack={() => setCurrentScreen("profile")} />
      )}

      {currentScreen === "settings" && (
        <Settings onBack={() => setCurrentScreen("home")} />
      )}
    </div>
  );
}
