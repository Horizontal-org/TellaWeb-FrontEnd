import {
  FunctionComponent,
  PropsWithChildren,
  useState,
  ReactNode,
} from "react";
import cn from "classnames";
import { MdClose } from "react-icons/md";
import { btnType, Button } from "../Button/Button";
import ReactModal from "react-modal";

type Props = {
  render?: (toggle: () => void) => ReactNode;
  onClose?: () => void
  toggleButton: (toggle: () => void) => ReactNode
};

export const ButtonPopup: FunctionComponent<PropsWithChildren<Props>> = ({
  children,
  render,
  onClose,
  toggleButton
}) => {
  const [popupOpen, changePopupStatus] = useState(false);

  const togglePopup = () => changePopupStatus(!popupOpen);

  const requestClose = () => {
    togglePopup()
    onClose && onClose()
  }

  return (
    <div>
      { toggleButton && toggleButton(togglePopup)}

      <ReactModal
        onRequestClose={requestClose}
        isOpen={popupOpen}
        overlayClassName={
          "flex bg-black bg-opacity-50 absolute inset-0 justify-center items-center"
        }
        className="bg-white w-4/12 py-4 px-3 rounded shadow-xl text-gray-800"
      >
        <div className="flex-start items-center">
          <button 
            type="button" 
            onClick={requestClose}
            className='active:shadow-inbox rounded flex flex-col justify-center items-center focus:outline-none cursor-pointer p-2 stroke-current text-customgray-500 hover:bg-gray-50'
          >
            <MdClose className="text-gray-300" />
          </button>
        </div>

        <div>{render ? render(togglePopup) : children}</div>
      </ReactModal>
    </div>
  );
};