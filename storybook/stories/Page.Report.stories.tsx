import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { ReportPage } from "../../packages/ui";
import { FakeReport } from "../moked/report";

storiesOf("Pages", module).add("Report - Details", () => {
  return (
    <ReportPage
      report={FakeReport}
      onDeleteReport={action("Delete report")}
      onDeleteFile={action("Delete file")}
      onClose={action("Close report")}
    />
  );
});
