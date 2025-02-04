import { btnType, Button } from 'packages/ui/components/Button/Button';
import { ButtonPopup } from 'packages/ui/components/ButtonPopup/ButtonPopup';
import { Modal } from 'packages/ui/components/Modal';
import { FunctionComponent } from 'react'
import { FaRegTrashAlt } from "react-icons/fa";

interface Props {
  onSubmit: () => void;
}

export const DeleteBackupModal: FunctionComponent<React.PropsWithChildren<Props>> = ({
  onSubmit,
}) => {

  return (

     <ButtonPopup                  
          toggleButton={(toggle) => (
            <Button              
              icon={<FaRegTrashAlt />}
              onClick={toggle}              
              type={btnType.Secondary}
            />
          )}
          render={(toggle) => (
            <div className='px-4'>

              <div>
                <p className='py-2 font-sans text-gray-600 text-xxxl font-bold'>
                  {`Delete backup?`}
                </p>
                
                <p className='font-sans text-sm font-normal text-gray-500'>
                    This action is permanent and irreversible.
                </p>
              </div>
    
              <div className='py-4 flex justify-end'>
                <Button 
                  text="DELETE BACKUP"
                  type={btnType.Danger}
                  onClick={() => {                
                    toggle()
                    onSubmit()
                  }}
                />
              </div>
            </div>
          )}
        />
    
  )
}
