import { FunctionComponent, useState, useEffect } from 'react'
import { Modal, ErrorMessage } from '../../../components/Modal'
import { TextInput } from '../../../'
import { btnType } from '../../../components/Button/Button'
import { IoMdAdd } from 'react-icons/io'

interface Props {
  currentUrl: string;
  onSubmit: (name: string) => void;
}

export const EditUrlProjectModal: FunctionComponent<React.PropsWithChildren<Props>> = ({
  onSubmit,
  currentUrl,
}) => {

  const [url, handleUrl] = useState<string>('')
  const [showValidations, handleShowValidations] = useState(false)
  
  useEffect(() => {
    handleUrl(currentUrl)
  }, [currentUrl])

  return (
    <Modal 
      title='Edit URL'
      button='EDIT'
      btnType={btnType.Secondary}
      subtitle='Type in the URL you would like Tella users to use to connect to this project'
      submit='SAVE'
      disabled={!(url && url.length > 0)}
      onSubmit={() => {
        onSubmit(url)

        handleUrl('')
      }}
      render={() => (
        <div>
          <div className='pt-4'>
            <TextInput
              name='url'
              placeholder='URL'
              value={url}
              onChange={(e) => { handleUrl(e.target.value) }}
              onFocus={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  handleShowValidations(false)
                }
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  handleShowValidations(true)
                }
              }}
            />
          </div>          

        </div>
      )}
    />
  )
}