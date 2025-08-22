import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotification } from "../../../components/common/NotificationProvider";
import type { RootState } from "../../../store";
import type { Location } from "../../../types";
import { useTripFormLogic } from "../../company/hooks/useTripFormLogic";
import { createTripForCompany } from "../services/tripAdminService";

interface UseAdminAddTripFormProps {
  allLocations: Location[];
}

export const useAdminAddTripForm = ({
  allLocations,
}: UseAdminAddTripFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();

  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.roles.includes("admin");

  const companyInfo = location.state as {
    companyId: string;
    companyName: string;
  } | null;

  useEffect(() => {
    if (isAdmin && !companyInfo?.companyId) {
      showNotification("Vui lòng chọn một nhà xe để thêm chuyến đi.", "error");
      navigate("/admin/companies");
    }
  }, [isAdmin, companyInfo, navigate, showNotification]);

  const tripFormLogic = useTripFormLogic({
    initialCompanyId: companyInfo?.companyId || "",
    saveFunction: createTripForCompany,
    onSuccessRedirectPath: (companyId) => `/admin/companies/${companyId}/trips`,
    allLocations: allLocations,
  });

  return {
    ...tripFormLogic,
    companyName: companyInfo?.companyName || "Nhà xe",
  };
};
