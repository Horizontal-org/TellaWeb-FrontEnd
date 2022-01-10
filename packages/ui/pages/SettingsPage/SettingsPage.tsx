import { FunctionComponent } from "react";
import { MainLayout } from "../../layouts/MainLayout";
import { EditEmailModal } from "../../components/EditEmailModal/EditEmailModal";
import { EditPasswordModal } from "../../components/EditPasswordModal/EditPasswordModal";
import { User } from "packages/state/domain/user";

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
