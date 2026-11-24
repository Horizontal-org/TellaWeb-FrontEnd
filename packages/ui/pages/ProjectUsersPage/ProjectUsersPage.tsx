import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useState,
  ChangeEvent,
} from "react";
import { MdDelete, MdOpenInNew, MdRemoveRedEye, MdSave } from "react-icons/md";
import {
  Button,
  Table,
  ButtonMenu,
  ButtonOption,
  UserBar
} from "../..";
import { btnType } from "../../components/Button/Button";

import { MainLayout } from "../../layouts/MainLayout";

import { ItemQuery } from "../../domain/ItemQuery";
import { Item } from "../../domain/Item";
import { Project } from "packages/state/domain/project";
import HoveredRowWrapper from "packages/ui/components/Table/HoveredRowWrapper";
import { ROLES } from "common/casl/Ability";
import { User } from "packages/state/domain/user";
import { ManageUsersProjectModal } from "packages/ui/modals/project/ManageUsersProjectModal/ManageUsersProjectModal";
import { USER_COLUMNS } from "packages/ui/domain/UserTableColumns";
import { BsPerson } from "react-icons/bs";

type Props = {
  project: Project
  // One page of the project's users, as returned by the server
  users: User[];
  onQueryChange: (iq: ItemQuery) => void;
  onOpen: (user: User) => void;
  onAddUsers: (newUsers: string[]) => void;
  sidebar: React.ReactNode;
  currentQuery: ItemQuery;
  removeSelected: (selectedUsers: string[]) => void;
  isLoading?: boolean;
};

export const ProjectUsersPage: FunctionComponent<React.PropsWithChildren<Props>> = ({
  project,
  onOpen,
  onQueryChange,
  onAddUsers,
  users = [],
  sidebar,
  currentQuery,
  removeSelected,
  isLoading
}) => {
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const openUser = () => {
    setCurrentUser(selectedUsers[0]);
  }

  return (
    <MainLayout
      title={"Project users"}
      subtitle={`Manage users available in the project “${project.name}”`}
      content={
        <div>
          <div className="flex space-x-2 mb-2 p-2">
            {selectedUsers.length === 0 && (
              <>
                <ManageUsersProjectModal
                  onSubmit={(newUsers) => {
                    onAddUsers(newUsers)
                  }}
                  projectId={project.id}
                />
              </>
            )}

            {selectedUsers.length > 0 && (
              <>
                {selectedUsers.length === 1 && (
                  <>
                    <Button
                      icon={<MdOpenInNew />}
                      text="Edit"
                      onClick={(event: MouseEvent) => {
                        event.preventDefault();
                        onOpen(selectedUsers[0]);
                      }}
                    />
                    <Button
                      type={btnType.Secondary}
                      icon={<MdRemoveRedEye />}
                      text="Preview"
                      onClick={openUser}
                    />
                  </>
                )}

                {selectedUsers.find(su => su.role !== ROLES.Admin) && (
                  <div className="rounded-sm overflow-hidden border border-gray-100">
                    <ButtonOption
                      icon={<MdDelete />}
                      color="#DC2626"
                      text="Remove from project"
                      onClick={() => {
                        removeSelected(selectedUsers.map(su => su.id))
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
          <Table
            loading={isLoading}
            columns={USER_COLUMNS}
            data={users}
            withPagination={true}
            itemQuery={currentQuery}
            onSelection={setSelectedUsers as Dispatch<SetStateAction<Item[]>>}
            onFetch={onQueryChange}
            icon={<BsPerson />}
            rowOptions={(hoveredRow, isHoverSelected) => (
              <HoveredRowWrapper isHoverSelected={isHoverSelected}>
                <>
                  <div className="px-2">
                    <Button
                      type={btnType.Secondary}
                      icon={<MdRemoveRedEye />}
                      text="Preview"
                      onClick={(e: ChangeEvent) => {
                        e.stopPropagation()
                        setCurrentUser(hoveredRow);
                      }}
                    />
                  </div>
                  {hoveredRow.role !== ROLES.Admin && (
                    <ButtonMenu openSide="left" type={btnType.Secondary} text="...">
                      <ButtonOption
                        icon={<MdDelete />}
                        color="#DC2626"
                        text="Remove from project"
                        onClick={(e: ChangeEvent) => {
                          e.stopPropagation()
                          removeSelected([hoveredRow.id])
                        }}
                      />
                    </ButtonMenu>
                  )}
                </>
              </HoveredRowWrapper>
            )}
          />
        </div>
      }
      leftbar={sidebar}
      leftbarActive={true}
      rightbar={<UserBar user={currentUser} />}
      rightbarActive={true}
      onClosePreview={() => setCurrentUser(undefined)}
      currentItem={currentUser}
    />
  );
};

