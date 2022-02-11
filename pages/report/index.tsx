import React, { useMemo, useState, useEffect } from "react";
import { ReportListPage, ItemQuery, Report as IReport } from "packages/ui";
import { Menu } from "../../components/Menu";
import { toReport } from "../../common/toReport";
import { useRouter } from "next/dist/client/router";
import { useAuthRequired } from "packages/state/features/auth/authHooks";
import {
  useBatchDeleteMutation,
  useListQuery,
} from "packages/state/services/reports";
import { ReportQuery } from "packages/state/domain/report";
import { useReportFileDownloader } from "packages/state/features/files/useReportFileDownloader";

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

export const Report = () => {
  const ready = useAuthRequired();

  const { push } = useRouter();
  const [downloadReportFile] = useReportFileDownloader();

  const [query, setQuery] = useState<ReportQuery>(defaultQuery);
  const itemQuery = useMemo(() => toItemQuery(query), [query]);

  const { data: reports, refetch } = useListQuery(query);
  const [batchDelete] = useBatchDeleteMutation();

  const onBatchDelete = async (reportsToDelete: IReport[]) => {
    const toDelete = reportsToDelete.map((td) => td.id);
    const deleted = await batchDelete(toDelete).unwrap();
    if (deleted) refetch();
  };

  useEffect(() => {
    refetch()
  }, [])

  return ready ? (
    <ReportListPage      
      currentQuery={itemQuery}
      onQueryChange={(itemQuery) => setQuery(toReportQuery(itemQuery))}
      onDelete={onBatchDelete}
      onOpen={(report) => {
        push(`./report/${report.id}`);
      }}
      onDownload={(report) => {
        downloadReportFile(report.id);
      }}
      reports={reports?.results.map(toReport) || []}
      sidebar={<Menu />}
    />
  ) : (
    false
  );
};

export default Report;
