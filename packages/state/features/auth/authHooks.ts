import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/dist/client/router";
import { RootStore } from "../../store";
import { useLazyGetProfileQuery } from "packages/state/services/user";
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
  const [loadUserProfile, data] = useLazyGetProfileQuery();

  // If the token was retrieved from the localstorage, we try to
  // get the profile of that user.
  useEffect(() => {
    if (accessToken && !user) {
      loadUserProfile().then((response) => dispatch(setUser(response.data)));
    }
  }, [accessToken, user]);

  // If there is no user token or the profile cannot be obtained,
  // the user is not logged in.
  useEffect(() => {
    if (data?.isError || !accessToken) {
      router.replace(loginUrl);
      return;
    }
    if (redirectoTo && user) router.replace(redirectoTo);
  }, [user, loginUrl, router, data]);

  return user;
};
