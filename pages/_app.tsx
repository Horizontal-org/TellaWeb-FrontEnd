import "../styles/globals.css";
import "../styles/tailwind.css";
import { appWithTranslation } from "next-i18next/pages";
import type { AppProps } from "next/app";
import { ToastWrapper } from "../components/ToastWrapper";
import { Provider } from "react-redux";
import store from "packages/state/store";
import { useRouter } from "next/router";
import { AbilityProvider } from '../common/casl/Can'
import { defaultAbility } from '../common/casl/Ability'
import { SplashScreen } from "packages/ui/components/SplashScreen/SplashScreen";
import ReactModal from "react-modal";

// lets react-modal hide the app from screen readers while a modal is open; skipped on the server (no document)
if (typeof window !== "undefined") ReactModal.setAppElement("#__next");

function TellaWeb({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  return (
    <AbilityProvider value={defaultAbility}>
        <Provider store={store}>
          <ToastWrapper>
            {router.isReady && (
              <SplashScreen>
                <Component {...pageProps} />
              </SplashScreen>
            )}
          </ToastWrapper>
        </Provider>
    </AbilityProvider>
  );
}

export default appWithTranslation(TellaWeb);
