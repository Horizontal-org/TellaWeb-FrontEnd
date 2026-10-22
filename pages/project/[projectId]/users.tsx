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
import { useListQuery } from "packages/state/services/user";
import { ProjectUsersPage } from "packages/ui/pages/ProjectUsersPage/ProjectUsersPage";
import { errorMessage } from "packages/state/utils/errorMessage";

const defaultQuery: UserQuery = {
  page: 0,
  size: 25,
};

const toItemQuery = (userQuery: UserQuery): ItemQuery => {
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

const toUserQuery = (itemQuery: ItemQuery): UserQuery => {
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
  const [query, setQuery] = useState<UserQuery>(defaultQuery);
  // Sorting, search and pagination are done by the server, as on the project's reports list
  const { data: users, refetch: refetchList } = useListQuery({ ...query, projectId }, { skip: !projectId })
  // The table needs the total from the API to know how many pages there are
  const itemQuery = useMemo(
    () => toItemQuery({ ...query, total: users?.total ?? query.total }),
    [query, users?.total]
  )
  const [addUsers, addUsersResult] = useAddEntitiesMutation()

  useEffect(() => {
    if (addUsersResult.isSuccess) {
      handleToast("Users updated!");
      refetch()
      refetchList()
    }
    if (addUsersResult.error && "status" in addUsersResult.error) {
      handleToast(errorMessage(addUsersResult.error), "danger");
    }
  }, [addUsersResult.status]);

  return currentProject ? (
    <ProjectUsersPage
      project={currentProject}
      currentQuery={itemQuery}
      onAddUsers={(newUsers) => {
        addUsers({ id: currentProject.id, users:newUsers })
      }}
      onQueryChange={(itemQuery) => setQuery(toUserQuery(itemQuery))}
      onOpen={(user) => {
        push(`/user/${user.id}`);
      }}
      removeSelected={(selected) => {
        addUsers({ id: currentProject.id, users: selected })
      }}
      users={users?.results || []}
      projectUsers={currentProject.users}
      sidebar={<Menu />}
    />
  ) : null;
};

export default ProjectById;
