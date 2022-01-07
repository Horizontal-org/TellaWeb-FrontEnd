import { CSSProperties } from "react";
import { storiesOf } from "@storybook/react";
import { MdRemoveRedEye } from "@react-icons/all-files/md/MdRemoveRedEye";

import { Button, SidebarButton } from "../../packages/ui";
import { btnType } from "../../packages/ui/components/Button/Button";

const titleStyle: CSSProperties = {
  fontSize: "27px",
  fontWeight: 500,
  color: "#666",
};

storiesOf("Buttons", module)
  .add("Primary Buttons", () => (
    <div className="flex flex-col items-start">
      <h3 style={titleStyle} className="text-xl py-4">
        Primary Button
      </h3>
      <div className="flex items-start space-x-4 ">
        <Button text="Preview" icon={<MdRemoveRedEye />} />
        <Button text="..." />
        <Button text="Preview" icon={<MdRemoveRedEye />} disabled />
      </div>
    </div>
  ))
  .add("Danger Buttons", () => (
    <div className="flex flex-col items-start">
      <h3 style={titleStyle} className="text-xl font-bold py-4">
        Danger Button test
      </h3>
      <div className="flex items-start space-x-4 ">
        <Button text="Preview" icon={<MdRemoveRedEye />} type={btnType.Danger} />
        <Button text="..." type={btnType.Danger}/>
        <Button text="Preview" icon={<MdRemoveRedEye />} disabled type={btnType.Danger} />
      </div>
    </div>
  ))
  .add("Secondary Buttons", () => (
    <div className="flex flex-col items-start">
      <h3 style={titleStyle} className="text-xl py-4">
        Secondary Button
      </h3>
      <div className="flex items-start space-x-4 ">
        <Button
          type={btnType.Secondary}
          text="Preview"
          icon={<MdRemoveRedEye />}
        />
        <Button type={btnType.Secondary} text="..." />
        <Button
          type={btnType.Secondary}
          text="Preview"
          icon={<MdRemoveRedEye />}
          disabled
        />
      </div>
    </div>
  ))
  .add('Sidebar Buttons', () => (
    <div>
      <SidebarButton 
        onClick={() => {
          console.log('onclick')
        }}
      />
    </div>
  ))
