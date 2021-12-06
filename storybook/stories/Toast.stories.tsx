import { CSSProperties } from "react";
import { storiesOf } from "@storybook/react";
import { useToast } from '../../components/ToastWrapper'
import { Button } from "../../packages/ui"


storiesOf("Toasts", module)
  .add("Info Toast", () => {
    const handleToast = useToast()
    return (
      <div>
        <div>
          <Button text="Info toast" onClick={() => {
            handleToast('This is an information message')
          }}/>
        </div>
      </div>
    )
  })
  .add("Danger Toast", () => {
    const handleToast = useToast()
    return (
      <div>
        <div>
          <Button text="Danger toast" onClick={() => {
            handleToast('This is a danger message', 'danger')
          }}/>
        </div>
      </div>
    )
  })
  .add("Success Toast", () => {
    const handleToast = useToast()
    return (
      <div>
        <div>
          <Button text="Success toast" onClick={() => {
            handleToast('This is a success message', 'success')
          }}/>
        </div>
      </div>
    )
  })