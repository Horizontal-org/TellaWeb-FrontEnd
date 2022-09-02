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
  Button,
  SearchInput,
} from "../..";

import { MainLayout } from "../../layouts/MainLayout";
import { ItemQuery } from "../../domain/ItemQuery";
import { Can } from "common/casl/Can";
import { ENTITIES } from "common/casl/Ability";
import { Project } from "packages/state/domain/project";
import { CreateProjectModal } from '../../modals/project/CreateProjectModal/CreateProjectModal'
import ProjectCard from "packages/ui/components/ProjectCard/ProjectCard";

type Props = {
  projects: Project[];
  onQueryChange: (iq: ItemQuery) => void;  
  sidebar: React.ReactNode;
  currentQuery: ItemQuery;
  onCreateProject: ({name: string}) => void
  onOpen: (id: string) => void
};


export const ProjectListPage: FunctionComponent<React.PropsWithChildren<Props>> = ({
  projects,
  onQueryChange,
  sidebar,
  currentQuery,
  onCreateProject,
  onOpen
}) => {

  const [open, handleOpen] = useState<boolean>(false)
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
      title="Projects"
      subtitle="Organise all files and reports into folders"
      content={
        <div>
          <div className="flex space-x-2 mb-2 p-2">    
            <>
              <Can I='create' a={ENTITIES.Projects}>
                <CreateProjectModal                  
                  open={open}
                  onClose={() => { handleOpen(false) }}
                  existingNames={projects.map(p => p.name)}
                  onSubmit={(newProject) => {
                    handleOpen(false)
                    onCreateProject(newProject)
                  }}
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
          </div>
                    

          <div className="py-4 flex flex-wrap ">
              { projects.map((p) => (
                <div key={p.id} className='pt-4 pr-4' onClick={() => { onOpen(p.id) }}>
                  <ProjectCard 
                    data={p}                
                  />
                </div>
              ))}
          </div>
        </div>
      }
      absoluteContent={ projects.length === 0 && (
        <div 
          className="flex text-sm justify-center w-full p-6" 
          style={{ 
            position: 'absolute', 
            bottom: 'calc(50% - 50px)',
            marginLeft: '-60px'
          }}
        >          
          <div 
            className="py-8 px-12 border rounded border-gray-100"
          >

            <p className='text-xxxl text-gray-600 font-bold'>
              No projects
            </p>
            <p className='py-2 font-normal text-sm text-gray-500'>
              There are currently no projects. Get started by creating your first project.
            </p>
            
            <div className='py-4'>
              <Button 
                text='CREATE PROJECT'
                full={true}
                onClick={() => {
                  handleOpen(true)
                }}
              />
            </div>
          </div>
        </div>
      )}
      leftbar={sidebar}
      leftbarActive={true}
      rightbarActive={false}
    />
  );
};

ProjectListPage.defaultProps = {
  projects: [],
};
