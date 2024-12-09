import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { useRouter } from "next/router";
import { UserPage } from '../../packages/ui/pages/UserPage/UserPage'
import { Menu } from "../../components/Menu";
import { useAuthRequired } from "packages/state/features/auth/authHooks";
import { useToast } from "components/ToastWrapper";
import {
  useUpdateUserMutation,
  useGetByIdQuery,
  useDeleteMutation
} from "packages/state/services/user";

const UserById: FunctionComponent<React.PropsWithChildren<unknown>> = () => {
  
  const router = useRouter();
  const handleToast = useToast()
     
  const [updateUser, updateUserResult] = useUpdateUserMutation();
  const [deleteUser, deleteUserResult] = useDeleteMutation()

  const { data: currentUser, refetch } = useGetByIdQuery(
    "" + router.query.userId
  )

  useEffect(() => {
    if (updateUserResult.isSuccess) {
      handleToast("User updated!", "info");
      router.push(`./${currentUser.id}`)
      refetch()
    }
    if (updateUserResult.error && "status" in updateUserResult.error) {
      handleToast(updateUserResult.error.data.message, "danger");
    }
  }, [updateUserResult.status]);

  useEffect(() => {
    if (deleteUserResult.isSuccess) {
      handleToast("User deleted", "info");
      router.back()
    }
    if (deleteUserResult.error && "status" in deleteUserResult.error) {
      handleToast(deleteUserResult.error.data.message, "danger");
    }
  }, [deleteUserResult.status]);

  return (
    <UserPage 
      sidebar={<Menu />}
      user={currentUser || null}
      onUpdateRole={(role) => {
        updateUser({ 
          id: currentUser.id, 
          username: currentUser.username,
          note: currentUser.note,
          role: role
        });
      }}
      onUpdatePassword={(newPassword) => {
        updateUser({ 
          password: newPassword,
          id: currentUser.id,
          note: currentUser.note,
          role: currentUser.role
        });
      }}
      onUpdateUsername={(username, isAdmin = false) => {
        updateUser({ 
          id: currentUser.id, 
          username: username,
          note: currentUser.note,
          role: currentUser.role
        });
      }}
      onUpdateNote={(note, isAdmin = false) => {
        updateUser({
          id: currentUser.id,
          note: note,
          role: currentUser.role
        })
      }}
      deleteUser={() => {
        deleteUser(currentUser.id)
      }}
    />
  )
}

export default UserById