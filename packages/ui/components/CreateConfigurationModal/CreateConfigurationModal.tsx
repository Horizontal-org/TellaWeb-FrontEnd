import { FunctionComponent, useState } from 'react'
import { Modal, ErrorMessage } from '../Modal'
import { TextInput } from '../../'
import { btnType } from '../Button/Button'
import { IoMdAdd } from 'react-icons/io'

interface Props {
  onSubmit: (name: string) => void
}

export const CreateConfigurationModal: FunctionComponent<React.PropsWithChildren<Props>> = ({
  onSubmit
}) => {

  const [showValidations, handleShowValidations] = useState(false)
  const [configurationName, handleConfigurationName] = useState('')

  return (
    <Modal 
      title='New configuration'
      button='NEW'
      btnType={btnType.Primary}
      buttonIcon={<IoMdAdd color='white'/>}
      subtitle='Name your new remote configuration. This name is only visible on Tella Web. Tella users will not see it.'
      submit='SAVE'
      disabled={configurationName.length == 0}
      onSubmit={() => {
        onSubmit(configurationName)
      }}
      render={() => (
        <div>
          <div className='pt-4'>
            <TextInput
              name='name'
              placeholder='Name'
              value={configurationName}
              type='text'
              onChange={(e) => { handleConfigurationName(e.target.value) }}
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

          { showValidations && (
            <>
              { configurationName.length == 0 && (
                <ErrorMessage 
                  message='Configuration name is required'
                />                  
              )}
            </>
          )}       
        </div>
      )}
    />
  )
}