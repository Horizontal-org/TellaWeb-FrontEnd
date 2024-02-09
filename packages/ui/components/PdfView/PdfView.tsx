import { FunctionComponent } from "react";
import styled from 'styled-components'
import ReactModal from "react-modal";
import { IoMdClose } from "react-icons/io";


interface Props {
  fileName: string;
  isOpen: boolean;
  handleIsOpen: () => void
}

export const PdfView: FunctionComponent<React.PropsWithChildren<Props>> = ({
  fileName,
  isOpen,
  handleIsOpen
}) => {

  return (    
    <Wrapper>

      <ReactModal
        onRequestClose={handleIsOpen}
        isOpen={isOpen}
        overlayClassName={
          "flex bg-black bg-opacity-50 absolute inset-0 justify-center items-center"
        }
      >
        <object data={`${window.location.origin}/api/resource/asset/${fileName}`} type="application/pdf" width="100%" height="100%">
            <p>Alternative text </p>
        </object>

        <CloseButton
          onClick={() => {
            handleIsOpen()
          }}
        >
          <IoMdClose color="white"/>
        </CloseButton>
       
      </ReactModal>
        
    </Wrapper>
  )
}


// position: relative;
const Wrapper = styled.div`

`

const CloseButton = styled.div`
  position: absolute;
  top: 0;
  right: 0;

  cursor:pointer;
  background: black;
  width: 40px;
  height: 40px;
  max-width: 40px;
  max-height: 40px;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;
`