import { useEffect, useState } from "react";
import { MapPin, TrendingUp, X, Bus, Clock, DollarSign } from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface Location {
  nameVi: string;
  nameEn: string;
  image: string;
  routes: number;
  popular: boolean;
  description?: string;
  popularRoutes?: Array<{
    from: string;
    to: string;
    duration: string;
    price: string;
    trips: number;
  }>;
}

const popularLocations: Location[] = [
  {
    nameVi: "TP. Hồ Chí Minh",
    nameEn: "Ho Chi Minh City",
    image:
      "https://images.unsplash.com/photo-1739287545519-a5af3fce0c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIbyUyMENoaSUyME1pbmglMjBjaXR5JTIwc2t5bGluZXxlbnwxfHx8fDE3NjUyMzAxMjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    routes: 150,
    popular: true,
    popularRoutes: [
      {
        from: "TP. Hồ Chí Minh",
        to: "Đà Lạt",
        duration: "6h 30m",
        price: "250,000đ",
        trips: 45,
      },
      {
        from: "TP. Hồ Chí Minh",
        to: "Nha Trang",
        duration: "8h",
        price: "280,000đ",
        trips: 35,
      },
      {
        from: "TP. Hồ Chí Minh",
        to: "Vũng Tàu",
        duration: "2h 30m",
        price: "120,000đ",
        trips: 50,
      },
    ],
  },
  {
    nameVi: "Hà Nội",
    nameEn: "Hanoi",
    image:
      "https://images.unsplash.com/photo-1679562078540-09ae866ef4bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIYW5vaSUyMG9sZCUyMHF1YXJ0ZXJ8ZW58MXx8fHwxNzY1MjMwMTIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    routes: 120,
    popular: true,
    popularRoutes: [
      {
        from: "Hà Nội",
        to: "Hải Phòng",
        duration: "2h",
        price: "150,000đ",
        trips: 60,
      },
      {
        from: "Hà Nội",
        to: "Huế",
        duration: "12h",
        price: "350,000đ",
        trips: 25,
      },
      {
        from: "Hà Nội",
        to: "Đà Nẵng",
        duration: "14h",
        price: "400,000đ",
        trips: 20,
      },
    ],
  },
  {
    nameVi: "Đà Nẵng",
    nameEn: "Da Nang",
    image:
      "https://images.unsplash.com/photo-1696215103476-985902d02b1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEYSUyME5hbmclMjBiZWFjaCUyMGJyaWRnZXxlbnwxfHx8fDE3NjUyMzAxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    routes: 95,
    popular: true,
    popularRoutes: [
      {
        from: "Đà Nẵng",
        to: "Hội An",
        duration: "45m",
        price: "50,000đ",
        trips: 80,
      },
      {
        from: "Đà Nẵng",
        to: "Huế",
        duration: "3h",
        price: "100,000đ",
        trips: 40,
      },
      {
        from: "Đà Nẵng",
        to: "Quy Nhơn",
        duration: "4h",
        price: "150,000đ",
        trips: 30,
      },
    ],
  },
  {
    nameVi: "Đà Lạt",
    nameEn: "Da Lat",
    image:
      "https://images.unsplash.com/photo-1613903491514-b3655f390093?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEYSUyMExhdCUyMGZsb3dlciUyMGNpdHl8ZW58MXx8fHwxNzY1MjMwMTIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    routes: 85,
    popular: true,
    popularRoutes: [
      {
        from: "Đà Lạt",
        to: "TP. Hồ Chí Minh",
        duration: "6h 30m",
        price: "250,000đ",
        trips: 45,
      },
      {
        from: "Đà Lạt",
        to: "Nha Trang",
        duration: "4h",
        price: "180,000đ",
        trips: 35,
      },
      {
        from: "Đà Lạt",
        to: "Phan Thiết",
        duration: "3h",
        price: "150,000đ",
        trips: 25,
      },
    ],
  },
  {
    nameVi: "Nha Trang",
    nameEn: "Nha Trang",
    image:
      "https://images.unsplash.com/photo-1533002832-1721d16b4bb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOaGElMjBUcmFuZyUyMGJlYWNofGVufDF8fHx8MTc2NTIzMDEyMnww&ixlib=rb-4.1.0&q=80&w=1080",
    routes: 78,
    popular: true,
    popularRoutes: [
      {
        from: "Nha Trang",
        to: "TP. Hồ Chí Minh",
        duration: "8h",
        price: "280,000đ",
        trips: 35,
      },
      {
        from: "Nha Trang",
        to: "Đà Lạt",
        duration: "4h",
        price: "180,000đ",
        trips: 35,
      },
      {
        from: "Nha Trang",
        to: "Quy Nhơn",
        duration: "3h 30m",
        price: "150,000đ",
        trips: 28,
      },
    ],
  },
  {
    nameVi: "Vũng Tàu",
    nameEn: "Vung Tau",
    image:
      "https://images.unsplash.com/photo-1698918160309-fe303e6428e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWdW5nJTIwVGF1JTIwYmVhY2h8ZW58MXx8fHwxNzY1MjMwMTIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    routes: 65,
    popular: true,
    popularRoutes: [
      {
        from: "Vũng Tàu",
        to: "TP. Hồ Chí Minh",
        duration: "2h 30m",
        price: "120,000đ",
        trips: 50,
      },
      {
        from: "Vũng Tàu",
        to: "Bình Dương",
        duration: "3h",
        price: "140,000đ",
        trips: 25,
      },
      {
        from: "Vũng Tàu",
        to: "Đồng Nai",
        duration: "2h",
        price: "100,000đ",
        trips: 30,
      },
    ],
  },
  {
    nameVi: "Phan Thiết",
    nameEn: "Phan Thiet",
    image:
      "https://images.unsplash.com/photo-1533002832-1721d16b4bb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOaGElMjBUcmFuZyUyMGJlYWNofGVufDF8fHx8MTc2NTIzMDEyMnww&ixlib=rb-4.1.0&q=80&w=1080",
    routes: 55,
    popular: true,
    popularRoutes: [
      {
        from: "Phan Thiết",
        to: "TP. Hồ Chí Minh",
        duration: "4h",
        price: "180,000đ",
        trips: 40,
      },
      {
        from: "Phan Thiết",
        to: "Đà Lạt",
        duration: "3h",
        price: "150,000đ",
        trips: 25,
      },
      {
        from: "Phan Thiết",
        to: "Nha Trang",
        duration: "5h",
        price: "200,000đ",
        trips: 20,
      },
    ],
  },
  {
    nameVi: "Cần Thơ",
    nameEn: "Can Tho",
    image:
      "https://images.unsplash.com/photo-1739287545519-a5af3fce0c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIbyUyMENoaSUyME1pbmglMjBjaXR5JTIwc2t5bGluZXxlbnwxfHx8fDE3NjUyMzAxMjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    routes: 48,
    popular: true,
    popularRoutes: [
      {
        from: "Cần Thơ",
        to: "TP. Hồ Chí Minh",
        duration: "3h 30m",
        price: "150,000đ",
        trips: 45,
      },
      {
        from: "Cần Thơ",
        to: "Cà Mau",
        duration: "2h 30m",
        price: "120,000đ",
        trips: 30,
      },
      {
        from: "Cần Thơ",
        to: "Sóc Trăng",
        duration: "1h 30m",
        price: "80,000đ",
        trips: 35,
      },
    ],
  },
  {
    nameVi: "Hải Phòng",
    nameEn: "Hai Phong",
    image:
      "https://images.unsplash.com/photo-1679562078540-09ae866ef4bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIYW5vaSUyMG9sZCUyMHF1YXJ0ZXJ8ZW58MXx8fHwxNzY1MjMwMTIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    routes: 42,
    popular: true,
    popularRoutes: [
      {
        from: "Hải Phòng",
        to: "Hà Nội",
        duration: "2h",
        price: "150,000đ",
        trips: 60,
      },
      {
        from: "Hải Phòng",
        to: "Quảng Ninh",
        duration: "2h 30m",
        price: "170,000đ",
        trips: 40,
      },
      {
        from: "Hải Phòng",
        to: "Nam Định",
        duration: "1h 30m",
        price: "100,000đ",
        trips: 35,
      },
    ],
  },
  {
    nameVi: "Huế",
    nameEn: "Hue",
    image:
      "https://images.unsplash.com/photo-1696215103476-985902d02b1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEYSUyME5hbmclMjBiZWFjaCUyMGJyaWRnZXxlbnwxfHx8fDE3NjUyMzAxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    routes: 38,
    popular: true,
    popularRoutes: [
      {
        from: "Huế",
        to: "Đà Nẵng",
        duration: "3h",
        price: "100,000đ",
        trips: 40,
      },
      {
        from: "Huế",
        to: "Hà Nội",
        duration: "12h",
        price: "350,000đ",
        trips: 25,
      },
      {
        from: "Huế",
        to: "Quảng Trị",
        duration: "1h 30m",
        price: "80,000đ",
        trips: 30,
      },
    ],
  },
];

export function HeroLocationSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [selectedRoute, setSelectedRoute] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const { language, t } = useLanguage();
  const [routesVisible, setRoutesVisible] = useState(false);

  // Auto-scroll animation
  useEffect(() => {
    // ✅ Pause slider when modal open to prevent re-render "jank"
    if (selectedLocation) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % popularLocations.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedLocation]);

  // ✅ NEW: trigger smooth enter animation for route items
  useEffect(() => {
    if (!selectedLocation) {
      setRoutesVisible(false);
      return;
    }
    setRoutesVisible(false);
    requestAnimationFrame(() => setRoutesVisible(true));
  }, [selectedLocation]);

  // Handle route selection
  useEffect(() => {
    if (selectedRoute) {
      // Dispatch custom event to trigger search
      const event = new CustomEvent("searchRoute", {
        detail: {
          departure: selectedRoute.from,
          destination: selectedRoute.to,
          date: new Date().toISOString().split("T")[0],
        },
      });
      window.dispatchEvent(event);

      // Scroll to top (hero search section) smoothly
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      // Close modal
      setSelectedLocation(null);
      setSelectedRoute(null);
    }
  }, [selectedRoute]);

  // Create infinite loop effect
  const displayLocations = [
    ...popularLocations,
    ...popularLocations,
    ...popularLocations,
  ];

  return (
    <>
      <div className="mt-12 overflow-hidden">
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
            <TrendingUp className="w-4 h-4 text-white" />
            <span className="text-sm text-white">
              {t("popularDestinations")}
            </span>
          </div>
        </div>

        <div className="relative">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-blue-600 to-transparent dark:from-blue-900 z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-blue-600 to-transparent dark:from-blue-900 z-10 pointer-events-none"></div>

          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 280}px)`,
            }}
          >
            {displayLocations.map((location, index) => (
              <div
                key={`${location.nameVi}-${index}`}
                className="flex-shrink-0 w-64 mx-2"
              >
                <div
                  onClick={() => setSelectedLocation(location)}
                  className="relative group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:bg-white/20 transition-all hover:scale-105 cursor-pointer"
                >
                  {/* Background Image */}
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={location.image}
                      alt={
                        language === "vi" ? location.nameVi : location.nameEn
                      }
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3
                      className="text-white mb-1"
                      style={{ fontSize: "var(--text-base)" }}
                    >
                      {language === "vi" ? location.nameVi : location.nameEn}
                    </h3>
                    <div className="flex items-center space-x-1 text-blue-100">
                      <MapPin className="w-3 h-3" />
                      <span style={{ fontSize: "var(--text-xs)" }}>
                        {location.routes}+ {t("routes")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center space-x-2 mt-6">
          {popularLocations.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex % popularLocations.length
                  ? "w-8 bg-white"
                  : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedLocation && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
            onClick={() => setSelectedLocation(null)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Image */}
              <div className="relative h-48 overflow-hidden rounded-t-3xl">
                <img
                  src={selectedLocation.image}
                  alt={
                    language === "vi"
                      ? selectedLocation.nameVi
                      : selectedLocation.nameEn
                  }
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-white text-2xl mb-1">
                    {language === "vi"
                      ? selectedLocation.nameVi
                      : selectedLocation.nameEn}
                  </h2>
                  <div className="flex items-center space-x-2 text-white/90">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {selectedLocation.routes}+ {t("routes")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Routes List */}
              <div className="p-6">
                <h3 className="text-gray-900 dark:text-white mb-4">
                  {language === "vi"
                    ? "Tuyến đường phổ biến"
                    : "Popular Routes"}
                </h3>
                <div className="space-y-3">
                  {selectedLocation.popularRoutes?.map((route, index) => (
                    <div
                      key={`${route.from}-${route.to}`}
                      style={{ transitionDelay: `${index * 70}ms` }}
                      className={[
                        "bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 cursor-pointer",
                        "border border-gray-200 dark:border-gray-600",
                        "transition-[transform,opacity,box-shadow] duration-500 ease-out",
                        "will-change-[transform,opacity] transform-gpu",
                        routesVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-2",
                        "hover:shadow-md hover:-translate-y-0.5",
                      ].join(" ")}
                      onClick={() =>
                        setSelectedRoute({ from: route.from, to: route.to })
                      }
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Bus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-gray-900 dark:text-white">
                            {route.from} → {route.to}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {route.trips}{" "}
                          {language === "vi" ? "chuyến/ngày" : "trips/day"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{route.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                          <DollarSign className="w-3 h-3" />
                          <span>{route.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  {language === "vi" ? "Tìm chuyến đi" : "Find Trip"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
