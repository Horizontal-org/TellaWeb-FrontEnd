import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { useRouter } from "next/router";
import { ConfigPage } from '../../packages/ui/pages/ConfigPage/ConfigPage'
import { Menu } from "../../components/Menu";
import { useAuthRequired } from "packages/state/features/auth/authHooks";
import { useToast } from "components/ToastWrapper";
import {
  // useUpdatePasswordMutation,
  // useUpdateUserMutation,
  useLazyGetByIdQuery,
  useUpdateConfigurationMutation,
  useDeleteConfigurationMutation
} from "packages/state/services/configuration";
import { toRemoteConfiguration } from 'common/toRemoteConfiguration';

const ConfigById: FunctionComponent = () => {
  // useAuthRequired();
  
  const router = useRouter();
  const handleToast = useToast()
  const [currentConfigId, handleCurrentConfigId] = useState<string>()
  const [loadConfig, { data: currentConfig }] = useLazyGetByIdQuery();
  const [updateConfiguration, updateConfigurationResult] = useUpdateConfigurationMutation();
  const [deleteConfiguration, deleteConfigurationResult] = useDeleteConfigurationMutation()

  const id = useMemo(() => {
    if (router.query?.configurationId && typeof router.query.configurationId !== "string")
      return router.query.configurationId.toString();
    return router.query.configurationId as string;
  }, [router.query?.configurationId]);

  useEffect(() => {
    id && loadConfig(id);
    id && handleCurrentConfigId(id)
  }, [id, loadConfig]);  

  useEffect(() => {
    if (updateConfigurationResult.isSuccess) {
      handleToast("Remote configuration updated!", "info");
      loadConfig(currentConfigId)
    }
    if (updateConfigurationResult.error && "status" in updateConfigurationResult.error) {
      handleToast(updateConfigurationResult.error.data.message, "danger");
    }
  }, [updateConfigurationResult.status]);

  return (
    currentConfig ? <ConfigPage 
      configuration={toRemoteConfiguration(currentConfig)}
      onUpdate={updateConfiguration}
      onDelete={(id) => {
        handleToast("Report deleted");
        router.back();
        deleteConfiguration(id)
      }}
      onClose={() => {
        router.back();
      }}
    /> : null
  )
}

export default ConfigById