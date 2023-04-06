import { useEffect, useContext, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LoginPage } from "packages/ui";
import { useRouter } from "next/dist/client/router";
import { useDispatch } from "react-redux";
import { useAuth } from "packages/state/features/auth/authHooks";
import { useLoginMutation, useOtpLoginMutation, useAuthRecoveryKeyMutation } from "packages/state/services/auth";
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
  const { verification_successful } = router.query  
  const [login, { isLoading }] = useLoginMutation();
  const [otpLogin, {isLoading: otpLoading}] = useOtpLoginMutation()
  const [authRecoveryKey, {isLoading: recoveryKeyLoading}] = useAuthRecoveryKeyMutation()
  const [loadUserProfile, { data }] = useLazyGetProfileQuery();
  const ability = useContext(AbilityContext);

  const [isSuspicious, handleSuspicious] = useState(false)
  const [loginResponse, handleLoginResponse] = useState<LoginResponse|null>(null)
  const [password, handlePassword] = useState<string>('')
  
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

      if (data.flagged) {
        handleSuspicious(true)
        return
      }
      
      if(!data.user?.otp_active) {
        return dispatch(setCredentials(data));
      }
      handlePassword(credential.password)
      handleLoginResponse(data)
    } catch (err) {
      dispatch(setError(err.data.message || "Something went wrong, try again"));
    }
  };

  const handleTwoFactorAuth = async (otpValue: string) => {
    try{
      const data = await otpLogin({ userId: loginResponse.user.id, code: otpValue}).unwrap()
      dispatch(setCredentials(data))
    } catch(err) {
      handleTwoFactorErrors('The verification code is incorrect. Please try again')
    }
  }

  const handleRecoveryKeyAuth = async(recoveryKey: string) => {
    try {
      const data = await authRecoveryKey({ userId: loginResponse.user.id, code: recoveryKey, password}).unwrap()

      dispatch(setCredentials(data))
    } catch (err) {
      handleTwoFactorErrors('The backup code is incorrect. Please try again')
    }
  }

  return (
    <>
    <LoginPage
      onSubmit={doLogin}
      errorMessage={errorMessage}
      isLoading={isLoading}
      isSuspicious={isSuspicious}
      otpLoading={otpLoading}
      loginResponse={loginResponse}
      handleTwoFactorAuth={handleTwoFactorAuth}
      handleRecoveryKeyAuth={handleRecoveryKeyAuth}
      twoFactorErrorMessage={twoFactorError}
      clearLoginResponse={() => handleLoginResponse(null)}
      verificationSuccessful={verification_successful}
      />    
    </>
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
