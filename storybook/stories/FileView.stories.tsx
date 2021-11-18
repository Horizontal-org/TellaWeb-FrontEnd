import { CSSProperties } from "react"
import { storiesOf } from "@storybook/react"
import { FilesMokedData } from '../moked/files'
import { FileView, ImageView } from "../../packages/ui"


storiesOf("FileView", module)
  .add("VideoView", () => (
    <div className="max-w-xs h-24">
      <FileView file={FilesMokedData[0]}/>
    </div>
  ))
  .add("ImageView", () => (
    <div className="max-w-xs h-screen">
      <FileView file={FilesMokedData[1]}/>
    </div>
  ))
  .add("AudioView", () => (
    <div className="max-w-xs h24">
      <FileView file={FilesMokedData[2]}/>
    </div>
  ));
