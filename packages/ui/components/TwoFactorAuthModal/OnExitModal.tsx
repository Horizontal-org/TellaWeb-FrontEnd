import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { Button } from '../..'
import ReactModal from "react-modal";
import { btnType } from '../Button/Button';

type Props = {
  isOpen: boolean,
  onClose: () => void,
  onExitProgress: () => void
}

export const OnExitModal: FunctionComponent<React.PropsWithChildren<Props>> = ({ 
  isOpen,
  onClose,
  onExitProgress,
}) => {

  return (
    <>
      <ReactModal
        isOpen={isOpen}
        overlayClassName={
          "flex bg-black bg-opacity-50 absolute inset-0 justify-center items-center"
        }
        className="bg-white w-5/12 py-4 px-3 rounded shadow-xl text-gray-800"
      >      
        <div className='px-20'>
          <p className='py-2 font-sans text-gray-600 text-xxxl font-bold'>
            Exit?
          </p>
          <p className='font-sans text-base font-normal text-gray-500'>
            If you exit, you will have to restart setting up two-factor authentication from the beginning.        
          </p>

          <ButtonsContainer>
            <div className='pr-4'>
              <Button
                text='continue set up' 
                type={btnType.Secondary} 
                onClick={onClose}
              />
            </div>
            <div>
              <Button 
                text='EXIT' 
                type={btnType.Danger} 
                onClick={onExitProgress}
              />
            </div>
          </ButtonsContainer>
        </div>
      </ReactModal>
    </>
  )
}

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: end;
  padding-top: 32px;
  padding-bottom: 8px;
`