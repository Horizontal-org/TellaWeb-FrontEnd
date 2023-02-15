import { FunctionComponent, useState, useEffect } from 'react'
import { ButtonPopup, Button, TextInput } from '../..'
import { btnType } from '../Button/Button'
import { DisableTwoFactorModal } from '../DisableTwoFactor/DisableTwoFactor'
import { Init } from './Init'
import { BackupCodes } from './BackupCodes'
export enum Steps  {
  INIT = "init",
  DISABLE = "disable",
  CODES = 'codes'
}

type Props = {
  handleOtpActive: (value: boolean) => void;
  handleExternalOpen: (value: boolean) => void;
  externalOpen: boolean;
};

export const EditTwoFactorAuthModal: FunctionComponent<React.PropsWithChildren<Props>> = ({
  handleOtpActive,
  handleExternalOpen,
  externalOpen
}) => { 
  const [steps, handleSteps] = useState<Steps>(Steps.INIT)
  return (
    <ButtonPopup
       externalOpen={externalOpen}
      onClose={() =>  {
        handleSteps(Steps.INIT)
        handleExternalOpen(false)
      }}
      toggleButton={(toggle) => (
        <Button
          text="EDIT"
          onClick={toggle}
          type={btnType.Secondary}
        />
      )}
      render={(toggle) => (
        <div className='p-4'>
          {steps === Steps.INIT && (
            <Init
              handleDisable={() => handleSteps(Steps.DISABLE)}
              handleSeeCodes={() => handleSteps(Steps.CODES)}
            />
          )}
          {steps === Steps.DISABLE && (
            <DisableTwoFactorModal handleOtpActive={handleOtpActive} toggle={toggle} />
          )}
          {steps === Steps.CODES && (
            <BackupCodes />
          )}
        </div>
      )}
    />
  )
}