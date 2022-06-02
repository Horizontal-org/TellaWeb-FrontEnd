import { FunctionComponent, useState, ChangeEventHandler } from 'react'
import { Modal, ErrorMessage } from '../../../components/Modal'
import { TextInput } from '../../../'
import { btnType } from '../../../components/Button/Button'
import { MdEdit } from 'react-icons/md'

interface Props {
  onSubmit: ({}) => void
  defaultName: string
}

export const EditNameModal: FunctionComponent<Props> = ({
  onSubmit,
  defaultName
}) => {

  const [name, handleName] = useState(defaultName)
  const [showValidations, handleShowValidations] = useState(false)
  
  return (
    <Modal 
      title='Rename configuration'
      button=''
      buttonIcon={<MdEdit color='#8b8e8f'/>}
      btnType={btnType.Secondary}
      subtitle='Name your new remote configuration. This name is only visible on Tella Web. Tella users will not see it.'
      submit='SAVE'
      disabled={name.length == 0}
      onSubmit={() => {
        onSubmit(name)
      }}
      render={() => (
        <div>
          <div className='pt-4'>
            <TextInput
              name='name'
              placeholder='Name'
              value={name}
              type='text'
              onChange={(e) => { handleName(e.target.value) }}
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
              { name.length == 0 && (
                <ErrorMessage 
                  message='Configuration name is required'
                />                  
              )}
            </>
          )}       
        </div>
      )}
    />
  )
}