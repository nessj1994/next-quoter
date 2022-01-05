import type { NextPage } from 'next';
import bcrypt from 'bcryptjs';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Form, Formik, Field } from 'formik';
import useAuth from '../../services/authLib/hooks/useAuth';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import api from 'services/api/apiConnector';
import { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const Login: NextPage = (pageProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user && session?.expires > Date.now().toString()) {
      router.push('/quotes/list');
    }
  });

  useEffect(() => {}, []);

  const handleSubmit = async (e: { Username: string; Password: string }) => {
    const { Username, Password } = e;

    const extraSalty =
      Username.substr(0, 2) + Username.substr(Username.length - 2, 2);
    console.log(e);

    // bcrypt
    //   .hash(extraSalty + Password, '$2a$10$kdIGcQMl8inZeZTJIBZxy.;')
    //   .then(async (hash) => {

    //   });
    await signIn('credentials', {
      username: Username.toLowerCase(),
      password: Password,
      callbackUrl: '/quotes/list',
    });
  };

  // const onKeyDown = (keyEvent) => {
  //   if (keyEvent.getModifierState('CapsLock')) {

  // };

  const initialVals = {};
  return (
    <div className="flex flex-col items-center content-center justify-end flex-1 w-4/5 mx-auto md:px-64 md:py-48 md:mx-0">
      <Image
        src="/we_do_imPossible_b.jpg"
        layout="fill"
        sizes="100%"
        height="2048"
        width="2048"
        alt="bg_we-do-the-imPossible"
      />
      <div className="z-50 flex flex-col items-center w-4/5 py-16 mr-4 bg-white border rounded-lg shadow-md opacity-95">
        <Formik
          enableReinitialize
          initialValues={initialVals}
          validate={() => {}}
          onSubmit={handleSubmit}
        >
          {({ errors, isSubmitting, handleSubmit, values, handleChange }) => (
            <div className="flex flex-col flex-1 w-3/4 h-full gap-12 ">
              <div className="flex flex-col gap-3">
                <h3 className="flex text-3xl font-bold text-nowrap text-porter">
                  Ready to Quote?
                </h3>
                <div>
                  <h2 className="text-3xl font-semibold text-gray-700">
                    Sign in
                  </h2>
                  <div className="flex flex-row gap-1">
                    <p>New user? | </p>
                    <Link href="/auth/register" passHref>
                      <p className="text-porter-accent"> Register here! </p>
                    </Link>
                  </div>
                </div>
              </div>
              <Form className="flex flex-col flex-1 gap-16">
                <div>
                  <div className="mb-4">
                    <label
                      className="block mb-2 font-bold text-gray-700 text-md"
                      htmlFor="username"
                    >
                      Username
                    </label>
                    <Field
                      className="w-full border rounded shadow"
                      type="input"
                      id="username"
                      name="Username"
                    />
                  </div>
                  <div className="columns is-gapless">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <Field
                      as="input"
                      className="w-full border rounded shadow appearance-none"
                      type="password"
                      id="password"
                      name="Password"
                    />
                  </div>
                </div>

                <button
                  disabled={isSubmitting}
                  className="w-2/5 mx-auto text-white rounded-full bg-porter hover:bg-porter-light"
                  type="submit"
                >
                  Login
                </button>
              </Form>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
