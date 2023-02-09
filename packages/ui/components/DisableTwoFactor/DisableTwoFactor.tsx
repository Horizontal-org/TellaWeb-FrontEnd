import { FunctionComponent, useState } from 'react'
import { ButtonPopup, Button, TextInput } from '../..'
import { btnType } from '../Button/Button'

import { ConfirmPassword } from '../ConfirmPasswordModal/ConfirmPasswordModal'
import { ConfirmOtp } from './ConfirmOtp'

type Props = {
  onConfirmPassword: (currentPassword: string) => void
  onDisableOtp: (code: string) => void
}

export const DisableTwoFactorModal: FunctionComponent<React.PropsWithChildren<Props>> = ({ 
  onConfirmPassword,
  onDisableOtp
}) => {
  const [step, handleSteps] = useState<number>(1)

  return (
    <ButtonPopup 
      toggleButton={(toggle) => (
        <Button
          text="DISABLE"
          onClick={toggle}
          type={btnType.Secondary}
        />
      )}
      render={(toggle) => (
        <div className='p-4'>
          {step === 1 && (
            <ConfirmPassword 
              title="Enable two-factor authentication" 
              onSubmit={onConfirmPassword}
              handleSteps={() => handleSteps(step + 1)}
            />
          )}

          {step === 2 && (
            <ConfirmOtp 
              onSubmit={onDisableOtp}
            />
          )}
        </div>
      )}
    />
  )
}