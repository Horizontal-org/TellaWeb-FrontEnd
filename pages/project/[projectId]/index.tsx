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
import { useBatchDeleteMutation } from "packages/state/services/reports";

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

const processReports = (reports, query) => {
  if (!reports) {
    return []
  }

  let newReports = reports
  if ( query.search && query.search.length > 0 ) {
    newReports = reports.filter((r) => { return r.title.toLowerCase().includes(query.search.toLowerCase()) })
  }

  return newReports.map(toReport)
}

export const ProjectById = () => {

  const router = useRouter();
  const handleToast = useToast()
  
  const { data: currentProject, refetch } = useGetByIdQuery(
    "" + router.query.projectId
    );
  
  const { push } = useRouter();
  const [downloadReportFile] = useReportFileDownloader();

  const [query, setQuery] = useState<ReportQuery>(defaultQuery);
  const itemQuery = useMemo(() => toItemQuery(query), [query]);
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
      handleToast(batchDeleteReportResult.error.data.message, "danger");
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
      reports={processReports(currentProject.reports, query)}
      sidebar={<Menu />}
    />
  ) : null;
};

export default ProjectById;
