import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import { ItemQuery, User as IUser } from 'packages/ui'
import { useAuthRequired } from "packages/state/features/auth/authHooks";
import { Menu } from "../../components/Menu";
import { useToast } from "components/ToastWrapper";
import {
  useListQuery,
  useCreateUserMutation,
  useBatchDeleteUserMutation
} from "packages/state/services/user";
import { UserQuery } from "packages/state/domain/user";
import { UserListPage } from '../../packages/ui/pages/UserListPage/UserListPage'

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


export const Report = () => {
  const ready = true

  const handleToast = useToast()
  const { push } = useRouter();
  const [createUser, createUserResult] = useCreateUserMutation()

  const [query, setQuery] = useState<UserQuery>(defaultQuery);
  const itemQuery = useMemo(() => toItemQuery(query), [query]);

  const { data: users, refetch } = useListQuery(query);
  const [batchDeleteUsers, batchDeleteUsersResult] = useBatchDeleteUserMutation();

  const onBatchDeleteUsers = async (usersToDelete: IUser[]) => {
    const toDelete = usersToDelete.map((td) => td.id);
    batchDeleteUsers(toDelete)
  };


  useEffect(() => {
    if (createUserResult.isSuccess) {
      handleToast("User created!", "info");
      refetch()
    }
    if (createUserResult.error && "status" in createUserResult.error) {
      handleToast(createUserResult.error.data.message, "danger");
    }
  }, [createUserResult.status]);

  useEffect(() => {
    if (batchDeleteUsersResult.isSuccess) {
      handleToast("User deleted", "info");
      refetch()
    }
    if (batchDeleteUsersResult.error && "status" in batchDeleteUsersResult.error) {
      handleToast(batchDeleteUsersResult.error.data.message, "danger");
    }
  }, [batchDeleteUsersResult.status])

  return ready ? (
    <UserListPage 
      currentQuery={itemQuery}
      onQueryChange={(itemQuery) => setQuery(toUserQuery(itemQuery))}
      sidebar={<Menu />}
      users={users?.results || []}
      onOpen={(user) => {
        push(`./user/${user.username}`);
      }}
      onDelete={onBatchDeleteUsers}
      onCreateUser={createUser} 
    ></UserListPage>
  ) : (
    false
  );
};

export default Report;
