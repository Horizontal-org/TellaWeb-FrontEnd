import { useRouter } from "next/dist/client/router";
import { FunctionComponent } from "react";
import { SidebarLayout } from "packages/ui";

export const Menu: FunctionComponent = () => {
  const router = useRouter();

  return (
    <SidebarLayout
      topMenu={[
        {
          text: "Reports",
          icon: null,
          onClick: () => router.replace("/report"),
          selected: router.route.includes("/report"),
        },
        {
          text: "Users",
          onClick: () => router.replace("/user"),

          icon: null,
          selected: router.route.includes("/user"),
        },
        {
          text: "Configuration",
          icon: null,
          onClick: () => router.replace("/configuration"),
          selected: router.route.includes("/configuration"),
        },
      ]}
      bottomMenu={[]}
    />
  );
};
