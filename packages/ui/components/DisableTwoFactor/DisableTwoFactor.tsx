import { FunctionComponent, useState, useEffect } from 'react'
import { ButtonPopup, Button, TextInput } from '../..'
import { btnType } from '../Button/Button'

import { ConfirmPassword } from '../ConfirmPasswordModal/ConfirmPasswordModal'
import { ConfirmOtp } from './ConfirmOtp'

import { useConfirmPasswordMutation } from 'packages/state/services/user'
import { useDisableMutation } from 'packages/state/services/auth'

export const DisableTwoFactorModal: FunctionComponent = () => {
  const [step, handleSteps] = useState<number>(1)

  const [confirmPassword, {isError, isSuccess: isConfirmSuccess}] = useConfirmPasswordMutation();
  const [disableOtp, {isError: otpConfirmError, isSuccess: isOtpVerifySuccess}] = useDisableMutation();
  const [closeModal, handleCloseModal] = useState<boolean>(false)
  useEffect(() => {
    if(isConfirmSuccess) {
      handleSteps(step + 1)
    }
  }, [isConfirmSuccess])

  useEffect(() => {
    if(isOtpVerifySuccess) {
      window.location.reload()
    }
  }, [isOtpVerifySuccess])
 

  return (
    <ButtonPopup
      externalOpen={closeModal}
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
              errorMessage={isError}
              title="Disable two-factor authentication" 
              onSubmit={(currentPassword) => {
                confirmPassword({
                  current: currentPassword
                })
              }}
            />
          )}

          {step === 2 && (
            <ConfirmOtp
              errorMessage={otpConfirmError}
              onSubmit={(code) => {
                disableOtp({
                  code
                })
              }}
            />
          )}
        </div>
      )}
    />
  )
}