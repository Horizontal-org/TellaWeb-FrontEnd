import { CSSProperties } from "react"
import { storiesOf } from "@storybook/react"
import { FilesMokedData } from '../moked/files'
import { FileView, ImageView } from "../../packages/ui"


storiesOf("FileView", module)
  .add("ImageView", () => (
    <div className="w-24 h-24">
      <FileView file={FilesMokedData[0]}/>
    </div>
  ))
  .add("AudioView", () => (
    <div className="w-24 h24">
      <FileView file={FilesMokedData[0]}/>
    </div>
  ));
