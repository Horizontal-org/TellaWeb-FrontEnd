import "../styles/globals.css";
import "../styles/tailwind.css";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import { ToastWrapper } from "../components/ToastWrapper";
import { Provider } from "react-redux";
import store from "packages/state/store";
import { useRouter } from "next/router";

function TellaWeb({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <Provider store={store}>
      <ToastWrapper>
        {router.isReady && <Component {...pageProps} />}
      </ToastWrapper>
    </Provider>
  );
}

export default appWithTranslation(TellaWeb);
