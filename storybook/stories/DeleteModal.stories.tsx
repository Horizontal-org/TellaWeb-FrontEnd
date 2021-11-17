import { storiesOf } from "@storybook/react"
import { DeleteModal } from "../../packages/ui"
import { action } from "@storybook/addon-actions"

storiesOf("Delete modal", module).add("Delete modal", () => {
  return (
    <div>
      <DeleteModal 
        render={(
          <p>
            All will be permanently deleted.
          </p>
        )}
        onDelete={() => action(`Delete`)('Delete something')}
      />    
    </div>
  );
});
