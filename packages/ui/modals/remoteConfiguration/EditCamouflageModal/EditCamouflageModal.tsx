import { FunctionComponent, useState, ChangeEventHandler } from 'react'
import { Modal, ErrorMessage } from '../../../components/Modal'
import { RadioGroupInput, Checkbox } from '../../../'
import { btnType } from '../../../components/Button/Button'

interface Props {
  onSubmit: ({}) => void
}

export const EditCamouflageModal: FunctionComponent<Props> = ({
  onSubmit
}) => {

  const [nameChecked, handleNameChecked] = useState(false)
  const [hideCalcChecked, handleHideCalcChecked] = useState(false)
  const [visibility, handleVisibility] = useState('visible')
  return (
    <Modal 
      title='Camouflage'
      button='EDIT'
      btnType={btnType.Secondary}
      subtitle={(
        <div>
          Camouflage hides the Tella app on the user’s device. <br/>
          When Camouflage is visible, users can select one of three options:<br/>
        
          - Keep Tella in its default look (with the Tella icon and name)<br/>
          - Select a custom icon and name<br/>
          - Hide Tella behind a fully functional calculator<br/>
        </div>
      )}
      submit='SAVE'
      disabled={false}
      onSubmit={() => {
        onSubmit({
          visible: visibility === 'visible',
          calculator: hideCalcChecked,
          change_name: nameChecked
        })
      }}
      render={() => (
        <div>
          <div>
            <p className='text-sm font-normal text-gray-500'>
              Camouflage should be:
            </p>
            <div className='py-4'>
              <RadioGroupInput 
                onChange={e => handleVisibility(e.target.value)}
                value={visibility}
                elements={[
                  {
                    value: 'visible',
                    name: 'camo-visibility',
                    label: 'Visible (users can enable and disable it)'
                  },
                  {
                    value: 'hidden',
                    name: 'camo-visibility',
                    label: 'Hidden (users cannot enable and disable it)'
                  }
                ]}
              />
            </div>
          </div>

          <div>
            <p className='text-sm font-normal text-gray-500'>
              The Camouflage options available to the user should innclude:
            </p>

            <div className='py-4'>
              <Checkbox 
                checked={nameChecked}
                label='Change name and icon'
                onChange={() => {
                  handleNameChecked(!nameChecked)
                }}
              />
            </div>

            <div className=''>
              <Checkbox 
                checked={hideCalcChecked}
                label='Hide behind a calculator'
                onChange={() => {
                  handleHideCalcChecked(!hideCalcChecked)
                }}
              />
            </div>


          </div>
        </div>
      )}
    />
  )
}