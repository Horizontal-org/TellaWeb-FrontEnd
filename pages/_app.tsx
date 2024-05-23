import "../styles/globals.css";
import "../styles/tailwind.css";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import { ToastWrapper } from "../components/ToastWrapper";
import { Provider } from "react-redux";
import store from "packages/state/store";
import { useRouter } from "next/router";
import { AbilityContext } from '../common/casl/Can'
import { defaultAbility } from '../common/casl/Ability'
import { SplashScreen } from "packages/ui/components/SplashScreen/SplashScreen";

function TellaWeb({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  return (
    <AbilityContext.Provider value={defaultAbility}>
        <Provider store={store}>
          <ToastWrapper>
            {router.isReady && (
              <SplashScreen>
                <Component {...pageProps} />
              </SplashScreen>
            )}
          </ToastWrapper>
        </Provider>
    </AbilityContext.Provider>
  );
}

export default appWithTranslation(TellaWeb);
