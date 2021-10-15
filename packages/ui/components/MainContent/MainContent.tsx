import { FunctionComponent } from "react";

export const MainContent: FunctionComponent = ({ children }) => (
  <div id="content" className="px-20 py-16 flex-1 inline">
    {children}
  </div>
);
