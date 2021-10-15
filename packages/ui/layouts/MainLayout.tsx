import { FunctionComponent, useEffect, useState } from "react";
import cn from "classnames";
import Img from "next/image";
import { Title, SubTitle } from "..";
import { Item } from "../domain/Item";

import handbarToggle from "../assets/handbar-toggle.png";

type Props = {
  title?: string;
  subtitle?: string;
  leftbar?: React.ReactNode;
  rightbar?: React.ReactNode;
  content: React.ReactNode;
  currentItem?: Item;
  onClosePreview?: () => void;
};

export const MainLayout: FunctionComponent<Props> = ({
  content,
  leftbar,
  rightbar,
  title,
  subtitle,
  currentItem,
  onClosePreview,
}) => {
  const [leftSidebarOpen, changeLeftSidebarOpenStatus] = useState(true);
  const [rightSidebarOpen, changeRightSidebarOpenStatus] = useState(false);

  const toggleLeftSideBar = () => changeLeftSidebarOpenStatus(!leftSidebarOpen);
  const toggleRightSideBar = () =>
    changeRightSidebarOpenStatus(!rightSidebarOpen);

  useEffect(() => {
    if (currentItem) changeRightSidebarOpenStatus(true);
  }, [currentItem]);

  useEffect(() => {
    if (rightSidebarOpen === false && onClosePreview) {
      onClosePreview();
    }
  }, [rightSidebarOpen]);

  return (
    <div className="flex w-full min-h-screen bg-white overflow-x-hidden">
      {leftbar && (
        <div
          className={cn(
            "w-56 md:flex border-r p-8 border-gray-100 transition-all transform duration-300 ease-in-out h-screen fixed top-0 left-0",
            {
              "-translate-x-56": !leftSidebarOpen,
            }
          )}
        >
          {leftbar}
        </div>
      )}
      <div
        className={cn("p-6 flex-1 transition-all duration-300 ease-in-out", {
          "transform ml-56": leftbar && leftSidebarOpen,
          "transform mr-64": rightbar && rightSidebarOpen,
        })}
      >
        <div className="py-4">
          {title && <Title>{title}</Title>}
          {subtitle && <SubTitle>{subtitle}</SubTitle>}
        </div>
        <div className="flex">
          {leftbar && (
            <div>
              <button
                type="button"
                style={{ lineHeight: 1 }}
                onClick={toggleLeftSideBar}
                className="focus:outline-none cursor-pointer border-r my-2 py-1 pr-3"
              >
                <Img
                  height="18px"
                  width="18px"
                  src={handbarToggle}
                  alt="Toggle left sidebar"
                />
              </button>
            </div>
          )}
          <div className="flex-1">{content}</div>
          {currentItem && rightbar && (
            <div>
              <button
                type="button"
                style={{ lineHeight: 1 }}
                onClick={toggleRightSideBar}
                className="focus:outline-none cursor-pointer border-l my-2 py-1"
              >
                <div className="ml-3">
                  <Img
                    height="18px"
                    width="18px"
                    className="transform rotate-180"
                    src={handbarToggle}
                    alt="Toggle right sidebar"
                  />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
      {rightbar && (
        <div
          className={cn(
            "w-64 flex border-l p-5 border-gray-100 transition-all transform duration-300 ease-in-out h-screen fixed right-0 top-0",
            {
              "translate-x-64": !rightSidebarOpen,
            }
          )}
        >
          {rightbar}
        </div>
      )}
    </div>
  );
};
