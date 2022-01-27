import "../styles/globals.css";
import "../styles/tailwind.css";
import type { AppProps } from "next/app";
import { dependenciesLocator as plocs } from "packages/bloc";
import { createContext } from "../common/Context";
import { ToastWrapper } from "../components/ToastWrapper";
import { Provider } from "react-redux";
import store from "packages/state/store";

const ploc = {
  file: plocs.provideFilePloc(process.env.NEXT_PUBLIC_API_URL),
  report: plocs.provideReportPloc(process.env.NEXT_PUBLIC_API_URL),
};

export const [blocContext, usePloc] = createContext<typeof ploc>();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <blocContext.Provider value={ploc}>
      <Provider store={store}>
        <ToastWrapper>
          <Component {...pageProps} />
        </ToastWrapper>
      </Provider>
    </blocContext.Provider>
  );
}
export default MyApp;
