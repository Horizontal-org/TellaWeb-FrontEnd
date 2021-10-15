// @ts-nocheck
import { MdDelete } from "@react-icons/all-files/md/MdDelete";
import cn from "classnames";
import { Row, Column } from "react-table";
import { REPORT_COLUMNS } from "../../packages/ui/domain/ReportTableColumns";
import { btnType, Button } from "../../packages/ui/components/Button/Button";
import { Report } from "../../packages/ui/domain/Report";
import style from "../../packages/ui/components/Table/Table.module.css";

export const NEW_REPORT_COLUMNS: Column[] = [
  ...REPORT_COLUMNS,
  {
    Header: () => "",
    id: "actions",
    Cell: function ReportActions({ row }: { row: Row<Report> }) {
      return (
        <div className={cn(style.onlyOnHoverOrSelected, "px-3")}>
          <Button
            text="Delete"
            icon={<MdDelete />}
            type={btnType.Secondary}
            onClick={() => {
              console.log(`Delete ${row.original.id}`);
            }}
          />
        </div>
      );
    },
    className: "py-0 w-32",
  },
];
