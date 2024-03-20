import { FunctionComponent, PropsWithChildren, useState, useEffect, useRef } from "react";
import { User } from "packages/state/domain/user";
import styled from 'styled-components'
import { VscClose } from 'react-icons/vsc'
import { BsPerson, BsCheck } from 'react-icons/bs'
import { TbChevronDown } from 'react-icons/tb' 
import { useOnClickOutside } from "packages/ui/hooks/useOnClickOutside";

interface Props {
  users: User[];
  onSearch: (query: string, excluded?: Array<string>) => void;
  onSelect: (items: string[]) => void;
}

let timeoutToken = null

// ROLE FUNCTION HIDDEN
export const SearchUserInput: FunctionComponent<PropsWithChildren<Props>> = ({
  users,
  onSearch,
  onSelect
}) => {

  
  const [selectedItems, handleSelectedItems] = useState([])
  const [selectedRole, handleSelectedRole] = useState(null)
  
  const [showResults, handleShowResults] = useState(false)
  console.log("🚀 ~ file: SearchUserInput.tsx:29 ~ showResults:", showResults)
  // const [showRoles, handleShowRoles] = useState(false)
  
  const searchInput = useRef(null)
  const wrapperRef = useRef(null)

  useOnClickOutside(wrapperRef, () => {
    handleShowResults(false) 
    // handleShowRoles(false)    
  })

  const clean = () => {
    searchInput.current.textContent = ''
    handleShowResults(false)
  }
  
  useEffect(() => {
    // if (showRoles) handleShowRoles(false)
    handleShowResults(true)
  }, [users])
  
  useEffect(() => {
    onSelect(selectedItems.map(si => si.id))
  }, [selectedItems])

  useEffect(() => {
    handleShowResults(false)
  }, [])

  return (
    <Wrapper ref={wrapperRef}>
      <MultiSelect resultsOpen={showResults || selectedItems.length > 0}>
        { selectedItems.map(si => (
          <Item key={si.label}>
            <span>
              { si.label }
            </span>
            <VscClose onClick={() => {
              handleSelectedItems(selectedItems.filter(sif => sif.id !== si.id ))
            }} size={16} color="#8B8E8F" />
          </Item>
        ))}

        <InputWrapper>
          <Input 
            ref={searchInput}
            className='font-sans' 
            role='textbox'
            contentEditable
            onInput={(e) => { 
              const newQuery = e.currentTarget.textContent              
              clearTimeout(timeoutToken)

              timeoutToken = setTimeout(() => {
                onSearch(newQuery, selectedItems.map(si => si.id))                
              }, 500)
            }}
          />
        </InputWrapper>

        {/* <RolePicker onClick={() => {
          if (showResults) handleShowResults(false)
          handleShowRoles(!showRoles)
        }}>
          <span>{selectedRole || 'role'}</span>
          <TbChevronDown size={18} color='#8B8E8F'/>
        </RolePicker> */}
        
      </MultiSelect>

      <AbsoluteContent>
          { users.length > 0 && showResults && ( 
            <SearchResults>
              { users.map((user, key) => (
                <SearchResult
                  key={user.id}
                  tabIndex={key}
                  onClick={() => {
                    let newItems = selectedItems
                    newItems.push({id: user.id, label: user.username})
                    handleSelectedItems([...newItems])
                    clean()
                  }}
                >
                  <BsPerson size='16' color="#8B8E8F"/>
                  <p>
                    {user.username}
                  </p>
                </SearchResult>
              ))}
            </SearchResults>
          )}


          {/* { showRoles && (
            <RolesList>
              <Role onClick={() => { 
                handleSelectedRole('reporter')
                handleShowRoles(false)
              }}>
                <RoleIconWrapper>
                  <BsCheck size={24} color='#009688'/>
                </RoleIconWrapper>
                <RoleText>
                  <span>Reporter</span>
                  <p>can send in reports to this project from the Tella mobile apps</p>
                </RoleText>
              </Role>
              <Role onClick={() => { 
                handleSelectedRole('viewer')
                handleShowRoles(false)
              }}>
                <RoleIconWrapper>
                  <BsCheck size={24} color='#009688'/>
                </RoleIconWrapper>
                <RoleText>
                  <span>Viewer</span>
                  <p>can browse and view reports submitted to this project</p>
                </RoleText>                
              </Role>
              <Role onClick={() => { 
                handleSelectedRole('editor')
                handleShowRoles(false)
              }}>
                <RoleIconWrapper>
                  <BsCheck size={24} color='#009688'/>
                </RoleIconWrapper>
                <RoleText>
                  <span>Editor</span>
                  <p>can edit and delete reports in this project</p>                
                </RoleText>
              </Role>
              <Role onClick={() => { 
                handleSelectedRole('admin')
                handleShowRoles(false)
              }}>
                <RoleIconWrapper>
                  <BsCheck size={24} color='#009688'/>
                </RoleIconWrapper>
                <RoleText>
                  <span>Admin</span>
                  <p>can add and manage members, and delete the project</p>
                </RoleText>
              </Role>
            </RolesList>
          )} */}
      </AbsoluteContent>
    </Wrapper>
  )
}



const RolePicker = styled.div`
  position: absolute;
  right: 4px;
  top: 6px;
  display: flex;
  align-items: center;
  padding: 10px 4px;

  > span {
    font-size: 10px;
    color: #8B8E8F;
    padding-right: 6px;
    font-weight: 700;
    text-transform: uppercase;
  }

`

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`

const MultiSelect = styled.div`
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #5F6368;
  border-radius: 4px;
  padding: 8px 10px;
  cursor: pointer;
  align-items: center;
  min-height: 50px;

  &:focus-within {
    border: 1px solid #008DEC;
  }

  ${props => props.resultsOpen && `
    border: 1px solid #008DEC;
  `}
`

const Input = styled.span`
  color: #5F6368;
  cursor: text;
  font-size: 12px;
  padding: 2px;
  font-weight: 600;
  width: 100%;

  &:focus-visible {
    outline: none;
  }
`

const Item = styled.div`
  padding: 2px 12px;
  margin-right: 8px;
  margin-bottom: 4px;
  margin-top: 4px;
  border-radius: 4px;
  border: 1px solid #D8D8D8;
  display: flex;
  align-items: center;

  > span {
    font-size: 12px;
    color: #5F6368;
    padding-right: 4px;
  }
`

const Wrapper = styled.div`
  position: relative;
`

const AbsoluteContent = styled.div`
  position: relative;
`

const SearchResults = styled.div`
  position: absolute;
  top: 10px;
  border-radius: 4px;
  border: 1px solid #D8D8D8;
  background: #fff;
  z-index: 2;
  width: 100%;  
`

const RolesList = styled.div`
  position: absolute;
  top: 10px;
  right: 0;
  width: 250px;
  background: #fff;  
  z-index: 2;
  border-radius: 4px;
  border: 1px solid #D8D8D8;
`

const Role = styled.div`
  padding: 10px 12px 10px 2px; 
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background: #EDF5FE;
  }  
`

const RoleText = styled.div`
  padding-left: 4px;

  > span {
    color: #5F6368;
    font-size: 14px;
    font-weight: 600;
  }

  > p {
    font-weight: 400;
    color: #8B8E8F;
    font-size: 11px;
    line-height: 15px;
    padding: 4px 0;
  }

`
const RoleIconWrapper = styled.div`
  visibility: hidden;
  padding: 0 12px;
  
  ${Role}:hover & {
    visibility: visible;
  }
`

const SearchResult = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 12px;

  > p {
    margin-left: 10px;
    font-weight: 700;
    font-size: 12px;
    color: #8B8E8F;
  }

  &:hover {
    background: #EDF5FE;
  }
`