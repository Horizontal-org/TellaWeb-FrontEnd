import { FunctionComponent, useState } from "react";
import { MainLayout } from "../../layouts/MainLayout";
import { useListQuery } from "packages/state/services/global-setting";
import { GlobalSetting } from "packages/state/domain/global-setting";
import { ToggleGlobalSettingsModel } from "packages/ui/modals/globalSetting/ToggleGlobalSettingModal/ToggleGlobalSettingModal";

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
      title="Admin center"
      subtitle="Change system wide settings"
      leftbar={sidebar}
      leftbarActive={false}
      content={
        <div className='px-8'>
          { globalSettings && globalSettings.length > 0 && globalSettings.map((g) => (
            <div 
              className="flex justify-between items-center py-4 border-b"
              key={g.id}
            >
              <div className="flex items-center">
                <p className="text-gray-600 uppercase" style={{ width: 200 }}>
                  { g.name }
                </p>
                <p>{g.enabled  ? 'ENABLED' : 'DISABLED'}</p>
              </div>            
              <ToggleGlobalSettingsModel 
                onToggle={(newValue) => {
                  onUpdate(g.id, newValue)
                }}
                globalSetting={g}
              />
            </div>
          ))}
        </div>
      }
    />
  );
};
