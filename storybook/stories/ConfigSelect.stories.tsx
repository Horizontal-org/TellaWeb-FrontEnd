import { storiesOf } from "@storybook/react";
import { ConfigSelect } from "../../packages/ui";
import { action } from "@storybook/addon-actions";

storiesOf("Configuration Select", module).add("Configuration Select", () => {
  return (
    <ConfigSelect
      options={[
        {
          title: "App Lock",
          description: "Pattern and PIN available",
          onClick: action("onClick - App Lock"),
        },
        {
          title: "Camouflage",
          description: "Change name + icon and Calculator available",
          onClick: action("onClick - Camouflage"),
        },
      ]}
    />
  );
});
