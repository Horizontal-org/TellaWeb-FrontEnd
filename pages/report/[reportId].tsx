import { useRouter } from "next/dist/client/router";
import { useEffect, useMemo } from "react";
import { ReportPage } from "packages/ui";
import { toReport } from "../../common/toReport";
import { usePlocState } from "../../common/usePlocState";
import { usePloc } from "../_app";

export const ReportById = () => {
  const { query, back } = useRouter();
  const { report: reportPloc, file: filePloc } = usePloc();
  const state = usePlocState(reportPloc);

  useEffect(() => {
    if (typeof query.reportId !== "string") return;
    reportPloc.open(query.reportId);
  }, [query.reportId, reportPloc]);

  return state && state.currentReport ? (
    <ReportPage
      report={toReport(state.currentReport)}
      onDeleteFile={(_, file) => {
        if (file) filePloc.delete(file);
      }}
      onDeleteReport={(report) => {
        reportPloc.delete(report.id);
      }}
      onClose={() => {
        back();
      }}
    />
  ) : null;
};

export default ReportById;
