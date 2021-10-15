import { storiesOf } from "@storybook/react";
import { MokedConfiguration } from "../moked/configuration";
import { ConfigurationPanel } from "../../packages/ui";

storiesOf("Configuration Panel", module).add("Configuration Panel", () => {
  return (
    <div className="w-auto p-2">
      <ConfigurationPanel
        name="Test Configuration"
        configuration={MokedConfiguration}
      />
    </div>
  );
});
