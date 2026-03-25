import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { LogoutPage } from "packages/ui/pages/LogoutPage/LogoutPage";
import { clearCredentials } from "packages/state/features/auth/authSlice";
import { clearUser } from "packages/state/features/user/userSlice";
import { useLogoutMutation } from "packages/state/services/auth";

const Logout = () => {
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    logout()
      .finally(() => {
        dispatch(clearCredentials());
        dispatch(clearUser());
      });
  }, []);

  return <LogoutPage />;
};

export default Logout;
