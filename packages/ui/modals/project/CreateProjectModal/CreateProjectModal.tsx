import { FunctionComponent, useState, ChangeEventHandler } from 'react'
import { Modal, ErrorMessage } from '../../../components/Modal'
import { TextInput } from '../../../'
import { btnType } from '../../../components/Button/Button'
import { IoMdAdd } from 'react-icons/io'

interface Props {
  checkName: (name: string) => Promise<boolean>
  open: boolean;
  onSubmit: (newProject: {
    name: string;
  }) => void;
  onClose: () => void
}

export const CreateProjectModal: FunctionComponent<React.PropsWithChildren<Props>> = ({
  onSubmit,
  checkName,
  open,
  onClose
}) => {

  const [name, handleName] = useState<string>('')
  const [showValidations, handleShowValidations] = useState(false)
  const [taken, handleTaken] = useState(false)
  
  return (
    <Modal 
      externalOpen={open}
      title='Create Project'
      button='NEW'
      buttonIcon={<IoMdAdd color='white'/>}
      btnType={btnType.Primary}
      subtitle='Name your new project. This name will be visible to Tella users.'
      submit='SAVE'
      disabled={!(name.length > 0) || taken}
      onSubmit={() => {
        onSubmit({
          name,         
        })

        handleName('')
        handleTaken(false)
      }}
      onClose={onClose}
      render={() => (
        <div>
          <div className='pt-4'>
            <TextInput
              name='name'
              maxLength={150}
              placeholder='Project name'
              value={name}
              onChange={(e) => {
                handleName(e.target.value)
                handleTaken(false)
              }}
              onFocus={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  handleShowValidations(false)
                }
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  handleShowValidations(true)
                  if (name.length > 0) checkName(name).then(handleTaken)
                }
              }}
            />
          </div>          


          { showValidations && (
            <>
              { taken && (
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