import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/dist/client/router";
import { RootStore } from "../../store";

export const useAuth = () => {
  const authState = useSelector((store: RootStore) => store.auth);
  return authState;
};

export const useAuthRequired = (loginUrl = "/login", redirectoTo?: string) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace(loginUrl);
      return;
    }
    if (redirectoTo) router.replace(redirectoTo);
  }, [user, loginUrl, router]);
};
