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
import {
  ReportBar,
  Button,
  Table,
  ButtonMenu,
  ButtonOption,
  SearchInput,
  DeleteModal
} from "../..";
import { btnType } from "../../components/Button/Button";
import { MainLayout } from "../../layouts/MainLayout";

import { REPORT_COLUMNS } from "../../domain/ReportTableColumns";
import { ItemQuery } from "../../domain/ItemQuery";
import { Item } from "../../domain/Item";
import { Report } from "../../domain/Report";
import { Project } from "packages/state/domain/project";
import { format } from "date-fns";
import { useToast } from "components/ToastWrapper";
import { RenameProjectModal } from "packages/ui/modals/project/RenameProjectModal/RenameProjectModal";
import { DeleteProjectModal } from "packages/ui/modals/project/DeleteProjectModal/DeleteProjectModal";
import { ManageUsersProjectModal } from "packages/ui/modals/project/ManageUsersProjectModal/ManageUsersProjectModal";
import { EditUrlProjectModal } from "packages/ui/modals/project/EditUrlProjectModal/EditUrlProjectModal";
import { Can } from "common/casl/Can";
import { ENTITIES } from "common/casl/Ability";

type Props = {
  project: Project
  onRename: (name: string) => void;
  onEdit: ({}) => void
  onDelete: () => void;
  onManage: (entity: string) => void;
  sidebar: React.ReactNode;
};

const voidFunction = () => {};

export const ProjectSettingsPage: FunctionComponent<React.PropsWithChildren<Props>> = ({
  project,  
  sidebar,
  onRename,
  onDelete,
  onManage,
  onEdit
}) => {
  const [currentReport, setCurrentReport] = useState<Report | undefined>();
  const [domain, handleDomain] = useState<string>('')
  const [createdAt, handleCreatedAt] = useState<Date>()
  const handleToast = useToast()

  useEffect(() => {
    handleDomain(window.location.origin)
    handleCreatedAt(new Date(project.createdAt))
  }, [])

  return (
    <MainLayout
      title={project.name}
      subtitle="Manage your project settings"
      content={
        <div className='p-8'>

          <p className="text-base text-gray-600 font-bold py-4">
            General
          </p>

          <div className="flex justify-between items-center py-4 border-b">
            <div className="flex items-center">
              <p className="text-gray-600 text-base uppercase" style={{ minWidth: 300 }}>
                Name
              </p>                  
              <p>
                <span>{project.name}</span>
              </p>              
            </div>
            <div>
              <RenameProjectModal
                currentName={project.name}
                onSubmit={(newName) => {
                  onRename(newName)
                }}
              />                        
            </div>                
          </div>
          <div className="flex justify-between items-center py-4 border-b">
            <div className="flex items-center">
              <p className="text-gray-600 text-base uppercase" style={{ minWidth: 300 }}>
                Created
              </p>                  
              <p>
                <span>{createdAt ? format(createdAt, "dd MMM yyyy") : null}</span>
              </p>
            </div>
            <div>
              <p>
                
              </p>                               
            </div>                
          </div>
          <div className="flex justify-between items-center py-4 border-b">
            <div className="flex items-center">
              <p className="text-gray-600 text-base uppercase" style={{ minWidth: 300 }}>
                url
              </p>             
              <div>
                <div
                  style={{ maxWidth: '100%'}}
                  className="overflow-ellipsis overflow-hidden whitespace-nowrap pr-8"
                >
                  {project.url  ? project.url : 'No URL set'}
                </div>
             
              </div>     
            </div>
            <div className="flex items-center">
              <Button 
                type={btnType.Secondary}
                text='COPY'
                onClick={() => {
                  navigator.clipboard.writeText(`${project.url || ''}`)
                  handleToast('URL copied to clipboard')
                }}
              />
              <div className="pl-2">
                <EditUrlProjectModal
                  currentUrl={project.slug}
                  onSubmit={(newUrl) => {
                    onEdit({ slug: newUrl })
                  }}
                />
              </div>
            </div>                
          </div>


          <div className="pt-4">
            <p className="text-base text-gray-600 font-bold py-4">
              Manage access
            </p>

            <Can I='read' a={ENTITIES.Users}>
              <div className="flex justify-between items-center py-4 border-b">
                <div className="flex items-center">
                  <p className="text-gray-600 text-base uppercase" style={{ minWidth: 300 }}>
                    Manage users
                  </p>                  
                  <p>
                    
                  </p>
                </div>
                <div>
                  <Button 
                    type={btnType.Secondary}
                    text='MANAGE'
                    onClick={() => {onManage('users')}}  
                  />
                </div>                
              </div>            
            </Can>
            <div className="flex justify-between items-center py-4 border-b">
              <div className="flex items-center">
                <p className="text-gray-600 text-base uppercase" style={{ minWidth: 300 }}>
                  Manage resources
                </p>                  
                <p>
                  
                </p>
              </div>
              <div>
                <Button 
                  type={btnType.Secondary}
                  text='MANAGE'
                  onClick={() => {onManage('resources')}}  
                />
              </div>                
            </div>                      
          </div>


          <div className="pt-4">
            <p className="text-base text-gray-600 font-bold py-4">
              Danger zone 
            </p>

            <div className="flex justify-between items-center py-4 border-b">
              <div className="flex items-center">
                <p className="text-gray-600 text-base uppercase" style={{ minWidth: 300 }}>
                  Delete project
                </p>                  
                <p>
                  
                </p>
              </div>
              <div>
                <DeleteProjectModal
                  currentName={project.name}
                  onSubmit={onDelete}
                />                              
              </div>                
            </div>
          </div>

        </div>
      }
      leftbar={sidebar}
      leftbarActive={false}    
      rightbarActive={false}
      onClosePreview={() => setCurrentReport(undefined)}
      currentItem={currentReport}
    />
  );
};
