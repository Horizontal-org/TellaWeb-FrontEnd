import { FunctionComponent, useState } from 'react'
import { Button, TextInput } from '../..'


type Props = {
  onSubmit: (currentPassword: string) =>  void
  handleSteps?: () => void
  errorMessage?: boolean
  title: string
}

export const ConfirmPassword: FunctionComponent<React.PropsWithChildren<Props>> = ({ 
  title,
  onSubmit, 
  errorMessage,
}) => {
  const [currentPassword, handleCurrentPassword] = useState<string>('')

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(currentPassword)
    }}>
      <p className='py-2 font-sans text-gray-600 text-xxxl font-bold'>
        {title}
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
          Password is incorrect. Please try again
      </div>
      )}

      <div className='pb-4'>
        <button
          className="bg-blue-300 hover:bg-blue py-2 text-white uppercase text-base font-bold rounded w-full disabled:opacity-50"
          id="login"
          disabled={!currentPassword}
          type={"submit"}
        >
          <span>NEXT</span>
        </button>
      </div>
    </form>
  )
}