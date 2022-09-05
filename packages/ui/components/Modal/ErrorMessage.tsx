import { FunctionComponent } from 'react'

interface Props {
  message: string;
}

export const ErrorMessage: FunctionComponent<React.PropsWithChildren<Props>> = ({message}) => {
  return (
    <div className="w-full p-2 mt-4  bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200">
      { message }
    </div>
  )
}