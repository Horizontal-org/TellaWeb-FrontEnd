import { FunctionComponent, useState } from "react";
import OtpInput from "packages/ui/components/OtpInput.tsx/OtpInput";
import { Button } from "packages/ui/components/Button/Button";

type Props = {
  handleTwoFactorAuth: (otpValue: string) => void; 
  errorMessage?: string;
};

export const TwoFactor: FunctionComponent<React.PropsWithChildren<Props>> = ({
  handleTwoFactorAuth,
  errorMessage
}) => {
  const [ otpValue, handleOtpValue ] = useState<string>('')
  return (
    <div className="p-10 bg-white rounded flex justify-center items-center flex-col shadow-md border">
      <p className="text-xl text-gray-600 font-bold">
        Two-factor Authentication
      </p>
      <p className='font-sans text-base font-normal text-gray-500 mb-5'>
        Enter the 6-digit code from your authentication app      
      </p>
      <OtpInput 
        value={otpValue}
        onChange={(value) => handleOtpValue(value)}
        valueLength={6}
      />
      {errorMessage && (
        <div
          className="w-full p-2 mt-4 mb-2 bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200"
          role="alert"
        >
          {errorMessage}
      </div>
      )}
      <div className="w-full py-4">
        <Button 
          text='NEXT'
          full={true}
          disabled={otpValue.length < 6}
          onClick={() => handleTwoFactorAuth(otpValue)}
        />
      </div>
    </div>
  );
};
