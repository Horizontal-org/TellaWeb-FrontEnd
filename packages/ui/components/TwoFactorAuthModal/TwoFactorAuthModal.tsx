import { FunctionComponent, useState } from 'react'
import { ButtonPopup, Button, TextInput } from '../..'
import { btnType } from '../Button/Button'
import { EnableTwoFactor } from './EnableTwoFactor'
import { Connect } from './Connect'
import { FinalStep } from './FinalStep'

type Props = {
  onSubmit: (currentPassword: string) =>  { otpUrl: string, otpCode: string }
}

export const TwoFactorAuthModal: FunctionComponent<React.PropsWithChildren<Props>> = ({ onSubmit }) => {
  const [step, handleSteps] = useState<number>(2)
  const [otpUrl, handleOtpUrl] = useState<string>('')
  const [otpCode, handleOtpCode] = useState<string>('CYDK YPDR FRTM ZE7D FRTM IANE')


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
            <EnableTwoFactor 
              onSubmit={onSubmit}
              handleOtpUrl={handleOtpUrl}
              handleOtpCode={handleOtpCode}
              handleSteps={() => handleSteps(step + 1)}
            />
          )}

          {step === 2 && (
            <>
              <Connect 
                otpCode={otpCode}
                otpUrl={otpUrl}
                handleSteps={() => handleSteps(step + 1)}
              />
            </>
          )}

          {step === 3 && (
            <>
              <FinalStep 
                toggle={() => toggle()}
              />
            </>
          )}
        </div>
      )}
    />
  )
}