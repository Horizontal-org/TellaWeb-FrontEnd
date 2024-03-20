import { FunctionComponent, useState, useEffect, useMemo } from 'react'
import { Modal, ErrorMessage } from '../../../components/Modal'
import { TextInput, ItemQuery } from '../../../'
import { btnType } from '../../../components/Button/Button'
import { IoMdAdd } from 'react-icons/io'
import { User, UserQuery } from 'packages/state/domain/user'
import { useListQuery } from 'packages/state/services/user'
import styled from 'styled-components'
import { SearchUserInput } from 'packages/ui/components/SearchUserInput/SearchUserInput'
import { SearchEntityInput } from 'packages/ui/components/SearchEntityInput/SearchEntityInput'

interface Props {
  onSubmit: (newUsers: string[]) => void;
  userList: User[]
}



export const ManageUsersProjectModal: FunctionComponent<React.PropsWithChildren<Props>> = ({
  onSubmit,
  userList
}) => {

  const [newUsers, handleNewUsers] = useState<Array<string>>([])
  const [parsedUserList, handleParsedUserList] = useState<Array<any>>([])
  const [query, setQuery] = useState<UserQuery>({
    page: 0,
    size: 0,
    search: '',
  })
  const { data: users, refetch } = useListQuery(query);

  useEffect(() => {
    const parsed = users?.results.map((u) => {
      return {
        id: u.id,
        label: u.username
      }
    })

    handleParsedUserList(parsed)
  }, [users])

  console.log("🚀 ~ file: ManageUsersProjectModal.tsx:31 ~ users:", users)

  return (
    <Modal 
      title='Add users to project'
      subtitle='Search and select the users to add to this project.'
      button='ADD USERS'
      buttonIcon={<IoMdAdd color='#fff' size={20}/>}
      btnType={btnType.Primary}
      submit='ADD'
      disabled={!(newUsers.length > 0)}
      onClose={() => {
        handleNewUsers([])
      }}
      onSubmit={() => {
        onSubmit(newUsers)
        handleNewUsers([])
      }}
      render={() => (
        <div>
          <div className='pt-4'>
            {/* <SearchUserInput
              onSelect={(newUsers) => {
                handleNewUsers(newUsers)
              }}
              users={users?.results || []}
              onSearch={(searchQuery, excludedUsers) => {
                setQuery({
                  page: 0,
                  size: 3,
                  search: searchQuery.length > 0 ? searchQuery : '',
                  exclude: [...excludedUsers, ...userList.map(ul => ul.id)]
                })
              }}
            /> */}


            <SearchEntityInput
              onSelect={(newUsers) => {
                // EN EL SEGUNDO SEARCH CON MISMO USUARIO NO RENDERREA
                handleNewUsers(newUsers)
                setQuery({
                  page: 0,
                  size: 3,
                  search: 'RETURN-NOTHING',
                })
              }}
              entities={parsedUserList || []}
              onSearch={(searchQuery, excludedUsers) => {
                setQuery({
                  page: 0,
                  size: 3,
                  search: searchQuery.length > 0 ? searchQuery : ' ',
                  exclude: [...excludedUsers, ...userList.map(ul => ul.id)]
                })
              }}
            />
          </div>          

        </div>
      )}
    />
  )
}
