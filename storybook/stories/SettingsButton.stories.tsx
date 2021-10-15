import { useEffect, useState } from "react";
import { storiesOf } from "@storybook/react";
import { SettingsButton } from "../../packages/ui";
import { action } from "@storybook/addon-actions";

storiesOf("Settings Toggle Button", module).add(
  "Settings Toggle Button",
  () => {
    const [selected, setSelected] = useState(false);

    const toggle = () => {
      const newSelected = !selected;
      setSelected(newSelected);
      action("Selected")({ selected: newSelected });
    };

    return (
      <div className="flex flex-row">
        <SettingsButton
          onClick={toggle}
          selected={selected}
          type="Setting"
          description="Click to enable this setting"
        />
      </div>
    );
  }
);
