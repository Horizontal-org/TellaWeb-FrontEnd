import React, { useEffect, useState } from "react";
import { Menu } from "../../components/Menu";
import { AdminCenterPage } from "packages/ui/pages/AdminCenterPage";

const Settings = () => {
 
  return (
    <AdminCenterPage
      sidebar={<Menu />}    
    />
  );
};


export default Settings;
