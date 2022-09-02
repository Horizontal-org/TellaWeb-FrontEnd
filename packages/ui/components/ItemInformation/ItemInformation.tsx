import { FunctionComponent } from "react";

type Props = {
  title: string;
  dict: { [k: string]: string };
};

export const ItemInformation: FunctionComponent<React.PropsWithChildren<Props>> = ({ title, dict }) => (
  <>
    <h3 className="text-base font-bold text-gray-500 py-3">{title}</h3>
    <div className="text-sm text-gray-500 gap-y-2">
      {dict &&
        Object.entries(dict).map(([key, value]) => (
          <div style={{padding: '2px 0'}} className="flex justify-between flex-wrap" key={key}>
            <span style={{minWidth: 80}}>{key}</span>
            <span className="text-black text-opacity-80">{value}</span>
          </div>
        ))}
    </div>
  </>
);
