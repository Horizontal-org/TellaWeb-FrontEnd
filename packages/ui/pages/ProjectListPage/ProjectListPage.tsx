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
  DeleteModal
} from "../..";
import { btnType } from "../../components/Button/Button";

import { MainLayout } from "../../layouts/MainLayout";

import { REPORT_COLUMNS } from "../../domain/ReportTableColumns";
import { ItemQuery } from "../../domain/ItemQuery";
import { Item } from "../../domain/Item";
import { Report } from "../../domain/Report";
import { Can } from "common/casl/Can";
import { ENTITIES } from "common/casl/Ability";
import { Project } from "packages/state/domain/project";

type Props = {
  projects: Project[];
  onQueryChange: (iq: ItemQuery) => void;  
  sidebar: React.ReactNode;
  currentQuery: ItemQuery;
};

const voidFunction = () => {};

export const ProjectListPage: FunctionComponent<Props> = ({
  projects,
  onQueryChange,
  sidebar,
  currentQuery,
}) => {
  
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
          
        </div>
      }
      leftbar={sidebar}
      leftbarActive={true}
      rightbarActive={false}
    />
  );
};

ProjectListPage.defaultProps = {
  projects: [],
};
