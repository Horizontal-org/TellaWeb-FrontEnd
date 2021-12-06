import { FunctionComponent, useState, useEffect } from 'react'
import { MainLayout } from '../../layouts/MainLayout'
import { TextInput, Button, SubTitle } from '../../../ui'

type Props = {
  sidebar: React.ReactNode
  onValidateEmail: (email: string) => void
  onUpdateUsername: (username: string) => void
  mailAvailable: boolean
}

let emailTimeout = null

export const SettingsPage: FunctionComponent<Props> = ({
  sidebar,
  onValidateEmail,
  onUpdateUsername,
  mailAvailable
}) => {
  
  const [username, handleUsername] = useState<string>('')

  const [oldPassword, handleOldPassword] = useState<string>('')
  const [newPassword, handleNewPassword] = useState<string>('')
  const [confirmPassword, handleConfirmPassword] = useState<string>('')
  const [passwordMatch, handlePasswordMatch] = useState<boolean>(false)
  return (
    <MainLayout 
      title='Settings'
      subtitle='Change your user and password'
      leftbar={sidebar}
      content={
        <div>
          <div className='flex h-10 mb-2'></div>
          <div className='pt-12'>

            <div className='pb-2 text-base font-bold'>
              Change username
            </div>
            <form 
              className='p-4 max-w-md rounded bg-black bg-opacity-5'
              onSubmit={(e) => {
                e.preventDefault()
                onUpdateUsername(username)
              }}
            >
              <div className='pb-2'>
                <SubTitle>
                  Username
                </SubTitle>
              </div>
              <TextInput 
                type='email'
                name='username'
                placeholder=''
                onChange={(e) => { 
                  if (emailTimeout) {
                    clearTimeout(emailTimeout)
                  }

                  emailTimeout = setTimeout(() => {
                    onValidateEmail(e.target.value)
                  }, 500)

                  handleUsername(e.target.value)                  
                }}
                value={username}
              />

              { !mailAvailable && username.length > 0 && (
                <span>mail taken</span>
              )}

              <div className='pt-2 flex justify-end'>
                <Button 
                  text="Submit" 
                  disabled={!mailAvailable}
                />
              </div>    
            </form>

            <div className='py-8'></div>
            <div className='pb-2 text-base font-bold'>
              Change password
            </div>
            <div className='p-4 max-w-md rounded bg-black bg-opacity-5'>
              <div className='pb-4'>
                <div className='pb-2'>
                  <SubTitle>
                    Old password
                  </SubTitle>
                </div>
                <TextInput 
                  name='old-password'
                  placeholder=''
                  type='password'
                  onChange={(e) => { handleOldPassword(e.target.value) }}
                  value={oldPassword}
                />                
              </div>
              <div className='pb-4'>
                <div className='pb-2'>
                  <SubTitle>
                    New password
                  </SubTitle>
                </div>
                <TextInput 
                  name='new-password'
                  placeholder=''
                  type='password'
                  onChange={(e) => { handleNewPassword(e.target.value) }}
                  value={newPassword}
                />                
              </div>
              <div className='pb-4'>
                <div className='pb-2'>
                  <SubTitle>
                    Confirm new password
                  </SubTitle>
                </div>
                <TextInput 
                  name='confirm-password'
                  placeholder=''
                  type='password'
                  onChange={(e) => { handleConfirmPassword(e.target.value) }}
                  value={confirmPassword}
                />                
              </div>
              <div className='pt-2 flex justify-end'>
                <Button text="Submit" disabled={!passwordMatch} onClick={() => { console.log('submit new password')}}/>
              </div>
            </div>

          </div>
        </div>
      }
    />
  )
}