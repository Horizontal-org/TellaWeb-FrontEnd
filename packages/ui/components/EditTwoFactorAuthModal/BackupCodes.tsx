import { FunctionComponent, useState, useEffect } from 'react'
import { useRecoveryKeyQuery } from 'packages/state/services/auth'
export const BackupCodes: FunctionComponent = () => {

  const [backupCodes, setBackupCodes] = useState<[string] | undefined>()
  const { data } = useRecoveryKeyQuery()

  useEffect(() => {
    setBackupCodes(data)
  }, [data])

  return (
    <>
      <p className='py-2 font-sans text-gray-600 text-xxxl font-bold'>
        Backup codes
      </p>

      <p className='py-2 font-sans text-base text-center font-normal text-gray-500'>
        Use backup codes to log in if you lose access to your authentication app. Keep these backup codes somewhere safe but accessible.     
      </p>
      <div className='flex flex-col items-center'>
        <div className='border w-96 flex flex-col items-center bg-gray-200 py-3'>
          {backupCodes && backupCodes.map((bc, key) => (
            <div className='pb-1' key={key}>
              <span className='text-gray-500'>{bc}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}