import { FunctionComponent, useState, useEffect } from 'react'
import { Modal, ErrorMessage } from '../../../components/Modal'
import { TextInput } from '../../..'
import { btnType } from '../../../components/Button/Button'
import { FaTrash } from "react-icons/fa";



interface Props {
  onSubmit: () => void;
}

export const DeleteResourceModal: FunctionComponent<React.PropsWithChildren<Props>> = ({
  onSubmit,
}) => {

  const [name, handleName] = useState<string>('')
  const [deleteConfirm, handleDeleteConfirm] = useState<string>('')

  return (
    <Modal 
      title='Delete Resource'
      button='DELETE'
      buttonIcon={<FaTrash color='white'/>}
      btnType={btnType.Danger}
      subtitle='Are you sure you want to delete this resource? It will be removed from all projects that it was added to, and users of these projects will lose access to it. This action cannot be reversed.'
      submit='DELETE'
      submitButtonType={btnType.Danger}         
      onSubmit={() => {
        onSubmit()
      }}
      render={() => (
        <div>
        </div>
      )}
    />
  )
}