import { FunctionComponent, MouseEventHandler, PropsWithChildren } from "react";
import Img from "next/image";
import handbarImg from "../../assets/handbar-toggle.png";

type Props = {
  leftToggle: MouseEventHandler;
  rightToggle: MouseEventHandler;
};

export const ToggleButtonsBar: FunctionComponent<PropsWithChildren<Props>> = ({
  leftToggle,
  rightToggle,
  children,
}) => (
  <div id="slider-bar" className="flex px-4">
    <button
      type="button"
      style={{ lineHeight: 1 }}
      onClick={leftToggle}
      className="focus:outline-none cursor-pointer border-r my-2 py-1 pr-3"
    >
      <Img
        height="18px"
        width="18px"
        src={handbarImg}
        alt="Toggle left sidebar"
      />
    </button>

    <div className="flex-1 flex justify-between">{children}</div>

    <button
      type="button"
      style={{ lineHeight: 1 }}
      onClick={rightToggle}
      className="focus:outline-none cursor-pointer border-l my-2 py-1"
    >
      <div className="ml-3">
        <Img
          height="18px"
          className="transform rotate-180"
          width="18px"
          src={handbarImg}
          alt="Toggle right sidebar"
        />
      </div>
    </button>
  </div>
);
