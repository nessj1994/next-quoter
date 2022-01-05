import '../../styles/globals.scss';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from 'store/store';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import Layout from 'components/containers/Layout';
import AuthRoute from 'components/containers/AuthRoute';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <Layout>
          {Component.auth ? (
            <AuthRoute>
              <Component {...pageProps} />
            </AuthRoute>
          ) : (
            <Component {...pageProps} />
          )}
        </Layout>
      </SessionProvider>
    </Provider>
  );
}

export default MyApp;
