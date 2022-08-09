import { 
  useState, 
  ChangeEvent, 
  FormEvent, 
  FunctionComponent, 
  ReactNode, 
  useRef,
  Dispatch,
  SetStateAction
} from "react";
import { CreateConfigurationModal, SearchInput, Table, Button, ButtonMenu, ButtonOption } from "../../../ui/";
import { MainLayout } from "../../layouts/MainLayout";
import { ItemQuery } from "../../domain/ItemQuery";
import { Item } from "../../domain/Item";
import { Configuration } from "packages/state/domain/configuration";
import { CONFIGURATION_COLUMNS } from "../../domain/ConfigTableColumns";
import RemoteConfigIcon from '../../components/RemoteConfigIcon'
import { btnType } from '../../components/Button/Button'
import { MdOpenInNew, MdRemoveRedEye, MdSave } from "react-icons/md";
import { ShareConfigurationModal } from "packages/ui/modals/remoteConfiguration/ShareConfigurationModal/ShareConfigurationModal";
import { Can } from "common/casl/Can";
import { ENTITIES } from "common/casl/Ability";
import HoveredRowWrapper from "packages/ui/components/Table/HoveredRowWrapper";

interface Props {
  sidebar: ReactNode;
  onQueryChange: (iq: ItemQuery) => void;
  currentQuery: ItemQuery;
  onCreateConfig: (name: string) => void;
  configurations: Configuration[];
  onOpen: (config: Configuration) => void;
}

export const ConfigurationListPage: FunctionComponent<Props> = ({
  sidebar,
  onQueryChange,
  currentQuery,
  onCreateConfig,
  configurations,
  onOpen
}) => {

  const [currentConfig, setCurrentConfig] = useState<Configuration | undefined>();
  const [selectedConfigs, setSelectedConfigs] = useState<Configuration[]>([]);

  const openConfig = () => {
    setCurrentConfig(setSelectedConfigs[0]);
  };

  const searchInput = useRef<HTMLInputElement>();
   let searchTimeout = null


  const search = (e: FormEvent<HTMLFormElement> | ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const name = searchInput.current.value;

    onQueryChange({
      ...currentQuery,
      search: name
    })
  };
  
  return (
    <MainLayout 
      title="Configurations" 
      subtitle="Create and manage remote configurations"
      leftbar={sidebar}
      leftbarActive={true}
      content={
        <div>
          { selectedConfigs.length === 0 && (
            <div className="flex space-x-2 mb-2 p-2">
              <Can I='create' a={ENTITIES.RemoteConfigurations}>
                <CreateConfigurationModal 
                  onSubmit={onCreateConfig}
                />
              </Can>
              <div className="pl-2">
                <form onSubmit={search} className="flex">
                  <SearchInput
                    onChange={(e) => {
                      clearTimeout(searchTimeout)
                      searchTimeout = setTimeout(() => {
                        search(e)
                      }, 500)
                    }}
                    ref={searchInput}
                    defaultValue={currentQuery.search}
                  />
                </form>
              </div>
            </div>
          )}
          
          { selectedConfigs.length === 1 && (
            <div className="flex space-x-2 mb-2 p-2">
              <div className='pr-2 h-full'>
                <ShareConfigurationModal config={selectedConfigs[0]}/>
              </div>
              <div className='pr-2 h-full'>
                <Button
                  type={btnType.Secondary}
                  icon={<MdOpenInNew />}
                  text="Open"
                  onClick={(event: MouseEvent) => {
                    event.preventDefault();
                    onOpen(selectedConfigs[0]);
                  }}
                />
              </div>
            </div>
          )}


          <div>
            <Table
              columns={CONFIGURATION_COLUMNS}
              data={configurations}
              itemQuery={currentQuery}
              onSelection={setSelectedConfigs as Dispatch<SetStateAction<Item[]>>}
              onFetch={onQueryChange}
              icon={(
                <div style={{height: '24px', width: '24px'}}>
                  <RemoteConfigIcon/>
                </div>
              )}
              rowOptions={(hoverRow, isHoverSelected) => (
                <HoveredRowWrapper isHoverSelected={isHoverSelected}>
                  <>
                    <div className='pr-2'>
                      <ShareConfigurationModal config={hoverRow}/>
                    </div>
                    <ButtonMenu openSide="left" type={btnType.Secondary} text="...">
                      <ButtonOption
                        color='#8B8E8F'
                        icon={<MdOpenInNew />}
                        text="Open"
                        onClick={(event: MouseEvent) => {
                          event.preventDefault();
                          event.stopPropagation()
                          onOpen(hoverRow);
                        }}
                      />
                    </ButtonMenu>
                  </>
                </HoveredRowWrapper>
              )}
            />
          </div>
        </div>
      }
    />
  )
}