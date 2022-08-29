import { FunctionComponent, useState, useEffect } from 'react'
import { Modal, ErrorMessage } from '../../../components/Modal'
import { TextInput } from '../../../'
import { btnType } from '../../../components/Button/Button'
import { IoMdAdd } from 'react-icons/io'

interface Props {
  currentName: string;
  onSubmit: (newProject: {
    name: string;
  }) => void;
}

export const RenameProjectModal: FunctionComponent<React.PropsWithChildren<Props>> = ({
  onSubmit,
  currentName,
}) => {

  const [name, handleName] = useState<string>('')
  const [showValidations, handleShowValidations] = useState(false)
  
  useEffect(() => {
    handleName(currentName)
  }, [currentName])

  return (
    <Modal 
      title='Rename Project'
      button='RENAME'
      btnType={btnType.Secondary}
      subtitle='Type the new name for your project'
      submit='SAVE'
      disabled={!(name.length > 0)}
      onSubmit={() => {
        onSubmit({
          name,         
        })

        handleName('')
      }}
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

        </div>
      )}
    />
  )
}