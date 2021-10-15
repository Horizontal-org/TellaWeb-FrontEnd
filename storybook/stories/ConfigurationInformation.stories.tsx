import { storiesOf } from "@storybook/react";
import { ConfigurationInformation } from "../../packages/ui";
import { FakeConfig } from "../moked/config";

storiesOf("Configuration Information", module).add(
  "Configuration Information",
  () => {
    return (
      <div className="w-64 p-2">
        <ConfigurationInformation config={FakeConfig} />
      </div>
    );
  }
);
