import { SessionProvider } from "next-auth/react";
import "tailwindcss/tailwind.css";
// To implement REcoil we need first to import it and then we want to use the <RecoilRoot> HOC COMPONENT
// and wrap the main component.
import { RecoilRoot } from "recoil";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  );
}

export default MyApp;
