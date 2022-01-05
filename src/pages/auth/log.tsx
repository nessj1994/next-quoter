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
import { useSession, signOut, signIn } from 'next-auth/react';

import Image from 'next/image';
export default function Log({}) {
  const auth = useAuth();
  const router = useRouter();
  const authenticateUser = async () => {};

  const handleSubmit = async (e: { Username: string; Password: string }) => {
    const { Username, Password } = e;

    const extraSalty =
      Username.substr(0, 2) + Username.substr(Username.length - 2, 2);
    console.log(e);

    bcrypt
      .hash(extraSalty + Password, '$2a$10$kdIGcQMl8inZeZTJIBZxy.;')
      .then(async (hash) => {
        // let stuff = await auth.login(user, hash);
        await signIn('credentials', {
          username: Username.toLowerCase(),
          password: hash,
          callbackUrl: '/quotes/list',
        });

        // if (stuff) {
        // }
      });
  };

  // const onKeyDown = (keyEvent) => {
  //   if (keyEvent.getModifierState('CapsLock')) {

  // };

  const initialVals = {};

  return (
    <div className="flex flex-col justify-center flex-1 w-3/5 px-16 py-3 border min-h-3/5 h-3/5 ">
      <div className="grid flex-1 min-h-full grid-flow-row md:grid-flow-cols grid-rows-auto">
        {/* <div className=" image-container">
          <p className="text-4xl text-white ">Porter Athletic</p>
          <Image
            src="/we_do_imPossible_b.jpg"
            alt="Do the Impossible"
            layout="fill"
            className="image"
          />
        </div> */}
        <div className="items-center ">
          <Formik
            enableReinitialize
            initialValues={initialVals}
            validate={() => {}}
            onSubmit={handleSubmit}
          >
            {({ errors, isSubmitting, handleSubmit, values, handleChange }) => (
              <div className="flex flex-col gap-8">
                <div className="flex">
                  <h1 className="text-3xl font-semibold font">Sign in</h1>
                </div>

                <Form className="flex flex-col">
                  <div className="">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700"
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
                  <div className="mb-4 columns is-gapless">
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
                  <button
                    disabled={isSubmitting}
                    className="bg-blue-400 hover:bg-blue-700 "
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
    </div>
  );
}
