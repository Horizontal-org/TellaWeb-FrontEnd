import { FunctionComponent, useState } from "react";
import { MainLayout } from "../../layouts/MainLayout";
import { GlobalSetting } from "packages/state/domain/global-setting";
import { ToggleGlobalSettingsModel } from "packages/ui/modals/globalSetting/ToggleGlobalSettingModal/ToggleGlobalSettingModal";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { version } from 'package.json'

type Props = {
  sidebar: React.ReactNode;
  globalSettings: GlobalSetting[]
  onUpdate: (id, newValue: boolean) => void
};


export const AdminCenterPage: FunctionComponent<React.PropsWithChildren<Props>> = ({
  sidebar,
  globalSettings,
  onUpdate
}) => {

  return (
    <MainLayout
      title="Admin Center"
      subtitle="Manage system-wide settings"
      leftbar={sidebar}
      leftbarActive={false}
      content={
        <div className='px-8'>
          <div className="flex h-10 mb-2"></div>
          { globalSettings && globalSettings.length > 0 && globalSettings.map((g) => (
            <div 
              className="flex justify-between items-center py-4 border-b"
              key={g.id}
            >
              <div className="flex items-center">
                <p className="text-gray-600 uppercase flex items-center" style={{ width: 350 }}>
                  { g.name }
                  <span className="ml-4 cursor-pointer">
                    <IoMdHelpCircleOutline 
                        size={20}
                        color="#8B8E8F"
                        onClick={() => {
                          window.open("https://tella-app.org/tella-web/#admin-center", "_blank")
                        }}
                    />
                  </span>
                </p>
                <p>{g.enabled  ? 'Enabled' : 'Disabled'}</p>
                
              </div>            
              <ToggleGlobalSettingsModel 
                onToggle={(newValue) => {
                  onUpdate(g.id, newValue)
                }}
                globalSetting={g}
              />
            </div>
          ))}
          <div 
            className="flex justify-between items-center py-4 border-b"
          >
            <div className="flex items-center">
              <p className="text-gray-600 uppercase flex items-center" style={{ width: 350 }}>
                TELLA WEB VERSION                
              </p>
              <p>v{version}</p>            
            </div>                        
          </div>
        </div>
      }
    />
  );
};
