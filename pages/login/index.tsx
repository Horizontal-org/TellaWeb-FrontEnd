import { LoginPage } from "packages/ui";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { Credential } from "packages/bloc";
import { usePlocState } from "../../common/usePlocState";
import { usePloc } from "../_app";

const Login = () => {
  const { auth: authPloc } = usePloc();
  const state = usePlocState(authPloc);
  const router = useRouter();

  useEffect(() => {
    if (state?.loggedIn) router.replace("/report");
  }, [state?.loggedIn]);

  return (
    <LoginPage
      onSubmit={(userAndPassword: Credential) =>
        authPloc.login(userAndPassword)
      }
      errorMessage={state?.kind === "ErrorAuthState" ? state.error : undefined}
    />
  );
};

export default Login;
