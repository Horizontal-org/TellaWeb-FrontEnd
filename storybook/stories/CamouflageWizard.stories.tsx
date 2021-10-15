/* eslint-disable no-console */
import { storiesOf } from "@storybook/react";
import { CamouflageWizard } from "../../packages/ui";
import { FakeConfig } from "../moked/config";
import { action } from "@storybook/addon-actions";

storiesOf("Camouflage Wizard", module).add("Camouflage Wizard", () => {
  return (
    <CamouflageWizard
      config={FakeConfig}
      goPrev={action("goPrev")}
      goNext={action("goNext")}
    />
  );
});
