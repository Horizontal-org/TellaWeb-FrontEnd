import { 
  FunctionComponent, 
  useState, 
  Dispatch, 
  SetStateAction, 
  useRef,
  FormEvent,
  ChangeEvent,
  PropsWithChildren
} from "react";
import {
  ButtonMenu,
  ButtonOption,
  SearchInput,
  DeleteModal,
  // CreateUserModal,
  UserBar,
} from "../..";
import { MainLayout } from "../../layouts/MainLayout";
import { User } from "packages/state/domain/user";
import { Item } from "../../domain/Item";
import { ItemQuery, Table, Button } from 'packages/ui'
import { btnType } from "../../components/Button/Button";
import { MdOpenInNew, MdRemoveRedEye, MdSave } from "react-icons/md";
import { MdPictureAsPdf } from "react-icons/md";
import { CreateUserModal } from '../../modals/user/CreateUserModal/CreateUserModal'
import { Can } from "common/casl/Can";
import { ENTITIES } from "common/casl/Ability";
import HoveredRowWrapper from "packages/ui/components/Table/HoveredRowWrapper";
import { Resource } from "packages/state/domain/resource";
import { CreateResourceModal } from "packages/ui/modals/resource/CreateResourceModal/CreateResourceModal";
import { RiDownload2Fill } from "react-icons/ri";

// @ts-nocheck
import { format } from "date-fns";
import { Column } from "react-table";
import { DeleteResourceModal } from "packages/ui/modals/resource/DeleteResourceModal/DeleteResourceModal";
import { ResourceBar } from "packages/ui/components/ResourceBar/ResourceBar";
import { PdfView } from "packages/ui/components/PdfView/PdfView";

type Props = {
  sidebar: React.ReactNode;  
  resources: Resource[];
  currentQuery: ItemQuery;
  // onOpen: (user: User) => void;
  onQueryChange: (iq: ItemQuery) => void;
  onDelete: (id: string) => void;
  onCreateUser: () => void;
  onDownload: (fileNames: string[]) => void
};


export const RESOURCE_COLUMNS: Column[] = [
  {
    Header: "Title",
    headerKey: 'resource.title',
    accessor: (resource: Resource): string => resource.title,
    className: "px-3 py-3 w-40 font-semibold",
  },
  {
    Header: "Date created",
    headerKey: 'user.createdAt',
    className: "px-3 py-3 w-40",
    id: "date",
    accessor: (resource: Resource): string => format(new Date(resource.createdAt), "dd MMM yyyy"),
  }
];


export const ResourceListPage: FunctionComponent<React.PropsWithChildren<Props>> = ({
  sidebar,
  currentQuery,
  onQueryChange,
  resources,
  onCreateUser,
  // onOpen,
  onDelete,
  onDownload
}) => {

  const [currentResource, setCurrentResource] = useState<Resource | undefined>();
  const [openViewer, handleViewer] = useState<boolean>(false)

  console.log("🚀 ~ file: ResourceListPage.tsx:81 ~ currentResource:", currentResource)
  const [selectedResources, setSelectedResources] = useState<Resource[]>([]);
  console.log("🚀 ~ file: ResourceListPage.tsx:83 ~ selectedResources:", selectedResources)
  
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
      title="Resources"
      subtitle="Manage all the resources available in your space"
      onClosePreview={() => setCurrentResource(undefined)}
      rightbarActive={true}
      rightbar={<ResourceBar resource={currentResource}/>}
      leftbar={sidebar}      
      leftbarActive={true}
      currentItem={currentResource}
      content={
        <div>
          <div 
            className="flex space-x-2 mb-2 p-2"
          >

            <PdfView 
              isOpen={openViewer}
              fileName={currentResource ? currentResource.fileName : ''}
              handleIsOpen={() => {
                handleViewer(false)
              }}
            />


            {selectedResources.length === 0 && (
              <>
                <Can I='create' a={ENTITIES.Resources}>
                  <CreateResourceModal 
                    onSubmit={onCreateUser}
                  />
                </Can>

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
              </>
            )}

            {selectedResources.length === 1 && (
              <>
                <div className='flex'>
                  <div className='pr-2 h-full'>
                    <Button
                      icon={<MdRemoveRedEye />}
                      text="Preview"
                      onClick={(event: MouseEvent) => {
                        event.preventDefault();
                        setCurrentResource(selectedResources[0]);
                      }}
                    />
                  </div>
                  <Button
                    type={btnType.Secondary}
                    icon={<RiDownload2Fill />}
                    text="Download"
                    onClick={() => {                       
                      onDownload([selectedResources[0].fileName])
                    }}
                  />              
                </div>
                <ButtonMenu openSide="right">
                  <Can I='delete' a={ENTITIES.Resources}>
                    <DeleteResourceModal 
                      onSubmit={() => { 
                        onDelete(selectedResources[0].id)
                      }}                      
                    />                    
                  </Can>
                </ButtonMenu>
              </>                                  
            )}         

            {selectedResources.length > 1 && (
              <>
                <div className='flex'>         
                  <Button
                    type={btnType.Secondary}
                    icon={<RiDownload2Fill />}
                    text="Download"
                    onClick={() => { 
                      onDownload(selectedResources.map(f => f.fileName))
                    }}
                  />              
                </div>                
              </>                                  
            )}                
           
          </div>
          <div>
            <Table
              columns={RESOURCE_COLUMNS}
              data={resources}
              itemQuery={currentQuery}
              onSelection={setSelectedResources as Dispatch<SetStateAction<Item[]>>}
              onFetch={onQueryChange}
              icon={<MdPictureAsPdf/>}
              rowOptions={(hoverRow, isHoverSelected) => (
                <HoveredRowWrapper isHoverSelected={isHoverSelected}>
                  <>
                    <div className='pr-2'>
                      <Button
                        icon={<MdOpenInNew />}
                        text="Open"
                        onClick={(event: MouseEvent) => {
                          event.preventDefault();
                          event.stopPropagation()
                          // onOpen(hoverRow);
                          setCurrentResource(hoverRow);
                          handleViewer(true)
                        }}
                      />
                    </div>
                    <ButtonMenu openSide="left" type={btnType.Secondary} text="...">
                      <ButtonOption
                        icon={<MdRemoveRedEye />}
                        color='#8B8E8F'
                        text="Preview"
                        onClick={(e: ChangeEvent) => {
                          e.stopPropagation()
                          setCurrentResource(hoverRow);
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
  );
};
