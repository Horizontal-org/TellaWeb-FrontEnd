import { CSSProperties } from "react";
import { storiesOf } from "@storybook/react";
import { MdCloudUpload } from "react-icons/md";

import { NavButton } from "../../packages/ui";
import { ExampleMenuMokedData } from "../moked/menu";

const titleStyle: CSSProperties = {
  fontSize: "27px",
  fontWeight: 500,
  color: "#666",
};

storiesOf("Navigation", module)
  .add("Buttons", () => (
    <div className="max-w-xs">
      <div>
        <h3 style={titleStyle} className="text-xl py-4">
          Normal and hover
        </h3>
        <NavButton text="Uploads" icon={<MdCloudUpload />} />
      </div>
      <div>
        <h3 style={titleStyle} className="text-xl py-4">
          Selected
        </h3>
        <NavButton text="Uploads" icon={<MdCloudUpload />} selected />
      </div>
      <div>
        <h3 style={titleStyle} className="text-xl py-4">
          Disabled
        </h3>
        <NavButton text="Uploads" icon={<MdCloudUpload />} disabled />
      </div>
    </div>
  ))
  .add("In a menu", () => {
    return (
      <ul className="flex flex-col gap-2 w-full">
        {ExampleMenuMokedData.map((data) => (
          <NavButton key={data.text} {...data} />
        ))}
      </ul>
    );
  })
  .add("Only text", () => <NavButton text="Profile" />);
