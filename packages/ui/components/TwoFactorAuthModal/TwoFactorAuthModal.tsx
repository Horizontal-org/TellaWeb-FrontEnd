import { FunctionComponent, useState } from 'react'
import { ButtonPopup, Button, TextInput } from '../..'
import { btnType } from '../Button/Button'
import { EnableTwoFactor } from './EnableTwoFactor'
import { Connect } from './Connect'
import { FinalStep } from './FinalStep'
import { OnExitModal } from './OnExitModal'
import { OtpData } from 'packages/state/domain/user'

type Props = {
  onSubmit: (currentPassword: string) =>  void
  onActivate: (code: string) => void
  otpData: OtpData | null
}

export const TwoFactorAuthModal: FunctionComponent<React.PropsWithChildren<Props>> = ({ onSubmit, otpData, onActivate }) => {
  const [step, handleSteps] = useState<number>(1)
  const [onExitModal, handleOnExitModal] = useState<boolean>(false) 
  const [externalOpen, handleExternalOpen] = useState<boolean>(false)

  const handleExitProgress = () =>{
    handleSteps(1)
    handleOnExitModal(false)
    handleExternalOpen(false)
  }

  return (
    <ButtonPopup 
      externalOpen={externalOpen}
      onClose={() => {
        handleExternalOpen(true)
        handleOnExitModal(true)
      }} 
      toggleButton={(toggle) => (
        <Button
          text="ENABLE"
          onClick={toggle}
          type={btnType.Secondary}
        />
      )}
      render={(toggle) => (
        <div className='p-4'>
          {onExitModal && <OnExitModal 
            isOpen={onExitModal} 
            onClose={() => handleOnExitModal(false)} 
            onExitProgress={() => handleExitProgress()}
          
          />}
          {step === 1 && (
            <EnableTwoFactor 
              onSubmit={onSubmit}
              handleSteps={() => handleSteps(step + 1)}
            />
          )}

          {step === 2 && (
            <>
              <Connect 
                otpCode={otpData?.otpCode}
                otpUrl={otpData?.otpUrl}
                handleSteps={() => handleSteps(step + 1)}
              />
            </>
          )}

          {step === 3 && (
            <>
              <FinalStep 
                onActivate={onActivate}
              />
            </>
          )}
        </div>
      )}
    />
  )
}