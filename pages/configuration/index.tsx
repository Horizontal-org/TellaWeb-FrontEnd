import React, { useState, useMemo, useEffect } from 'react'
import { ItemQuery } from "packages/ui";
import { ConfigurationListPage } from 'packages/ui/pages/ConfigurationListPage/ConfigurationListPage';
import { Menu } from "../../components/Menu";
import { ConfigurationQuery } from "packages/state/domain/configuration";
import { useToast } from "../../components/ToastWrapper";
import { useAuthRequired } from "packages/state/features/auth/authHooks";
import { 
  useCreateConfigurationMutation,
  useListQuery
} from '../../packages/state/services/configuration'
import { useRouter } from 'next/router';

const defaultQuery: ConfigurationQuery = {
  page: 0,
  size: 25,
};

const toItemQuery = (configQuery: ConfigurationQuery): ItemQuery => {
  return {
    sort: {
      key: configQuery.sortKey,
      order: configQuery.sortOrder,
    },
    search: configQuery.search,
    filter: {},
    pagination: {
      page: configQuery.page,
      total: configQuery.total,
      size: configQuery.size,
    },
  };
};

const toConfigQuery = (itemQuery: ItemQuery): ConfigurationQuery => {
  return {
    sortKey: itemQuery.sort?.key,
    sortOrder: itemQuery.sort?.order,
    search: itemQuery.search,
    page: itemQuery.pagination?.page,
    total: itemQuery.pagination?.total,
    size: itemQuery.pagination?.size,
  };
};


const Configuration = () => {
  // useAuthRequired()
  
  const { push } = useRouter();

  const [query, setQuery] = useState<ConfigurationQuery>(defaultQuery);
  const itemQuery = useMemo(() => toItemQuery(query), [query]);
  
  const [createConfig, createConfigResult] = useCreateConfigurationMutation()
  const { data: configurations, refetch } = useListQuery(query);
  const handleToast = useToast();




  useEffect(() => {
    if (createConfigResult.isSuccess) {
      handleToast("Remote configuration created!", "info");
      refetch()
    }
    if (createConfigResult.error && "status" in createConfigResult.error) {
      handleToast(createConfigResult.error.data.message, "danger");
    }
  }, [createConfigResult.status]);

  return (
    <ConfigurationListPage 
      sidebar={<Menu />}
      configurations={configurations?.results || []}
      onCreateConfig={(name) => {
        createConfig({name})
      }}
      onOpen={(config) => {
        push(`./configuration/${config.id}`);
      }}
      currentQuery={itemQuery}
      onQueryChange={(itemQuery) => setQuery(toConfigQuery(itemQuery))}
    />
  )
}

export default Configuration