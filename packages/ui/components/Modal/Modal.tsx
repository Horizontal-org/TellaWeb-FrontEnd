import { FunctionComponent, ReactNode } from 'react'
import { ButtonPopup, Button, TextInput } from '../../'
import { btnType as  btnTypes} from '../Button/Button'

type Props = {
  onSubmit?: () => void
  button?: string;
  buttonIcon?: ReactNode;
  submit?: string;
  title?: string;
  subtitle?: string | ReactNode;
  disabled?: boolean;
  render: () => ReactNode;
  btnType?: btnTypes;
  submitButtonType?: btnTypes;
  externalOpen?: boolean,
  onClose?: () => void
}

export const Modal: FunctionComponent<React.PropsWithChildren<Props>> = ({ 
  onSubmit, 
  title, 
  subtitle, 
  render,
  disabled,
  button,
  submit,
  btnType,
  buttonIcon,
  externalOpen,
  onClose,
  submitButtonType
}) => {

  return (
    <ButtonPopup 
      externalOpen={externalOpen}
      onClose={onClose}
      toggleButton={(toggle) => (
        <Button
          icon={buttonIcon}
          text={button}
          onClick={(e: Event) => {
            e.stopPropagation()            
            toggle()            
          }}
          type={btnType}
        />
      )}
      render={(toggle) => (
        <div className='p-4'>
          <p className='text-xxxl text-gray-700 font-bold'>
            { title }
          </p>
          <p className='py-2 font-normal text-sm text-gray-500'>
            { subtitle }
          </p>

          <div className='py-2'>
            { render() }
          </div>

          { onSubmit && (
            <div className='py-4'>
              <Button 
                text='SAVE'
                full={true}
                type={submitButtonType ? submitButtonType : btnTypes.Primary}
                disabled={disabled}
                onClick={() => {
                  onSubmit()
                  if (!externalOpen) {
                    toggle()
                  }
                }}
              />
            </div>
          )}

        </div>
      )}
    />
  )
}