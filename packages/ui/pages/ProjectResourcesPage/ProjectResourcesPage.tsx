import {
  Dispatch,
  FormEvent,
  FunctionComponent,
  SetStateAction,
  useRef,
  useState,
  ChangeEvent,
  useEffect
} from "react";
import { MdOpenInNew, MdRemoveRedEye, MdSave } from "react-icons/md";
import {
  ReportBar,
  Button,
  Table,
  ButtonMenu,
  ButtonOption,
  SearchInput,
  DeleteModal,
  UserBar
} from "../..";
import { btnType } from "../../components/Button/Button";
import { MdPictureAsPdf } from "react-icons/md";
import { MainLayout } from "../../layouts/MainLayout";

import { REPORT_COLUMNS } from "../../domain/ReportTableColumns";
import { ItemQuery } from "../../domain/ItemQuery";
import { Item } from "../../domain/Item";
import { Report } from "../../domain/Report";
import { Project } from "packages/state/domain/project";
import HoveredRowWrapper from "packages/ui/components/Table/HoveredRowWrapper";
import { Can } from "common/casl/Can";
import { ENTITIES } from "common/casl/Ability";
import { User } from "packages/state/domain/user";
import { ManageUsersProjectModal } from "packages/ui/modals/project/ManageUsersProjectModal/ManageUsersProjectModal";
import { USER_COLUMNS } from "packages/ui/domain/UserTableColumns";
import { BsPerson } from "react-icons/bs";
import { Resource } from "packages/state/domain/resource";
import { RESOURCE_COLUMNS } from "../ResourceListPage/ResourceListPage";
import { ManageResourcesProjectModal } from "packages/ui/modals/project/ManageResourcesProjectModal/ManageResourcesProjectModal";

type Props = {
  project: Project
  resources: Resource[];
  onQueryChange: (iq: ItemQuery) => void;
  onOpen: (resource: Resource) => void;
  onAddResources: (newResources:  string[]) => void;
  sidebar: React.ReactNode;
  currentQuery: ItemQuery;
  removeSelected: (selectedResources: string[]) => void;
};

export const ProjectResourcesPage: FunctionComponent<React.PropsWithChildren<Props>> = ({
  project,
  onOpen,
  onQueryChange,
  onAddResources,
  resources,
  sidebar,
  currentQuery,
  removeSelected
}) => {
  console.log("🚀 ~ file: ProjectResourcesPage.tsx:63 ~ resources:", resources)
  const [currentResource, setCurrentResource] = useState<Resource | undefined>();
  const [selectedResources, setSelectedResources] = useState<Resource[]>([]);

  const openUser = () => {
    setCurrentResource(selectedResources[0]);
  };


  return (
    <MainLayout
      title={project.name}
      subtitle="Manage the project's resources"
      content={
        <div>
          <div className="flex space-x-2 mb-2 p-2">
            {selectedResources.length === 0 && (
              <>
                <ManageResourcesProjectModal 
                  onSubmit={(newResources) => {
                    onAddResources(newResources)
                  }}
                  resourceList={resources}
                />
              </>
            )}

            {selectedResources.length > 0 && (
              <>
                {selectedResources.length === 1 && (
                  <>                   
                    <Button
                      type={btnType.Secondary}
                      icon={<MdRemoveRedEye />}
                      text="Preview"
                      onClick={openUser}
                    />                    
                  </>
                )}             
                <Button
                  type={btnType.Secondary}
                  text="Remove from project"
                  onClick={() => {
                    removeSelected(selectedResources.map(su => su.id))
                  }}
                />         
              </>
            )}
          </div>
          <Table
            columns={RESOURCE_COLUMNS}
            data={resources}
            withPagination={false}
            itemQuery={currentQuery}
            onSelection={setSelectedResources as Dispatch<SetStateAction<Item[]>>}
            onFetch={onQueryChange}
            icon={<MdPictureAsPdf/>}
            rowOptions={(hoveredRow, isHoverSelected) => (
              <HoveredRowWrapper isHoverSelected={isHoverSelected}>
                <>
                  <div className="px-2">
                    <Button
                      type={btnType.Secondary}
                      icon={<MdRemoveRedEye />}
                      text="Preview"
                      onClick={(e: ChangeEvent) => {
                        e.stopPropagation()
                        setCurrentResource(hoveredRow);
                      }}
                    />
                  </div>
                  <ButtonMenu openSide="left" type={btnType.Secondary} text="...">
                    {/* <ButtonOption
                      icon={<MdSave />}
                      onClick={(event: MouseEvent) => {
                        event.stopPropagation()
                        onDownload(hoveredRow)
                      }}
                      text="Download"
                      color='#8B8E8F'
                    /> */}
                  </ButtonMenu>
                </>
              </HoveredRowWrapper>
            )}
          />
        </div>
      }
      leftbar={sidebar}
      leftbarActive={true}
      rightbarActive={false}
      onClosePreview={() => setCurrentResource(undefined)}
      currentItem={currentResource}
    />
  );
};

ProjectResourcesPage.defaultProps = {
  resources: [],
};
