import { FunctionComponent, MouseEventHandler, PropsWithChildren } from "react";
import { SidebarButton } from '../SidebarButton/SidebarButton'

type Props = {
  leftToggle: () => void; 
  rightToggle?: () => void;
};

export const ToggleButtonsBar: FunctionComponent<React.PropsWithChildren<PropsWithChildren<Props>>> = ({
  leftToggle,
  rightToggle,
  children,
}) => (
  <div id="slider-bar" className="flex px-4">
    <SidebarButton
      onClick={leftToggle}
    />

    <div className="flex-1 flex justify-between">{children}</div>

    { rightToggle && (
      <SidebarButton 
        onClick={rightToggle}
        position='right'
      />
    )}
  </div>
);
