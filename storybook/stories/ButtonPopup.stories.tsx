import { storiesOf } from "@storybook/react";
import { ButtonPopup } from "../../packages/ui";

storiesOf("Button with Popup", module).add("Button with Popup", () => {
  return (
    <ButtonPopup text="Add">
      <p>Hello I'm a popup!</p>
    </ButtonPopup>
  );
});
