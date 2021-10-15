import { storiesOf } from "@storybook/react";
import { AppLock } from "../../packages/ui";
import { FakeConfig } from "../moked/config";
import { action } from "@storybook/addon-actions";

storiesOf("App Lock", module).add("App Lock", () => {
  return (
    <AppLock
      config={FakeConfig}
      goPrev={action("goPrev")}
      goNext={action("goNext")}
    />
  );
});
