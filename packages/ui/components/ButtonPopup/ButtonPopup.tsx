import {
  FunctionComponent,
  PropsWithChildren,
  useState,
  ReactNode,
} from "react";
import cn from "classnames";
import { MdClose } from "@react-icons/all-files/md/MdClose";
import { btnType, Button } from "../Button/Button";
import ReactModal from "react-modal";

type Props = {
  disabled?: boolean;
  icon?: ReactNode;
  text: string;
  render?: (toggle: () => void) => ReactNode;
  onClose?: () => void
  buttonType?: btnType
};

export const ButtonPopup: FunctionComponent<PropsWithChildren<Props>> = ({
  disabled,
  icon,
  text,
  children,
  render,
  onClose,
  buttonType
}) => {
  const [popupOpen, changePopupStatus] = useState(false);

  const togglePopup = () => changePopupStatus(!popupOpen);

  const requestClose = () => {
    togglePopup()
    onClose && onClose()
  }

  return (
    <div>
      <Button
        icon={icon}
        text={text}
        disabled={disabled}
        onClick={togglePopup}
        type={buttonType}
      />
      <ReactModal
        onRequestClose={requestClose}
        isOpen={popupOpen}
        overlayClassName={
          "flex bg-black bg-opacity-50 absolute inset-0 justify-center items-center"
        }
        className="bg-white font-thin w-4/12 py-4 px-3 rounded shadow-xl text-gray-800"
      >
        <div className="flex-start items-center">
          <button type="button" onClick={requestClose}>
            <MdClose className="text-gray-300" />
          </button>
        </div>

        <div>{render ? render(togglePopup) : children}</div>
      </ReactModal>
    </div>
  );
};

ButtonPopup.defaultProps = {
  buttonType: btnType.Primary
}
