import { FunctionComponent } from "react";
import { LoginBox } from "../../components/LoginBox/LoginBox";
import { Credential } from "../../domain/Credential";
import { LoginResponse } from "packages/state/domain/user";
import { TwoFactor } from "./TwoFactor";

type Props = {
  onSubmit: (credential: Credential) => void;
  handleTwoFactorAuth: (otpValue: string) => void;
  handleRecoveryKeyAuth: (recoveryKey: string) => void;
  clearLoginResponse: () => void;
  errorMessage?: string;
  isLoading?: boolean;
  otpLoading?: boolean
  loginResponse: LoginResponse | null;
  twoFactorErrorMessage?: string
};
export const LoginPage: FunctionComponent<React.PropsWithChildren<Props>> = ({
  onSubmit,
  errorMessage,
  isLoading,
  otpLoading,
  loginResponse,
  handleTwoFactorAuth,
  handleRecoveryKeyAuth,
  clearLoginResponse,
  twoFactorErrorMessage
}) => {

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      {!loginResponse && (
        <LoginBox
          onSubmit={onSubmit}
          errorMessage={errorMessage}
          isLoading={isLoading}
        />
      )}
      {loginResponse && (
        <TwoFactor 
          clearLoginResponse={clearLoginResponse}
          isLoading={otpLoading}
          handleTwoFactorAuth={handleTwoFactorAuth}
          handleRecoveryKeyAuth={handleRecoveryKeyAuth}
          errorMessage={twoFactorErrorMessage}
        />
      )}
    </div>
  );
};
