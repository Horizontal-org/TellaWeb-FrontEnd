import { FunctionComponent } from "react";

interface Props { }

export const LayoutAbsoluteContent: FunctionComponent<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  return (
    <div
      className="flex text-sm justify-center w-full p-6"
      style={{
        position: 'absolute',
        top: 'calc(50% - 100px)',
        marginLeft: '-60px'
      }}
    >
      {children}
    </div>
  );
}