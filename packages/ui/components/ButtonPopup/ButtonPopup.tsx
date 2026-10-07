import {
  FunctionComponent,
  PropsWithChildren,
  useState,
  ReactNode,
} from "react";
import { MdClose } from "react-icons/md";
import ReactModal from "react-modal";

type Props = {
  render?: (toggle: () => void) => ReactNode;
  onClose?: () => void
  toggleButton: (toggle: () => void) => ReactNode
  externalOpen?: boolean
};

export const ButtonPopup: FunctionComponent<React.PropsWithChildren<PropsWithChildren<Props>>> = ({
  children,
  render,
  onClose,
  toggleButton,
  externalOpen
}) => {
  const [popupOpen, changePopupStatus] = useState(false);

  const togglePopup = () => changePopupStatus(!popupOpen);

  const requestClose = () => {
    changePopupStatus(false)
    onClose && onClose()
  }

  return (
    <div>
      { toggleButton && toggleButton(togglePopup)}

      <ReactModal
        onRequestClose={requestClose}
        isOpen={popupOpen || externalOpen}
        overlayClassName={
          "flex bg-black/50 absolute inset-0 justify-center items-center"
        }
        className="bg-white w-5/12 py-4 px-3 rounded-sm shadow-xl text-gray-800"
      >
        <div className="flex-start items-center">
          <button 
            type="button" 
            onClick={requestClose}
            className='active:shadow-inbox rounded-sm flex flex-col justify-center items-center focus:outline-hidden cursor-pointer p-2 stroke-current text-customgray-500 hover:bg-gray-50'
          >
            <MdClose className="text-gray-300" />
          </button>
        </div>

        <div>{render ? render(togglePopup) : children}</div>
      </ReactModal>
    </div>
  );
};