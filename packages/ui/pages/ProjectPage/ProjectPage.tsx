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
import { MdOpenInNew, MdRemoveRedEye, MdSave, MdSettings } from "react-icons/md";
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
import HoveredRowWrapper from "packages/ui/components/Table/HoveredRowWrapper";
import { Can } from "common/casl/Can";
import { ENTITIES } from "common/casl/Ability";
import { LayoutAbsoluteContent } from "packages/ui/components/LayoutAbsoluteContent/LayoutAbsoluteContent";
import { useRouter } from "next/router";

type Props = {
  project: Project
  reports: Report[];
  onQueryChange: (iq: ItemQuery) => void;
  onOpen: (report: Report) => void;
  onDownload?: (report: Report) => void;
  onDelete: (reports: Report[]) => void;
  sidebar: React.ReactNode;
  currentQuery: ItemQuery;
  isLoading?: boolean;
};

const voidFunction = () => { };

export const ProjectPage: FunctionComponent<React.PropsWithChildren<Props>> = ({
  reports = [],
  project,
  onOpen,
  onDownload = voidFunction,
  onDelete,
  onQueryChange,
  sidebar,
  currentQuery,
  isLoading,
}) => {
  const [currentReport, setCurrentReport] = useState<Report | undefined>();
  const [selectedReports, setSelectedReports] = useState<Report[]>([]);

  const { push } = useRouter();

  const searchInput = useRef<HTMLInputElement>(null);
  let searchTimeout = null

  const openReport = () => {
    setCurrentReport(selectedReports[0]);
  };

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
      title={project.name}
      subtitle="All the files and reports sent by your users"
      content={
        <div>
          <div className="flex space-x-2 mb-2 p-2">
            {selectedReports.length === 0 && (
              <>
                <form onSubmit={search} className="flex">
                  <SearchInput
                    onChange={(e) => {
                      //TODO change this
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
            {selectedReports.length > 0 && (
              <>
                {selectedReports.length === 1 && (
                  <>
                    <Button
                      icon={<MdOpenInNew />}
                      text="Open"
                      onClick={(event: MouseEvent) => {
                        event.preventDefault();
                        onOpen(selectedReports[0]);
                      }}
                    />
                    <Button
                      type={btnType.Secondary}
                      icon={<MdRemoveRedEye />}
                      text="Preview"
                      onClick={openReport}
                    />
                    <Button
                      type={btnType.Secondary}
                      icon={<MdSave />}
                      onClick={(event: MouseEvent) =>
                        onDownload(selectedReports[0])
                      }
                      text="Download"
                    />
                  </>
                )}
                <Can I='delete' a={ENTITIES.Reports}>
                  <ButtonMenu openSide="right" type={btnType.Secondary} text="...">
                    <DeleteModal
                      render={(
                        <p>
                          the selected reports will be permanently deleted.
                        </p>
                      )}
                      onDelete={() => onDelete(selectedReports)}
                    />
                  </ButtonMenu>
                </Can>
              </>
            )}
          </div>
          {(reports.length > 0 || isLoading) && (
            <Table
              loading={isLoading}
              columns={REPORT_COLUMNS}
              data={reports}
              withPagination={true}
              itemQuery={currentQuery}
              onSelection={setSelectedReports as Dispatch<SetStateAction<Item[]>>}
              onFetch={onQueryChange}
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
                          setCurrentReport(hoveredRow);
                        }}
                      />
                    </div>
                    <ButtonMenu openSide="left" type={btnType.Secondary} text="...">
                      <ButtonOption
                        icon={<MdSave />}
                        onClick={(event: MouseEvent) => {
                          event.stopPropagation()
                          onDownload(hoveredRow)
                        }}
                        text="Download"
                        color='#8B8E8F'
                      />
                      <Can I='delete' a={ENTITIES.Reports}>
                        <DeleteModal
                          render={(
                            <p>
                              the selected reports will be permanently deleted.
                            </p>
                          )}
                          onDelete={() => onDelete([hoveredRow])}
                        />
                      </Can>
                    </ButtonMenu>
                  </>
                </HoveredRowWrapper>
              )}
            />
          )}
        </div>
      }
      leftbar={sidebar}
      leftbarActive={true}
      rightbar={<ReportBar report={currentReport} />}
      rightbarActive={true}
      onClosePreview={() => setCurrentReport(undefined)}
      currentItem={currentReport}
      absoluteContent={(reports.length === 0 && !isLoading) && (
        <LayoutAbsoluteContent>
          <div
            className="text-center flex-col flex justify-center items-center"
          >
            <Can I='create' a={ENTITIES.Projects} passThrough>
              {({ isAllowed }) => isAllowed ? (
                <>
                  <p className='text-xl font-semibold'>
                    No reports yet! Reports will appear here once users submit them.
                  </p>
                  <div className='pt-8'>
                    <p className='font-bold text-lg'>
                      To get started:
                    </p>
                    <p className='font-normal text-lg'>
                      1. Go to project settings
                    </p>
                    <p className='font-normal text-lg'>
                      2. Assign users to the project
                    </p>
                    <p className='font-normal text-lg'>
                      3. Share the project URL for users to connect to on Tella mobile.
                    </p>

                    <div className='pt-8 pb-4 flex justify-center'>
                      <Button
                        text='PROJECT SETTINGS'
                        icon={<MdSettings color='white' />}
                        onClick={() => {
                          push(`/project/${project.id}/settings`)
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className='text-xl font-semibold'>
                    No reports yet!
                  </p>
                  <p className='font-normal text-lg py-4'>
                    Reports will appear here once users submit them.
                  </p>

                </>
              )}
            </Can>
            <div>
              <a
                className="text-blue-400 text-lg underline font-bold"
                href="https://tella.app/tella-web#get-people-on-the-ground-ready-to-start-submitting-reports"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn about submitting reports
              </a>
            </div>

          </div>
        </LayoutAbsoluteContent>
      )}
    />
  );
};

