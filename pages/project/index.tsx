import React, { useMemo, useState, useEffect } from "react";
import { ReportListPage, ItemQuery, Report as IReport } from "packages/ui";
import { Menu } from "../../components/Menu";
import { toReport } from "../../common/toReport";
import { useRouter } from "next/dist/client/router";
import { useAuthRequired } from "packages/state/features/auth/authHooks";
import {
  useListQuery,
} from "packages/state/services/project";
import { ReportQuery } from "packages/state/domain/report";
import { useReportFileDownloader } from "packages/state/features/files/useReportFileDownloader";
import { ProjectQuery } from "packages/state/domain/project";
import { ProjectListPage } from "packages/ui/pages/ProjectListPage/ProjectListPage";

const defaultQuery: ProjectQuery = {
  page: 0,
  size: 25,
};

const toItemQuery = (projectQuery: ProjectQuery): ItemQuery => {
  return {
    sort: {
      key: projectQuery.sortKey,
      order: projectQuery.sortOrder,
    },
    search: projectQuery.search,
    filter: {},
    pagination: {
      page: projectQuery.page,
      total: projectQuery.total,
      size: projectQuery.size,
    },
  };
};

const toProjectQuery = (itemQuery: ItemQuery): ProjectQuery => {
  return {
    sortKey: itemQuery.sort?.key,
    sortOrder: itemQuery.sort?.order,
    search: itemQuery.search,
    page: itemQuery.pagination?.page,
    total: itemQuery.pagination?.total,
    size: itemQuery.pagination?.size,
  };
};

export const Project = () => {
  const [query, setQuery] = useState<ProjectQuery>(defaultQuery);
  const itemQuery = useMemo(() => toItemQuery(query), [query]);

  const { data: projects } = useListQuery(query);
  
  return (
    <ProjectListPage 
      currentQuery={itemQuery}
      projects={projects?.results || []}
      sidebar={<Menu />}
      onQueryChange={(itemQuery) => setQuery(toProjectQuery(itemQuery))}
    />
  );
};

export default Project;

// <ReportListPage
    //   currentQuery={itemQuery}
    //   onQueryChange={(itemQuery) => setQuery(toReportQuery(itemQuery))}
    //   onDelete={onBatchDelete}
    //   onOpen={(report) => {
    //     push(`./report/${report.id}`);
    //   }}
    //   onDownload={(report) => {
    //     downloadReportFile(report.id);
    //   }}
    //   reports={reports?.results.map(toReport) || []}
    //   sidebar={<Menu />}
    // />
