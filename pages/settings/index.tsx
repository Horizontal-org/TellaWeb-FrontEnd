import React, { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SettingsPage } from "../../packages/ui/pages/SettingsPage/SettingsPage";
import { Menu } from "../../components/Menu";
import { useAuthRequired } from "packages/state/features/auth/authHooks";
import { useUserProfile } from "packages/state/features/user/userHooks";
import { useToast } from "components/ToastWrapper";
import {
  useUpdatePasswordMutation,
  useUpdateUserMutation,
  useUpdateUserSelfMutation
} from "packages/state/services/user";
import { useDispatch } from "react-redux";
import { setUser } from "packages/state/features/user/userSlice";

const Settings = () => {
  
  const user = useUserProfile();
  const dispatch = useDispatch();

  const handleToast = useToast();

  const [updatePassword, updatePasswordResult] = useUpdatePasswordMutation();
  const [updateSelf, updateSelfResult] = useUpdateUserSelfMutation();

  const [otpActive, handleOtpActive] = useState<boolean | null>(null)

  useEffect(() => {
    handleOtpActive(user.otp_active)
  }, [user])


  useEffect(() => {
    if (updatePasswordResult.isSuccess) {
      handleToast("Password updated!", "info");
    }
    if (updatePasswordResult.error && "status" in updatePasswordResult.error) {
      handleToast(updatePasswordResult.error.data.message, "danger");
    }
  }, [updatePasswordResult.status]);

  useEffect(() => {
    if (updateSelfResult.isSuccess) {
      handleToast("Email updated!", "info");
      dispatch(setUser({ ...user, ...updateSelfResult.data }));
    }
    if (updateSelfResult.error && "status" in updateSelfResult.error) {
      handleToast(updateSelfResult.error.data.message, "danger");
    }
  }, [updateSelfResult.status]);

  return (
    <SettingsPage
      sidebar={<Menu />}
      user={user}
      onUpdatePassword={(current, newPassword) => {
        updatePassword({ current, new: newPassword });
      }}
      onUpdateUsername={(username) => {
        updateSelf({ username: username })
      }}
      otpActive={otpActive}
      handleOtpActive={handleOtpActive}
    />
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["settings"])),
    },
  };
}

export default Settings;
