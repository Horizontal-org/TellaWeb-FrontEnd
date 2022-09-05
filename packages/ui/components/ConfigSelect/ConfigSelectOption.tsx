import { MdEdit } from "react-icons/md";
import { FunctionComponent } from "react";

export interface ConfigOption {
  title: string;
  description: string;
  onClick: () => void;
}

type Props = {
  option: ConfigOption;
};

export const ConfigSelectOption: FunctionComponent<React.PropsWithChildren<Props>> = ({ option }) => (
  <div className="w-96 h-20 rounded-xl bg-gray-200  hover:bg-gray-100">
    <p className="m-7 mb-0 pt-2.5 font-bold text-gray-700">{option.title}</p>
    <p className="m-7 mt-xsm pb-10 text-sm text-gray-500 inline-block">
      {option.description}
    </p>
    <button
      className="-pt-xxxsm right-4 inline absolute"
      type="button"
      onClick={option.onClick}
    >
      <MdEdit className="text-gray-300" />
    </button>
  </div>
);
