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
} from "packages/state/services/user";
import { useEnableMutation, useActivateMutation } from "packages/state/services/auth";
import { useDispatch } from "react-redux";
import { setUser } from "packages/state/features/user/userSlice";

const Settings = () => {
  
  const user = useUserProfile();
  const dispatch = useDispatch();

  const handleToast = useToast();

  const [updatePassword, updatePasswordResult] = useUpdatePasswordMutation();
  const [updateUser, updateUserResult] = useUpdateUserMutation();
  const [enableOtp, enableOtpResult] = useEnableMutation();
  const [activateOtp, activateOtpResult] = useActivateMutation();

  const [otpData, handleOtpData] = useState<{otpCode: string, otpUrl: string} | null>(null)


  useEffect(() => {
    if (updatePasswordResult.isSuccess) {
      handleToast("Password updated!", "info");
    }
    if (updatePasswordResult.error && "status" in updatePasswordResult.error) {
      handleToast(updatePasswordResult.error.data.message, "danger");
    }
  }, [updatePasswordResult.status]);

  useEffect(() => {
    if(enableOtpResult.isSuccess) {
      handleOtpData({
        otpCode: enableOtpResult.data.otp_code,
        otpUrl: enableOtpResult.data.otp_url
      })
    }
    console.log('enableOtpResult', enableOtpResult)
  }, [enableOtpResult])

  useEffect(() => {
    console.log(activateOtpResult)
    if(activateOtpResult.isSuccess) {
      handleToast("You have succesfully enabled two-factor authentication!" , "success")
    }
  }, [activateOtpResult])

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
        updateUser({ 
          id: user.id, 
          username: username,
          role: user.role
        });
      }}
      onTwoFactorAuthGenerate={(currentPassword) => {
        enableOtp({
          password: currentPassword
        })
      }}
      onActivateTwoFactor={(code) => {
        activateOtp({
          code: code
        })
      }}
      otpData={otpData}
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
