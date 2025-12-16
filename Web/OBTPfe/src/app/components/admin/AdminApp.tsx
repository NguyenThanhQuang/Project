import { useState } from "react";
import { AdminLogin } from "./AdminLogin";
import { CompanyDashboard } from "./CompanyDashboard";
import { SystemDashboard } from "./SystemDashboard";
import { VehicleManagement } from "./VehicleManagement";
import { RouteManagement } from "./RouteManagement";
import { BookingManagement } from "./BookingManagement";
import { CompanyManagement } from "./CompanyManagement";
import { UserManagement } from "./UserManagement";
import { ReviewManagement } from "./ReviewManagement";
import { SettingsPage } from "./SettingsPage";
import { DriverManagement } from "./DriverManagement";
import { DriverApplications } from "./DriverApplications";
import { useTheme } from "../ThemeProvider";
import { useLanguage } from "../LanguageContext";
import {
  LayoutDashboard,
  Bus,
  Route,
  Ticket,
  Settings,
  Building2,
  Users,
  Star,
  Database,
  LogOut,
  Menu,
  X,
  UserCheck,
  FileText,
  Sun,
  Moon,
  Globe,
} from "lucide-react";

type AdminType = "company" | "system";
type Page =
  | "dashboard"
  | "vehicles"
  | "routes"
  | "bookings"
  | "drivers"
  | "driver-applications"
  | "users"
  | "companies"
  | "reviews"
  | "settings";

interface AdminAppProps {
  adminType?: AdminType;
  onLogout?: () => void;
}

export function AdminApp({ adminType = "company", onLogout }: AdminAppProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "",
    id: "",
    email: "",
  });
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  const handleLoginSuccess = (data: {
    name: string;
    id: string;
    email: string;
  }) => {
    setAdminData(data);
    setIsLoggedIn(true);
  };

  const handleBackToCustomer = () => {
    setIsLoggedIn(false);
    onLogout?.();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("dashboard");
  };

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return (
      <AdminLogin
        adminType={adminType}
        onLoginSuccess={handleLoginSuccess}
        onBack={handleBackToCustomer}
      />
    );
  }

  const companyMenuItems = [
    {
      icon: LayoutDashboard,
      label: "dashboard",
      page: "dashboard" as Page,
    },
    {
      icon: Bus,
      label: "vehicleManagement",
      page: "vehicles" as Page,
    },
    {
      icon: UserCheck,
      label: "driverManagement",
      page: "drivers" as Page,
    },
    {
      icon: FileText,
      label: "driverApplications",
      page: "driver-applications" as Page,
    },
    { icon: Route, label: "routeManagement", page: "routes" as Page },
    { icon: Ticket, label: "bookingManagement", page: "bookings" as Page },
    {
      icon: Settings,
      label: "settings",
      page: "settings" as Page,
    },
  ];

  const systemMenuItems = [
    {
      icon: LayoutDashboard,
      label: "dashboard",
      page: "dashboard" as Page,
    },
    {
      icon: Building2,
      label: "companyManagement",
      page: "companies" as Page,
    },
    { icon: Users, label: "userManagement", page: "users" as Page },
    { icon: Bus, label: "buses", page: "vehicles" as Page },
    { icon: Route, label: "routeManagement", page: "routes" as Page },
    { icon: Star, label: "reviewManagement", page: "reviews" as Page },
    {
      icon: Database,
      label: "dataManagement",
      page: "settings" as Page,
    },
  ];

  const menuItems =
    adminType === "company" ? companyMenuItems : systemMenuItems;

  const renderContent = () => {
    if (currentPage === "dashboard") {
      return adminType === "company" ? (
        <CompanyDashboard />
      ) : (
        <SystemDashboard />
      );
    }

    if (currentPage === "vehicles") {
      return <VehicleManagement />;
    }

    if (currentPage === "drivers") {
      return <DriverManagement />;
    }

    if (currentPage === "driver-applications") {
      return <DriverApplications />;
    }

    if (currentPage === "routes") {
      return <RouteManagement />;
    }

    if (currentPage === "bookings") {
      return <BookingManagement />;
    }

    if (currentPage === "companies" && adminType === "system") {
      return <CompanyManagement />;
    }

    if (currentPage === "users" && adminType === "system") {
      return <UserManagement />;
    }

    if (currentPage === "reviews" && adminType === "system") {
      return <ReviewManagement />;
    }

    if (currentPage === "settings") {
      return <SettingsPage />;
    }

    // For other pages not yet implemented
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-gray-900 dark:text-white mb-2">
            {t("underDevelopment")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t(menuItems.find((m) => m.page === currentPage)?.label || "")}{" "}
            {t("pageUnderConstruction")}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          {sidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-teal-500 text-white px-3 py-2 rounded-xl">
                <span className="text-xl">🚌</span>
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                {adminType === "company" ? "Company" : "Admin"}
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => setCurrentPage(item.page)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className="w-5 h-5" />
                {sidebarOpen && <span>{t(item.label)}</span>}
              </button>
            );
          })}
        </nav>

        {/* Theme & Language Controls */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            title={t(theme === "dark" ? "switchToLight" : "switchToDark")}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-blue-600" />
            )}
            {sidebarOpen && (
              <span>{t(theme === "dark" ? "lightTheme" : "darkTheme")}</span>
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            title={t(
              language === "vi" ? "switchToEnglish" : "switchToVietnamese"
            )}
          >
            <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
            {sidebarOpen && (
              <span className="uppercase">
                {language === "vi" ? "EN" : "VI"}
              </span>
            )}
          </button>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>{t("logout")}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{renderContent()}</main>
    </div>
  );
}
