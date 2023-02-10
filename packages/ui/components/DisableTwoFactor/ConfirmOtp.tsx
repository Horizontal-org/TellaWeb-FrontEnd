import { FunctionComponent, useState } from 'react'
import { Button } from '../..'
import OtpInput from '../OtpInput.tsx/OtpInput'

type Props = {
  errorMessage?: boolean
  onSubmit: (code: string) => void
}

export const ConfirmOtp: FunctionComponent<React.PropsWithChildren<Props>> = ({ 
  errorMessage,
  onSubmit
}) => {
  const [otp, handleOtp] = useState<string>('')
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      onSubmit(otp)
    }}>
      <p className='py-2 font-sans text-gray-600 text-xxxl font-bold'>
        One-time passcode
      </p>
      <p className='font-sans text-base font-normal text-gray-500'>
        Enter the 6-digit code from your authentication app or use a backup code instead        
      </p>
      <div className='flex justify-center py-4'>
        <OtpInput value={otp} valueLength={6} onChange={(value) => handleOtp(value)}/>
      </div>
      {errorMessage && (
        <div
          className="w-full p-2 mt-4 mb-2 bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200"
          role="alert"
        >
          The verification code is incorrect. Please try again.
      </div>
      )}
      <div className='pb-4'>

        <button
          className="bg-blue-300 hover:bg-blue py-2 text-white uppercase text-base font-bold rounded w-full disabled:opacity-50"
          disabled={otp.length < 6}
          type={"submit"}
        >
          <span>VERIFY</span>
        </button>
      </div>
    </form>
  )
}