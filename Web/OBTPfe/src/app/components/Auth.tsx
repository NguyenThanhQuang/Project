import { useState } from "react";
import {
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface AuthProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

type AuthMode = "login" | "register" | "forgot-password";

export function Auth({ onClose, onLoginSuccess }: AuthProps) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      // Simulate login
      console.log("Login:", { email, password });
      onLoginSuccess();
    } else if (mode === "register") {
      // Simulate register
      console.log("Register:", { email, password, fullName, phone });
      alert(t("registerSuccess"));
      setMode("login");
    } else {
      // Forgot password
      console.log("Forgot password:", email);
      alert(t("resetPasswordSuccess"));
      setMode("login");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <h2 className="text-gray-900 dark:text-white">
              {mode === "login" && t("login")}
              {mode === "register" && t("register")}
              {mode === "forgot-password" && t("forgotPassword")}
            </h2>
            <div className="w-10"></div>
          </div>

          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center bg-gradient-to-br from-blue-600 to-teal-500 text-white px-6 py-4 rounded-2xl shadow-lg shadow-blue-500/30 mb-4">
              <span className="text-4xl">🚌</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {mode === "login" && t("loginSubtitle")}
              {mode === "register" && t("registerSubtitle")}
              {mode === "forgot-password" && t("forgotPasswordSubtitle")}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    {t("fullName")}
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t("enterFullName")}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    {t("phone")}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t("enterPhoneNumber")}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                {t("email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("enterEmail")}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            {mode !== "forgot-password" && (
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  {t("password")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("enterPassword")}
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {mode === "register" && (
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  {t("confirmPassword")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t("enterConfirmPassword")}
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {mode === "login" && (
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t("rememberMe")}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setMode("forgot-password")}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {t("forgotPassword")}?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-2xl hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:scale-[1.02]"
            >
              {mode === "login" && t("login")}
              {mode === "register" && t("register")}
              {mode === "forgot-password" && t("resetPassword")}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            {mode === "login" && (
              <p className="text-gray-600 dark:text-gray-400">
                {t("noAccount")}{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {t("registerNow")}
                </button>
              </p>
            )}
            {mode === "register" && (
              <p className="text-gray-600 dark:text-gray-400">
                {t("haveAccount")}{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {t("loginNow")}
                </button>
              </p>
            )}
            {mode === "forgot-password" && (
              <button
                onClick={() => setMode("login")}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t("backToLogin")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
