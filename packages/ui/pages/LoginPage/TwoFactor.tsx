import { FunctionComponent, useState } from "react";
import styled from 'styled-components';
import OtpInput from "packages/ui/components/OtpInput.tsx/OtpInput";

type Props = {
  handleTwoFactorAuth: (otpValue: string) => void; 
  clearLoginResponse: () => void;
  errorMessage?: string;
  isLoading?: boolean;
};

export const TwoFactor: FunctionComponent<React.PropsWithChildren<Props>> = ({
  handleTwoFactorAuth,
  clearLoginResponse,
  errorMessage,
  isLoading
}) => {
  const [ otpValue, handleOtpValue ] = useState<string>('')
  return (
    <form 
      className="p-10 bg-white rounded flex justify-center items-center flex-col shadow-md border"
      onSubmit={(e) => {
        e.preventDefault()
        handleTwoFactorAuth(otpValue)
      }}
    >
      <p className="text-xl text-gray-600 font-bold pb-4">
        Two-factor Authentication
      </p>
      <p className='font-sans text-base font-normal text-center text-gray-500 pb-8'>
      Enter the 6-digit code from your authentication app. If you <br/> don’t have access to your authentication app, you can <Link>use a <br/> backup code instead.</Link>      
      </p>
      <OtpInput 
        value={otpValue}
        onChange={(value) => handleOtpValue(value)}
        valueLength={6}
      />
      <div className="w-full pt-8 pb-4">
        {errorMessage && (
          <div
            className="w-full p-2 mt-4 mb-2 bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200"
            role="alert"
          >
            {errorMessage}
        </div>
        )}
        <button
          className="bg-blue-300 hover:bg-blue py-2 text-white uppercase text-base font-bold rounded w-full disabled:opacity-50"
          disabled={otpValue.length < 6 || isLoading}
          type={"submit"}
        >
          <span>{isLoading ? "Logging in..." : "LOG IN"}</span>
        </button>
      </div>
      <div>
        <Link onClick={clearLoginResponse}>Go back to login screen</Link>
      </div>
    </form>
  );
};

const Link = styled.span`
  cursor: pointer;
  color: #0000FF;
  font-weight: 600;
  font-size: 12px;
`
