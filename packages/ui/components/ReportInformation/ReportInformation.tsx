import { FunctionComponent } from "react";
import { format } from "date-fns";
import filesize from "filesize.js";
import { Report } from "../../domain/Report";
import { ItemInformation } from "../ItemInformation/ItemInformation";

type Props = {
  report: Report;
};

export const ReportInformation: FunctionComponent<React.PropsWithChildren<Props>> = ({ report }) => {
  const dict = {
    ...(report.date ? { Date: format(report.date, "dd MMM yyyy") } : {}),
    ...(report.date ? { Time: format(report.date, "h:mm:ss a") } : {}),
    // Size: filesize(report.files.reduce((p = 0, a) => a.size + p, 0)),
    "Number of files": report.files.length.toString(),
    Author: report.author ? report.author.username : 'deleted user',
    ID: report.id.toString(),
  };
  return (
    <>
      <ItemInformation title="Report information" dict={dict} />

      <p>
        <h3 className="font-sans text-base font-bold text-gray-500 py-3">Description</h3>
        <div className="font-sans  text-sm text-gray-500 gap-y-2">
          { report.description }
        </div>
      </p>
    </>
  );
};
