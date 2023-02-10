import { FunctionComponent, useState, useEffect } from 'react'
import { ButtonPopup, Button } from '../..'
import { btnType } from '../Button/Button'
import { Connect } from './Connect'
import { FinalStep } from './FinalStep'
import { OnExitModal } from './OnExitModal'
import { OtpData } from 'packages/state/domain/user'
import { ConfirmPassword } from '../ConfirmPasswordModal/ConfirmPasswordModal'
import { useEnableMutation, useActivateMutation } from "packages/state/services/auth"

export const TwoFactorAuthModal: FunctionComponent = () => {
  const [step, handleSteps] = useState<number>(1)
  const [onExitModal, handleOnExitModal] = useState<boolean>(false) 
  const [externalOpen, handleExternalOpen] = useState<boolean>(false)
  const [otpData, handleOtpData] = useState<{otpCode: string, otpUrl: string} | null>(null)

  const handleExitProgress = () =>{
    handleSteps(1)
    handleOnExitModal(false)
    handleExternalOpen(false)
  }

  const [
    enableOtp, 
    {isError: enableOtpError, isSuccess: enableOtpSuccess, data: enableOtpData}
  ] = useEnableMutation();

  const [
    activateOtp,
    {isError: onActivateError, isSuccess: onActivateSuccess}
  ] = useActivateMutation();

  useEffect(() => {
    if(enableOtpSuccess) {
      handleOtpData({
        otpCode: enableOtpData.otp_code,
        otpUrl: enableOtpData.otp_url
      })
      handleSteps(step + 1)
    }
  }, [enableOtpSuccess])

  useEffect(() => {
    if(onActivateSuccess) {
      window.location.reload()
    }
  }, [onActivateSuccess])


  return (
    <ButtonPopup 
      externalOpen={externalOpen}
      onClose={() => {
        handleExternalOpen(true)
        handleOnExitModal(true)
      }} 
      toggleButton={(toggle) => (
        <Button
          text="ENABLE"
          onClick={toggle}
          type={btnType.Secondary}
        />
      )}
      render={(toggle) => (
        <div className='p-4'>
          {onExitModal && <OnExitModal 
            isOpen={onExitModal} 
            onClose={() => handleOnExitModal(false)} 
            onExitProgress={() => handleExitProgress()}
          
          />}
          {step === 1 && (
            <ConfirmPassword
              errorMessage={enableOtpError}
              title="Enable two-factor authentication" 
              onSubmit={(currentPassword) => {
                enableOtp({
                  password: currentPassword
                })
              }}
            />
          )}

          {step === 2 && (
            <>
              <Connect 
                otpCode={otpData?.otpCode}
                otpUrl={otpData?.otpUrl}
                handleSteps={() => handleSteps(step + 1)}
              />
            </>
          )}

          {step === 3 && (
            <>
              <FinalStep
                errorMessage={onActivateError} 
                onActivate={(code) => {
                  activateOtp({
                    code: code
                  })
                }}
              />
            </>
          )}
        </div>
      )}
    />
  )
}