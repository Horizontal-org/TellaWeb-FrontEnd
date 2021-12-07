import { storiesOf } from "@storybook/react"
import { ButtonMenu, DeleteModal } from "../../packages/ui"
import { action } from "@storybook/addon-actions"

storiesOf("Delete modal", module).add("Delete modal", () => {
  return (
    <ButtonMenu openSide="right">
      <DeleteModal 
        render={(
          <p>
            All will be permanently deleted.
          </p>
        )}
        onDelete={() => action(`Delete`)('Delete something')}
      />    
    </ButtonMenu>
  );
});
