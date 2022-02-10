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
import { User } from "packages/state/domain/user"
import { EditEmailModal } from "../../components/EditEmailModal/EditEmailModal";
import { EditPasswordModal } from "../../components/EditPasswordModal/EditPasswordModal";
import { DeleteUserModal } from '../../components/DeleteUserModal/DeleteUserModal'
import { EditUserNoteModal } from '../../components/EditUserNoteModal/EditUserNoteModal'

type Props = {
  sidebar: React.ReactNode;
  onUpdateUsername: (username: string, isAdmin: boolean) => void;
  onUpdatePassword: (currentPassword: string, newPassword: string) => void;
  onUpdateNote: (note: string, isAdmin: boolean) => void;
  deleteUser: () => void
  user: User | null;
};

export const UserPage: FunctionComponent<Props> = ({
  sidebar,
  user,
  onUpdateUsername,
  onUpdatePassword,
  onUpdateNote,
  deleteUser
}) => {

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
              onSubmit={(username: string) => {
                onUpdateUsername(username, !!(user.role))
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
              <p className="text-gray-600 uppercase" style={{ width: 200 }}>
                Note
              </p>
              <p>{user ? user.note : '-'}</p>
            </div>
            <EditUserNoteModal 
            onSubmit={(note: string) => {
              onUpdateNote(note, !(user.role))
              }} 
            />
          </div>

          <div className="flex justify-between items-center py-4 border-b">
            <div className="flex items-center">
              <p className="text-gray-600 uppercase" style={{ width: 200 }}>
                Role
              </p>
              <p>{ user ? (user.role === 1 ? 'Guest' : 'Administrator') : ''}</p>
            </div>
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
  )
}