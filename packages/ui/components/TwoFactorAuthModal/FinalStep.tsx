import { FunctionComponent } from 'react'
import { Button } from '../..'

type Props = {
  toggle: () => void 
}

export const FinalStep: FunctionComponent<React.PropsWithChildren<Props>> = ({ 
  toggle
}) => {

  return (
    <>
      <p className='py-2 font-sans text-gray-600 text-xxxl font-bold'>
        Final step
      </p>
      <p className='font-sans text-sm font-normal text-gray-500'>
        Enter the 6-digit code from your authentication app        
      </p>

      <div className='pb-4'>
        <Button 
          text='VERIFY'
          full={true}
          onClick={() => {
            toggle()
          }}
        />
      </div>
    </>
  )
}