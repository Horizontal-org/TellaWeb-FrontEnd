import { FunctionComponent, useRef, useState, useEffect, SetStateAction } from "react";
import cn from "classnames";
import { MdInfoOutline, MdSave, MdRemoveRedEye } from "react-icons/md";
import { BsArrowsAngleExpand } from "react-icons/bs";

import { Report, IReportFile } from "../../domain";
import {
  ReportInformation,
  Thumbnail,
  Button,
  SliderControl,
  ButtonMenu,
  ButtonOption,
  TopBar,
  ToggleButtonsBar,
  MainContent,
  LeftCollapsingSidebar,
  FileView,
  Paginator,
  EditReportTitleModal,
  DeleteModal
} from "../..";
import { btnType } from "../../components/Button/Button";
import { ButtonPopup } from "../../components/ButtonPopup/ButtonPopup";
import { Can } from "common/casl/Can";
import { ENTITIES } from "common/casl/Ability";
import useWindowDimensions from "packages/ui/hooks/useWindowDimensions";

type Props = {
  report: Report;
  onDeleteReport: (report: Report) => void;
  onDeleteFile: (report: Report, file: IReportFile) => void;
  onDownloadFile: (file: IReportFile) => void;
  onClose: () => void;
  onEditTitle: (title: string) => void
};

export const ReportPage: FunctionComponent<Props> = ({
  report,
  onDeleteReport,
  onDeleteFile,
  onDownloadFile,
  onClose,
  onEditTitle
}) => {
  const [leftSidebarOpen, changeLeftSidebarOpenStatus] = useState(true);
  const [rightSidebarOpen, changeRightSidebarOpenStatus] = useState(true);
  const [compact, handleCompact] = useState(false)
  const [current, setCurrent] = useState(1);
  const { height, width } = useWindowDimensions()

  const goNext = () => {
    if (current === report.files.length) {
      setCurrent(1);
      return;
    }
    setCurrent(current + 1);
  };

  const goPrev = () => {
    if (current === 1) {
      setCurrent(report.files.length);
      return;
    }
    setCurrent(current - 1);
  };

  useEffect(() => {
    onScreenResize()
  }, [width, leftSidebarOpen, rightSidebarOpen]);

  const onScreenResize = () => {
    if (width <= 1200 && leftSidebarOpen && rightSidebarOpen && !compact) {
      handleCompact(true)
    } 
    if (compact && (width > 1200 || !leftSidebarOpen || !rightSidebarOpen)) {
      handleCompact(false)
    }  
  }

  const toggleLeftSideBar = () => changeLeftSidebarOpenStatus(!leftSidebarOpen)
  const toggleRightSideBar = () => changeRightSidebarOpenStatus(!rightSidebarOpen);

  return (
    <div className="flex flex-grow min-h-screen">
      <LeftCollapsingSidebar collapsed={!leftSidebarOpen}>
        <ReportInformation report={report} />
        <div className="grid grid-cols-2 gap-2 mt-6">
          {report.files.map((file, index) => {
            return (
              <Thumbnail 
                file={file} 
                selected={index == (current - 1)}
                key={file.src.toString()}
                onClick={() => {
                  setCurrent(index + 1)
                }} 
              />
            )
          })}
        </div>
      </LeftCollapsingSidebar>

      <div
        className={cn(
          "flex flex-col flex-1 pt-20 transition-all duration-300 ease-in-out",
          {
            "transform ml-64": leftSidebarOpen,
            "transform mr-64": rightSidebarOpen,
          }
        )}
      >
        <ToggleButtonsBar
          leftToggle={toggleLeftSideBar}
          rightToggle={toggleRightSideBar}
        >
          { report.files.length > 0 && (
            <div className="flex-1 flex space-x-2 mb-2 px-4 py-2">
              <Button
                type={btnType.Secondary}
                icon={<MdInfoOutline />}
                text="File Information"
              />
              { !compact && (
                <Button
                  type={btnType.Secondary}
                  icon={<MdSave />}
                  text="Download file"
                  onClick={() => {
                    onDownloadFile(report.files[current - 1])
                  }}
                />
              )}
              <ButtonMenu openSide="right" type={btnType.Secondary} text="...">         
                { compact && (
                  <ButtonOption
                    text="Download file"
                    icon={<MdSave />}
                    onClick={() => { 
                      onDownloadFile(report.files[current - 1])

                    }}
                    color='#8B8E8F'
                  />
                )}       
                <DeleteModal 
                  render={(
                    <p>
                      {report.files[current - 1].fileName} will be permanently deleted.
                    </p>
                  )}
                  onDelete={() => onDeleteFile(report, report.files[current - 1])}
                />                              
              </ButtonMenu>
            </div>
          )}          
          { report.files.length > 0 && (
            <div className="flex space-x-4 mb-2 px-4 py-2 items-center">
              <Button type={btnType.Secondary} icon={<BsArrowsAngleExpand />} />
              <div >
                <Paginator 
                  previousPage={goPrev}
                  nextPage={goNext}
                  canNextPage={true}
                  canPreviousPage={true}
                  pageIndex={current - 1}
                  pageTotal={report.files.length}
                />
              </div>
            </div>
          )}
        </ToggleButtonsBar>

        <MainContent>
          {!!(report.files.length) && (
            <FileView file={report.files[current - 1]} />
          )}
        </MainContent>
      </div>
      <div
        className={cn(
          "w-64 border-l px-6 pt-20 border-gray-100 transition-all transform duration-300 h-screen overflow-y-scroll fixed right-0 top-0",
          {
            "translate-x-64": !rightSidebarOpen,
          }
        )}
      />

      <TopBar title={report.title} onClose={onClose}>
        <ButtonMenu openSide="left" type={btnType.Secondary} text="...">
          <Can I='edit' a={ENTITIES.Reports}>
            <EditReportTitleModal 
              onSubmit={(name) => {
                onEditTitle(name)
              }}
            />
          </Can>
          <Can I='delete' a={ENTITIES.Reports}>
            <DeleteModal 
              render={(
                <p>
                  Are you sure you want to delete the report? <br />
                  <strong>All files will be permanently deleted.</strong>
                </p>
              )}
              onDelete={() => onDeleteReport(report)}
            />
          </Can>
        </ButtonMenu>
        <Button icon={<MdRemoveRedEye />} text="Preview" />
      </TopBar>
    </div>
  );
};
