import { useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import { ReportPage } from "packages/ui";
import { toReport } from "../../common/toReport";
import { usePlocState } from "../../common/usePlocState";
import { usePloc } from "../_app";
import { useToast } from "../../components/ToastWrapper";
import { useAuthRequired } from "packages/state/features/auth/authHooks";
import {
  useDeleteMutation,
  useGetByIdQuery,
} from "packages/state/services/reports";

export const ReportById = () => {
  useAuthRequired();

  const { query, back } = useRouter();
  const { file: filePloc } = usePloc();
  const fileState = usePlocState(filePloc);
  const handleToast = useToast();

  const { data: currentReport, refetch } = useGetByIdQuery(
    query.reportId.toString()
  );
  const [deleteReport, {}] = useDeleteMutation();
  useEffect(() => {
    if (fileState.kind === "DeletedFileState") {
      if (typeof query.reportId !== "string") return;
      refetch();
    }
  }, [fileState.kind]);

  return currentReport ? (
    <ReportPage
      report={toReport(currentReport)}
      onDeleteFile={(_, file) => {
        if (file) {
          filePloc.delete(file);
          handleToast("File deleted");
        }
      }}
      onDownloadFile={(file) => {
        filePloc.donwload(file);
      }}
      onDeleteReport={async (report) => {
        const result = await deleteReport(report.id);
        if ("data" in result) {
          handleToast("Report deleted");
          back();
        }
        //add error tast
      }}
      onClose={() => {
        back();
      }}
    />
  ) : null;
};

export default ReportById;
