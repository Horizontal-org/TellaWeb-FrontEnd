import { FunctionComponent, useState } from "react";
import { MainLayout } from "../../layouts/MainLayout";

type Props = {
  sidebar: React.ReactNode;
};


export const AdminCenterPage: FunctionComponent<React.PropsWithChildren<Props>> = ({
  sidebar
}) => {

  return (
    <MainLayout
      title="Admin center"
      subtitle="Change system wide settings"
      leftbar={sidebar}
      leftbarActive={false}
      content={
        <div className='px-8'>
          algo
        </div>
      }
    />
  );
};
