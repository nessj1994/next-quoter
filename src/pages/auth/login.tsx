import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from 'next';
import bcrypt from 'bcryptjs';
import { useRouter } from 'next/router';
import { Form, Formik, Field } from 'formik';
import useAuth from '../../authLib/hooks/useAuth';
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
        let stuff = await login({ email: user, password: hash });

        console.log(stuff);

        if (stuff) {
          router.push('/quotes/list');
        }
      });
  };

  const initialVals = {};
  return (
    <div className="container mx-auto">
      <Formik
        enableReinitialize
        initialValues={initialVals}
        validate={() => {}}
        onSubmit={(values, { setSubmitting }) => {
          //   console.log(values);
          //   setSubmitting(true);
          //   handleSave(values);
          //   setSubmitting(false);
        }}
      >
        {({ errors, isSubmitting, handleSubmit, values, handleChange }) => (
          <div className="container">
            <div className="mx-auto text-center">
              <h1 className="font-bold">Welcome</h1>
            </div>
            <div className="mx-auto  w-full max-w-xs">
              <Form className="bg-gray-300 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <Field
                    className="shadow border rounded w-full"
                    type="input"
                    id="username"
                    name="Username"
                  />
                </div>
                <div className="columns is-gapless">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <Field
                    as="input"
                    className="shadow appearance-none border rounded w-full"
                    type="password"
                    id="password"
                    name="Password"
                  />
                </div>
                <button
                  disabled={isSubmitting}
                  className="bg-blue-400 hover:bg-blue-700 hover:rotate-90"
                  onClick={(e: any) => {
                    e.preventDefault();
                    const password = document.getElementById(
                      'password',
                    )! as HTMLInputElement;
                    const username = document.getElementById(
                      'username',
                    )! as HTMLInputElement;
                    if (password.value) {
                      handleIt(username.value, password.value);
                    }
                  }}
                >
                  Login
                </button>
              </Form>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default Login;
