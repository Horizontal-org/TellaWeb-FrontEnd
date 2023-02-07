import { FunctionComponent, useState } from 'react'
import { Button } from '../..'
import OtpInput from '../OtpInput.tsx/OtpInput'

type Props = {
  toggle: () => void 
  errorMessage?: string
}

export const FinalStep: FunctionComponent<React.PropsWithChildren<Props>> = ({ 
  toggle,
  errorMessage
}) => {
  const [otp, handleOtp] = useState<string>('')
  return (
    <>
      <p className='py-2 font-sans text-gray-600 text-xxxl font-bold'>
        Final step
      </p>
      <p className='font-sans text-base font-normal text-gray-500'>
        Enter the 6-digit code from your authentication app        
      </p>
      <div className='flex justify-center py-4'>
        <OtpInput value={otp} valueLength={6} onChange={(value) => handleOtp(value)}/>
      </div>
      {errorMessage && (
        <div
          className="w-full p-2 mt-4 mb-2 bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200"
          role="alert"
        >
          {errorMessage}
      </div>
      )}
      <div className='pb-4'>
        <Button 
          text='VERIFY'
          full={true}
          onClick={() => {
            toggle()
          }}
        />
      </div>
    </>
  )
}