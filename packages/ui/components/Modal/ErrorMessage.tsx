import { FunctionComponent } from 'react'

interface Props {
  message: string;
  id?: string;
}

export const ErrorMessage: FunctionComponent<React.PropsWithChildren<Props>> = ({message, id}) => {
  return (
    <div id={id} className="w-full p-2 mt-4  bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200">
      { message }
    </div>
  )
}
