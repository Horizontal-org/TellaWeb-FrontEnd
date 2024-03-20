import { FunctionComponent } from 'react'
import { Button, btnType } from '../Button/Button'
type Props = {
  handleDisable?: () => void
  handleSeeCodes?: () => void
}

export const Init: FunctionComponent<React.PropsWithChildren<Props>> = ({
  handleDisable,
  handleSeeCodes
}) => {

  return (
    <>
      <p className='py-2 font-sans text-gray-600 text-xxxl font-bold'>
        Edit two-factor authentication
      </p>

      <p className='pb-4 font-sans text-base font-normal text-gray-500'>
        Edit your settings for two-factor authentication      
      </p>

      <div>
        <div className='pb-4'>
          <div>Disable two-factor authentication</div>
          <div className='flex justify-between items-center'>
            <div>
              <span className='pb-4 font-sans text-base font-normal text-gray-500'>
                This will remove the extra security on your account and you’ll only use your password to sign in.
              </span>
            </div>
            <div>
              <Button 
                text='DISABLE'
                onClick={handleDisable}
                type={btnType.Secondary}
              />
            </div>
          </div>
        </div>

        <div>
          <div>Back up codes</div>
          <div className='flex justify-between items-center'>
            <div>
              <span className='pb-4 font-sans text-base font-normal text-gray-500'>
                This will remove the extra security on your account and you’ll only use your password to sign in.
              </span>
            </div>
            <div>
              <Button 
                text='SHOW CODES'
                onClick={handleSeeCodes}
                type={btnType.Secondary}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}