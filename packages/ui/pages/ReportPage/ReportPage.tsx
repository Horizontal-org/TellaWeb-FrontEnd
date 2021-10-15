import { FunctionComponent, useRef, useState } from "react";
import cn from "classnames";
import { MdInfoOutline } from "@react-icons/all-files/md/MdInfoOutline";
import { MdSave } from "@react-icons/all-files/md/MdSave";
import { BsArrowsAngleExpand } from "@react-icons/all-files/bs/BsArrowsAngleExpand";
import { MdRemoveRedEye } from "@react-icons/all-files/md/MdRemoveRedEye";
import { MdDelete } from "@react-icons/all-files/md/MdDelete";

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
} from "../..";
import { btnType } from "../../components/Button/Button";
import { ButtonPopup } from "../../components/ButtonPopup/ButtonPopup";

type Props = {
  report: Report;
  onDeleteReport: (report: Report) => void;
  onDeleteFile: (report: Report, file: IReportFile) => void;
  onClose: () => void;
};

export const ReportPage: FunctionComponent<Props> = ({
  report,
  onDeleteReport,
  onDeleteFile,
  onClose,
}) => {
  const [leftSidebarOpen, changeLeftSidebarOpneStatus] = useState(true);
  const [rightSidebarOpen, changeRightSidebarOpneStatus] = useState(true);

  const [current, setCurrent] = useState(1);
  const deleteModalRef = useRef<typeof ButtonPopup>(null);

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

  const toggleLeftSideBar = () => changeLeftSidebarOpneStatus(!leftSidebarOpen);
  const toggleRightSideBar = () =>
    changeRightSidebarOpneStatus(!rightSidebarOpen);

  return (
    <div className="flex flex-grow min-h-screen">
      <LeftCollapsingSidebar collapsed={!leftSidebarOpen}>
        <ReportInformation report={report} />
        <div className="grid grid-cols-2 gap-2 mt-6">
          {report.files.map((file) => (
            <Thumbnail file={file} key={file.src.toString()} />
          ))}
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
          <div className="flex-1 flex space-x-2 mb-2 px-4 py-2">
            <Button
              type={btnType.Secondary}
              icon={<MdInfoOutline />}
              text="File Information"
            />
            <Button
              type={btnType.Secondary}
              icon={<MdSave />}
              text="Download file"
            />
            <ButtonMenu openSide="right" type={btnType.Secondary} text="...">
              <ButtonPopup
                icon={<MdDelete />}
                text="Delete"
                render={(toggle) => (
                  <>
                    <p>
                      Are you sure you want to delete the file? <br />
                      <strong>
                        {report.files[current - 1].fileName} will be permanently
                        deleted.
                      </strong>
                    </p>
                    <div className="flex justify-end">
                      <Button
                        text={"Confirm"}
                        onClick={() => {
                          toggle();
                          onDeleteFile(report, report.files[current - 1]);
                        }}
                      />
                    </div>
                  </>
                )}
              />
            </ButtonMenu>
          </div>
          <div className="flex space-x-4 mb-2 px-4 py-2 items-center">
            <Button type={btnType.Secondary} icon={<BsArrowsAngleExpand />} />
            <div className="w-24">
              <SliderControl
                goNext={goNext}
                goPrev={goPrev}
                current={current}
                total={report.files.length}
              />
            </div>
          </div>
        </ToggleButtonsBar>

        <MainContent>
          {report.files.length && (
            <Thumbnail file={report.files[current - 1]} full />
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
        <ButtonMenu openSide="left">
          <ButtonPopup
            icon={<MdDelete />}
            text="Delete"
            render={(toggle) => (
              <>
                <p>
                  Are you sure you want to delete the report? <br />
                  <strong>All files will be permanently deleted.</strong>
                </p>
                <div className="flex justify-end">
                  <Button
                    text={"Confirm"}
                    onClick={() => {
                      toggle();
                      onDeleteReport(report);
                    }}
                  />
                </div>
              </>
            )}
          />
        </ButtonMenu>
        <Button icon={<MdRemoveRedEye />} text="Preview" />
      </TopBar>
    </div>
  );
};
