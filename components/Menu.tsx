import { useRouter } from "next/dist/client/router";
import { FunctionComponent } from "react";
import { SidebarLayout } from "packages/ui";
import { IoMdExit } from 'react-icons/io'

import { MdOutlineSettings } from 'react-icons/md'
import { BsFillCloudArrowUpFill, BsPerson } from 'react-icons/bs'
import { MdOutlinePictureAsPdf } from "react-icons/md";

import RemoteConfigIcon from '../packages/ui/components/RemoteConfigIcon'
import { IoMdHelpCircleOutline } from "react-icons/io";

import { ENTITIES } from "common/casl/Ability";
export const Menu: FunctionComponent<React.PropsWithChildren<unknown>> = () => {
  const router = useRouter();

  return (
    <SidebarLayout
      topMenu={[
        {
          permission: ENTITIES.Projects,
          text: "Projects",
          icon: <BsFillCloudArrowUpFill />,
          onClick: () => router.replace("/project"),
          selected: router.route.includes("/project"),
        },
        {
          permission: ENTITIES.Users,
          text: "Users",
          icon: <BsPerson />,
          onClick: () => router.replace("/user"),
          selected: router.route === '/user',
        },
        {
          permission: ENTITIES.Resources,
          text: "Resources",
          icon: <MdOutlinePictureAsPdf />,
          onClick: () => router.replace("/resource"),
          selected: router.route === '/resource',
        },
        // WAITING FOR MOBILE
        // {
        //   permission: ENTITIES.RemoteConfigurations,
        //   text: "Configurations",
        //   icon: <RemoteConfigIcon />,
        //   onClick: () => router.replace("/configuration"),
        //   selected: router.route.includes("/configuration"),
        // }
      ]}
      bottomMenu={[
        {
          permission: ENTITIES.Web,
          text: "Settings",
          icon: <MdOutlineSettings />,
          onClick: () => router.replace("/settings"),
          selected: router.route == "/settings",
        },
        {
          permission: ENTITIES.Web,
          text: "Help",
          icon: <IoMdHelpCircleOutline />,
          onClick: () => window.open("https://tella-app.org/docs", "_blank"),
          selected: false,
        },
        {
          permission: ENTITIES.Web,
          text: "Logout",
          icon: (<IoMdExit />),
          onClick: () => router.replace("/logout"),
          selected: router.route.includes("/logout"),
        },
      ]}
    />
  );
};
