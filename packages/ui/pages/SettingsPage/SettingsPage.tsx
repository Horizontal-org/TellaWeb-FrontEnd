import { FunctionComponent, useState, useEffect } from "react";
import { MainLayout } from "../../layouts/MainLayout";
import { User } from "../../../bloc";
import { EditEmailModal } from "../../components/EditEmailModal/EditEmailModal";
import { EditPasswordModal } from "../../components/EditPasswordModal/EditPasswordModal";

type Props = {
  sidebar: React.ReactNode;
  onUpdateUsername: (username: string) => void;
  onUpdatePassword: (currentPassword: string, newPassword: string) => void;
  user: User | null;
};

export const SettingsPage: FunctionComponent<Props> = ({
  sidebar,
  onUpdateUsername,
  onUpdatePassword,
  user,
}) => {
  return (
    <MainLayout
      title="Settings"
      subtitle="Change your user and password"
      leftbar={sidebar}
      content={
        <div>
          {JSON.stringify(user || {})}
          <div className="flex h-10 mb-2"></div>
          <div className="flex justify-between items-center py-4 border-b">
            <div className="flex items-center">
              <p className="text-gray-600 uppercase" style={{ width: 200 }}>
                email
              </p>
              <p>{user ? user.username : ""}</p>
            </div>
            <EditEmailModal onSubmit={onUpdateUsername} />
          </div>

          <div className="flex justify-between items-center py-4 border-b">
            <div className="flex items-center">
              <p className="text-gray-600 uppercase" style={{ width: 200 }}>
                Password
              </p>
              <p>••••••••••</p>
            </div>
            <EditPasswordModal onSubmit={onUpdatePassword} />
          </div>
        </div>
      }
    />
  );
};
