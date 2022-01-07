import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { usePloc } from "../pages/_app";
import { usePlocState } from "./usePlocState";

export const useAuthRequired = (redirectoTo?: string) => {
  const { auth: authPloc } = usePloc();
  const state = usePlocState(authPloc);
  const router = useRouter();

  useEffect(() => {
    authPloc.getProfile()  
  }, [])

  useEffect(() => {
    if (!state || typeof state?.loggedIn === "undefined") return;
    if (!state.loggedIn) {
      router.replace("/login");
      return;
    }
    if (redirectoTo) router.replace(redirectoTo);
  }, [state, router]);
};
