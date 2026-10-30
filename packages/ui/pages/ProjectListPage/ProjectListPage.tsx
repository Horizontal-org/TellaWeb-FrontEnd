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
import { LayoutAbsoluteContent } from "packages/ui/components/LayoutAbsoluteContent/LayoutAbsoluteContent";
import { IoMdAdd } from "react-icons/io";

type Props = {
  projects: Project[];
  onQueryChange: (iq: ItemQuery) => void;
  sidebar: React.ReactNode;
  currentQuery: ItemQuery;
  onCreateProject: ({ name }) => void
  onOpen: (id: string) => void
  isLoading: boolean
};


export const ProjectListPage: FunctionComponent<React.PropsWithChildren<Props>> = ({
  projects = [],
  onQueryChange,
  sidebar,
  currentQuery,
  onCreateProject,
  onOpen,
  isLoading
}) => {

  const [open, handleOpen] = useState<boolean>(false)
  const searchInput = useRef<HTMLInputElement>(null);
  let searchTimeout = null

  const search = (e: FormEvent<HTMLFormElement> | ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const name = searchInput.current.value;

    onQueryChange({
      ...currentQuery,
      search: name,
      // A new search starts again from the first page
      pagination: { ...currentQuery.pagination, page: 0 }
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
            {projects.map((p) => (
              <div key={p.id} className='pt-4 pr-4' onClick={() => { onOpen(p.id) }}>
                <ProjectCard
                  data={p}
                />
              </div>
            ))}
          </div>
        </div>
      }
      absoluteContent={(projects.length === 0 && !isLoading) && (
        <LayoutAbsoluteContent>
          <div
            className="text-center flex-col flex justify-center items-center"
          >
            <p className='text-xl font-semibold'>
              You don’t have any projects yet.
            </p>
            <Can I='create' a={ENTITIES.Projects} passThrough>
              {({ isAllowed }) => isAllowed ? (
                <>
                  <p className='font-normal text-lg  py-2'>
                    Create your first project to get started.
                  </p>
                  <div className='py-4'>
                    <Button
                      text='NEW PROJECT'
                      icon={<IoMdAdd color='white' />}
                      onClick={() => {
                        handleOpen(true)
                      }}
                    />
                  </div>
                </>
              ) : (
                <p className='font-normal text-lg text-gray-500 py-2'>
                  Projects that you are invited to will appear here.
                </p>
              )}
            </Can>

          </div>
        </LayoutAbsoluteContent>
      )}
      leftbar={sidebar}
      leftbarActive={true}
      rightbarActive={false}
    />
  );
};

