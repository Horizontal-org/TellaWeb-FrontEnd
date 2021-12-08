import { FunctionComponent, useState, useEffect } from 'react'
import { MainLayout } from '../../layouts/MainLayout'
import { User } from '../../../bloc'
import { EditEmailModal } from '../../components/EditEmailModal/EditEmailModal'
import { EditPasswordModal } from '../../components/EditPasswordModal/EditPasswordModal'

type Props = {
  sidebar: React.ReactNode
  onUpdateUsername: (username: string) => void
  onUpdatePassword: (currentPassword: string, newPassword: string) => void
  user: User | null
}


export const SettingsPage: FunctionComponent<Props> = ({
  sidebar,
  onUpdateUsername,
  onUpdatePassword,
  user
}) => {

  return (
    <MainLayout 
      title='Settings'
      subtitle='Change your user and password'
      leftbar={sidebar}
      content={
        <div>
          <div className='flex h-10 mb-2'></div>
          <div className='flex justify-between items-center py-4 border-b'>
            <p className='text-gray-600 uppercase'>
              email
            </p>
            <p>
              { user ? user.username : '' }
            </p>
            <EditEmailModal 
              onSubmit={onUpdateUsername}
            />
          </div>

          <div className='flex justify-between items-center py-4 border-b'>
            <p className='text-gray-600 uppercase'>
              Password
            </p>
            <EditPasswordModal 
              onSubmit={onUpdatePassword}
            />
          </div>
        </div>
      }
    />
  )
}