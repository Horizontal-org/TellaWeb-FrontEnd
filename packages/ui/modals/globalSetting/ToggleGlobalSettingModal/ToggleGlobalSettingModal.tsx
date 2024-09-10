import { FunctionComponent, useState, useEffect } from 'react'
import { ButtonPopup, Button } from '../../..'

import { OnExitModal } from 'packages/ui/components/TwoFactorAuthModal/OnExitModal';
import { btnType } from 'packages/ui/components/Button/Button';
import { GlobalSetting } from 'packages/state/domain/global-setting';
import { lowerCase } from 'lodash';

type Props = {
  globalSetting: GlobalSetting
  onToggle: (value: boolean) => void
};

export const ToggleGlobalSettingsModel: FunctionComponent<React.PropsWithChildren<Props>> = ({
  globalSetting,
  onToggle
}) => {
  // const [onExitModal, handleOnExitModal] = useState<boolean>(false) 
  const [externalOpen, handleExternalOpen] = useState<boolean>(false)

  const handleExitProgress = () =>{
    // handleOnExitModal(false)
    handleExternalOpen(false)
  }

  return (
    <ButtonPopup 
      externalOpen={externalOpen}
      onClose={() => {
        handleExternalOpen(false)
        // handleOnExitModal(true)/
      }} 
      toggleButton={(toggle) => (
        <Button
          text={globalSetting.enabled ? 'DISABLE' : 'ENABLE'}
          onClick={toggle}
          type={btnType.Secondary}
        />
      )}
      render={(toggle) => (
        <div className='p-4'>

          {/* {onExitModal && <OnExitModal 
            isOpen={onExitModal} 
            text='Changes you made will not be saved.'
            buttonText='Cancel'
            onClose={() => handleOnExitModal(false)} 
            onExitProgress={() => handleExitProgress()}          
          />} */}

          <div>
            <p className='py-2 font-sans text-gray-600 text-xxxl font-bold'>
              {`${globalSetting.enabled ? 'Disable': 'Enable'} ${lowerCase(globalSetting.name)} ?`}
            </p>
            <p className='font-sans text-sm font-normal text-gray-500'>
              This change will impact all users on your Tella Web instance
            </p>
          </div>

          <div className='py-4'>
            <Button 
              text={globalSetting.enabled ? 'DISABLE' : 'ENABLE'}
              full={true}
              onClick={() => {
                onToggle(!globalSetting.enabled)
                toggle()
              }}
            />
          </div>
        </div>
      )}
    />
  )
}