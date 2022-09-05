import { FunctionComponent, useState, ChangeEventHandler } from 'react'
import { Modal, ErrorMessage } from '../../../components/Modal'
import { TextInput, RadioGroupInput } from '../../../'
import { btnType } from '../../../components/Button/Button'
import { MdEdit } from 'react-icons/md'
import { ROLES } from 'packages/state/domain/user'

interface Props {
  onSubmit: ({}) => void
  defaultRole: string
  hasEmail: boolean
}

export const EditRoleModal: FunctionComponent<React.PropsWithChildren<Props>> = ({
  onSubmit,
  defaultRole,
  hasEmail
}) => {

  const [role, handleRole] = useState<string>(defaultRole)
  const [showValidations, handleShowValidations] = useState(false)
  
  return (
    <Modal 
      title='Edit role'
      button='EDIT'
      btnType={btnType.Secondary}
      subtitle='Select the new role you wish to assign to this user'
      submit='SAVE'
      disabled={role !== ROLES.REPORTER && !hasEmail}
      onSubmit={() => {
        onSubmit(role)
      }}
      render={() => (
        <div>

          <div>            
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
          
          { role !== ROLES.REPORTER && !hasEmail && (
            <ErrorMessage 
              message='username needs to be an email'
            />          
          )}
        </div>
      )}
    />
  )
}