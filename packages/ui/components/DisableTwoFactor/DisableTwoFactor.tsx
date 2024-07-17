import { FunctionComponent, useState, useEffect } from 'react'
import styled from 'styled-components';
import { ConfirmPassword } from '../ConfirmPasswordModal/ConfirmPasswordModal'
import { ConfirmOtp } from './ConfirmOtp'

import { useConfirmPasswordMutation } from 'packages/state/services/user'
import { useDisableMutation } from 'packages/state/services/auth'
import { useToast } from 'components/ToastWrapper'

type Props = {
  handleOtpActive: (value: boolean) => void
  toggle: () => void
};

export const DisableTwoFactorModal: FunctionComponent<React.PropsWithChildren<Props>> = ({
  handleOtpActive,
  toggle
}) => {
  const handleToast = useToast();
  const [step, handleSteps] = useState<number>(1)
  const [confirmPasswordText, handleConfirmPasswordText] = useState<string>('')

  const [confirmPassword, {isError, isSuccess: isConfirmSuccess}] = useConfirmPasswordMutation();
  const [disableOtp, {isError: otpConfirmError, isSuccess: isOtpVerifySuccess}] = useDisableMutation();

  useEffect(() => {
    if(isConfirmSuccess) {
      handleSteps(step + 1)
    }
  }, [isConfirmSuccess])

  useEffect(() => {
    if(isOtpVerifySuccess) {
      handleToast("You have successfully disabled two-factor authentication!", "success");
      handleOtpActive(false)
      toggle()
    }
  }, [isOtpVerifySuccess])
 

  return (
    <>
      {step === 1 && (
        <ConfirmPassword 
          errorMessage={isError}
          title="Disable two-factor authentication" 
          onSubmit={(currentPassword) => {
            handleConfirmPasswordText(currentPassword)
            confirmPassword({
              current: currentPassword
            })
          }}
        />
      )}

      {step === 2 && (
        <ConfirmOtp
          valueLength={6}
          errorMessage={otpConfirmError}
          onSubmit={(code) => {
            disableOtp({
              code,
              is_otp: true,
              confirm_password: confirmPasswordText
            })
          }}
        >
          <p className='py-2 font-sans text-gray-600 text-xxxl font-bold'>
            One-time passcode
          </p>
          <p className='font-sans text-base font-normal text-gray-500'>
            Enter the 6-digit code from your authentication app or <span> </span>
            <Link
              className='cursor-pointer'
              onClick={() => handleSteps(3)}>
               use a backup code instead
            </Link>   
          </p>
        </ConfirmOtp>
      )}

      {step === 3 && (
        <ConfirmOtp
          valueLength={8}
          errorMessage={otpConfirmError}
          onSubmit={(code) => {
            disableOtp({
              code,
              is_otp: false,
              confirm_password: confirmPasswordText
            })
          }}
        >
          <p className='py-2 font-sans text-gray-600 text-xxxl font-bold'>
            Backup code
          </p>
          <p className='font-sans text-base font-normal text-gray-500'>
            Enter the 8-digit backup code   
          </p>
        </ConfirmOtp>
      )}
    </>
  )
}

const Link = styled.span`
  cursor: pointer;
  color: #0000FF;
  font-weight: 600;
  font-size: 12px;
`