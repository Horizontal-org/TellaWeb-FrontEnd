import { FunctionComponent, useState, useEffect } from 'react'
import { ButtonPopup, Button, TextInput } from '../../'
import { btnType } from '../Button/Button'

type Props = {
  onSubmit: (username: string, confirmPassword) => void
  title: string
  isEmail: boolean
  withPassword: boolean
}

export const EditEmailModal: FunctionComponent<React.PropsWithChildren<Props>> = ({ 
  onSubmit, 
  title, 
  isEmail,
  withPassword
}) => {
  const [username, handleUsername] = useState<string>('')
  const [confirmUsername, handleConfirmUsername] = useState<string>('')
  const [confirmPassword, handleConfirmPassword] = useState<string>('')
  const [showValidations, handleShowValidations] = useState<boolean>(false)


  return (
    <ButtonPopup 
      toggleButton={(toggle) => (
        <Button
          text="EDIT"
          onClick={toggle}
          type={btnType.Secondary}
        />
      )}
      render={(toggle) => (
        <div className='p-4'>
          <p className='py-2 font-sans text-gray-600 text-xxxl font-bold'>
            Edit {isEmail ? 'email' : 'username'}
          </p>
          <p className='font-sans text-sm font-normal text-gray-500'>
            { title }
          </p>
          <div className='py-4'>
            <TextInput
              name='username'
              placeholder={isEmail ? 'Email' : 'Username'}
              value={username}
              onChange={(e) => { handleUsername(e.target.value) }}
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
              name='confirm-username'
              placeholder={isEmail ? 'Confirm email' : 'Confirm username'}
              value={confirmUsername}
              onChange={(e) => { handleConfirmUsername(e.target.value) }}
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

          { withPassword && (
            <div className='pt-4'>
              <TextInput
                name='confirm-password'
                type='password'
                placeholder={'Confirm password'}
                value={confirmPassword}
                onChange={(e) => { handleConfirmPassword(e.target.value) }}
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
          )}


          { showValidations && (
            <>
              { isEmail && username.length > 0 && !(/\S+@\S+\.\S+/.test(username)) && (
                <div className="w-full p-2 mt-4 mb-4 bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200">
                  Please enter a valid email address.
                </div>
              )}

              { !(username === confirmUsername) && (
                <div className="w-full p-2 mt-4  bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200">
                  The { isEmail ? 'email addresses' : 'names'} do not match
                </div>
              )}


              { withPassword && !(confirmPassword.length > 0) && (
                <div className="w-full p-2 mt-4  bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200">
                  Please enter a valid password
                </div>
              )}
            </>
          )}          

          <div className='py-4'>
            <Button 
              text='SAVE'
              full={true}
              disabled={!(username.length > 0 && username === confirmUsername && (withPassword ? confirmPassword.length > 0 : true)) || (isEmail && !(/\S+@\S+\.\S+/.test(username)))}
              onClick={() => {
                onSubmit(username, confirmPassword)
                toggle()
              }}
            />
          </div>
          
        </div>
      )}
    />
  );
}