import React from "react";
import { MdCloudUpload, MdPersonOutline, MdSettings, MdDelete, MdExitToApp, MdHelp } from "react-icons/md";
import { MenuDescription } from "../../ui-ignre/src/domain/Menu";

export const ExampleMenuMokedData: MenuDescription[] = [
  { text: "Reports", icon: <MdCloudUpload />, selected: true },
  { text: "Users", icon: <MdPersonOutline /> },
  { text: "Administration", icon: <MdSettings /> },
  { text: "Delete report", icon: <MdDelete />, disabled: true },
];

export const TopMenuMokedData: MenuDescription[] = [
  { text: "Reports", icon: <MdCloudUpload />, selected: true },
  { text: "Users", icon: <MdPersonOutline /> },
  { text: "Administration", icon: <MdSettings /> },
];

export const BottomMenuMokedData: MenuDescription[] = [
  { text: "Settings", icon: <MdSettings /> },
  { text: "Help", icon: <MdHelp /> },
  { text: "Logout", icon: <MdExitToApp /> },
];
