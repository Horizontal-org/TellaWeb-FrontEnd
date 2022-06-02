import {
  FunctionComponent,
} from "react"
import {
  TopBar,
  ButtonMenu,
  DeleteModal
} from '../../../ui'

import { EditCamouflageModal } from '../../modals/remoteConfiguration/EditCamouflageModal/EditCamouflageModal'
import { EditCrashReportsModal } from '../../modals/remoteConfiguration/EditCrashReportsModal/EditCrashReportsModal'

import { Configuration } from "packages/state/domain/configuration";
import { btnType } from '../../components/Button/Button'
import { EditServersModal } from "packages/ui/modals/remoteConfiguration/EditServersModal/EditServersModal";
import { EditNameModal } from "packages/ui/modals/remoteConfiguration/EditNameModal/EditNameModal";
import { ShareConfigurationModal } from 'packages/ui/modals/remoteConfiguration/ShareConfigurationModal/ShareConfigurationModal'
import { format } from "date-fns";
type Props = {
  configuration: Configuration | null;
  onClose: () => void;
  onUpdate: (Configuration) => void;
  onDelete: (id: string) => void
};

export const ConfigPage: FunctionComponent<Props> = ({
  configuration,
  onClose,
  onUpdate,
  onDelete
}) => {

  return (
    <div>
      { configuration && (
        <>          
          <div>

            <TopBar title={configuration.name} onClose={onClose} >
              <ButtonMenu openSide="left" type={btnType.Secondary} text="...">                
                <DeleteModal 
                  render={(
                    <p>
                      Are you sure you want to delete this remote configuration?
                    </p>
                  )}
                  onDelete={() =>  { onDelete(configuration.id) }}
                />
              </ButtonMenu>
              <EditNameModal 
                defaultName={configuration.name}
                onSubmit={(name) => {
                  onUpdate({
                    ...configuration,
                    name
                  })
                }}
              />
              
              <ShareConfigurationModal config={configuration}/>
            </TopBar>         
          </div>

          <div className="pt-20 p-6">

            <div className="p-8">
              <p className="text-base text-gray-600 font-bold py-4">
                General
              </p>

              <div className="flex py-4 border-b">
                <p className="uppercase text-gray-600 text-base" style={{ minWidth: 300 }}>
                  CREATED
                </p>

                <p className="text-base">
                  { format(configuration.createdAt, "dd MMM yyyy") || ' ' }
                </p>
              </div>


              <div className="flex py-4 border-b">
                <p className="uppercase text-gray-600 text-base" style={{ minWidth: 300 }}>
                  ID
                </p>

                <p className="text-base">
                  { configuration.id || ' ' }
                </p>
              </div>

            </div>

            <div className="p-8">
              
              <p className="text-base text-gray-600 font-bold py-4">
                Configuration
              </p>

              {/* row */}
              <div className="flex justify-between items-center py-4 border-b">
                <div className="flex items-center">
                  <p className="text-gray-600 text-base uppercase" style={{ minWidth: 300 }}>
                    Camouflage
                  </p>                  
                  <p>
                    <span>{configuration.camouflage.visible ? 'Visible; ' : 'Hidden; '}</span>
                    <span>{configuration.camouflage.calculator && configuration.camouflage.change_name && 'all options available'}</span>
                    <span>{configuration.camouflage.calculator && !configuration.camouflage.change_name && 'calculator only'}</span>
                    <span>{!configuration.camouflage.calculator && configuration.camouflage.change_name && 'change name only'}</span>
                    <span>{!configuration.camouflage.calculator && !configuration.camouflage.change_name && 'disabled by default'}</span>
                  </p>
                </div>
                <div>
                  <EditCamouflageModal 
                    onSubmit={(camouflage) => {
                      onUpdate({
                        ...configuration,
                        camouflage
                      })
                    }}
                  />
                </div>

              </div>

              {/* row */}
              <div className="flex justify-between items-center py-4 border-b">
                <div className="flex items-center">
                  <p className="text-gray-600 text-base uppercase" style={{ minWidth: 300 }}>
                    Crash reports
                  </p>                  
                  <p>
                    <span>{configuration.crashReports.visible ? 'Visible; ' : 'Hidden; '}</span>
                    <span>{configuration.crashReports.enabled ? 'enabled by default' : 'disabled by default'}</span>
                  </p>
                </div>
                <div>
                  <EditCrashReportsModal 
                    onSubmit={(crashReports) => {
                      onUpdate({
                        ...configuration,
                        crashReports
                      })
                    }}
                  />
                </div>                
              </div>

              {/* row */}
              <div className="flex justify-between items-center py-4 border-b">
                <div className="flex items-center">
                  <p className="text-gray-600 text-base uppercase" style={{ minWidth: 300 }}>
                    Servers
                  </p>                  
                  <p>
                    <span>{configuration.serversVisible ? 'Visible' : 'Hidden'}</span>
                  </p>
                </div>
                <div>
                  <EditServersModal
                    onSubmit={(serverVisibility) => {
                      onUpdate({
                        ...configuration,
                        serversVisible: serverVisibility
                      })
                    }}
                  />
                </div>                
              </div>


            </div>
          </div>

          
        </>
      )}
       
    </div>
  )
}