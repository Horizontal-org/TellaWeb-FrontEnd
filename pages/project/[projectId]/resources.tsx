import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { ItemQuery, ProjectPage, ReportPage } from "packages/ui";
import { useToast } from "../../../components/ToastWrapper";
import { useAuthRequired } from "packages/state/features/auth/authHooks";
import {
  useAddEntitiesMutation,
  useEditProjectMutation,
  useGetByIdQuery,
} from "packages/state/services/project";
import { ReportQuery } from "packages/state/domain/report";
import { useReportFileDownloader } from "packages/state/features/files/useReportFileDownloader";
import { Menu } from "components/Menu";
import { UserQuery } from "packages/state/domain/user";
import { ProjectUsersPage } from "packages/ui/pages/ProjectUsersPage/ProjectUsersPage";
import { ResourceQuery } from "packages/state/domain/resource";
import { ProjectResourcesPage } from "packages/ui/pages/ProjectResourcesPage/ProjectResourcesPage";

const defaultQuery: ResourceQuery = {
  page: 0,
  size: 25,
};

const toItemQuery = (userQuery: ResourceQuery): ItemQuery => {
  return {
    sort: {
      key: userQuery.sortKey,
      order: userQuery.sortOrder,
    },
    search: userQuery.search,
    filter: {},
    pagination: {
      page: userQuery.page,
      total: userQuery.total,
      size: userQuery.size,
    },
  };
};

const toResourceQuery = (itemQuery: ItemQuery): ResourceQuery => {
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
  const { data: currentProject, refetch, isLoading } = useGetByIdQuery(
    "" + router.query.projectId
    );

  const { push } = useRouter();
  const [query, setQuery] = useState<ResourceQuery>(defaultQuery);
  const itemQuery = useMemo(() => toItemQuery(query), [query]);
  const [addResources, addResourcesResult] = useAddEntitiesMutation()

  useEffect(() => {
    if (addResourcesResult.isSuccess) {
      handleToast("Resources updated!");
      refetch()
    }
    if (addResourcesResult.error && "status" in addResourcesResult.error) {
      handleToast(addResourcesResult.error.data.message, "danger");
    }
  }, [addResourcesResult.status]);

  return currentProject ? (
    <ProjectResourcesPage
      project={currentProject}
      currentQuery={itemQuery}
      isLoading={isLoading}
      onAddResources={(newR) => {
        addResources({ id: currentProject.id, resources: newR })
      }}
      onQueryChange={(itemQuery) => setQuery(toResourceQuery(itemQuery))}
      onOpen={(user) => {
        push(`/user/${user.id}`);
      }}
      removeSelected={(selected) => {
        addResources({ id: currentProject.id, resources: selected })
      }}
      resources={currentProject.resources}
      sidebar={<Menu />}
    />
  ) : null;
};

export default ProjectById;
