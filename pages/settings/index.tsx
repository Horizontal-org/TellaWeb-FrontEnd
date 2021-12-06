import React from "react";
import { SettingsPage } from '../../packages/ui/pages/SettingsPage/SettingsPage'
import { Menu } from '../../components/Menu'
import { usePloc } from "../_app";
import { usePlocState } from "../../common/usePlocState";

const Settings = () => {

  const { user: userPloc } = usePloc();
  const state = usePlocState(userPloc);

  console.log(state)

  const validateEmail = (email) => {
    userPloc.validateEmail(email)
  }

  return (
    <SettingsPage 
      sidebar={<Menu />}
      onValidateEmail={validateEmail}
      mailAvailable={state?.mailAvailable}
      onUpdateUsername={(username) => {
        console.log('update ', username)
      }}
    />
  )
}

export default Settings