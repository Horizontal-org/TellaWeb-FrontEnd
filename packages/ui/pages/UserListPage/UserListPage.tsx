import { 
  FunctionComponent, 
  useState, 
  Dispatch, 
  SetStateAction, 
  useRef,
  FormEvent,
  ChangeEvent,
  PropsWithChildren
} from "react";
import {
  ButtonMenu,
  ButtonOption,
  SearchInput,
  DeleteModal,
  // CreateUserModal,
  UserBar,
} from "../..";
import { MainLayout } from "../../layouts/MainLayout";
import { User } from "packages/state/domain/user";
import { Item } from "../../domain/Item";
import { ItemQuery, Table, Button } from 'packages/ui'
import { btnType } from "../../components/Button/Button";
import { MdOpenInNew, MdRemoveRedEye, MdSave } from "react-icons/md";
import { USER_COLUMNS } from "../../domain/UserTableColumns";
import { BsPerson, BsPlusLg } from 'react-icons/bs'
import { CreateUserModal } from '../../modals/user/CreateUserModal/CreateUserModal'
import { Can } from "common/casl/Can";
import { ENTITIES } from "common/casl/Ability";
import HoveredRowWrapper from "packages/ui/components/Table/HoveredRowWrapper";

type Props = {
  sidebar: React.ReactNode;  
  users: User[];
  currentQuery: ItemQuery;
  onOpen: (user: User) => void;
  onQueryChange: (iq: ItemQuery) => void;
  onDelete: (users: User[]) => void;
  onCreateUser: (newUser: {
    username: string
    password: string
    role: string
  }) => void;
};

export const UserListPage: FunctionComponent<React.PropsWithChildren<Props>> = ({
  sidebar,
  users,
  onQueryChange,
  currentQuery,
  onCreateUser,
  onOpen,
  onDelete
}) => {

  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const searchInput = useRef<HTMLInputElement>();
  let searchTimeout = null

  const openUser = () => {
    setCurrentUser(selectedUsers[0]);
  };

  const search = (e: FormEvent<HTMLFormElement> | ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const name = searchInput.current.value;

    onQueryChange({
      ...currentQuery,
      search: name
    })
  };

  return (
    <MainLayout
      title="Users"
      subtitle="Manage who can upload Reports to Tella Web"
      onClosePreview={() => setCurrentUser(undefined)}
      rightbar={<UserBar user={currentUser} />}
      rightbarActive={true}
      leftbar={sidebar}      
      leftbarActive={true}
      currentItem={currentUser}
      content={
        <div>
          <div 
            className="flex space-x-2 mb-2 p-2"
          >
            {selectedUsers.length === 0 && (
              <>
                <Can I='create' a={ENTITIES.Users}>
                  <CreateUserModal 
                    onSubmit={(newUser) => {
                      onCreateUser(newUser)
                    }}
                  />
                </Can>

                <form onSubmit={search} className="flex">
                  <SearchInput
                    onChange={(e) => {
                      clearTimeout(searchTimeout)
                      searchTimeout = setTimeout(() => {
                        search(e)
                      }, 500)
                    }}
                    ref={searchInput}
                    defaultValue={currentQuery.search}
                  />
                </form>
              </>
            )}
            {selectedUsers.length > 0 && (
              <>
                {selectedUsers.length === 1 && (
                  <div className='flex'>
                    <div className='pr-2 h-full'>
                      <Button
                        icon={<MdOpenInNew />}
                        text="Open"
                        onClick={(event: MouseEvent) => {
                          event.preventDefault();
                          onOpen(selectedUsers[0]);
                        }}
                      />
                    </div>
                    <Button
                      type={btnType.Secondary}
                      icon={<MdRemoveRedEye />}
                      text="Preview"
                      onClick={openUser}
                    />              
                  </div>
                )}                
                {<ButtonMenu openSide="right">
                  <Can I='delete' a={ENTITIES.Users}>
                    <DeleteModal 
                      render={(
                        <p>
                          the selected users will be permanently deleted.
                        </p>
                      )}
                      onDelete={() => {
                        onDelete(selectedUsers)
                      }}
                    />                    
                  </Can>
                </ButtonMenu>}
              </>
            )}
          </div>
          <div>
            <Table
              columns={USER_COLUMNS}
              data={users}
              itemQuery={currentQuery}
              onSelection={setSelectedUsers as Dispatch<SetStateAction<Item[]>>}
              onFetch={onQueryChange}
              icon={<BsPerson/>}
              rowOptions={(hoverRow, isHoverSelected) => (
                <HoveredRowWrapper isHoverSelected={isHoverSelected}>
                  <>
                    <div className='pr-2'>
                      <Button
                        icon={<MdOpenInNew />}
                        text="Open"
                        onClick={(event: MouseEvent) => {
                          event.preventDefault();
                          event.stopPropagation()
                          onOpen(hoverRow);
                        }}
                      />
                    </div>
                    <ButtonMenu openSide="left" type={btnType.Secondary} text="...">
                      <ButtonOption
                        icon={<MdRemoveRedEye />}
                        color='#8B8E8F'
                        text="Preview"
                        onClick={(e: ChangeEvent) => {
                          e.stopPropagation()
                          setCurrentUser(hoverRow);
                        }}
                      />
                      <Can I='delete' a={ENTITIES.Users}>
                        <DeleteModal 
                          render={(
                            <p>
                              the selected users will be permanently deleted.
                            </p>
                          )}
                          onDelete={() => {
                            onDelete(selectedUsers)
                          }}
                        />                    
                      </Can>
                    </ButtonMenu>
                  </>
                </HoveredRowWrapper>
              )}
            />
          </div>
         
        </div>
      }
    />
  );
};
