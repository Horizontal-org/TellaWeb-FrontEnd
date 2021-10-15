/* eslint-disable no-alert */
import { CSSProperties } from "react";
import { storiesOf } from "@storybook/react";
import { FilesMokedData } from "../moked/files";
import { Thumbnail } from "../../packages/ui";

const titleStyle: CSSProperties = {
  fontSize: "27px",
  fontWeight: 500,
  color: "#666",
};

storiesOf("Thumbnail", module)
  .add("Small Thumbnail", () => (
    <div className="max-w-xs">
      {FilesMokedData.map((file) => (
        <div key={file.type}>
          <h3 style={titleStyle} className="text-xl py-4 capitalize">
            {file.type}
          </h3>
          <Thumbnail
            file={file}
            onClick={() => alert(`Click on ${file.type}`)}
          />
        </div>
      ))}
    </div>
  ))
  .add("Full Thumbnail", () => (
    <div className="max-w-xs">
      {FilesMokedData.map((file) => (
        <div key={file.type}>
          <h3 style={titleStyle} className="text-xl py-4 capitalize">
            {file.type}
          </h3>
          <div className="w-64 h-40">
            <Thumbnail
              file={file}
              onClick={() => alert(`Click on ${file.type}`)}
              full
            />
          </div>
        </div>
      ))}
    </div>
  ))
  .add("Box Thumbnail", () => (
    <div className="max-w-xs">
      {FilesMokedData.map((file) => (
        <div key={file.type}>
          <h3 style={titleStyle} className="text-xl py-4 capitalize">
            {file.type}
          </h3>
          <Thumbnail
            file={file}
            onClick={() => alert(`Click on ${file.type}`)}
            box
          />
        </div>
      ))}
    </div>
  ));
