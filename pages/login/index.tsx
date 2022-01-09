import { useEffect } from "react";

import { LoginPage } from "packages/ui";
import { useRouter } from "next/dist/client/router";
import { useDispatch } from "react-redux";
import { Credential } from "@tellaweb/bloc";
import { useAuth } from "packages/state/features/auth/authHooks";
import { useLoginMutation } from "packages/state/services/auth";
import {
  setCredentials,
  setError,
} from "packages/state/features/auth/authSlice";

const Login = () => {
  const { errorMessage, user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (user) router.replace("/report");
  }, [user]);

  const doLogin = async (credential: Credential) => {
    try {
      const data = await login(credential).unwrap();
      dispatch(setCredentials(data));
    } catch (err) {
      dispatch(setError(err.data.message));
    }
  };

  return (
    <LoginPage
      onSubmit={doLogin}
      errorMessage={errorMessage}
      isLoading={isLoading}
    />
  );
};

export default Login;
