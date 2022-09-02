import { FunctionComponent } from "react";
import { format } from "date-fns";
import { Configuration } from "../../domain/Configuration";
import { ItemInformation } from "../ItemInformation/ItemInformation";

type Props = {
  config: Configuration;
};

export const ConfigurationInformation: FunctionComponent<React.PropsWithChildren<Props>> = ({
  config,
}) => {
  const dict = {
    Created: format(config.date, "dd MMM yyyy"),
    Status: config.status,
    "Number of connections": config.connections.toString(),
    ID: config.id.toString(),
  };
  return <ItemInformation title="Configuration information" dict={dict} />;
};
