import { FunctionComponent } from 'react'
import { Button } from '../..'
import { QRCodeCanvas} from 'qrcode.react'

type Props = {
  handleSteps: () => void
  otpCode: string | null
  otpUrl: string | null
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
      <div className='flex flex-col justify-center items-center py-8'>
        <p className='font-sans text-base font-normal text-gray-500'>
          Use your authentication app to scan this QR code:        
        </p>

        {(otpCode && otpUrl) && (
          <>
            <div className='py-4'>
              <QRCodeCanvas 
                id='qrcode'

                value={otpUrl}
              />
            </div>

            <p className='pb-4 font-sans text-base font-normal text-gray-500'>
              Or enter the code into the app (spaces don’t matter):     
            </p>

            <div className='p-4 bg-gray-25'>
              <span className="text-gray-500">{otpCode}</span>
            </div>
          </>
        )}
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