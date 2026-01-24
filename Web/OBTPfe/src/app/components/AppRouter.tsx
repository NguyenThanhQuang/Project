import { useState } from "react";
import { Header } from "./Header";
import { HeroSearch } from "./HeroSearch";
import { PopularRoutes } from "./PopularRoutes";
import { Features } from "./Features";
import { ActivePromoCodes } from "./ActivePromoCodes";
import { Footer } from "./Footer";
import { SearchResults } from "./SearchResults";
import { TripDetail } from "./TripDetail";
import { Auth } from "./Auth";
import { TicketLookup } from "./TicketLookup";
import { MyTrips } from "./MyTrips";
import { UserProfile } from "./UserProfile";
import { RoutesPage } from "./RoutesPage";
import { ContactPage } from "./ContactPage";
import { HotlineModal } from "./HotlineModal";
import { PaymentPage } from "./PaymentPage";
import { BookingConfirmation } from "./BookingConfirmation";
import { QRTicketPage } from "./QRTicketPage";
import { AboutPage } from "./AboutPage";
import { AboutUs, FAQ, Terms, Privacy, Contact } from "./footer-pages";

type Page =
  | "home"
  | "search-results"
  | "trip-detail"
  | "payment"
  | "booking-confirmation"
  | "qr-ticket"
  | "ticket-lookup"
  | "my-trips"
  | "user-profile"
  | "routes"
  | "contact"
  | "about"
  | "faq"
  | "about-us"
  | "terms"
  | "privacy"
  | "contact-us"
  | "mobile-app";

interface AppRouterProps {
  onPageChange?: (isHome: boolean) => void;
}

export function AppRouter({ onPageChange }: AppRouterProps = {}) {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [showAuth, setShowAuth] = useState(false);
  const [showHotline, setShowHotline] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [currentBookingId, setCurrentBookingId] = useState("");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Notify parent when page changes
  const changePage = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (onPageChange) {
      onPageChange(page === "home");
    }
  };

  // Mock data
  const mockTripData = {
    from: searchFrom || "TP. Hồ Chí Minh",
    to: searchTo || "Đà Lạt",
    date: "05/12/2024",
    time: "08:00",
    seats: selectedSeats.length > 0 ? selectedSeats : ["A1", "A2"],
    totalPrice: 440000,
    companyName: "Phương Trang",
    passengerName: "Nguyễn Văn A",
    passengerPhone: "0123456789",
  };

  const mockTicketData = {
    ...mockTripData,
    bookingId: currentBookingId || "BK123456789",
    status: "active" as const,
  };

  const handleSearch = (from: string, to: string, date: string) => {
    setSearchFrom(from);
    setSearchTo(to);
    changePage("search-results");
  };

  const handleRouteClick = (from: string, to: string) => {
    setSearchFrom(from);
    setSearchTo(to);
    changePage("search-results");
  };

  const handleTripSelect = (tripId: string) => {
    setSelectedTripId(tripId);
    changePage("trip-detail");
  };

  const handleBooking = (seats: string[]) => {
    setSelectedSeats(seats);
    if (!isLoggedIn) {
      setShowAuth(true);
    } else {
      changePage("payment");
    }
  };

  const handlePaymentSuccess = (bookingId: string) => {
    setCurrentBookingId(bookingId);
    changePage("booking-confirmation");
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowAuth(false);
    // Continue with booking if was trying to book
    if (selectedSeats.length > 0) {
      changePage("payment");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    changePage("home");
  };

  return (
    <>
      {currentPage === "home" && (
        <>
          <Header
            isLoggedIn={isLoggedIn}
            onLoginClick={() => setShowAuth(true)}
            onMyTripsClick={() => changePage("my-trips")}
            onProfileClick={() => changePage("user-profile")}
            onLogout={handleLogout}
            onRoutesClick={() => changePage("routes")}
            onContactClick={() => changePage("contact")}
            onTicketLookupClick={() => changePage("ticket-lookup")}
            onHotlineClick={() => setShowHotline(true)}
            onHomeClick={() => changePage("home")}
          />
          <HeroSearch
            onSearch={handleSearch}
            initialFrom={searchFrom}
            initialTo={searchTo}
          />
          <PopularRoutes onRouteClick={handleRouteClick} />
          <ActivePromoCodes />
          <Features />
          <Footer
            onAboutClick={() => changePage("about")}
            onFAQClick={() => changePage("faq")}
            onContactClick={() => changePage("contact")}
            onNavigate={(page) => changePage(page as Page)}
          />
        </>
      )}

      {currentPage === "routes" && (
        <RoutesPage
          onBack={() => changePage("home")}
          onRouteClick={handleRouteClick}
          isLoggedIn={isLoggedIn}
          onLoginClick={() => setShowAuth(true)}
          onMyTripsClick={() => changePage("my-trips")}
          onProfileClick={() => changePage("user-profile")}
          onLogout={handleLogout}
          onContactClick={() => changePage("contact")}
          onTicketLookupClick={() => changePage("ticket-lookup")}
          onHotlineClick={() => setShowHotline(true)}
        />
      )}

      {currentPage === "contact" && (
        <ContactPage
          onBack={() => changePage("home")}
          isLoggedIn={isLoggedIn}
          onLoginClick={() => setShowAuth(true)}
          onMyTripsClick={() => changePage("my-trips")}
          onProfileClick={() => changePage("user-profile")}
          onLogout={handleLogout}
          onRoutesClick={() => changePage("routes")}
          onTicketLookupClick={() => changePage("ticket-lookup")}
          onHotlineClick={() => setShowHotline(true)}
        />
      )}

      {currentPage === "about" && (
        <AboutPage onBack={() => changePage("home")} />
      )}

      {currentPage === "faq" && (
        <FAQ onNavigate={(page) => changePage(page as Page)} />
      )}

      {currentPage === "search-results" && (
        <SearchResults
          onBack={() => changePage("home")}
          onTripSelect={handleTripSelect}
        />
      )}

      {currentPage === "trip-detail" && selectedTripId && (
        <TripDetail
          tripId={selectedTripId}
          onBack={() => changePage("search-results")}
          onBooking={handleBooking}
        />
      )}

      {currentPage === "payment" && (
        <PaymentPage
          onBack={() => changePage("trip-detail")}
          onPaymentSuccess={handlePaymentSuccess}
          tripData={mockTripData}
        />
      )}

      {currentPage === "booking-confirmation" && (
        <BookingConfirmation
          onViewTicket={() => changePage("qr-ticket")}
          onBackToHome={() => changePage("home")}
          bookingData={{ ...mockTripData, bookingId: currentBookingId }}
        />
      )}

      {currentPage === "qr-ticket" && (
        <QRTicketPage
          onBack={() => changePage("my-trips")}
          ticketData={mockTicketData}
        />
      )}

      {currentPage === "ticket-lookup" && (
        <TicketLookup
          onBack={() => changePage("home")}
          isLoggedIn={isLoggedIn}
          onLoginClick={() => setShowAuth(true)}
          onMyTripsClick={() => changePage("my-trips")}
          onProfileClick={() => changePage("user-profile")}
          onLogout={handleLogout}
          onRoutesClick={() => changePage("routes")}
          onContactClick={() => changePage("contact")}
          onHotlineClick={() => setShowHotline(true)}
        />
      )}

      {currentPage === "my-trips" && (
        <MyTrips onBack={() => changePage("home")} />
      )}

      {currentPage === "user-profile" && (
        <UserProfile onBack={() => changePage("home")} />
      )}

      {/* Footer Pages */}
      {currentPage === "about-us" && (
        <AboutUs onNavigate={(page) => changePage(page as Page)} />
      )}

      {currentPage === "terms" && (
        <Terms onNavigate={(page) => changePage(page as Page)} />
      )}

      {currentPage === "privacy" && (
        <Privacy onNavigate={(page) => changePage(page as Page)} />
      )}

      {currentPage === "contact-us" && (
        <Contact onNavigate={(page) => changePage(page as Page)} />
      )}

      {showAuth && (
        <Auth
          onClose={() => setShowAuth(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showHotline && <HotlineModal onClose={() => setShowHotline(false)} />}
    </>
  );
}
