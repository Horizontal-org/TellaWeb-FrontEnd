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
import { MdDelete, MdOpenInNew, MdRemoveRedEye, MdSave } from "react-icons/md";
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
import { ResourceBar } from "packages/ui/components/ResourceBar/ResourceBar";
import { PdfView } from "packages/ui/components/PdfView/PdfView";
import { LayoutAbsoluteContent } from "packages/ui/components/LayoutAbsoluteContent/LayoutAbsoluteContent";

type Props = {
  project: Project
  // One page of the project's resources, as returned by the server
  resources: Resource[];
  // Every resource of the project, so the add modal can leave them out
  projectResources: Resource[];
  onQueryChange: (iq: ItemQuery) => void;
  onOpen: (resource: Resource) => void;
  onAddResources: (newResources: string[]) => void;
  sidebar: React.ReactNode;
  currentQuery: ItemQuery;
  removeSelected: (selectedResources: string[]) => void;
  isLoading: boolean
};

export const ProjectResourcesPage: FunctionComponent<React.PropsWithChildren<Props>> = ({
  project,
  onOpen,
  onQueryChange,
  onAddResources,
  resources = [],
  projectResources = [],
  sidebar,
  currentQuery,
  removeSelected,
  isLoading
}) => {
  const [currentResource, setCurrentResource] = useState<Resource | undefined>();
  const [openViewer, handleViewer] = useState<boolean>(false)

  const [selectedResources, setSelectedResources] = useState<Resource[]>([]);

  const openUser = () => {
    setCurrentResource(selectedResources[0]);
  };

  return (
    <MainLayout
      title={"Project resources"}
      subtitle={`Manage resources available in the project “${project.name}”`}
      content={
        <div>


          <PdfView
            isOpen={openViewer}
            fileName={currentResource ? currentResource.fileName : ''}
            handleIsOpen={() => {
              handleViewer(false)
            }}
          />

          <div className="flex space-x-2 mb-2 p-2">
            {selectedResources.length === 0 && (
              <>
                <Can I='attach' a={ENTITIES.Resources}>
                  <ManageResourcesProjectModal
                    onSubmit={(newResources) => {
                      onAddResources(newResources)
                    }}
                    resourceList={projectResources}
                  />
                </Can>
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

                <Can I='attach' a={ENTITIES.Resources}>
                  <div className="rounded-sm overflow-hidden border border-gray-100">
                    <ButtonOption
                      icon={<MdDelete />}
                      color="#DC2626"
                      text="Remove from project"
                      onClick={() => {
                        removeSelected(selectedResources.map(su => su.id))
                        setSelectedResources([])
                      }}
                    />
                  </div>
                </Can>
              </>
            )}
          </div>
          {(projectResources.length > 0) && (
            <Table
              columns={RESOURCE_COLUMNS}
              data={resources}
              withPagination={true}
              itemQuery={currentQuery}
              onSelection={setSelectedResources as Dispatch<SetStateAction<Item[]>>}
              onFetch={onQueryChange}
              icon={<MdPictureAsPdf />}
              rowOptions={(hoveredRow, isHoverSelected) => (
                <HoveredRowWrapper isHoverSelected={isHoverSelected}>
                  <>
                    <div className="px-2">
                      <Button
                        icon={<MdOpenInNew />}
                        text="Open"
                        onClick={(event: MouseEvent) => {
                          event.preventDefault();
                          event.stopPropagation()
                          setCurrentResource(hoveredRow);
                          handleViewer(true)
                        }}
                      />
                    </div>

                  </>
                </HoveredRowWrapper>
              )}
            />

          )}
        </div>
      }
      leftbar={sidebar}
      leftbarActive={true}
      rightbarActive={true}
      absoluteContent={(projectResources.length === 0 && !isLoading) && (
        <LayoutAbsoluteContent>
          <div
            className="text-center flex-col flex justify-center items-center"
          >

            <p className='text-xl font-semibold'>
              This project does not have any resources yet.
            </p>
            <Can I='attach' a={ENTITIES.Projects} passThrough>
              {({ isAllowed }) => isAllowed ? (
                <>
                  <p className='font-normal text-lg py-2'>
                    Add your first resource to get started.
                  </p>
                  <div className='py-4'>
                    <ManageResourcesProjectModal
                      onSubmit={(newResources) => {
                        onAddResources(newResources)
                      }}
                      resourceList={projectResources}
                    />
                  </div>
                </>
              ) : (
                <p className='font-normal text-lg text-gray-500 py-2'>
                  Resources that are added to this project will appear here.
                </p>
              )}
            </Can>

          </div>
        </LayoutAbsoluteContent>
      )}
      rightbar={<ResourceBar resource={currentResource} />}
      onClosePreview={() => setCurrentResource(undefined)}
      currentItem={currentResource}
    />
  );
};

