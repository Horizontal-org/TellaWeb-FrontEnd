import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { ItemQuery, ProjectPage, ReportPage } from "packages/ui";
import { useToast } from "../../../components/ToastWrapper";
import { useAuthRequired } from "packages/state/features/auth/authHooks";
import {
  useAddUsersMutation,
  useEditProjectMutation,
  useGetByIdQuery,
} from "packages/state/services/project";
import { ReportQuery } from "packages/state/domain/report";
import { useReportFileDownloader } from "packages/state/features/files/useReportFileDownloader";
import { Menu } from "components/Menu";
import { UserQuery } from "packages/state/domain/user";
import { ProjectUsersPage } from "packages/ui/pages/ProjectUsersPage/ProjectUsersPage";

const defaultQuery: ReportQuery = {
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

const processUsers = (users, query) => {
  return users
}

// const processReports = (reports, query) => {
//   if (!reports) {
//     return []
//   }
//   let newReports = reports
//   if ( query.search && query.search.length > 0 ) {
//     newReports = reports.filter((r) => { return r.title.toLowerCase().includes(query.search.toLowerCase()) })
//   }
//   return newReports.map(toReport)
// }

export const ProjectById = () => {

  const router = useRouter();
  const handleToast = useToast()
  const { data: currentProject, refetch } = useGetByIdQuery(
    "" + router.query.projectId
    );
  
  const { push } = useRouter();
  const [query, setQuery] = useState<UserQuery>(defaultQuery);
  const itemQuery = useMemo(() => toItemQuery(query), [query]);
  const [addUsers, addUsersResult] = useAddUsersMutation()

  useEffect(() => {
    if (addUsersResult.isSuccess) {
      handleToast("Users updated!");
      refetch()
    }
    if (addUsersResult.error && "status" in addUsersResult.error) {
      handleToast(addUsersResult.error.data.message, "danger");
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
      users={processUsers(currentProject.users, query)}
      sidebar={<Menu />}
    />
  ) : null;
};

export default ProjectById;
