import { FunctionComponent, useState, useRef } from 'react'
import { ButtonOption } from '../ButtonMenu/ButtonOption'
import { ButtonPopup } from '../ButtonPopup/ButtonPopup';
import { btnType, Button } from '../Button/Button'
import { TextInput } from '../Inputs/TextInput/TextInput';
import { MdDelete } from "react-icons/md";


type Props = {
  render: React.ReactNode
  onDelete: () => void
}

export const DeleteModal: FunctionComponent<Props> = ({ render, onDelete }) => {

  const [canDelete, handleCanDelete] = useState(false)

  return (
    <ButtonPopup
      toggleButton={(toggle) => (
        <ButtonOption 
          icon={<MdDelete />}
          color="#D6933B"
          text="DELETE"
          onClick={toggle}
        />      
      )}                
      onClose={() => {
        handleCanDelete(false)
      }}
      render={(toggle) => (
        <>
          <div className='p-4'>
            <h3 className='text-xxxl font-bold'>Delete file</h3>
            <div className='text-base'>
              { render }
            </div>
            <div className='py-4'>
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

            <div className='py-4'>
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
          </div>          
        </>
      )}
    />
  )
}