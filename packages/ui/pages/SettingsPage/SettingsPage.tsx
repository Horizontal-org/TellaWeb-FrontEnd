import { FunctionComponent } from "react";
import { MainLayout } from "../../layouts/MainLayout";
import { EditEmailModal } from "../../components/EditEmailModal/EditEmailModal";
import { EditPasswordModal } from "../../components/EditPasswordModal/EditPasswordModal";
import { ButtonMenu } from '../../components/ButtonMenu/ButtonMenu'
import { ButtonOption } from '../../components/ButtonMenu/ButtonOption'
import { ROLES, User } from "packages/state/domain/user";
import { useRouter } from 'next/router'
import { useTranslation } from "next-i18next";
import { btnType } from "../../components/Button/Button";
import { version } from 'package.json'

type Props = {
  sidebar: React.ReactNode;
  onUpdateUsername: (username: string) => void;
  onUpdatePassword: (currentPassword: string, newPassword: string) => void;
  user: User | null;
};

// locale={router.locale === 'en' ? 'de' : 'en'}

export const SettingsPage: FunctionComponent<Props> = ({
  sidebar,
  onUpdateUsername,
  onUpdatePassword,
  user,
}) => {

  const router = useRouter()
  const { t, i18n } = useTranslation("settings")

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
          </div>
        </div>
      }
      footer={(
        <div
          className="flex text-sm justify-center w-full p-6" 
          style={{ 
            position: 'absolute', 
            bottom: '0',
            marginLeft: '-60px'
          }}>
            Server version: v{version}
        </div>
      )}
    />
  );
};
