import {
  Dispatch,
  FormEvent,
  FunctionComponent,
  SetStateAction,
  useRef,
  useState,
  ChangeEvent,
  useEffect
} from "react";
import { MdOpenInNew, MdRemoveRedEye, MdSave } from "react-icons/md";
import {
  ReportBar,
  Button,
  Table,
  ButtonMenu,
  ButtonOption,
  SearchInput,
  DeleteModal,
  UserBar
} from "../..";
import { btnType } from "../../components/Button/Button";

import { MainLayout } from "../../layouts/MainLayout";

import { REPORT_COLUMNS } from "../../domain/ReportTableColumns";
import { ItemQuery } from "../../domain/ItemQuery";
import { Item } from "../../domain/Item";
import { Report } from "../../domain/Report";
import { Project } from "packages/state/domain/project";
import HoveredRowWrapper from "packages/ui/components/Table/HoveredRowWrapper";
import { Can } from "common/casl/Can";
import { ENTITIES } from "common/casl/Ability";
import { User } from "packages/state/domain/user";
import { ManageUsersProjectModal } from "packages/ui/modals/project/ManageUsersProjectModal/ManageUsersProjectModal";
import { USER_COLUMNS } from "packages/ui/domain/UserTableColumns";
import { BsPerson } from "react-icons/bs";

type Props = {
  project: Project
  users: User[];
  onQueryChange: (iq: ItemQuery) => void;
  onOpen: (user: User) => void;
  onAddUsers: (newUsers:  string[]) => void;
  sidebar: React.ReactNode;
  currentQuery: ItemQuery;
  removeSelected: (selectedUsers: string[]) => void;
};

export const ProjectUsersPage: FunctionComponent<React.PropsWithChildren<Props>> = ({
  project,
  onOpen,
  onQueryChange,
  onAddUsers,
  users,
  sidebar,
  currentQuery,
  removeSelected
}) => {
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const openUser = () => {
    setCurrentUser(selectedUsers[0]);
  };


  return (
    <MainLayout
      title={project.name}
      subtitle="Manage the project's users"
      content={
        <div>
          <div className="flex space-x-2 mb-2 p-2">
            {selectedUsers.length === 0 && (
              <>
                <ManageUsersProjectModal 
                  onSubmit={(newUsers) => {
                    onAddUsers(newUsers)
                  }}
                  userList={users}
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
                <Button
                  type={btnType.Secondary}
                  text="Remove from project"
                  onClick={() => {
                    removeSelected(selectedUsers.map(su => su.id))
                  }}
                />         
              </>
            )}
          </div>
          <Table
            columns={USER_COLUMNS}
            data={users}
            withPagination={false}
            itemQuery={currentQuery}
            onSelection={setSelectedUsers as Dispatch<SetStateAction<Item[]>>}
            onFetch={onQueryChange}
            icon={<BsPerson/>}
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
                  <ButtonMenu openSide="left" type={btnType.Secondary} text="...">
                    {/* <ButtonOption
                      icon={<MdSave />}
                      onClick={(event: MouseEvent) => {
                        event.stopPropagation()
                        onDownload(hoveredRow)
                      }}
                      text="Download"
                      color='#8B8E8F'
                    /> */}
                  </ButtonMenu>
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

ProjectUsersPage.defaultProps = {
  users: [],
};
