import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { ReportPage } from "packages/ui";
import { toReport } from "../../common/toReport";
import { useToast } from "../../components/ToastWrapper";
import { useAuthRequired } from "packages/state/features/auth/authHooks";
import {
  useDeleteReportMutation,
  useLazyGetByIdQuery,
  useEditReportMutation
} from "packages/state/services/reports";
import { useDeleteFileMutation } from "packages/state/services/files";
import { useFileDownloader } from "packages/state/features/files/useFileDownloader";

export const ReportById = () => {
  useAuthRequired();

  const router = useRouter();

  const reportId = useMemo(() => {
    if (router.query?.reportId && typeof router.query.reportId !== "string")
      return router.query.reportId.toString();
    return router.query.reportId as string;
  }, [router.query?.reportId]);

  const handleToast = useToast();

  const [loadReport, { data: currentReport }] = useLazyGetByIdQuery();
  const [editReport, editReportResult] = useEditReportMutation()
  const [deleteReport] = useDeleteReportMutation();
  const [downloadFile] = useFileDownloader();
  const [deleteFile] = useDeleteFileMutation();

  useEffect(() => {
    reportId && loadReport(reportId);
  }, [reportId, loadReport]);

  useEffect(() => {
    if (editReportResult.isSuccess) {
      handleToast("Title updated!", "info");
      loadReport(reportId)
    }
    if (editReportResult.error && "status" in editReportResult.error) {
      handleToast(editReportResult.error.data.message, "danger");
    }
  }, [editReportResult.status]);

  return currentReport ? (
    <ReportPage
      report={toReport(currentReport)}
      onDeleteFile={async (_, file) => {
        if (file) {
          await deleteFile(file);
          handleToast("File deleted");
          loadReport(reportId);
        }
      }}
      onDownloadFile={(file) => {
        downloadFile(file);
      }}
      onEditTitle={(title) => {
        editReport({
          id: currentReport.id,
          title: title,
          description: null
        })
      }}
      onDeleteReport={async (report) => {
        const result = await deleteReport(report.id);
        if ("data" in result) {
          handleToast("Report deleted");
          router.back();
        }
        //add error toast
      }}
      onClose={() => {
        router.back();
      }}
    />
  ) : null;
};

export default ReportById;
