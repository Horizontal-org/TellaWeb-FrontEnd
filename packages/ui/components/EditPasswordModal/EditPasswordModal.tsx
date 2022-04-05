import { FunctionComponent, useState } from 'react'
import { ButtonPopup, Button, TextInput } from '../../'
import { btnType } from '../Button/Button'

type Props = {
  onSubmit: (currentPassword: string, newPassword: string) => void
}

export const EditPasswordModal: FunctionComponent<Props> = ({ onSubmit }) => {
  const [oldPassword, handleOldPassword] = useState<string>('')
  const [newPassword, handleNewPassword] = useState<string>('')
  const [confirmPassword, handleConfirmPassword] = useState<string>('')
  const [showValidations, handleShowValidations] = useState<boolean>(false)

  return (
    <ButtonPopup       
      toggleButton={(toggle) => (
        <Button
          text="CHANGE PASSWORD"
          onClick={toggle}
          type={btnType.Secondary}
        />
      )}
      render={(toggle) => (
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
              onChange={(e) => { handleOldPassword(e.target.value) }}
              onFocus={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  handleShowValidations(false)
                }
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  handleShowValidations(true)
                }
              }}
            />
          </div>
          
          <div>
            <TextInput
              name='new-password'
              placeholder='New password'
              type='password'
              value={newPassword}
              onChange={(e) => { handleNewPassword(e.target.value) }}
              onFocus={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  handleShowValidations(false)
                }
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  handleShowValidations(true)
                }
              }}
            />
          </div>

          <div className='py-4'>
            <TextInput 
              name='confirm-password'
              placeholder='Confirm new password'
              type='password'          
              value={confirmPassword}
              onChange={(e) => { handleConfirmPassword(e.target.value) }}
            /> 
            onFocus={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  handleShowValidations(false)
                }
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  handleShowValidations(true)
                }
              }}
          </div>

          { showValidations && newPassword.length > 0 && confirmPassword.length > 0 && !(newPassword === confirmPassword) && (
            <div className="w-full p-2 my-4  bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200">
              Your new passwords do not match
            </div>
          )}

          <div className='pb-4'>
            <Button 
              text='SAVE'
              full={true}
              disabled={!(newPassword.length > 0 && newPassword === confirmPassword)}
              onClick={() => {
                onSubmit(oldPassword, newPassword)
                toggle()
              }}
            />
          </div>
          
        </div>
      )}
    />
  )
}