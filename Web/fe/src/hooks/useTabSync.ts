// fe/src/hooks/useTabSync.ts

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { loadUser, logout } from "../store/authSlice";

export const useTabSync = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const syncSession = (event: StorageEvent) => {
      // Chỉ xử lý khi có sự thay đổi trên key 'accessToken'
      if (event.key === "accessToken") {
        const newToken = event.newValue;

        // Trường hợp 1: Một tab khác vừa ĐĂNG NHẬP
        // Nếu tab này chưa có token, nhưng localStorage đã có token mới
        if (newToken && !token) {
          console.log("[Tab Sync] Detected login in another tab. Syncing...");
          dispatch(loadUser());
        }

        // Trường hợp 2: Một tab khác vừa ĐĂNG XUẤT
        // Nếu tab này đang có token, nhưng localStorage đã bị xóa
        if (!newToken && token) {
          console.log("[Tab Sync] Detected logout in another tab. Syncing...");
          // Dùng dispatch logout của Redux để xóa state ở tab này
          dispatch(logout());
        }
      }
    };

    // Lắng nghe sự kiện 'storage'
    window.addEventListener("storage", syncSession);

    // Dọn dẹp listener khi component unmount
    return () => {
      window.removeEventListener("storage", syncSession);
    };
  }, [token, dispatch]);
};
