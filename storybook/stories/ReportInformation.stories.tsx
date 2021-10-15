import { storiesOf } from "@storybook/react";
import { ReportInformation } from "../../packages/ui";
import { FakeReport } from "../moked/report";

storiesOf("Report Information", module).add("Report Information", () => {
  return (
    <div className="w-64 p-2">
      <ReportInformation report={FakeReport} />
    </div>
  );
});
