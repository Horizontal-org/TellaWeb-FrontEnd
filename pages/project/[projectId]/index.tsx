import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { ItemQuery, ProjectPage, ReportPage, Report as IReport } from "packages/ui";
import { toReport } from "../../../common/toReport";
import { useToast } from "../../../components/ToastWrapper";
import { useAuthRequired } from "packages/state/features/auth/authHooks";
import {
  useGetByIdQuery,
} from "packages/state/services/project";
import { ReportQuery } from "packages/state/domain/report";
import { useReportFileDownloader } from "packages/state/features/files/useReportFileDownloader";
import { Menu } from "components/Menu";
import { useBatchDeleteMutation, useListQuery } from "packages/state/services/reports";
import { errorMessage } from "packages/state/utils/errorMessage";

const defaultQuery: ReportQuery = {
  page: 0,
  size: 25,
};

const toItemQuery = (reportQuery: ReportQuery): ItemQuery => {
  return {
    sort: {
      key: reportQuery.sortKey,
      order: reportQuery.sortOrder,
    },
    search: reportQuery.search,
    filter: {},
    pagination: {
      page: reportQuery.page,
      total: reportQuery.total,
      size: reportQuery.size,
    },
  };
};

const toReportQuery = (itemQuery: ItemQuery): ReportQuery => {
  return {
    sortKey: itemQuery.sort?.key,
    sortOrder: itemQuery.sort?.order,
    search: itemQuery.search,
    page: itemQuery.pagination?.page,
    total: itemQuery.pagination?.total,
    size: itemQuery.pagination?.size,
  };
};

export const ProjectById = () => {

  const router = useRouter();
  const handleToast = useToast()

  const projectId = router.query.projectId as string | undefined
  const { data: currentProject, refetch } = useGetByIdQuery(
    "" + projectId
  );

  const { push } = useRouter();
  const [downloadReportFile] = useReportFileDownloader();

  const [query, setQuery] = useState<ReportQuery>(defaultQuery);
  // Sorting, search and pagination are done by the server, as on the reports list
  const { data: reports } = useListQuery({ ...query, projectId }, { skip: !projectId });
  // The table needs the total from the API to know how many pages there are
  const itemQuery = useMemo(
    () => toItemQuery({ ...query, total: reports?.total ?? query.total }),
    [query, reports?.total]
  );
  const [batchDelete, batchDeleteReportResult] = useBatchDeleteMutation()


  const onBatchDelete = async (reportsToDelete: IReport[]) => {
    const toDelete = reportsToDelete.map((td) => td.id);
    batchDelete(toDelete).unwrap();
  };


  useEffect(() => {
    if (batchDeleteReportResult.isSuccess) {
      handleToast("Report/s deleted", "info");
      refetch()
    }
    if (batchDeleteReportResult.error && "status" in batchDeleteReportResult.error) {
      handleToast(errorMessage(batchDeleteReportResult.error), "danger");
    }
  }, [batchDeleteReportResult.status])


  return currentProject ? (
    <ProjectPage
      project={currentProject}
      currentQuery={itemQuery}
      onQueryChange={(itemQuery) => setQuery(toReportQuery(itemQuery))}
      onOpen={(report) => {
        push(`/report/${report.id}`);
      }}
      onDownload={(report) => {
        downloadReportFile(report.id);
      }}
      onDelete={onBatchDelete}
      reports={reports?.results.map(toReport) || []}
      sidebar={<Menu />}
    />
  ) : null;
};

export default ProjectById;
