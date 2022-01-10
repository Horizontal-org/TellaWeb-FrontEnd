import React, { useEffect } from "react";
import { SettingsPage } from "../../packages/ui/pages/SettingsPage/SettingsPage";
import { Menu } from "../../components/Menu";
import { useAuthRequired } from "packages/state/features/auth/authHooks";
import { useUserProfile } from "packages/state/features/user/userHooks";
import { useToast } from "components/ToastWrapper";
import {
  useUpdatePasswordMutation,
  useUpdateUserMutation,
} from "packages/state/services/user";
import { useDispatch } from "react-redux";
import { setUser } from "packages/state/features/user/userSlice";

const Settings = () => {
  useAuthRequired();
  const user = useUserProfile();
  const dispatch = useDispatch();

  const handleToast = useToast();

  const [updatePassword, updatePasswordResult] = useUpdatePasswordMutation();
  const [updateUser, updateUserResult] = useUpdateUserMutation();

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
      handleToast("Email updated!", "info");
      dispatch(setUser({ ...user, ...updateUserResult.data }));
    }
    if (updateUserResult.error && "status" in updateUserResult.error) {
      handleToast(updateUserResult.error.data.message, "danger");
    }
  }, [updateUserResult.status]);

  return (
    <SettingsPage
      sidebar={<Menu />}
      user={user}
      onUpdatePassword={(current, newPassword) => {
        updatePassword({ current, new: newPassword });
      }}
      onUpdateUsername={(username) => {
        updateUser({ id: user.id, username });
      }}
    />
  );
};

export default Settings;
