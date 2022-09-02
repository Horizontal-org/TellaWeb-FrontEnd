import { FunctionComponent, useState, useEffect } from 'react'
import { Modal, ErrorMessage } from '../../../components/Modal'
import { TextInput } from '../../..'
import { btnType } from '../../../components/Button/Button'
import { IoMdAdd } from 'react-icons/io'

interface Props {
  currentName: string;
  onSubmit: () => void;
}

export const DeleteProjectModal: FunctionComponent<React.PropsWithChildren<Props>> = ({
  onSubmit,
  currentName
}) => {

  const [name, handleName] = useState<string>('')
  const [deleteConfirm, handleDeleteConfirm] = useState<string>('')

  return (
    <Modal 
      title='Delete Project'
      button='DELETE'
      btnType={btnType.Danger}
      subtitle='This will permanently delete this project , including all the files it contains. Enter the name of the project and type ‘DELETE’ to confirm'
      submit='DELETE'
      submitButtonType={btnType.Danger}
      disabled={!(name === currentName && deleteConfirm === 'DELETE')}
      onSubmit={() => {
        onSubmit()
      }}
      render={() => (
        <div>
          <div className='pt-4'>
            <TextInput
              name='name'
              placeholder='Project name'
              value={name}
              onChange={(e) => { handleName(e.target.value) }}
            />
          </div>          

          <div className='pt-4'>
            <TextInput
              name="deleteConfirm"
              placeholder="Type in 'DELETE'"
              value={deleteConfirm}
              onChange={(e) => { handleDeleteConfirm(e.target.value) }}
            />
          </div>          

        </div>
      )}
    />
  )
}