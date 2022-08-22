import { FunctionComponent, useState, ChangeEventHandler } from 'react'
import { Modal, ErrorMessage } from '../../../components/Modal'
import { TextInput, RadioGroupInput } from '../../../'
import { btnType } from '../../../components/Button/Button'
import { MdEdit } from 'react-icons/md'
import { ROLES } from 'packages/state/domain/user'

interface Props {
  onSubmit: (newUser: {
    username: string;
    password: string;
    role: string;
  }) => void;
}

export const CreateUserModal: FunctionComponent<React.PropsWithChildren<Props>> = ({
  onSubmit,
}) => {

  const [username, handleUsername] = useState<string>('')
  const [password, handlePassword] = useState<string>('')
  const [confirmPassword, handleConfirmPassword] = useState<string>('')
  const [role, handleRole] = useState<string>('reporter')
  const [isAdmin, handleIsAdmin] = useState<boolean>(false)

  const [showValidations, handleShowValidations] = useState(false)
  
  return (
    <Modal 
      title='Create User'
      button='CREATE USER'
      btnType={btnType.Primary}
      subtitle='Enter the user’s basic information here. You will be able to add additional information on the next screen.'
      submit='SAVE'
      disabled={!((username.length > 0 && (/\S+@\S+\.\S+/.test(username))) && password === confirmPassword)}
      onSubmit={() => {
        onSubmit({
          username,
          password,
          role
        })
      }}
      render={() => (
        <div>
          <div className='pt-4'>
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
          <div className='py-4'>
            <TextInput
              name='password'
              placeholder='Password'
              value={password}
              type='password'
              onChange={(e) => { handlePassword(e.target.value) }}
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
              name='confirm-password'
              placeholder='Confirm Password'
              value={confirmPassword}
              type='password'
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


          <div className='pt-8'>
            <p className='text-sm font-normal text-gray-500'>
              Role:
            </p>
            <div className='py-4'>
              <RadioGroupInput 
                onChange={e => handleRole(e.target.value)}
                value={role}
                elements={[
                  {
                    value: 'reporter',
                    name: 'user-role',
                    label: 'Reporter'
                  },
                  {
                    value: 'viewer',
                    name: 'user-role',
                    label: 'Viewer'
                  },
                  {
                    value: 'editor',
                    name: 'user-role',
                    label: 'Editor'
                  },
                  {
                    value: 'admin',
                    name: 'user-role',
                    label: 'Admin'
                  },                  
                ]}
              />
            </div>
          </div>


          { showValidations && (
            <>
              { role !== ROLES.REPORTER && username.length > 0 && !(/\S+@\S+\.\S+/.test(username)) && (
                <ErrorMessage 
                  message='Please enter a valid email address.'
                />          
              )}

              { !(confirmPassword === password) && (
                <ErrorMessage 
                  message='The passwords do not match.'
                />
              )}
            </>
          )}          

        </div>
      )}
    />
  );
}