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

type Props = {
  reports: Report[];
  onQueryChange: (iq: ItemQuery) => void;
  onDelete: (reports: Report[]) => void;
  onOpen: (report: Report) => void;
  onDownload?: (report: Report) => void;
  sidebar: React.ReactNode;
  currentQuery: ItemQuery;
};

const voidFunction = () => {};

export const ReportListPage: FunctionComponent<Props> = ({
  reports,
  onDelete,
  onOpen,
  onDownload = voidFunction,
  onQueryChange,
  sidebar,
  currentQuery,
}) => {
  const [currentReport, setCurrentReport] = useState<Report | undefined>();
  const [selectedReports, setSelectedReports] = useState<Report[]>([]);

  const searchInput = useRef<HTMLInputElement>();
  let searchTimeout = null

  const openReport = () => {
    setCurrentReport(selectedReports[0]);
  };

  const search = (e: FormEvent<HTMLFormElement> | ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const name = searchInput.current.value;

    onQueryChange({
      ...currentQuery,
      search: name
    })
  };

  console.log(reports)

  return (
    <MainLayout
      title="Reports"
      subtitle="All the files and reports sent by your users"
      content={
        <div>
          <div className="flex space-x-2 mb-2 p-2">
            {selectedReports.length === 0 && (
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
          <Table
            columns={REPORT_COLUMNS}
            data={reports}
            itemQuery={currentQuery}
            onSelection={setSelectedReports as Dispatch<SetStateAction<Item[]>>}
            onFetch={onQueryChange}
            rowOptions={(hoveredRow) => (
              <>
                <Button
                  type={btnType.Secondary}
                  icon={<MdRemoveRedEye />}
                  text="Preview"
                  onClick={(e: ChangeEvent) => {
                    e.stopPropagation()
                    setCurrentReport(hoveredRow);
                  }}
                />
                <div className="px-2">
                  <Button
                    type={btnType.Secondary}
                    icon={<MdSave />}
                    onClick={(event: MouseEvent) => {
                      event.stopPropagation()
                      onDownload(hoveredRow)
                    }}
                    text="Download"
                  />
                </div>
                <Can I='delete' a={ENTITIES.Reports}>
                  <ButtonMenu openSide="left" type={btnType.Secondary} text="...">
                    <DeleteModal 
                      render={(
                        <p>
                          the selected reports will be permanently deleted.
                        </p>
                      )}
                      onDelete={() => onDelete([hoveredRow])}
                    />  
                  </ButtonMenu>
                </Can>
              </>
            )}
          />
        </div>
      }
      leftbar={sidebar}
      leftbarActive={true}
      rightbar={<ReportBar report={currentReport} />}
      rightbarActive={true}
      onClosePreview={() => setCurrentReport(undefined)}
      currentItem={currentReport}
    />
  );
};

ReportListPage.defaultProps = {
  reports: [],
};
