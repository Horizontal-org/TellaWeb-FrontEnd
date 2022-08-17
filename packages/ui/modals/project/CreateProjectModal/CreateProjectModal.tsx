import { FunctionComponent, useState, ChangeEventHandler } from 'react'
import { Modal, ErrorMessage } from '../../../components/Modal'
import { TextInput } from '../../../'
import { btnType } from '../../../components/Button/Button'
import { IoMdAdd } from 'react-icons/io'

interface Props {
  existingNames: string[];
  open: boolean;
  onSubmit: (newProject: {
    name: string;
  }) => void;
  onClose: () => void
}

export const CreateProjectModal: FunctionComponent<Props> = ({
  onSubmit,
  existingNames,
  open,
  onClose
}) => {

  const [name, handleName] = useState<string>('')
  const [showValidations, handleShowValidations] = useState(false)
  
  return (
    <Modal 
      externalOpen={open}
      title='Create Project'
      button='NEW'
      buttonIcon={<IoMdAdd color='white'/>}
      btnType={btnType.Primary}
      subtitle='Name your new project. This name will be visible to Tella users.'
      submit='SAVE'
      disabled={!(name.length > 0)}
      onSubmit={() => {
        onSubmit({
          name,         
        })

        handleName('')
      }}
      onClose={onClose}
      render={() => (
        <div>
          <div className='pt-4'>
            <TextInput
              name='name'
              placeholder='Project name'
              value={name}
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
              { existingNames.includes(name) && (
                <ErrorMessage 
                  message='Name taken.'
                />          
              )}
            </>
          )}          

        </div>
      )}
    />
  )
}