import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { LogoutPage } from "packages/ui/pages/LogoutPage/LogoutPage";
import { clearCredentials } from "packages/state/features/auth/authSlice";

const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCredentials());
  }, []);

  return <LogoutPage />;
};

export default Logout;
