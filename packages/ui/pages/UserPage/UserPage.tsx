import {
  FunctionComponent,
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  FormEvent,
  ChangeEvent
} from "react"
import { MainLayout } from "../../layouts/MainLayout"
import { ROLES, User } from "packages/state/domain/user"
import { EditEmailModal } from "../../components/EditEmailModal/EditEmailModal";
import { EditPasswordModal } from "../../components/EditPasswordModal/EditPasswordModal";
import { DeleteUserModal } from '../../components/DeleteUserModal/DeleteUserModal'
import { EditUserNoteModal } from '../../components/EditUserNoteModal/EditUserNoteModal'
import { useUserProfile } from "packages/state/features/user/userHooks";
import { EditRoleModal } from '../../modals/user/EditRoleModal/EditRoleModal'

type Props = {
  sidebar: React.ReactNode;
  onUpdateUsername: (username: string) => void;
  onUpdatePassword: (currentPassword: string, newPassword: string) => void;
  onUpdateNote: (note: string) => void;
  onUpdateRole: (role: string) => void;
  deleteUser: () => void
  user: User | null;
};

export const UserPage: FunctionComponent<React.PropsWithChildren<Props>> = ({
  sidebar,
  user,
  onUpdateUsername,
  onUpdatePassword,
  onUpdateNote,
  onUpdateRole,
  deleteUser
}) => {
  const loggedUser = useUserProfile()

  return (
    <MainLayout
      title="Manage user"
      subtitle="Edit this user’s information and settings"
      leftbar={sidebar}
      content={
        <div className='px-8'>
          <div className="flex h-10 mb-2"></div>
          <div className="flex justify-between items-center py-4 border-b">
            <div className="flex items-center">
              <p className="text-gray-600 uppercase" style={{ width: 200 }}>
                Username
              </p>
              <p>{user ? user.username : ""}</p>
            </div>
            <EditEmailModal 
              isEmail={user && user.role !== ROLES.REPORTER}
              withPassword={false}
              onSubmit={(username: string, cp: string) => {
                onUpdateUsername(username)
              }} 
              title="Edit the username of the user"
            />
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

          <div className="flex justify-between items-center py-4 border-b">
            <div className="flex items-center">
              <p className="text-gray-600 uppercase" style={{ 
                  width: 200,
                  minWidth: 200
                }}>
                Note
              </p>
              <p className='break-all'>{user ? user.note : '-'}</p>
            </div>
            <EditUserNoteModal 
              onSubmit={(note: string) => {
                onUpdateNote(note)
              }} 
            />
          </div>

          <div className="flex justify-between items-center py-4 border-b">
            <div className="flex items-center">
              <p className="text-gray-600 uppercase" style={{ width: 200 }}>
                Role
              </p>
              <p>{ user ? user.role : ' '}</p>
            </div>
            { user && user.id !== loggedUser.id && (
              <EditRoleModal 
                defaultRole={user ? user.role + '' : 'admin'}
                hasEmail={user && (/\S+@\S+\.\S+/.test(user.username))}
                onSubmit={(role: string) => {
                  // update role 
                  onUpdateRole(role)
                }} 
              />
            )}
          </div>          


          <div className="flex justify-between items-center py-4 border-b">
            <div className="flex items-center">
              <p className="text-gray-600 uppercase" style={{ width: 200 }}>
                Delete user
              </p>
              <p>
              </p>
            </div>
            { user && (
              <DeleteUserModal 
                onSubmit={deleteUser}
                title={`This will permanently delete the user “${user.username}”`}
              />
            )}
          </div>          
        </div>
      }
    />
  );
}