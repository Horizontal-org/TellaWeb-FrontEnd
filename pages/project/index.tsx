import React, { useMemo, useState, useEffect } from "react";
import { ReportListPage, ItemQuery, Report as IReport } from "packages/ui";
import { Menu } from "../../components/Menu";
import { toReport } from "../../common/toReport";
import { useRouter } from "next/dist/client/router";
import { useAuthRequired } from "packages/state/features/auth/authHooks";
import {
  useCreateProjectMutation,
  useListQuery,
} from "packages/state/services/project";
import { ReportQuery } from "packages/state/domain/report";
import { useReportFileDownloader } from "packages/state/features/files/useReportFileDownloader";
import { ProjectQuery } from "packages/state/domain/project";
import { ProjectListPage } from "packages/ui/pages/ProjectListPage/ProjectListPage";
import { useToast } from "components/ToastWrapper";

const defaultQuery: ProjectQuery = {
  page: 0,
  size: 0,
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
  const handleToast = useToast()
  const [query, setQuery] = useState<ProjectQuery>(defaultQuery)
  const itemQuery = useMemo(() => toItemQuery(query), [query])
  const { push } = useRouter()

  const [createProject, createProjectResult] = useCreateProjectMutation()
  const { data: projects, refetch, isLoading } = useListQuery(query);
  
  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    if (createProjectResult.isSuccess) {
      handleToast("Project created!", "info");
      refetch()
    }
    if (createProjectResult.error && "status" in createProjectResult.error) {
      handleToast(createProjectResult.error.data.message, "danger");
    }
  }, [createProjectResult.status]);

  return (
    <ProjectListPage 
      isLoading={isLoading}
      currentQuery={itemQuery}
      projects={projects?.results || []}
      sidebar={<Menu />}
      onCreateProject={createProject}
      onOpen={(id) => {
        push(`./project/${id}`)
      }}
      onQueryChange={(itemQuery) => setQuery(toProjectQuery(itemQuery))}
    />
  );
};

export default Project;


