import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotification } from "../../../components/common/NotificationProvider";
import type { RootState } from "../../../store";
import { useTripFormLogic } from "../../company/hooks/useTripFormLogic";
import type { LocationData } from "../../trips/types/location";
import { createTripForCompany } from "../services/tripAdminService";

interface UseAdminAddTripFormProps {
  allLocations: LocationData[];
}

export const useAdminAddTripForm = ({
  allLocations,
}: UseAdminAddTripFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  const { user } = useSelector((state: RootState) => state.auth);

  const isAdmin = user?.roles.includes("admin");
  const companyInfoFromState = location.state as {
    companyId: string;
    companyName: string;
    isCreatingTemplate?: boolean;
  } | null;

  useEffect(() => {
    if (isAdmin && !companyInfoFromState?.companyId) {
      showNotification("Vui lòng chọn một nhà xe để thêm chuyến đi.", "error");
      navigate("/admin/companies");
    }
  }, [isAdmin, companyInfoFromState, navigate, showNotification]);

  const tripFormLogic = useTripFormLogic({
    initialCompanyId: companyInfoFromState?.companyId || "",
    isCreatingTemplate: companyInfoFromState?.isCreatingTemplate || false,
    saveFunction: createTripForCompany,
    onSuccessRedirectPath: (companyId) => `/admin/companies/${companyId}/trips`,
    allLocations: allLocations,
  });

  return {
    ...tripFormLogic,
    companyName: companyInfoFromState?.companyName || "Nhà xe không xác định",
  };
};
