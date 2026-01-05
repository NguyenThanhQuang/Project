import { Search, MapPin, Calendar, ArrowRightLeft, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "./LanguageContext";
import { HeroLocationSlider } from "./HeroLocationSlider";
// 1. IMPORT COMPONENT MỚI
import { CustomDatePicker } from "./CustomDatePicker";

interface HeroSearchProps {
  onSearch?: (from: string, to: string, date: string) => void;
  initialFrom?: string;
  initialTo?: string;
}

export function HeroSearch({
  onSearch,
  initialFrom = "",
  initialTo = "",
}: HeroSearchProps) {
  const { t, language } = useLanguage();
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [date, setDate] = useState("");
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFrom(initialFrom);
    setTo(initialTo);
  }, [initialFrom, initialTo]);

  // Listen for searchRoute event from HeroLocationSlider
  useEffect(() => {
    const handleSearchRoute = (event: CustomEvent) => {
      const { departure, destination, date: eventDate } = event.detail;
      setFrom(departure);
      setTo(destination);
      setDate(eventDate);

      // Trigger search automatically
      if (onSearch) {
        onSearch(departure, destination, eventDate);
      }
    };

    window.addEventListener("searchRoute", handleSearchRoute as EventListener);
    return () => {
      window.removeEventListener(
        "searchRoute",
        handleSearchRoute as EventListener
      );
    };
  }, [onSearch]);

  // Danh sách địa điểm phổ biến với cả VI và EN
  const cities = [
    { vi: "TP. Hồ Chí Minh", en: "Ho Chi Minh City", code: "hcm" },
    { vi: "Hà Nội", en: "Hanoi", code: "hn" },
    { vi: "Đà Nẵng", en: "Da Nang", code: "dn" },
    { vi: "Đà Lạt", en: "Da Lat", code: "dl" },
    { vi: "Nha Trang", en: "Nha Trang", code: "nt" },
    { vi: "Vũng Tàu", en: "Vung Tau", code: "vt" },
    { vi: "Phan Thiết", en: "Phan Thiet", code: "pt" },
    { vi: "Cần Thơ", en: "Can Tho", code: "ct" },
    { vi: "Hải Phòng", en: "Hai Phong", code: "hp" },
    { vi: "Huế", en: "Hue", code: "hue" },
    { vi: "Quy Nhơn", en: "Quy Nhon", code: "qn" },
    { vi: "Sa Pa", en: "Sa Pa", code: "sp" },
    { vi: "Hội An", en: "Hoi An", code: "ha" },
    { vi: "Phú Quốc", en: "Phu Quoc", code: "pq" },
    { vi: "Mũi Né", en: "Mui Ne", code: "mn" },
  ];

  // Get display name theo ngôn ngữ
  const getCityName = (city: (typeof cities)[0]) => {
    return language === "vi" ? city.vi : city.en;
  };

  const handleSearch = () => {
    if (!from || !to) {
      alert(t("selectBothLocations"));
      return;
    }
    if (!date) {
      const today = new Date().toISOString().split("T")[0];
      setDate(today);
      onSearch?.(from, to, today);
    } else {
      onSearch?.(from, to, date);
    }
  };

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const filteredFromCities = cities.filter((city) => {
    const cityName = getCityName(city);
    const searchLower = from.toLowerCase();
    return cityName.toLowerCase().includes(searchLower) && cityName !== to;
  });

  const filteredToCities = cities.filter((city) => {
    const cityName = getCityName(city);
    const searchLower = to.toLowerCase();
    return cityName.toLowerCase().includes(searchLower) && cityName !== from;
  });

  // Set today as min date
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-teal-500 dark:from-blue-900 dark:via-blue-800 dark:to-teal-800 py-24 transition-colors duration-300 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
            style={{ top: "20%", left: "10%" }}
          ></div>
          <div
            className="absolute w-3 h-3 bg-white/20 rounded-full animate-float delay-500"
            style={{ top: "60%", left: "80%" }}
          ></div>
          <div
            className="absolute w-2 h-2 bg-white/25 rounded-full animate-float delay-1000"
            style={{ top: "40%", left: "60%" }}
          ></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl text-white mb-4 drop-shadow-lg">
            {t("heroTitle")}
          </h1>
          <p className="text-xl text-blue-100 drop-shadow">
            {t("heroSubtitle")}
          </p>
        </div>

        {/* Search Card with glassmorphism */}
        <div className="max-w-5xl mx-auto animate-bounce-in">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 hover:shadow-blue-500/20 transition-all duration-300 animate-pulse-glow">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* From */}
              <div className="relative md:col-span-4">
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {t("departure")}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
                  <input
                    ref={fromInputRef}
                    type="text"
                    value={from}
                    onChange={(e) => {
                      setFrom(e.target.value);
                      setShowFromSuggestions(true);
                    }}
                    onFocus={() => setShowFromSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowFromSuggestions(false), 200)
                    }
                    placeholder={t("selectDeparture")}
                    className="w-full pl-10 pr-10 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                  />
                  {from && (
                    <button
                      onClick={() => setFrom("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {showFromSuggestions && filteredFromCities.length > 0 && (
                  <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto animate-scale-in">
                    {filteredFromCities.map((city, index) => (
                      <button
                        key={city.code}
                        onMouseDown={() => {
                          setFrom(getCityName(city));
                          setShowFromSuggestions(false);
                          toInputRef.current?.focus();
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 last:border-0 flex items-center space-x-3"
                      >
                        <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="flex-1 text-base">
                          {getCityName(city)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex items-end justify-center pb-0 md:pb-3">
                <button
                  onClick={handleSwap}
                  className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all hover:rotate-180 duration-300"
                  aria-label="Swap locations"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                </button>
              </div>

              {/* To */}
              <div className="relative md:col-span-4">
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {t("destination")}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
                  <input
                    ref={toInputRef}
                    type="text"
                    value={to}
                    onChange={(e) => {
                      setTo(e.target.value);
                      setShowToSuggestions(true);
                    }}
                    onFocus={() => setShowToSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowToSuggestions(false), 200)
                    }
                    placeholder={t("selectDestination")}
                    className="w-full pl-10 pr-10 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                  />
                  {to && (
                    <button
                      onClick={() => setTo("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {showToSuggestions && filteredToCities.length > 0 && (
                  <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto animate-scale-in">
                    {filteredToCities.map((city, index) => (
                      <button
                        key={city.code}
                        onMouseDown={() => {
                          setTo(getCityName(city));
                          setShowToSuggestions(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-teal-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 last:border-0 flex items-center space-x-3"
                      >
                        <MapPin className="w-4 h-4 text-teal-500 flex-shrink-0" />
                        <span className="flex-1 text-base">
                          {getCityName(city)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. SỬA DATE PICKER TẠI ĐÂY */}
              <div className="md:col-span-3">
                <CustomDatePicker
                  label={t("date")}
                  value={date}
                  onChange={(newDate) => setDate(newDate)}
                  min={today}
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 group"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-lg">{t("search")}</span>
            </button>
          </div>
        </div>

        {/* Location Slider */}
        <div className="mt-12">
          <HeroLocationSlider />
        </div>
      </div>
    </div>
  );
}
