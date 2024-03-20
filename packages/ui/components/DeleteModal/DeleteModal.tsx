import { FunctionComponent, useState, useRef } from 'react'
import { ButtonOption } from '../ButtonMenu/ButtonOption'
import { ButtonPopup } from '../ButtonPopup/ButtonPopup';
import { btnType, Button } from '../Button/Button'
import { TextInput } from '../Inputs/TextInput/TextInput';
import { MdDelete } from "react-icons/md";


type Props = {
  render: React.ReactNode
  onDelete: (e) => void
}

export const DeleteModal: FunctionComponent<React.PropsWithChildren<Props>> = ({ render, onDelete }) => {

  const [canDelete, handleCanDelete] = useState(false)

  return (
    <ButtonPopup
      toggleButton={(toggle) => (
        <ButtonOption 
          icon={<MdDelete />}
          color="#D6933B"
          text="DELETE"
          onClick={(e) => {
            e.stopPropagation()
            toggle()
          }}
        />      
      )}                
      onClose={() => {
        handleCanDelete(false)
      }}
      render={(toggle) => (
        <>
          <div className='p-4'>
            <h3 className='py-2 text-xxxl font-sans font-bold text-gray-600'>Delete file</h3>
            <div className='text-base font-normal font-sans text-gray-500'>
              { render }
            </div>
            <div className='py-4'>
              <p className='font-sans font-normal text-sm text-gray-500'>
              {`To confirm, please type "DELETE"`}
              </p>
              
              <div className='pt-4'>
                <TextInput 
                  placeholder='Type in DELETE'
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
                onClick={(e) => {
                  handleCanDelete(false)
                  toggle()
                  onDelete(e)
                }}
              />
            </div>          
          </div>          
        </>
      )}
    />
  )
}