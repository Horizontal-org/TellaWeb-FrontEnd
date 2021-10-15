import {
  FunctionComponent,
  PropsWithChildren,
  useState,
  ReactNode,
} from "react";
import cn from "classnames";
import { MdClose } from "@react-icons/all-files/md/MdClose";
import { Button } from "../Button/Button";
import ReactModal from "react-modal";

type Props = {
  disabled?: boolean;
  icon?: ReactNode;
  text: string;
  render?: (toggle: () => void) => ReactNode;
};

export const ButtonPopup: FunctionComponent<PropsWithChildren<Props>> = ({
  disabled,
  icon,
  text,
  children,
  render,
}) => {
  const [popupOpen, changePopupStatus] = useState(false);

  const togglePopup = () => changePopupStatus(!popupOpen);

  return (
    <div>
      <Button
        icon={icon}
        text={text}
        disabled={disabled}
        onClick={togglePopup}
      />
      <ReactModal
        isOpen={popupOpen}
        overlayClassName={
          "flex bg-black bg-opacity-50 absolute inset-0 justify-center items-center"
        }
        className="bg-white font-thin w-4/12 py-2 px-3 rounded shadow-xl text-gray-800"
      >
        <div className="flex-start items-center">
          <button type="button" onClick={togglePopup}>
            <MdClose className="text-gray-300" />
          </button>
        </div>

        <div>{render ? render(togglePopup) : children}</div>
      </ReactModal>
    </div>
  );
};
