import { FunctionComponent, useState } from "react";
import { MainLayout } from "../../layouts/MainLayout";
import { EditEmailModal } from "../../components/EditEmailModal/EditEmailModal";
import { EditPasswordModal } from "../../components/EditPasswordModal/EditPasswordModal";
import { TwoFactorAuthModal } from "packages/ui/components/TwoFactorAuthModal/TwoFactorAuthModal";
import { ButtonMenu } from '../../components/ButtonMenu/ButtonMenu'
import { ButtonOption } from '../../components/ButtonMenu/ButtonOption'
import { ROLES, User } from "packages/state/domain/user";
import { useRouter } from 'next/router'
import { useTranslation } from "next-i18next";
import { btnType } from "../../components/Button/Button";
import { version } from 'package.json'
import { EditTwoFactorAuthModal } from "packages/ui/components/EditTwoFactorAuthModal/EditTwoFactorAuthModal";

type Props = {
  sidebar: React.ReactNode;
  onUpdateUsername: (username: string, confirmPassword: string) => void;
  onUpdatePassword: (currentPassword: string, newPassword: string) => void;
  handleOtpActive: (value: boolean) => void
  user: User | null;
  otpActive: boolean
};

// locale={router.locale === 'en' ? 'de' : 'en'}

export const SettingsPage: FunctionComponent<React.PropsWithChildren<Props>> = ({
  sidebar,
  onUpdateUsername,
  onUpdatePassword,
  handleOtpActive,
  user,
  otpActive
}) => {

  const router = useRouter()
  const { t, i18n } = useTranslation("settings")

  const [editTwoFactorOpen, handleditTwoFactorOpen] = useState<boolean>(false)

  return (
    <MainLayout
      title="Settings"
      subtitle="Change your user and password"
      leftbar={sidebar}
      leftbarActive={false}
      content={
        <div className='px-8'>
          <div className="flex h-10 mb-2"></div>
          <div className="flex justify-between items-center py-4 border-b">
            <div className="flex items-center">
              <p className="text-gray-600 uppercase" style={{ width: 200 }}>
                email
              </p>
              <p>{user ? user.username : ""}</p>
            </div>
            <EditEmailModal 
              withPassword={true}
              isEmail={user && user.role !== ROLES.REPORTER}
              onSubmit={onUpdateUsername}
              title="Please enter the new email address you would like to use to log in Tella" 
            />
          </div>

          <div className="flex justify-between items-center py-4 border-b">
            <div className="flex items-center">
              <p className="text-gray-600 uppercase" style={{ width: 200 }}>
                Password
              </p>
              <p>••••••••••</p>
            </div>
            <EditPasswordModal onSubmit={onUpdatePassword} />
          </div>

          <div className="flex justify-between items-center py-4 border-b">
            <div className="flex items-center">
              <p className="text-gray-600 uppercase" style={{ width: 200 }}>
                TWO-FACTOR AUTHENTICATION
              </p>
              <p>{otpActive ? 'ENABLED' : 'DISABLED'}</p>
            </div>
            { otpActive ? 
              <EditTwoFactorAuthModal handleExternalOpen={handleditTwoFactorOpen} externalOpen={editTwoFactorOpen} handleOtpActive={handleOtpActive}/> :
              <TwoFactorAuthModal handleEditOpen={handleditTwoFactorOpen} handleOtpActive={handleOtpActive} />
            }
          </div>

          <div 
            className="flex justify-between items-center py-4 border-b"
          >
            <div className="flex items-center">
              <p className="text-gray-600 uppercase flex items-center" style={{ width: 200 }}>
                TELLA WEB VERSION                
              </p>
              <p>v{version}</p>            
            </div>                        
          </div>

          {/* HIDE FOR NOW */}
          {/* <div className="flex justify-between items-center py-4 border-b">
            <div className="flex items-center">
              <p className="text-gray-600 uppercase" style={{ width: 200 }}>
                Language
              </p>
              <p>{t(`settings.language.${router.locale}`)}</p>
            </div>
            <ButtonMenu openSide="left" type={btnType.Secondary} text="CHANGE">
              <ButtonOption
                text={t(`settings.language.es`)}
                onClick={() => { 
                  i18n.changeLanguage('es')
                  router.push(router.pathname, router.pathname, { locale: 'es' })
                }}
                color='#8B8E8F'
              />
              <ButtonOption
                text={t(`settings.language.en`)}
                onClick={() => { 
                  i18n.changeLanguage('en')
                  router.push(router.pathname, router.pathname, { locale: 'en' })
                }}
                color='#8B8E8F'
              />
            </ButtonMenu>
          </div> */}
        </div>
      }      
    />
  );
};
