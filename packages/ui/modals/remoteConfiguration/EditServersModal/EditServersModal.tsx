import { FunctionComponent, useState, ChangeEventHandler } from 'react'
import { Modal, ErrorMessage } from '../../../components/Modal'
import { RadioGroupInput, Checkbox } from '../../../'
import { btnType } from '../../../components/Button/Button'

interface Props {
  onSubmit: ({}) => void
}

export const EditServersModal: FunctionComponent<Props> = ({
  onSubmit
}) => {

  const [visibility, handleVisibility] = useState('visible')

  return (
    <Modal 
      title='Servers'
      button='EDIT'
      btnType={btnType.Secondary}
      subtitle={(
        <div>
          The Servers menu allows Tella users connect to an organization’s server to send files and data. When the menu is visible, users can add as many server connections as they wish.
        </div>
      )}
      submit='SAVE'
      disabled={false}
      onSubmit={() => {
        onSubmit(visibility === 'visible')
      }}
      render={() => (
        <div>
          <div>
            <p className='text-sm font-normal text-gray-500'>
              The Servers menu should be 
            </p>
            <div className='py-4'>
              <RadioGroupInput 
                onChange={e => handleVisibility(e.target.value)}
                value={visibility}
                elements={[
                  {
                    value: 'visible',
                    name: 'servers-visibility',
                    label: 'Visible (users can add, edit, and delete server connections)'
                  },
                  {
                    value: 'hidden',
                    name: 'servers-visibility',
                    label: 'Hidden (users cannot add, edit, and delete server connections)'
                  }
                ]}
              />
            </div>
          </div>
             

        </div>
      )}
    />
  )
}