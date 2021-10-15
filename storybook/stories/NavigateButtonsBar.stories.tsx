import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { NavigateButtonsBar } from "../../packages/ui";

storiesOf("Navigation Buttons Bar", module).add(
  "Navigation Buttons Bar",
  () => {
    return (
      <NavigateButtonsBar goPrev={action("goPrev")} goNext={action("goNext")} />
    );
  }
);
