import { FunctionComponent, useState, useEffect, useMemo } from 'react'
import { Modal, ErrorMessage } from '../../../components/Modal'
import { TextInput, ItemQuery } from '../../..'
import { btnType } from '../../../components/Button/Button'
import { IoMdAdd } from 'react-icons/io'
import { useListQuery } from 'packages/state/services/resource'
import { Resource, ResourceQuery } from 'packages/state/domain/resource'
import { SearchEntityInput } from 'packages/ui/components/SearchEntityInput/SearchEntityInput'

interface Props {
  onSubmit: (newResources: string[]) => void;
  resourceList: Resource[]
}


const processResources = (resources) => {
  if (resources) {
    return resources.map((r: Resource) => {
      return {
        id: r.id,
        label: r.fileName
      }
    } )
  }

  return []
}

export const ManageResourcesProjectModal: FunctionComponent<React.PropsWithChildren<Props>> = ({
  onSubmit,
  resourceList
}) => {

  const [newResources, handleNewResources] = useState<Array<string>>([])
  const [parsedRecList, handleParsedRecList] = useState<Array<any>>([])
  const [query, setQuery] = useState<ResourceQuery>({
    page: 0,
    size: 0,
    search: '',
  })
  const { data: resources, refetch } = useListQuery(query);


  useEffect(() => {
    const parsed = resources?.results.map((u) => {
      return {
        id: u.id,
        label: u.fileName
      }
    })

    handleParsedRecList(parsed)
  }, [resources])

  return (
    <Modal 
      title='Add resources to project'
      subtitle='Search and select the resources to add to this project.'
      button='ADD RESOURCES'
      buttonIcon={<IoMdAdd color='#fff' size={20}/>}
      btnType={btnType.Primary}
      submit='ADD'
      disabled={!(newResources.length > 0)}
      onClose={() => {
        handleNewResources([])
      }}
      onSubmit={() => {
        onSubmit(newResources)
        handleNewResources([])
      }}
      render={() => (
        <div>
          <div className='pt-4'>

            <SearchEntityInput
              onSelect={(selectedResources) => {
                handleNewResources(selectedResources)
                setQuery({
                  page: 0,
                  size: 3,
                  search: 'RETURN-NOTHING',
                })
              }}
              entities={parsedRecList || []}
              onSearch={(searchQuery, excludedResources) => {
                setQuery({
                  page: 0,
                  size: 3,
                  search: searchQuery.length > 0 ? searchQuery : 'RETURN-NOTHING',
                  exclude: [...excludedResources, ...resourceList.map(ul => ul.id)]
                })
              }}
            />
          </div>          

        </div>
      )}
    />
  )
}
