import { FunctionComponent, useState, useEffect } from 'react'
import { ButtonPopup, Button, TextInput } from '../../'
import { btnType } from '../Button/Button'

type Props = {
  onSubmit: () => void
  title: string
}

export const DeleteUserModal: FunctionComponent<Props> = ({
  onSubmit,
  title
}) => {

  const [confirmation, handleConfirmation] = useState('')

  return (
    <ButtonPopup 
      toggleButton={(toggle) => (
        <Button
          type={btnType.Danger}
          text="DELETE"
          onClick={toggle}
        />
      )}
      render={(toggle) => (
        <div className='p-4'>
          <p className='text-xxxl font-bold'>
            Delete user
          </p>
          <p className='py-4 text-base text-gray-600'>
            { title }
          </p>
          <p className='text-base text-gray-600'>
            Type in <strong>DELETE</strong> to confirm
          </p>
          <div className='py-4'>
            <TextInput
              name='username'
              placeholder='Type in DELETE'
              value={confirmation}
              onChange={(e) => { handleConfirmation(e.target.value) }}
            />
          </div>
          
          <div className='py-4'>
            <Button 
              text='DELETE'
              type={btnType.Danger}
              full={true}
              disabled={!(confirmation === 'DELETE')}
              onClick={() => {
                onSubmit()
                toggle()
              }}
            />
          </div>
          
        </div>
      )}
    />
  )
}