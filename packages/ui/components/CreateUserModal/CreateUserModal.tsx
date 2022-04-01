import { FunctionComponent, useState, useEffect } from 'react'
import { ButtonPopup, Button, TextInput } from '../../'
import { btnType } from '../Button/Button'

type Props = {
  onSubmit: (username: string, password: string, isAdmin: boolean) => void
  title: string
}

export const CreateUserModal: FunctionComponent<Props> = ({ onSubmit, title }) => {
  const [username, handleUsername] = useState<string>('')
  const [password, handlePassword] = useState<string>('')
  const [confirmPassword, handleConfirmPassword] = useState<string>('')
  const [isAdmin, handleIsAdmin] = useState<boolean>(false)

  return (
    <ButtonPopup 
      toggleButton={(toggle) => (
        <Button
          text="CREATE USER"
          onClick={toggle}
          type={btnType.Primary}
        />
      )}
      render={(toggle) => (
        <div className='p-4'>
          <p className='text-xxxl font-bold'>
            New User
          </p>
          <p className='text-base text-gray-600'>
            { title }
          </p>
          <div className='pt-4'>
            <TextInput
              name='username'
              placeholder='Email'
              value={username}
              onChange={(e) => { handleUsername(e.target.value) }}
            />
          </div>
          <div className='py-4'>
            <TextInput
              name='password'
              placeholder='Password'
              value={password}
              type='password'
              onChange={(e) => { handlePassword(e.target.value) }}
            />
          </div>
          <div>
            <TextInput
              name='confirm-password'
              placeholder='Confirm Password'
              value={confirmPassword}
              type='password'
              onChange={(e) => { handleConfirmPassword(e.target.value) }}
            />
          </div>

          <div className='pt-4'>
            <label className='pr-2 font-sans text-gray-500 text-sm' htmlFor='is-admin'>Is admin ?</label>
            <input
              name='is-admin' 
              type='checkbox'
              checked={isAdmin}
              onChange={() => {
                handleIsAdmin(!isAdmin)
              }}
            />
          </div>

          { username.length > 0 && !(/\S+@\S+\.\S+/.test(username)) && (
            <div className="w-full p-2 mt-4 mb-4 bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200">
              Please enter a valid email address.
            </div>
          )}

          { !(confirmPassword === password) && (
            <div className="w-full p-2 mt-4  bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200">
              The passwords do not match
            </div>
          )}

          <div className='py-4'>
            <Button 
              text='SAVE'
              full={true}
              disabled={!(username.length > 0 && password === confirmPassword) || !(/\S+@\S+\.\S+/.test(username))}
              onClick={() => {
                onSubmit(
                  username,
                  password,
                  isAdmin
                )
                toggle()
              }}
            />
          </div>
          
        </div>
      )}
    />
  )
}