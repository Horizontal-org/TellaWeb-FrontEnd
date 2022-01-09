import { useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import { ReportPage } from "packages/ui";
import { toReport } from "../../common/toReport";
import { usePlocState } from "../../common/usePlocState";
import { usePloc } from "../_app";
import { useToast } from "../../components/ToastWrapper";
import { useAuthRequired } from "packages/state/features/auth/authHooks";

export const ReportById = () => {
  useAuthRequired();

  const { query, back } = useRouter();
  const { report: reportPloc, file: filePloc } = usePloc();
  const state = usePlocState(reportPloc);
  const fileState = usePlocState(filePloc)
  const handleToast = useToast()

  useEffect(() => {
    if (typeof query.reportId !== "string") return;
    reportPloc.open(query.reportId);
  }, [query.reportId, reportPloc]);

  useEffect(() => {
    if (fileState.kind === 'DeletedFileState') {
      if (typeof query.reportId !== "string") return;
      reportPloc.open(query.reportId);
    }  
  }, [fileState.kind])

  return state && state.currentReport ? (
    <ReportPage
      report={toReport(state.currentReport)}
      onDeleteFile={(_, file) => {
        if (file) {
          filePloc.delete(file)
          handleToast('File deleted')
        }
      }}
      onDownloadFile={(file) => {
        filePloc.donwload(file)
      }}
      onDeleteReport={(report) => {
        reportPloc.delete(report.id);
        handleToast('Report deleted')
        back()
      }}
      onClose={() => {
        back();
      }}
    />
  ) : null;
};

export default ReportById;
