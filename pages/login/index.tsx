import { useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LoginPage } from "packages/ui";
import { useRouter } from "next/dist/client/router";
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
      errorMessage={
        state?.kind === "ErrorAuthState" ? "error.invalid" : undefined
      }
    />
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["login"])),
  },
});

export default Login;
