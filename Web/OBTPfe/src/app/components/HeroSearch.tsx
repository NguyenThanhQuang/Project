import { Search, MapPin, Calendar, ArrowRightLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import { HeroLocationSlider } from "./HeroLocationSlider";

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
  const { t } = useLanguage();
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [date, setDate] = useState("");
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  useEffect(() => {
    setFrom(initialFrom);
    setTo(initialTo);
  }, [initialFrom, initialTo]);

  useEffect(() => {
    const handleSearchRoute = (event: CustomEvent) => {
      const { departure, destination, date: eventDate } = event.detail;
      setFrom(departure);
      setTo(destination);
      setDate(eventDate);
      onSearch?.(departure, destination, eventDate);
    };

    window.addEventListener("searchRoute", handleSearchRoute as EventListener);
    return () =>
      window.removeEventListener(
        "searchRoute",
        handleSearchRoute as EventListener
      );
  }, [onSearch]);

  const cities = [
    "TP. Hồ Chí Minh",
    "Hà Nội",
    "Đà Nẵng",
    "Đà Lạt",
    "Nha Trang",
    "Vũng Tàu",
    "Phan Thiết",
    "Cần Thơ",
    "Hải Phòng",
    "Huế",
    "Quy Nhơn",
    "Sa Pa",
    "Hội An",
    "Phú Quốc",
    "Mũi Né",
  ];

  const handleSearch = () => {
    if (!from || !to) {
      alert(t("selectBothLocations"));
      return;
    }
    const searchDate = date || new Date().toISOString().split("T")[0];
    setDate(searchDate);
    onSearch?.(from, to, searchDate);
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const filteredFromCities = cities.filter(
    (city) => city.toLowerCase().includes(from.toLowerCase()) && city !== to
  );

  const filteredToCities = cities.filter(
    (city) => city.toLowerCase().includes(to.toLowerCase()) && city !== from
  );

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-teal-500 dark:from-blue-900 dark:via-blue-800 dark:to-teal-800 py-24">
      {/* ===== Background effects (NO OVERFLOW) ===== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-teal-300/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="absolute inset-0">
          <span className="absolute top-[20%] left-[10%] w-2 h-2 bg-white/30 rounded-full animate-float" />
          <span className="absolute top-[60%] left-[80%] w-3 h-3 bg-white/20 rounded-full animate-float delay-500" />
          <span className="absolute top-[40%] left-[60%] w-2 h-2 bg-white/25 rounded-full animate-float delay-1000" />
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h1
            className="text-white mb-4 drop-shadow-lg"
            style={{ fontSize: "var(--text-5xl)", fontWeight: 700 }}
          >
            {t("heroTitle")}
          </h1>
          <p className="text-blue-100" style={{ fontSize: "var(--text-xl)" }}>
            {t("heroSubtitle")}
          </p>
        </div>

        {/* ===== Search Card ===== */}
        <div className="max-w-5xl mx-auto animate-bounce-in">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* From */}
              <div className="relative md:col-span-4">
                <label className="text-sm mb-2 block">{t("departure")}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
                  <input
                    value={from}
                    onChange={(e) => {
                      setFrom(e.target.value);
                      setShowFromSuggestions(true);
                    }}
                    onFocus={() => setShowFromSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowFromSuggestions(false), 150)
                    }
                    placeholder={t("selectDeparture")}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-700"
                  />
                </div>

                {showFromSuggestions && (
                  <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {filteredFromCities.map((city) => (
                      <button
                        key={city}
                        onMouseDown={() => setFrom(city)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap */}
              <div className="md:col-span-1 flex items-end justify-center">
                <button
                  onClick={handleSwap}
                  className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:scale-105 transition"
                >
                  <ArrowRightLeft />
                </button>
              </div>

              {/* To */}
              <div className="relative md:col-span-4">
                <label className="text-sm mb-2 block">{t("destination")}</label>
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder={t("selectDestination")}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-700"
                />
              </div>

              {/* Date */}
              <div className="md:col-span-3">
                <label className="text-sm mb-2 block">{t("date")}</label>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-700"
                />
              </div>
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white flex items-center justify-center gap-2 hover:scale-[1.02] transition"
            >
              <Search />
              {t("search")}
            </button>
          </div>
        </div>

        <HeroLocationSlider />
      </div>
    </section>
  );
}
