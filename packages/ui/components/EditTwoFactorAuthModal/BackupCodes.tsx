import { FunctionComponent, useState, useEffect } from 'react'

export const BackupCodes: FunctionComponent = () => {
  const [backupCodes, setBackupCodes] = useState([])
  useEffect(() => {
    setBackupCodes([
    '9988 7449', 
    '6045 4131', 
    '0149 6478',
    '8836 9138',
    '2807 0921',
    '4376 8817',
    '4461 8491',
    '5304 2302',
    '5934 7471',
    '5665 4383',
    ])
  }, [])
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
          {backupCodes.map((bc, key) => (
            <div className='pb-1' key={key}>
              <span className='text-gray-500'>{bc}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}