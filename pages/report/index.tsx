import React, { useEffect, useState } from "react";
import { useAuthRequired } from "../../common/useAuthRequired";
import { ReportListPage, ItemQuery } from "packages/ui";
import { usePlocState } from "../../common/usePlocState";
import { usePloc } from "../_app";
import { Menu } from "../../components/Menu";
import { toReport } from "../../common/toReport";
import { useRouter } from "next/dist/client/router";

export const Report = () => {
  useAuthRequired();
  const { push } = useRouter();
  const { report: reportPloc, file: filePloc } = usePloc();
  const state = usePlocState(reportPloc);

  const [query, setQuery] = useState<ItemQuery>({
    sort: [],
    filter: {},
    pagination: {
      page: 1,
      total: 1,
      size: 5,
    },
  });

  const loadReports = (newQuery: ItemQuery) => {
    setQuery(newQuery);
    reportPloc.list();
  };

  useEffect(() => {
    if (!state) return;
    setQuery({
      ...query,
      pagination: {
        ...query.pagination,
        total: state.reports.total,
        page: state.reports.offset,
        size: state.reports.limit,
      },
    });
  }, [state]);

  useEffect(() => {
    reportPloc.list();
  }, []);

  return (
    <ReportListPage
      currentQuery={query}
      onQueryChange={(newQuery: ItemQuery) => loadReports(newQuery)}
      onDelete={() => {}}
      onOpen={(report) => {
        push(`./report/${report.id}`);
      }}
      onDownload={(report) => {
        filePloc.donwloadReportFiles(report.id);
      }}
      reports={state?.reports.results.map(toReport) || []}
      sidebar={<Menu />}
    />
  );
};

export default Report;
