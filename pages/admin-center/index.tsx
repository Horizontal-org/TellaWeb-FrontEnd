import React, { useEffect, useState } from "react";
import { Menu } from "../../components/Menu";
import { AdminCenterPage } from "packages/ui/pages/AdminCenterPage/AdminCenterPage";
import { useListQuery, useUpdateGlobalSettingMutation } from "packages/state/services/global-setting";
import { useToast } from "components/ToastWrapper";
import { useRouter } from "next/router";
import { useLatestQuery, useStartMutation, useDeleteMutation } from "packages/state/services/backup";
import { on } from "cluster";


const AdminCenter = () => {
  const { data: globalSettings, refetch } = useListQuery();
  const router = useRouter()
  const handleToast = useToast()

  const [update, updateResult] = useUpdateGlobalSettingMutation();
  const [startBackup, startBackupResult] = useStartMutation();
  const [deleteBackup, deleteBackupResult] = useDeleteMutation();
  
  const { data: latestBackups, refetch: refetchLatestBackups } = useLatestQuery();

  const [newBackupFlag, handleNewBackupFlag] = useState<boolean>(false)

  useEffect(() => {
    refetch()
    refetchLatestBackups()

    // if on the page check for new backup status
    setInterval(() => {
      refetchLatestBackups()
    }, 30000)
  }, [])


  useEffect(() => {
    if (latestBackups) {
      if (latestBackups.processing && !newBackupFlag) {
        handleNewBackupFlag(true)
      }
  
      if (newBackupFlag && !latestBackups.processing) {
        handleNewBackupFlag(false)
        handleToast("Your backup was successfully generated", "info");
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
      handleToast(updateResult.error.data.message, "danger");
    }
  }, [updateResult.status]);

  useEffect(() => {
    if (startBackupResult.isSuccess) {
      handleToast("Your backup is being generated", "info");
      refetchLatestBackups()
    }
    if (startBackupResult.error && "status" in startBackupResult.error) {
      handleToast(startBackupResult.error.data.message, "danger");
    }
  }, [startBackupResult.status]);

  useEffect(() => {
    if (deleteBackupResult.isSuccess) {
      handleToast("Your backup was successfully deleted", "info");      
      refetchLatestBackups()
    }
    if (deleteBackupResult.error && "status" in deleteBackupResult.error) {
      handleToast(deleteBackupResult.error.data.message, "danger");
    }
  }, [deleteBackupResult.status]);


  return (
    <AdminCenterPage
      globalSettings={globalSettings}
      backups={latestBackups}
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
