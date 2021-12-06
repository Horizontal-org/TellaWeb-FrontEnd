import React, { useEffect } from 'react'
import { LogoutPage } from '../../packages/ui/pages/LogoutPage/LogoutPage'
import { usePloc } from "../_app"

const Logout = () => {
  const { auth: authPloc } = usePloc()

  useEffect(() => {
    authPloc.logout()
  }, [])

  
  return (
    <LogoutPage />
  )
}

export default Logout