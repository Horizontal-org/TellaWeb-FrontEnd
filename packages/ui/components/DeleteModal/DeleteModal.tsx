import { FunctionComponent, useState, useRef } from 'react'
import { DeletePopup } from './DeletePopup'
import { btnType, Button } from '../Button/Button'
import { TextInput } from '../Inputs/TextInput/TextInput';
import { MdDelete } from "@react-icons/all-files/md/MdDelete";


type Props = {
  render: React.ReactNode
  onDelete: () => void
}

export const DeleteModal: FunctionComponent<Props> = ({ render, onDelete }) => {

  const [canDelete, handleCanDelete] = useState(false)

  return (
    <DeletePopup
      color="#D6933B"    
      icon={<MdDelete />}
      text="Delete"
      onClose={() => {
        handleCanDelete(false)
      }}
      render={(toggle) => (
        <>
          <div className='p-4'>
            <h3 className='text-xxxl font-bold'>Delete file</h3>
            <div className='py-4 text-base'>
              { render }
            </div>
            <div>
              <p className='text-base text-gray-500'>
                <strong>{`To confirm, please type "DELETE"`}</strong>
              </p>
              
              <div className='pt-4'>
                <TextInput 
                  onChange={(e) => {
                    if (!canDelete && e.target.value === 'DELETE') {
                      handleCanDelete(true)
                    } else if (canDelete && e.target.value !== 'DELETE') {
                      handleCanDelete(false)
                    }
                  }}
                />
              </div>
            </div>          
          </div>

          <div className="flex justify-end">
            <Button
              type={btnType.Danger}
              full={true}
              text={"Confirm"}
              disabled={!canDelete}
              onClick={() => {
                handleCanDelete(false)
                toggle()
                onDelete()
              }}
            />
          </div>
        </>
      )}
    />
  )
}