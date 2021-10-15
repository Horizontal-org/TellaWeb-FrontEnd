import { FunctionComponent, MouseEvent } from "react";
import Img from "next/image";
import cn from "classnames";
import icon from "../../assets/icon.png";

type Props = {
  selected: boolean;
  type: string;
  description: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

export const SettingsButton: FunctionComponent<Props> = ({
  selected,
  type,
  description,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "p-0 w-48 h-60 bg-gray-25 font-sans rounded-lg text-center hover:bg-gray-100",
      {
        "bg-gray-100 border-blue-100 border": selected,
      }
    )}
  >
    <p className="p-0 block font-bold font-medium items-center justify-center text-center mt-6">
      {type}
    </p>
    <div className="block ml-auto mr-auto w-6/12">
      <Img
        height="100px"
        width="100px"
        src={icon}
        className="mt-xsm mb-md"
        alt="icon"
      />
    </div>
    <p className="block font-light text-base text-center mt-15">
      {" "}
      {description}{" "}
    </p>
  </button>
);
