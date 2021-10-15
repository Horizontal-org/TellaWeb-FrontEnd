import { storiesOf } from "@storybook/react";
import { ItemQuery } from "../../packages/ui/domain/ItemQuery";
import { REPORT_COLUMNS } from "../../packages/ui/domain/ReportTableColumns";
import { NEW_REPORT_COLUMNS } from "../moked/tableActions";
import { Table } from "../../packages/ui";
import { makeReportData } from "../moked/Table.moked.data";

storiesOf("Tables", module)
  .add("Report table", () => {
    return (
      <div className="w-full">
        <Table columns={REPORT_COLUMNS} data={makeReportData(20)} />
      </div>
    );
  })
  .add("Add callback actions", () => {
    const showMessage = (rq: ItemQuery) => {
      const type = rq.sort[0] ? rq.sort[0].id : "default";
      const order = rq.sort[0]
        ? rq.sort[0].desc
          ? "descendent"
          : "ascendent"
        : "";
      alert(`Sorting by ${type} ${order}`);
    };

    return (
      <div className="w-full">
        <Table
          columns={NEW_REPORT_COLUMNS}
          data={makeReportData(20)}
          onFetch={showMessage}
        />
      </div>
    );
  });
