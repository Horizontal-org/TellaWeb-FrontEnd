import { FunctionComponent } from "react";

type Props = {
  text: string;
  color?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

export const ButtonOption: FunctionComponent<Props> = ({
  text,
  icon,
  color,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      style={color ? { color } : {}}
      className="w-full flex py-2 px-3 uppercase space-x-2 items-center bg-white hover:bg-gray-50"
    >
      {icon}
      <span className="text-sm font-semibold">{text}</span>
    </button>
  );
};
