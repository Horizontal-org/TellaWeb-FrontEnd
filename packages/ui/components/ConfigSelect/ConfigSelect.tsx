import { FunctionComponent } from "react";
import { ConfigSelectOption, ConfigOption } from "./ConfigSelectOption";

type Props = {
  options: ConfigOption[];
};

export const ConfigSelect: FunctionComponent<React.PropsWithChildren<Props>> = ({ options }) => {
  return (
    <div className="w-96 fixed inset-y-1/3 inset-x-1/3">
      <p className="font-sans  font-bold text-xxxl"> Configuration </p>
      {options.map((option) => (
        <ConfigSelectOption key={option.title} option={option} />
      ))}
    </div>
  );
};
