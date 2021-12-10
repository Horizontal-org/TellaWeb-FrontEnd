import { useRouter, } from "next/dist/client/router";
import { useEffect, useMemo } from "react";
import { ReportPage } from "packages/ui";
import { toReport } from "../../common/toReport";
import { usePlocState } from "../../common/usePlocState";
import { usePloc } from "../_app";
import { useToast } from '../../components/ToastWrapper'

export const ReportById = () => {
  const { query, back, push } = useRouter();
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
