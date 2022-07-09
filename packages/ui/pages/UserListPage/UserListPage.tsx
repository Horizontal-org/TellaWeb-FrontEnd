import { 
  FunctionComponent, 
  useState, 
  Dispatch, 
  SetStateAction, 
  useRef,
  FormEvent,
  ChangeEvent
} from "react";
import {
  ButtonMenu,
  ButtonOption,
  SearchInput,
  DeleteModal,
  CreateUserModal,
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


type Props = {
  sidebar: React.ReactNode;  
  users: User[];
  currentQuery: ItemQuery;
  onOpen: (user: User) => void;
  onQueryChange: (iq: ItemQuery) => void;
  onCreateUser: (username:  string, password: string, isAdmin: boolean) => void;
  onDelete: (users: User[]) => void;
};

export const UserListPage: FunctionComponent<Props> = ({
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
                <CreateUserModal 
                  title='Enter the user’s basic information here. You will be able to add additional information on the next screen.'
                  onSubmit={onCreateUser}
                />
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
            />
          </div>
         
        </div>
      }
    />
  );
};
