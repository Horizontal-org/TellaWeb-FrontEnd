import { FunctionComponent, useState } from 'react'
import { Button, TextInput } from '../..'


type Props = {
  onSubmit: (currentPassword: string) =>  { otpUrl: string, otpCode: string }
  handleOtpUrl: (otpUrl: string) => void
  handleOtpCode: (otpCode: string) => void
  handleSteps: () => void
  errorMessage?: string
}

export const EnableTwoFactor: FunctionComponent<React.PropsWithChildren<Props>> = ({ 
  onSubmit, 
  handleOtpUrl,
  handleOtpCode,
  handleSteps,
  errorMessage,
}) => {
  const [currentPassword, handleCurrentPassword] = useState<string>('')

  return (
    <>
      <p className='py-2 font-sans text-gray-600 text-xxxl font-bold'>
        Enable two-factor authentication
      </p>
      <p className='font-sans text-sm font-normal text-gray-500'>
        Please enter your password          
      </p>

      <div className='py-4'>
        <TextInput
          name='current-password'
          placeholder='Password'
          type='password'
          value={currentPassword}
          onChange={(e) => { handleCurrentPassword(e.target.value) }}
        />
      </div>

      {errorMessage && (
        <div
          className="w-full p-2 mt-4 mb-2 bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200"
          role="alert"
        >
          {errorMessage}
      </div>
      )}

      <div className='pb-4'>
        <Button 
          text='NEXT'
          full={true}
          disabled={!currentPassword}
          onClick={() => {
            const res = onSubmit(currentPassword)
            handleOtpUrl(res.otpUrl)
            handleOtpCode(res.otpCode)
            handleSteps()
          }}
        />
      </div>
      </>
  )
}