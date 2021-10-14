import '../../styles/globals.css';
import type { AppProps } from 'next/app';
// import 'bootstrap/dist/css/bootstrap.css';
import { AuthProvider } from '../authLib/contexts/auth-provider/authProvider';
import { Navbar } from '../components/containers/Navbar';
import { Provider } from 'react-redux';
import { store, history } from 'store/store';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AuthProvider navigate={null}>
        <Navbar />
        <Component {...pageProps} />
      </AuthProvider>
    </Provider>
  );
}
export default MyApp;
