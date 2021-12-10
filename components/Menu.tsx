import { useRouter } from "next/dist/client/router";
import { FunctionComponent } from "react";
import { SidebarLayout } from "packages/ui";
import { IoMdExit } from 'react-icons/io'

import { MdOutlineSettings } from 'react-icons/md'
import { BsFillCloudArrowUpFill } from 'react-icons/bs'

export const Menu: FunctionComponent = () => {
  const router = useRouter();

  return (
    <SidebarLayout
      topMenu={[
        {
          text: "Reports",
          icon: <BsFillCloudArrowUpFill />,
          onClick: () => router.replace("/report"),
          selected: router.route.includes("/report"),
        }
      ]}
      bottomMenu={[
        {
          text: "Settings",
          icon: <MdOutlineSettings />,
          onClick: () => router.replace("/settings"),
          selected: router.route.includes("/settings"),
        },
        {
          text: "Logout",
          icon: (<IoMdExit />),
          onClick: () => router.replace("/logout"),
          selected: router.route.includes("/logout"),
        },
      ]}
    />
  );
};
