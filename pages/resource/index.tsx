import React, { useEffect, useMemo, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SettingsPage } from "../../packages/ui/pages/SettingsPage/SettingsPage";
import { Menu } from "../../components/Menu";
import { useAuthRequired } from "packages/state/features/auth/authHooks";
import { useUserProfile } from "packages/state/features/user/userHooks";
import { useToast } from "components/ToastWrapper";
import {
  useUpdatePasswordMutation,
  useUpdateUserMutation
} from "packages/state/services/user";
import { useDispatch } from "react-redux";
import { setUser } from "packages/state/features/user/userSlice";
import { ResourceListPage } from "packages/ui/pages/ResourceListPage/ResourceListPage";
import { useRouter } from "next/router";
import { ResourceQuery } from "packages/state/domain/resource";
import { ItemQuery } from "@tellaweb/ui";
import { useDeleteResourceMutation, useListQuery } from "packages/state/services/resource";
import { useResourceFileDownloader } from "packages/state/features/resources/useResourceFilesDownloader";


const defaultQuery: ResourceQuery = {
  page: 0,
  size: 25,
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

const toItemQuery = (reportQuery: ResourceQuery): ItemQuery => {
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


const Resources = () => {
  const ready = true

  const handleToast = useToast()
  const { push } = useRouter();

  const [query, setQuery] = useState<ResourceQuery>(defaultQuery);
  const itemQuery = useMemo(() => toItemQuery(query), [query]);

  const { data: resources, refetch } = useListQuery(query);
  const [deleteResource, deleteResourceResult] = useDeleteResourceMutation();
  const [downloadFile] = useResourceFileDownloader();


  useEffect(() => {
    if (deleteResourceResult.isSuccess) {
      handleToast("The resource was successfully deleted", "success");
      refetch()
    }
    if (deleteResourceResult.error && "status" in deleteResourceResult.error) {
      handleToast(deleteResourceResult.error.data.message, "danger");
    }
  }, [deleteResourceResult.status]);

  return (
    <ResourceListPage
      onCreateUser={() => {
        refetch()
        handleToast('The new resource was successfully added to your workspace', 'success')
      }}
      currentQuery={itemQuery}
      sidebar={<Menu />}
      onDelete={(id) => {
        deleteResource(id)
      }}
      onDownload={(fileNames) => {
        downloadFile(fileNames)
      }}
      onQueryChange={(itemQuery) => setQuery(toResourceQuery(itemQuery))}
      resources={resources?.results || []}      
    />
  );
};

export default Resources;
