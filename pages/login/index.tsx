import { useEffect, useContext, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LoginPage } from "packages/ui";
import { useRouter } from "next/dist/client/router";
import { useDispatch } from "react-redux";
import { useAuth } from "packages/state/features/auth/authHooks";
import { useLoginMutation } from "packages/state/services/auth";
import {
  setCredentials,
  setError,
} from "packages/state/features/auth/authSlice";
import { useUserProfile } from "packages/state/features/user/userHooks";
import { Credential, LoginResponse } from "packages/state/domain/user";
import { setUser } from "packages/state/features/user/userSlice";
import { useLazyGetProfileQuery } from "packages/state/services/user";
import { AbilityContext } from "common/casl/Can";
import { updateAbility } from "common/casl/Ability";

const Login = () => {
  const { errorMessage, accessToken } = useAuth();
  const user = useUserProfile();
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [loadUserProfile, { data }] = useLazyGetProfileQuery();
  const ability = useContext(AbilityContext);
  const [loginResponse, handleLoginResponse] = useState<LoginResponse|null>(null)
  
  //twofactor
  const [twoFactorError, handleTwoFactorErrors] = useState('')

  useEffect(() => {
    if (user) router.replace("/project");
  }, [user]);

  useEffect(() => {
    if (accessToken && !user && !data) {
      loadUserProfile();
      return;
    }
    if (data) {
      updateAbility(data, ability)
      dispatch(setUser(data))
    };
  }, [accessToken, user, data]);

  const doLogin = async (credential: Credential) => {
    try {
      const data = await login(credential).unwrap();
      // mocked data that should be removed
      const parsedData = {
        ...data,
        two_factor_enabled: true
      }

      if(!parsedData.two_factor_enabled) {
        return dispatch(setCredentials(data));
      }

      handleLoginResponse(parsedData)
    } catch (err) {
      dispatch(setError(err.data.message || "Something went wrong, try again"));
    }
  };

  const handleTwoFactorAuth = (otpValue: string) => {
    //some async operation to validate otp
    if(otpValue === '123456') {
      return dispatch(setCredentials(loginResponse))
    }

    handleTwoFactorErrors('The verification code is incorrect. Please try again')

  }

  return (
    <LoginPage
      onSubmit={doLogin}
      errorMessage={errorMessage}
      isLoading={isLoading}
      loginResponse={loginResponse}
      handleTwoFactorAuth={handleTwoFactorAuth}
      twoFactorErrorMessage={twoFactorError}
    />
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      // Will be passed to the page component as props
    },
  };
}

export default Login;
