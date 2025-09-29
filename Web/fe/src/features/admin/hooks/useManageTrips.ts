import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { getCompanyDetails } from "../services/companyAdminService";
import {
  cancelTrip,
  getTripsByCompany,
  toggleTripRecurrence,
} from "../services/tripAdminService";
import type { AdminTrip } from "../types/trip";

export const useManageTrips = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [trips, setTrips] = useState<AdminTrip[]>([]);
  const [companyName, setCompanyName] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState<
    "upcoming" | "history" | "templates"
  >("upcoming");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTrip, setSelectedTrip] = useState<AdminTrip | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!companyId) {
      setError("Không tìm thấy ID nhà xe trong URL.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const [tripsData, companyData] = await Promise.all([
        getTripsByCompany(companyId),
        getCompanyDetails(companyId),
      ]);

      setTrips(tripsData);
      setCompanyName(companyData.name);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Không thể tải dữ liệu chuyến đi. Vui lòng thử lại."
        )
      );
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData, location.state?.refresh]);

  const { upcomingTrips, historyTrips, templateTrips } = useMemo(() => {
    const upcoming: AdminTrip[] = [];
    const history: AdminTrip[] = [];
    const templates: AdminTrip[] = [];

    for (const trip of trips) {
      if (trip.isRecurrenceTemplate === true) {
        templates.push(trip);
      } else {
        if (trip.status === "scheduled" || trip.status === "departed") {
          upcoming.push(trip);
        } else if (trip.status === "arrived" || trip.status === "cancelled") {
          history.push(trip);
        }
      }
    }
    return { upcomingTrips, historyTrips, templateTrips };
  }, [trips]);

  const tripsToDisplay = useMemo(() => {
    switch (activeTab) {
      case "history":
        return historyTrips;
      case "templates":
        return templateTrips;
      case "upcoming":
      default:
        return upcomingTrips;
    }
  }, [activeTab, upcomingTrips, historyTrips, templateTrips]);

  const paginatedTrips = useMemo(() => {
    return tripsToDisplay.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [tripsToDisplay, page, rowsPerPage]);

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    trip: AdminTrip
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedTrip(trip);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenCancelDialog = () => {
    setCancelDialogOpen(true);
    handleMenuClose();
  };

  const confirmCancelTrip = async () => {
    if (!selectedTrip) return;
    clearMessages();
    try {
      setLoading(true);
      await cancelTrip(selectedTrip._id);
      setSuccessMessage(`Đã hủy chuyến đi thành công.`);
      await fetchData();
    } catch (err) {
      setError(
        getErrorMessage(err, "Hủy chuyến đi thất bại. Vui lòng thử lại.")
      );
    } finally {
      setLoading(false);
      setCancelDialogOpen(false);
    }
  };

  const handleToggleRecurrence = async (tripToUpdate: AdminTrip) => {
    if (!tripToUpdate.isRecurrenceTemplate) return;
    clearMessages();
    setTrips((currentTrips) =>
      currentTrips.map((trip) =>
        trip._id === tripToUpdate._id
          ? { ...trip, isRecurrenceActive: !trip.isRecurrenceActive }
          : trip
      )
    );
    try {
      await toggleTripRecurrence(
        tripToUpdate._id,
        !tripToUpdate.isRecurrenceActive
      );
      setSuccessMessage("Cập nhật trạng thái lặp lại thành công!");
    } catch (err) {
      setError(getErrorMessage(err, "Cập nhật thất bại, vui lòng thử lại."));
      fetchData();
    }
  };

  return {
    loading,
    error,
    successMessage,
    trips,
    companyName,
    companyId,
    paginatedTrips,
    tripsToDisplay,
    page,
    rowsPerPage,
    activeTab,
    setActiveTab,
    anchorEl,
    selectedTrip,
    cancelDialogOpen,
    clearMessages,
    handleChangePage,
    handleChangeRowsPerPage,
    handleMenuOpen,
    handleMenuClose,
    handleOpenCancelDialog,
    confirmCancelTrip,
    setCancelDialogOpen,
    handleToggleRecurrence,
  };
};
