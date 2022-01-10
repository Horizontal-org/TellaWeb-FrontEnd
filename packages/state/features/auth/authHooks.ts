import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/dist/client/router";
import { RootStore } from "../../store";
import { useGetProfileQuery } from "packages/state/services/user";
import { setCredentials } from "./authSlice";
import { useUserProfile } from "../user/userHooks";
import { setUser } from "../user/userSlice";

export const useAuth = () => {
  const authState = useSelector((store: RootStore) => store.auth);
  return authState;
};

export const useAuthRequired = (loginUrl = "/login", redirectoTo?: string) => {
  const { accessToken } = useAuth();
  const user = useUserProfile();
  const router = useRouter();
  const dispatch = useDispatch();
  const { refetch, data, isError } = useGetProfileQuery();

  // If the token was retrieved from the localstorage, we try to
  // get the profile of that user.
  useEffect(() => {
    if (accessToken && !user) {
      refetch();
    }
  }, [accessToken, user]);

  // If the profile is obtained, it is saved in the store.
  useEffect(() => {
    if (accessToken && data && !user) {
      dispatch(setCredentials({ access_token: accessToken }));
      dispatch(setUser(data));
    }
  }, [data, user, accessToken]);

  // If there is no user token or the profile cannot be obtained,
  // the user is not logged in.
  useEffect(() => {
    if (isError || !accessToken) {
      router.replace(loginUrl);
      return;
    }
    if (redirectoTo) router.replace(redirectoTo);
  }, [user, loginUrl, router]);
};
