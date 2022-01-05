import { FunctionComponent, MouseEventHandler, PropsWithChildren } from "react";
import { SidebarButton } from '../SidebarButton/SidebarButton'

// import Img from "next/image";
// import handbarImg from "../../assets/handbar-toggle.png";

type Props = {
  leftToggle: () => void; 
  rightToggle: () => void;
};

export const ToggleButtonsBar: FunctionComponent<PropsWithChildren<Props>> = ({
  leftToggle,
  rightToggle,
  children,
}) => (
  <div id="slider-bar" className="flex px-4">
    <SidebarButton
      onClick={leftToggle}
    />

    <div className="flex-1 flex justify-between">{children}</div>

    <SidebarButton 
      onClick={rightToggle}
      position='right'
    />
  </div>
);
