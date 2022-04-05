import { FunctionComponent, PropsWithChildren } from "react";
import { MdClose } from "react-icons/md";

type Props = {
  title: string;
  onClose?: () => void;
};

export const TopBar: FunctionComponent<PropsWithChildren<Props>> = ({
  title,
  onClose,
  children,
}) => (
  <div className="px-8 py-5 w-full border-b border-gray-100 flex font-xl items-center justify-items-start fixed top-0 right-0 bg-white justify-between">
    <div className="flex items-center">
      {onClose && (
        <button 
          className='active:shadow-inbox rounded flex justify-center items-center' 
          type="button" 
          onClick={onClose}
          style={{
            height: 36,
            width: 36
          }}
        >
          <MdClose className="text-gray-300" />
        </button>
      )}
      <h2 className="text-gray-500 font-bold px-4">{title}</h2>
    </div>
    <div className="flex space-x-2">{children}</div>
  </div>
);
