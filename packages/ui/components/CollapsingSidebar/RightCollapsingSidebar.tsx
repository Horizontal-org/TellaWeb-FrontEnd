import { FunctionComponent, PropsWithChildren } from "react";
import cn from "classnames";

type Props = {
  collapsed: boolean;
};

export const RightCollapsingSidebar: FunctionComponent<
  PropsWithChildren<Props>
> = ({ collapsed, children }) => (
  <div
    className={cn(
      "w-64 border-l px-6 pt-20 border-gray-100 transition-all transform duration-300 h-screen overflow-y-scroll fixed right-0 top-0",
      {
        "translate-x-64": { collapsed },
      }
    )}
  >
    {children}
  </div>
);
