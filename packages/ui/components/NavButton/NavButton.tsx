import { FunctionComponent, ReactNode } from "react";
import cn from "classnames";

type Props = {
  text: string;
  icon?: ReactNode;
  disabled?: boolean;
  selected?: boolean;
  onClick?: (event: unknown) => void;
};

export const NavButton: FunctionComponent<React.PropsWithChildren<Props>> = ({
  text,
  icon,
  disabled,
  selected,
  onClick,
}: Props) => {
  return (
    <button
      type="button"
      className={cn(
        "flex flex-row font-bold items-center h-10 px-4 rounded text-base bg-white text-gray-500",
        {
          "opacity-40 cursor-not-allowed": disabled,
          "hover:bg-black hover:bg-opacity-5 hover:text-gray-700 cursor-pointer":
            !disabled && !selected,
          "bg-blue-light text-blue-500 cursor-pointer": selected,
        }
      )}
      onClick={onClick}
    >
      <span className="flex items-center justify-center text-xl">{icon}</span>
      <span className="ml-3">{text}</span>
    </button>
  );
};

NavButton.defaultProps = {
  icon: undefined,
  disabled: false,
  selected: false,
  onClick: () => null,
};
