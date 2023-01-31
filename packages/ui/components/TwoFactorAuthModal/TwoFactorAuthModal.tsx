import { FunctionComponent, useState } from 'react'
import { ButtonPopup, Button, TextInput } from '../..'
import { btnType } from '../Button/Button'

type Props = {
  onSubmit: (currentPassword: string, newPassword: string) => void
}

export const TwoFactorAuthModal: FunctionComponent<React.PropsWithChildren<Props>> = ({ onSubmit }) => {
  const [currentPassword, handleCurrentPassword] = useState<string>('')
  const [step, handleSteps] = useState<number>(1)
  return (
    <ButtonPopup       
      toggleButton={(toggle) => (
        <Button
          text="ENABLE"
          onClick={toggle}
          type={btnType.Secondary}
        />
      )}
      render={(toggle) => (
        <div className='p-4'>
          {step === 1 && (
            <>
              <p className='py-2 font-sans text-gray-600 text-xxxl font-bold'>
                Enable two-factor authentication
              </p>
              <p className='font-sans text-sm font-normal text-gray-500'>
                Please enter your password          
              </p>

              <div className='py-4'>
                <TextInput
                  name='current-password'
                  placeholder='Password'
                  type='password'
                  value={currentPassword}
                  onChange={(e) => { handleCurrentPassword(e.target.value) }}
                />
              </div>

              <div className='pb-4'>
                <Button 
                  text='NEXT'
                  full={true}
                  disabled={!currentPassword}
                  onClick={() => {
                    handleSteps(step + 1)
                  }}
                />
              </div>
            </>
          )}

          {step === 2 && (
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
                CYDK YPDR FRTM ZE7D FRTM IANE
              </div>

              <div className='pb-4'>
                <Button 
                  text='NEXT'
                  full={true}
                  onClick={() => {
                    handleSteps(step + 1)
                  }}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className='py-2 font-sans text-gray-600 text-xxxl font-bold'>
                Final step
              </p>
              <p className='font-sans text-sm font-normal text-gray-500'>
                Enter the 6-digit code from your authentication app        
              </p>

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
          )}
          
          
          
        </div>
      )}
    />
  )
}