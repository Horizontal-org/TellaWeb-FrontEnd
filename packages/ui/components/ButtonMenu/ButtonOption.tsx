import { FunctionComponent } from "react";

type Props = {
  text: string;
  color?: string;
  icon?: React.ReactNode;
  onClick?: (event) => void;
  disabled?: boolean
};

export const ButtonOption: FunctionComponent<Props> = ({
  text,
  icon,
  color,
  onClick,
  disabled
}) => {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        onClick(event);
      }}
      disabled={disabled}
      style={color ? { 
        color: color,
        height: 36
      } : {
        height: 36
      }}
      className="w-full flex py-2 px-3 uppercase space-x-2 items-center bg-white hover:bg-gray-50"
    >
      {icon}
      <span className="font-sans text-sm font-bold">{text}</span>
    </button>
  );
};
