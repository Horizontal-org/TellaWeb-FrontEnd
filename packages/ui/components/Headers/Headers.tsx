import { FunctionComponent } from "react";

export const Title: FunctionComponent<React.PropsWithChildren<unknown>> = ({ children }) => (
  <h1 className="font-sans font-bold text-xxl text-gray-600">{children}</h1>
);

export const SubTitle: FunctionComponent<React.PropsWithChildren<unknown>> = ({ children }) => (
  <h2 className="font-sans font-normal text-base text-gray-500">{children}</h2>
);
