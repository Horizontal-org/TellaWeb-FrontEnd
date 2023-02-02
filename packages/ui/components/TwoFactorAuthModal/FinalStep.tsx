import { FunctionComponent, useState } from 'react'
import { Button } from '../..'
import OtpInput from '../OtpInput.tsx/OtpInput'

type Props = {
  toggle: () => void 
}

export const FinalStep: FunctionComponent<React.PropsWithChildren<Props>> = ({ 
  toggle
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