import { FunctionComponent, useState, useEffect } from 'react'

import { OnExitModal } from 'packages/ui/components/TwoFactorAuthModal/OnExitModal';
import { btnType, Button } from 'packages/ui/components/Button/Button';
import { GlobalSetting } from 'packages/state/domain/global-setting';
import { lowerCase } from 'lodash';
import { ButtonPopup } from 'packages/ui/components/ButtonPopup/ButtonPopup';
import { Backup, LatestBackups } from 'packages/state/domain/backup';
import { format } from 'date-fns';

type Props = {
  backups: LatestBackups
  onBackupStart: () => void
  // onToggle: (value: boolean) => void
};

export const StartBackupModal: FunctionComponent<React.PropsWithChildren<Props>> = ({
  backups,
  onBackupStart
  // onToggle
}) => {
  // const [onExitModal, handleOnExitModal] = useState<boolean>(false) 
  // const [externalOpen, handleExternalOpen] = useState<boolean>(false)

  const handleExitProgress = () =>{
    // handleOnExitModal(false)
    // handleExternalOpen(false)
  }

  return (
    <ButtonPopup       
      onClose={() => {
        // handleExternalOpen(false)
        // handleOnExitModal(true)
      }} 
      toggleButton={(toggle) => (
        <Button
          text="GENERATE "
          onClick={toggle}
          disabled={!!(backups.processing)}
          type={btnType.Secondary}
        />
      )}
      render={(toggle) => (
        <div className='px-4'>

          {/* {onExitModal && <OnExitModal 
            isOpen={onExitModal} 
            text='Changes you made will not be saved.'
            buttonText='Cancel'
            onClose={() => handleOnExitModal(false)} 
            onExitProgress={() => handleExitProgress()}          
          />} */}

          <div>
            <p className='py-2 font-sans text-gray-600 text-xxxl font-bold'>
              {`Generate backup?`}
            </p>
            
            { backups.latest && (
              <p className='font-sans text-sm font-normal text-gray-500'>
                If you generate a new backup, your previous backup from { format(new Date(backups.latest.createdAt), "dd LLLL yyyy 'at' HH:mm") } will be deleted. Make sure to download that backup if you don’t want to lose it before generating a new one.
              </p>
            )}

          </div>

          <div className='py-4 flex justify-end'>
            <Button 
              text="GENERATE BACKUP"
              
              onClick={() => {                
                toggle()
                onBackupStart()
              }}
            />
          </div>
        </div>
      )}
    />
  )
}