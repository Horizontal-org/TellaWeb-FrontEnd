import { FunctionComponent } from "react";

type Props = {
  title: string;
  dict: { [k: string]: string };
};

export const ItemInformation: FunctionComponent<Props> = ({ title, dict }) => (
  <>
    <h3 className="text-base font-bold text-gray-500 py-3">{title}</h3>
    <div className="text-sm text-gray-500 gap-y-2">
      {dict &&
        Object.entries(dict).map(([key, value]) => (
          <div className="grid grid-cols-2" key={key}>
            <span>{key}</span>
            <span className="text-black text-opacity-80">{value}</span>
          </div>
        ))}
    </div>
  </>
);
