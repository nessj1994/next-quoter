import '../../styles/globals.scss';
import type { AppProps } from 'next/app';
// import 'bootstrap/dist/css/bootstrap.css';
import { AuthProvider } from '../services/authLib/contexts/auth-provider/authProvider';
import { Navbar } from '../components/containers/Navbar';
import { Provider } from 'react-redux';
import { store, history } from 'store/store';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <Provider store={store}>
      <AuthProvider navigate={router}>
        <div className=" flex flex-col md:flex-row md:min-h-screen ">
          {router.pathname !== '/auth/login' && <Navbar />}
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </Provider>
  );
}
export default MyApp;
