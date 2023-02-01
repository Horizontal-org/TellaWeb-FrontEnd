import { FunctionComponent } from 'react'
import { Button } from '../..'


type Props = {
  handleSteps: () => void
  otpCode: string
  otpUrl: string
}

export const Connect: FunctionComponent<React.PropsWithChildren<Props>> = ({ 
  otpCode,
  otpUrl,
  handleSteps,
}) => {

  return (
    <>
      <p className='py-2 font-sans text-gray-600 text-xxxl font-bold'>
        Connect to authentication app
      </p>
      <p className='font-sans text-sm font-normal text-gray-500'>
        Use your authentication app to scan this QR code:        
      </p>

      <div className='py-4'>
        display qr code
      </div>

      <div className='py-4'>
        {otpCode}
      </div>

      <div className='pb-4'>
        <Button 
          text='NEXT'
          full={true}
          onClick={() => {
            handleSteps()
          }}
        />
      </div>
    </>
  )
}