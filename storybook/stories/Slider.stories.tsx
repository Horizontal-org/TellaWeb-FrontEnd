import { storiesOf } from "@storybook/react";
import { FilesMokedData } from "../moked/files";
import { Thumbnail } from "../../packages/ui";
import { Slider } from "../../packages/ui";

storiesOf("Slider", module).add("Slider", () => {
  return (
    <div className="w-52">
      <Slider
        items={FilesMokedData.map((f, i) => (
          <Thumbnail file={f} key={i.toString()} box />
        ))}
      />
    </div>
  );
});
