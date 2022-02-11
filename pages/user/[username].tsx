import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { useRouter } from "next/router";
import { UserPage } from '../../packages/ui/pages/UserPage/UserPage'
import { Menu } from "../../components/Menu";
import { useAuthRequired } from "packages/state/features/auth/authHooks";
import { useToast } from "components/ToastWrapper";
import {
  useUpdatePasswordMutation,
  useUpdateUserMutation,
  useLazyGetByUsernameQuery,
  useDeleteMutation
} from "packages/state/services/user";

const UserById: FunctionComponent = () => {
  useAuthRequired();
  
  const router = useRouter();
  const handleToast = useToast()
  const [currentUsername, handleCurrentUsername] = useState<string>()
  const [loadUser, { data: currentUser }] = useLazyGetByUsernameQuery();
  const [updatePassword, updatePasswordResult] = useUpdatePasswordMutation();
  const [updateUser, updateUserResult] = useUpdateUserMutation();
  const [deleteUser, deleteUserResult] = useDeleteMutation()

  const username = useMemo(() => {
    if (router.query?.username && typeof router.query.username !== "string")
      return router.query.username.toString();
    return router.query.username as string;
  }, [router.query?.username]);

  useEffect(() => {
    username && loadUser(username);
    username && handleCurrentUsername(username)
  }, [username, loadUser]);  

  useEffect(() => {
    if (updatePasswordResult.isSuccess) {
      handleToast("Password updated!", "info");
    }
    if (updatePasswordResult.error && "status" in updatePasswordResult.error) {
      handleToast(updatePasswordResult.error.data.message, "danger");
    }
  }, [updatePasswordResult.status]);

  useEffect(() => {
    if (updateUserResult.isSuccess) {
      handleToast("User updated!", "info");
      router.push(`./${currentUsername}`)
      loadUser(currentUsername)
    }
    if (updateUserResult.error && "status" in updateUserResult.error) {
      handleToast(updateUserResult.error.data.message, "danger");
    }
  }, [updateUserResult.status]);

  useEffect(() => {
    if (deleteUserResult.isSuccess) {
      handleToast("Deleted updated!", "info");
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
      onUpdatePassword={(current, newPassword) => {
        updatePassword({ current, new: newPassword });
      }}
      onUpdateUsername={(username, isAdmin = false) => {
        handleCurrentUsername(username)
        updateUser({ 
          id: currentUser.id, 
          username: username,
          note: currentUser.note,
          isAdmin: isAdmin 
        });
      }}
      onUpdateNote={(note, isAdmin = false) => {
        updateUser({
          id: currentUser.id,
          isAdmin: isAdmin,
          note: note
        })
      }}
      deleteUser={() => {
        deleteUser(currentUser.id)
      }}
    />
  )
}

export default UserById