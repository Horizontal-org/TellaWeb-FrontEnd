import "../styles/globals.css";
import "../styles/tailwind.css";
import type { AppProps } from "next/app";
import { dependenciesLocator as plocs } from "packages/bloc";
import { createContext } from "../common/Context";

const ploc = {
  auth: plocs.provideAuthPloc(process.env.NEXT_PUBLIC_API_URL),
  file: plocs.provideFilePloc(process.env.NEXT_PUBLIC_API_URL),
  report: plocs.provideReportPloc(process.env.NEXT_PUBLIC_API_URL),
  user: plocs.provideUserPloc(process.env.NEXT_PUBLIC_API_URL)
};

export const [blocContext, usePloc] = createContext<typeof ploc>();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <blocContext.Provider value={ploc}>
      <Component {...pageProps} />
    </blocContext.Provider>
  );
}
export default MyApp;
