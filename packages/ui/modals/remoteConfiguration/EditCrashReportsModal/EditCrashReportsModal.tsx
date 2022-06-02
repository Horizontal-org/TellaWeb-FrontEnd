import { FunctionComponent, useState } from 'react'
import { Modal } from '../../../components/Modal'
import { RadioGroupInput } from '../../../'
import { btnType } from '../../../components/Button/Button'

interface Props {
  onSubmit: ({}) => void
}

export const EditCrashReportsModal: FunctionComponent<Props> = ({
  onSubmit
}) => {

  const [visibility, handleVisibility] = useState('visible')
  const [enabled, handleEnabled] = useState('enabled')

  return (
    <Modal 
      title='Crash reports'
      button='EDIT'
      btnType={btnType.Secondary}
      subtitle={(
        <div>
          Crash reports help the Tella team identify issues with Tella and fix them as quickly as possible. When the setting is enabled, those reports are sent automatically.
        </div>
      )}
      submit='SAVE'
      disabled={false}
      onSubmit={() => {
        onSubmit({
          visible: visibility === 'visible',
          enabled: enabled === 'enabled',
        })
      }}
      render={() => (
        <div>
          <div>
            <p className='text-sm font-normal text-gray-500'>
              “Share crash reports” should be:
            </p>
            <div className='py-4'>
              <RadioGroupInput 
                onChange={e => handleVisibility(e.target.value)}
                value={visibility}
                elements={[
                  {
                    value: 'visible',
                    name: 'crash-reports-visibility',
                    label: 'Visible (users can enable and disable it)'
                  },
                  {
                    value: 'hidden',
                    name: 'crash-reports-visibility',
                    label: 'Hidden (users cannot enable and disable it)'
                  }
                ]}
              />
            </div>
          </div>
          
          <div>
            <p className='text-sm font-normal text-gray-500'>
              “Share crash reports” should be:
            </p>
            <div className='py-4'>
              <RadioGroupInput 
                onChange={e => handleEnabled(e.target.value)}
                value={enabled}
                elements={[
                  {
                    value: 'enabled',
                    name: 'crash-reports-enabled',
                    label: 'Enabled (users can enable and disable it)'
                  },
                  {
                    value: 'disabled',
                    name: 'crash-reports-enabled',
                    label: 'Disabled (users cannot enable and disable it)'
                  }
                ]}
              />
            </div>
          </div>

        </div>
      )}
    />
  )
}