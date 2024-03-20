import { FunctionComponent, useState } from "react";
import { LoginBox } from "../../components/LoginBox/LoginBox";
import { Credential } from "../../domain/Credential";
import { LoginResponse } from "packages/state/domain/user";
import { TwoFactor } from "./TwoFactor";
import SuspiciousPage from "packages/ui/components/SuspiciousBox";
import { BsX } from "react-icons/bs"
import classNames from "classnames";

type Props = {
  onSubmit: (credential: Credential) => void;
  handleTwoFactorAuth: (otpValue: string) => void;
  handleRecoveryKeyAuth: (recoveryKey: string) => void;
  clearLoginResponse: () => void;
  errorMessage?: string;
  isLoading?: boolean;
  otpLoading?: boolean
  loginResponse: LoginResponse | null;
  twoFactorErrorMessage?: string;
  isSuspicious: boolean;
  verificationSuccessful: string | string[];
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
  twoFactorErrorMessage,
  isSuspicious,
  verificationSuccessful
}) => {
  const [popup, showPopup] = useState(true)

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-white">
      { isSuspicious ? (
        <SuspiciousPage />
      ) : (
        <>
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
          { verificationSuccessful && popup && (
            <div 
              style={{width: 400}} 
              className={classNames(
                'mt-2 shadow-md p-2 text-sm font-bold font-sans duration-300 text-white rounded',
                {                  
                  'bg-red-600': verificationSuccessful === '0',
                  'bg-blue-300': verificationSuccessful === '1',
                }
              )}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>          
                  <span className='pl-2'>
                    { verificationSuccessful === '1' && 'Verification successfull, please log in again' }
                    { verificationSuccessful === '0' && 'Unauthorized, please try again' }
                  </span>
                </div>
                <div className='cursor-pointer' onClick={() => { showPopup(false) }}>
                  <BsX color='white' size={20} /> 
                </div>
              </div>              
            </div>
          )}
        </>
      )}
    </div>
  );
};
