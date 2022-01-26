import { FunctionComponent, useEffect, useRef, useState } from "react";
import cn from "classnames";
import { BsThreeDots } from "react-icons/bs";
import { btnType, Button } from "../Button/Button";

type Props = {
  indeterminate?: boolean;
  text?: string;
  icon?: React.ReactNode;
  type?: btnType;
  openSide?: "left" | "right";
};

export const ButtonMenu: FunctionComponent<Props> = ({
  children,
  text,
  icon,
  type,
  openSide,
}) => {
  const [open, setOpenState] = useState(false);
  const [toRight, setDirection] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const toggle = () => {
    setOpenState(!open);
  };

  useEffect(() => {
    if (openSide) setDirection(openSide === "right");
  }, []);

  const openMenu = () => {
    if (!ref.current) return;
    if (openSide) {
      setDirection(openSide === "right");
    } else if (ref.current.offsetLeft > ref.current.offsetWidth) {
      setDirection(true);
    } else {
      setDirection(false);
    }
    toggle();
  };

  return (
    <div
      className={cn("w-min flex", {
        "flex-row-reverse": !toRight,
      })}
    >
      <div ref={ref}>
        <Button
          text={text}
          icon={!icon && !text ? <BsThreeDots /> : icon}
          type={type}
          onClick={() => openMenu()}
          //TODO: Auto close
        />
      </div>
      <div className="relative">
        {open && (
          <div
            className={cn(
              "absolute m-2 w-max bg-white rounded overflow-hidden border border-gray-100 z-20 flex flex-col -top-2",
              {
                "right-0": !toRight,
                "left-0": toRight,
              }
            )}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

ButtonMenu.defaultProps = {
  type: btnType.Secondary,
  text: "",
};
