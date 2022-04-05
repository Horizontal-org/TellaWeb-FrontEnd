import { FunctionComponent, useState, useEffect } from 'react'
import { ButtonPopup, Button, TextInput } from '../../'
import { btnType } from '../Button/Button'

type Props = {
  onSubmit: (username: string) => void
  title: string
}

export const EditEmailModal: FunctionComponent<Props> = ({ onSubmit, title }) => {
  const [username, handleUsername] = useState<string>('')
  const [confirmUsername, handleConfirmUsername] = useState<string>('')
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
          <p className='text-xxxl font-bold'>
            Edit email
          </p>
          <p className='text-base text-gray-600'>
            { title }
          </p>
          <div className='py-4'>
            <TextInput
              name='username'
              placeholder='Email'
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
              placeholder='Confirm email'
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

          { showValidations && (
            <>
              { username.length > 0 && !(/\S+@\S+\.\S+/.test(username)) && (
                <div className="w-full p-2 mt-4 mb-4 bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200">
                  Please enter a valid email address.
                </div>
              )}

              { !(username === confirmUsername) && (
                <div className="w-full p-2 mt-4  bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200">
                  The email addresses do not match
                </div>
              )}
            </>
          )}          

          <div className='py-4'>
            <Button 
              text='SAVE'
              full={true}
              disabled={!(username.length > 0 && username === confirmUsername) || !(/\S+@\S+\.\S+/.test(username))}
              onClick={() => {
                onSubmit(username)
                toggle()
              }}
            />
          </div>
          
        </div>
      )}
    />
  )
}