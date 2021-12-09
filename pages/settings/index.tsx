import React, { useEffect, useState } from "react";
import { SettingsPage } from '../../packages/ui/pages/SettingsPage/SettingsPage'
import { Menu } from '../../components/Menu'
import { usePloc } from "../_app";
import { usePlocState } from "../../common/usePlocState"
import { useAuthRequired } from "../../common/useAuthRequired"
import { useToast } from '../../components/ToastWrapper'

const Settings = () => {
  useAuthRequired();

  const { user: userPloc } = usePloc();
  const state = usePlocState(userPloc);
  const handleToast = useToast()

  const [currentUser, handleCurrentUser] = useState(null)

  useEffect(() => {
    userPloc.getProfile()
  }, [])

  useEffect(() => {
    if (state.kind === 'PasswordUpdated') {
      handleToast('Password updated!', 'info')
    }

    if (state.kind === 'UsernameUpdated') {
      handleToast('Email updated!', 'info')
      userPloc.getProfile()
    }

    if (state.kind === 'UpdateFailed') {
      handleToast(state.error, 'danger')
    }

    if (state.kind === 'LoadedUser') {
      handleCurrentUser(state.user)
    }

  }, [state.kind])
  

  return (
    <SettingsPage 
      sidebar={<Menu />}
      user={currentUser}
      onUpdatePassword={(currentPassword, newPassword) => {
        userPloc.updatePassword(currentPassword, newPassword)
      }}
      onUpdateUsername={(username) => {
        userPloc.updateUsername(currentUser.id, username)
      }}
    />
  )
}

export default Settings