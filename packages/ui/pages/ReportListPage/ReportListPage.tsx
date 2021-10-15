import {
  Dispatch,
  FormEvent,
  FunctionComponent,
  SetStateAction,
  useRef,
  useState,
} from "react";

import { MdOpenInNew } from "@react-icons/all-files/md/MdOpenInNew";
import { MdRemoveRedEye } from "@react-icons/all-files/md/MdRemoveRedEye";
import { MdSave } from "@react-icons/all-files/md/MdSave";
import { MdDelete } from "@react-icons/all-files/md/MdDelete";

import {
  ReportBar,
  Button,
  Table,
  ButtonMenu,
  ButtonOption,
  SearchInput,
} from "../..";
import { btnType } from "../../components/Button/Button";

import { MainLayout } from "../../layouts/MainLayout";

import { REPORT_COLUMNS } from "../../domain/ReportTableColumns";
import { ItemQuery } from "../../domain/ItemQuery";
import { Item } from "../../domain/Item";
import { Report } from "../../domain/Report";

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

  const openReport = () => {
    setCurrentReport(selectedReports[0]);
  };

  const search = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = searchInput.current.value;
    ({
      ...currentQuery,
      filter: {
        byName: name,
      },
    });
  };

  return (
    <MainLayout
      title="Reports"
      subtitle="All the files and reports sent by your users"
      content={
        <div>
          <div className="flex h-10 space-x-2 mb-2 p-2">
            {selectedReports.length === 0 && (
              <form onSubmit={search} className="flex">
                <SearchInput
                  ref={searchInput}
                  defaultValue={currentQuery.filter?.byName}
                />
              </form>
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
                  </>
                )}
                <Button
                  type={btnType.Secondary}
                  icon={<MdSave />}
                  onClick={(event: MouseEvent) =>
                    onDownload(selectedReports[0])
                  }
                  text="Download"
                />
                <ButtonMenu openSide="right">
                  <ButtonOption
                    icon={<MdDelete />}
                    text="Delete"
                    color="#D6933B"
                    onClick={() => onDelete(selectedReports)}
                  />
                </ButtonMenu>
              </>
            )}
          </div>
          <Table
            columns={REPORT_COLUMNS}
            data={reports}
            itemQuery={currentQuery}
            onSelection={setSelectedReports as Dispatch<SetStateAction<Item[]>>}
            onFetch={onQueryChange}
          />
        </div>
      }
      leftbar={sidebar}
      rightbar={<ReportBar report={currentReport} />}
      onClosePreview={() => setCurrentReport(undefined)}
      currentItem={currentReport}
    />
  );
};

ReportListPage.defaultProps = {
  reports: [],
};
