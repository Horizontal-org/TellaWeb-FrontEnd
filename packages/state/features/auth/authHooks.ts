import { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/dist/client/router";
import { RootStore } from "../../store";
import { useLazyGetProfileQuery } from "packages/state/services/user";
import { useUserProfile } from "../user/userHooks";
import { setUser } from "../user/userSlice";

import { AbilityContext } from "common/casl/Can";
import { updateAbility } from "common/casl/Ability";

export const useAuth = () => {
  const authState = useSelector((store: RootStore) => store.auth);
  return authState;
};

export const useAuthRequired = (loginUrl = "/login", redirectTo?: string) => {

  const { accessToken } = useAuth();
  const user = useUserProfile();
  const router = useRouter();
  const dispatch = useDispatch();
  const ability = useContext(AbilityContext);
  const [loadUserProfile, data] = useLazyGetProfileQuery();

  // If the token was retrieved from the localstorage, we try to
  // get the profile of that user.
  useEffect(() => {
    if (accessToken && !user) {
      loadUserProfile().then(
        (response) => {
          if (response.isError) return
          
          updateAbility(response.data, ability)
          dispatch(setUser(response.data))
        }
      );
    }
  }, [accessToken, user]);

  // If there is no user token or the profile cannot be obtained,
  // the user is not logged in.
  useEffect(() => {
    if ((data?.isError || !accessToken) && router.pathname !== loginUrl) {
      router.replace(loginUrl);
      return;
    }
    if (redirectTo && redirectTo !== router.pathname && user) router.replace(redirectTo);
  }, [user, loginUrl, router, data]);

  return user; 
};
