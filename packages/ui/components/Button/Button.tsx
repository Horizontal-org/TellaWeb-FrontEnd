import { FunctionComponent, ReactNode } from "react";
import cn from "classnames";
import { ImSpinner8 } from "react-icons/im";

export enum btnType {
  "Primary",
  "Secondary",
  "Danger"
}

interface Props {
  text?: string;
  //TODO To remove
  icon?: ReactNode;
  disabled?: boolean;
  full?: boolean;
  type?: btnType;
  onClick?: (event: unknown) => void;
  onBlur?: (event: unknown) => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
}

export const Button: FunctionComponent<React.PropsWithChildren<Props>> = ({
  text,
  disabled = false,
  icon,
  leftIcon,
  rightIcon,
  type = btnType.Primary,
  onClick = () => null,
  full = false,
  onBlur = () => null,
  loading = false,
}: Props) => {
  const isDisabled = disabled || loading;
  const btnStyle = cn(
    "flex flex-none w-auto py-2 px-2 space-x-2 rounded-sm items-center text-sm font-bold font-sans uppercase border border-gray-100 active:shadow-inbox disabled:opacity-50 focus:outline-hidden",
    {
      "text-white bg-blue-300 hover:bg-blue-400": type === btnType.Primary,
      "text-gray-300 bg-white hover:bg-gray-50": type === btnType.Secondary,
      "text-white bg-red-600 hover:bg-red-700": type === btnType.Danger,
      "cursor-not-allowed": isDisabled,
      "flex-1 w-full justify-center": full,
    }
  );

  return (
    <button
      style={{ height: 36 }}
      type="button"
      disabled={isDisabled}
      aria-busy={loading}
      className={btnStyle}
      onClick={(event) => {
        event.preventDefault();
        onClick(event);
      }}
      onBlur={onBlur}
    >
      {loading ? (
        <span className="text-base">
          <ImSpinner8 size={18} className="animate-spin mr-2" />
        </span>
      ) : (
        <>
          {icon && <span className="text-base">{icon}</span>}
          {leftIcon && <span className="text-base">{leftIcon}</span>}
        </>
      )}
      {text && <span>{text}</span>}
      {rightIcon && <span className="text-base">{rightIcon}</span>}
    </button>
  );
};

