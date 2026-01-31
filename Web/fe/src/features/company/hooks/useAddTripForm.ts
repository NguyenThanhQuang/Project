import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { getCompanyDetails } from "../../admin/services/vehicleAdminService";
import type { LocationData } from "../../trips/types/location";
import { createTrip } from "../services/tripCompanyService";
import { useTripFormLogic } from "./useTripFormLogic";

interface UseAddTripFormProps {
  allLocations: LocationData[];
}

export const useAddTripForm = ({ allLocations }: UseAddTripFormProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [companyName, setCompanyName] = useState("Nhà xe của bạn");

  useEffect(() => {
    const fetchCompanyName = async () => {
      if (!user?.companyId) {
        return;
      }

      if (typeof user.companyId === "object" && user.companyId.name) {
        setCompanyName(user.companyId.name);
        return;
      }

      if (typeof user.companyId === "string") {
        try {
          const company = await getCompanyDetails(user.companyId);
          setCompanyName(company.name);
        } catch (error) {
          console.error("Failed to fetch company name:", error);
          setCompanyName("Không tìm thấy tên");
        }
      }
    };

    fetchCompanyName();
  }, [user?.companyId]);

  const getInitialCompanyId = (): string => {
    if (!user?.companyId) {
      return "";
    }
    return typeof user.companyId === "string"
      ? user.companyId
      : user.companyId._id;
  };

  const tripFormLogic = useTripFormLogic({
    initialCompanyId: getInitialCompanyId(),
    saveFunction: createTrip,
    onSuccessRedirectPath: () => "/manage-trips",
    allLocations: allLocations,
    isCreatingTemplate: false,
  });

  return {
    ...tripFormLogic,
    companyName,
  };
};

export default useAddTripForm;
