import { FunctionComponent, useState, useEffect } from 'react'
import { ButtonPopup, Button, TextInput } from '../..'
import { btnType } from '../Button/Button'
import PasswordMeter from '../PasswordMeter/PasswordMeter'
import zxcvbn from 'zxcvbn'
import { FocusEvent } from 'react'
import { useToast } from 'components/ToastWrapper'
import { useUpdatePasswordSelfMutation } from 'packages/state/services/user'
import { ErrorMessage } from '../Modal'

export const EditSelfPasswordModal: FunctionComponent<React.PropsWithChildren> = () => {

  const [updatePassword, updatePasswordResult] = useUpdatePasswordSelfMutation();
  const [currentPasswordError, handleCurrentPasswordError] = useState<string | null>(null)
  const handleToast = useToast();

  useEffect(() => {
    if (updatePasswordResult.isSuccess) {
      handlePopupOpen(false)
      handleToast("Password updated!", "info");
    }
    if (updatePasswordResult.error && "status" in updatePasswordResult.error) {
      if (updatePasswordResult.error.status === 405) {
        handleCurrentPasswordError("Incorrect current password.")
      }
    }
  }, [updatePasswordResult.status]);

  const [oldPassword, handleOldPassword] = useState<string>('')
  const [newPassword, handleNewPassword] = useState<string>('')
  const [confirmPassword, handleConfirmPassword] = useState<string>('')
  const [showValidations, handleShowValidations] = useState<boolean>(false)
  const [passwordStrength, handlePasswordStrength] = useState<number>(0)
  const [popupOpen, handlePopupOpen] = useState<boolean>(false)

  useEffect(() => {
    handlePasswordStrength(zxcvbn(newPassword).score)
  }, [newPassword])

  const handleInput = (e: FocusEvent<HTMLInputElement>, isFocus: boolean) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      handleShowValidations(!isFocus)
    }
  }

  const currentInvalid = showValidations && !!currentPasswordError
  const mismatch = showValidations && newPassword.length > 0 && confirmPassword.length > 0 && newPassword !== confirmPassword
  const tooShort = showValidations && newPassword.length > 0 && newPassword.length < 6

  return (
    <ButtonPopup
      externalOpen={popupOpen}
      onClose={() => { handlePopupOpen(false) }}
      toggleButton={() => (
        <Button
          text="CHANGE PASSWORD"
          onClick={() => { handlePopupOpen(true) }}
          type={btnType.Secondary}
        />
      )}
      render={() => (
        <div className='p-4'>
          <p className='py-2 font-sans text-gray-600 text-xxxl font-bold'>
            Edit password
          </p>
          <p className='font-sans text-sm font-normal text-gray-500'>
            Please enter your current password and new password.
          </p>

          <div className='py-4'>
            <TextInput
              name='current-password'
              placeholder='Current password'
              type='password'
              value={oldPassword}
              onChange={(e) => {
                handleCurrentPasswordError(null)
                handleOldPassword(e.target.value)
              }}
              onFocus={(e) => handleInput(e, true)}
              onBlur={(e) => handleInput(e, false)}
              aria-invalid={currentInvalid}
              aria-describedby={currentInvalid ? 'current-password-error' : undefined}
            />

            {currentInvalid && (
              <ErrorMessage
                id='current-password-error'
                message={currentPasswordError}
              />
            )}
          </div>

          <div>
            <TextInput
              name='new-password'
              placeholder='New password'
              type='password'
              value={newPassword}
              onChange={(e) => { handleNewPassword(e.target.value) }}
              onFocus={(e) => handleInput(e, true)}
              onBlur={(e) => handleInput(e, false)}
              aria-invalid={tooShort}
              aria-describedby={tooShort ? 'new-password-error' : undefined}
            />
          </div>

          {newPassword.length > 0 && (
            <div>
              <PasswordMeter score={passwordStrength} />
            </div>
          )}

          <div className='pt-4'>
            <TextInput
              name='confirm-password'
              placeholder='Confirm new password'
              type='password'
              value={confirmPassword}
              onChange={(e) => { handleConfirmPassword(e.target.value) }}
              onFocus={(e) => handleInput(e, true)}
              onBlur={(e) => handleInput(e, false)}
              aria-invalid={mismatch}
              aria-describedby={mismatch ? 'confirm-password-error' : undefined}
            />
          </div>

          {mismatch && (
            <ErrorMessage id='confirm-password-error' message='Your new passwords do not match' />
          )}

          {tooShort && (
            <ErrorMessage id='new-password-error' message='The new password must have at least 6 characters' />
          )}

          <div className='py-4'>
            <Button
              text='SAVE'
              full={true}
              disabled={!(newPassword.length >= 6 && newPassword === confirmPassword)}
              onClick={() => {
                updatePassword({
                  current: oldPassword,
                  new: newPassword
                })
              }}
            />
          </div>

        </div>
      )}
    />
  )
}