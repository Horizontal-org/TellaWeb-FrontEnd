import React, { useEffect, useState } from "react";
import { Menu } from "../../components/Menu";
import { AdminCenterPage } from "packages/ui/pages/AdminCenterPage/AdminCenterPage";
import { useListQuery, useUpdateGlobalSettingMutation } from "packages/state/services/global-setting";
import { useToast } from "components/ToastWrapper";
import { useRouter } from "next/router";

const AdminCenter = () => {
  const { data: globalSettings, refetch } = useListQuery();
  const router = useRouter()
  const handleToast = useToast()

  const [update, updateResult] = useUpdateGlobalSettingMutation();


  useEffect(() => {
    refetch()
  }, [])
  
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

  return (
    <AdminCenterPage
      globalSettings={globalSettings}
      sidebar={<Menu />}    
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
