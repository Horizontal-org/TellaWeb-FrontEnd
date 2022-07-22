import { FunctionComponent, ReactNode } from 'react'
import { ButtonPopup, Button, TextInput } from '../../'
import { btnType } from '../Button/Button'

type Props = {
  onSubmit?: () => void
  button?: string;
  buttonIcon?: ReactNode;
  submit?: string;
  title?: string;
  subtitle?: string | ReactNode;
  disabled?: boolean;
  render: () => ReactNode;
  btnType?: btnType;
}

export const Modal: FunctionComponent<Props> = ({ 
  onSubmit, 
  title, 
  subtitle, 
  render,
  disabled,
  button,
  submit,
  btnType,
  buttonIcon
}) => {

  return (
    <ButtonPopup 
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

          {/* <div className='pt-4'>
            <TextInput
              name='username'
              placeholder='Email'
              value={username}
              onChange={(e) => { handleUsername(e.target.value) }}
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
          <div className='py-4'>
            <TextInput
              name='password'
              placeholder='Password'
              value={password}
              type='password'
              onChange={(e) => { handlePassword(e.target.value) }}
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
          <div>
            <TextInput
              name='confirm-password'
              placeholder='Confirm Password'
              value={confirmPassword}
              type='password'
              onChange={(e) => { handleConfirmPassword(e.target.value) }}
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

          <div className='pt-4'>
            <label className='pr-2 font-sans text-gray-500 text-sm' htmlFor='is-admin'>Is admin ?</label>
            <input
              name='is-admin' 
              type='checkbox'
              checked={isAdmin}
              onChange={() => {
                handleIsAdmin(!isAdmin)
              }}
            />
          </div>

          { showValidations && (
            <>
              { username.length > 0 && !(/\S+@\S+\.\S+/.test(username)) && (
                <div className="w-full p-2 mt-4 mb-4 bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200">
                  Please enter a valid email address.
                </div>
              )}

              { !(confirmPassword === password) && (
                <div className="w-full p-2 mt-4  bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200">
                  The passwords do not match
                </div>
              )}
            </>
          )}          

           */}

          { onSubmit && (
            <div className='py-4'>
              <Button 
                text='SAVE'
                full={true}
                disabled={disabled}
                onClick={() => {
                  onSubmit()
                  toggle()
                }}
              />
            </div>
          )}

        </div>
      )}
    />
  )
}