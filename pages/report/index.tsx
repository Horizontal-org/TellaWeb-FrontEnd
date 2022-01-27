import React, { useMemo, useState } from "react";
import { ReportListPage, ItemQuery } from "packages/ui";
import { usePloc } from "../_app";
import { Menu } from "../../components/Menu";
import { toReport } from "../../common/toReport";
import { useRouter } from "next/dist/client/router";
import { useAuthRequired } from "packages/state/features/auth/authHooks";
import { useListQuery } from "packages/state/services/reports";
import { ReportQuery } from "packages/state/domain/report";

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
  const { file: filePloc } = usePloc();

  const [query, setQuery] = useState<ReportQuery>(defaultQuery);
  const itemQuery = useMemo(() => toItemQuery(query), [query]);
  const { data: reports } = useListQuery(query);

  return ready ? (
    <ReportListPage
      currentQuery={itemQuery}
      onQueryChange={(itemQuery) => setQuery(toReportQuery(itemQuery))}
      onDelete={(toDelete) => {
        // TODO: Add batch delete method
        //onBatchDelete(toDelete.filter(td => td.id))
        //  .then(() => {
        //    refetch()
        //    // TODO: add deleted messge
        //  })
      }}
      onOpen={(report) => {
        push(`./report/${report.id}`);
      }}
      onDownload={(report) => {
        filePloc.donwloadReportFiles(report.id);
      }}
      reports={reports?.results.map(toReport) || []}
      sidebar={<Menu />}
    />
  ) : (
    false
  );
};

export default Report;
