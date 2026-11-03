import React, { useMemo, useState, useEffect } from "react";
import { ItemQuery } from "packages/ui";
import { Menu } from "../../components/Menu";
import { useRouter } from "next/router";
import {
  useCreateProjectMutation,
  useListQuery,
} from "packages/state/services/project";
import { ProjectQuery } from "packages/state/domain/project";
import { ProjectListPage } from "packages/ui/pages/ProjectListPage/ProjectListPage";
import { useToast } from "components/ToastWrapper";
import { errorMessage } from "packages/state/utils/errorMessage";

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
      handleToast(errorMessage(createProjectResult.error), "danger");
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


