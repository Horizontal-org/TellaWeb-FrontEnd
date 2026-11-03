import React, { useEffect, useState } from "react";
import { Menu } from "../../components/Menu";
import { AdminCenterPage } from "packages/ui/pages/AdminCenterPage/AdminCenterPage";
import { useListQuery, useUpdateGlobalSettingMutation } from "packages/state/services/global-setting";
import { useToast } from "components/ToastWrapper";
import { useRouter } from "next/router";
import { useLatestQuery, useSpaceQuery, useStartMutation, useDeleteMutation } from "packages/state/services/backup";
import { errorMessage } from "packages/state/utils/errorMessage";


const AdminCenter = () => {
  const { data: globalSettings } = useListQuery(undefined, { refetchOnMountOrArgChange: true })
  const router = useRouter()
  const handleToast = useToast()

  const [update, updateResult] = useUpdateGlobalSettingMutation();
  const [startBackup, startBackupResult] = useStartMutation();
  const [deleteBackup, deleteBackupResult] = useDeleteMutation();
  
  // while on the page, poll for new backup status (stops on unmount)
  const { data: latestBackups, refetch: refetchLatestBackups } = useLatestQuery(undefined, {
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true,
  })

  // not polled: the backend stats every stored file to compute it
  const { data: backupSpace, refetch: refetchBackupSpace } = useSpaceQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const [newBackupFlag, handleNewBackupFlag] = useState<boolean>(false)


  useEffect(() => {
    if (latestBackups) {
      if (latestBackups.processing && !newBackupFlag) {
        handleNewBackupFlag(true)
      }
  
      if (newBackupFlag && !latestBackups.processing) {
        handleNewBackupFlag(false)
        handleToast("Your backup was successfully generated", "info");
        refetchBackupSpace()
      }
    }
  }, [latestBackups])

  
  useEffect(() => {
    if (updateResult.isSuccess) {      
      handleToast("Your settings are updating, the page will refresh soon.", "info");
      setTimeout(() => {
        router.reload()
      }, 1500)
    }
    if (updateResult.error && "status" in updateResult.error) {
      handleToast(errorMessage(updateResult.error), "danger");
    }
  }, [updateResult.status]);

  useEffect(() => {
    if (startBackupResult.isSuccess) {
      handleToast("Your backup is being generated", "info");
      refetchLatestBackups()
    }
    if (startBackupResult.error && "status" in startBackupResult.error) {
      handleToast(errorMessage(startBackupResult.error), "danger");
    }
  }, [startBackupResult.status]);

  useEffect(() => {
    if (deleteBackupResult.isSuccess) {
      handleToast("Your backup was successfully deleted", "info");      
      refetchLatestBackups()
      refetchBackupSpace()
    }
    if (deleteBackupResult.error && "status" in deleteBackupResult.error) {
      handleToast(errorMessage(deleteBackupResult.error), "danger");
    }
  }, [deleteBackupResult.status]);


  return (
    <AdminCenterPage
      globalSettings={globalSettings}
      backups={latestBackups}
      backupSpace={backupSpace}
      sidebar={<Menu />}    
      onBackupStart={() => { startBackup() }}
      onBackupDelete={(id) => { deleteBackup(id) }}
      onUpdate={(id, newVal) => {
        update({
          enabled: newVal,
          id, 
        })
      }}
    />
  );
};


export default AdminCenter;
