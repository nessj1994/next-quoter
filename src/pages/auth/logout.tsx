import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from 'next';
import bcrypt from 'bcryptjs';
import { useRouter } from 'next/router';
import { Form, Formik, Field } from 'formik';
import useAuth from '../../services/authLib/hooks/useAuth';
import axios from 'axios';
import { login } from '../api/users/users';
const Login: NextPage = ({ message }) => {
  const auth = useAuth();
  const router = useRouter();
  const authenticateUser = async () => {};

  const handleIt = async (user: string, pass: string) => {
    const extraSalty = user.substr(0, 2) + user.substr(user.length - 2, 2);

    bcrypt
      .hash(extraSalty + pass, '$2a$10$kdIGcQMl8inZeZTJIBZxy.;')
      .then(async (hash) => {
        let stuff = await auth.login(user, hash);

        console.log(stuff);

        if (stuff) {
          router.push('/quotes/list');
        }
      });
  };

  // const onKeyDown = (keyEvent) => {
  //   if (keyEvent.getModifierState('CapsLock')) {

  // };

  const initialVals = {};
  return <div className="container mx-auto"></div>;
};
export default Login;
