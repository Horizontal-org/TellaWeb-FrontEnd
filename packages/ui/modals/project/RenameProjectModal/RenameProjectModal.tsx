import { FunctionComponent, useState, useEffect } from 'react'
import { Modal, ErrorMessage } from '../../../components/Modal'
import { TextInput } from '../../../'
import { btnType } from '../../../components/Button/Button'
import { IoMdAdd } from 'react-icons/io'

interface Props {
  currentName: string;
  onSubmit: (name: string) => void;
  checkName: (name: string) => Promise<boolean>
}

export const RenameProjectModal: FunctionComponent<React.PropsWithChildren<Props>> = ({
  onSubmit,
  currentName,
  checkName,
}) => {

  const [name, handleName] = useState<string>('')
  const [showValidations, handleShowValidations] = useState(false)
  const [taken, handleTaken] = useState(false)
  
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
      disabled={!(name.length > 0) || taken}
      onSubmit={() => {
        onSubmit(name)

        handleName('')
        handleTaken(false)
      }}
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

          { showValidations && taken && (
            <ErrorMessage
              message='Name taken.'
            />
          )}
        </div>
      )}
    />
  )
}