import { NextPage } from 'next';
import addSalt from '../../utils/salt-shaker';
import { Formik, Form, FormikErrors } from 'formik';
import { InputField } from '../../components/modules/Form/InputField';

import Image from 'next/image';
import Link from 'next/link';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import bcrypt from 'bcryptjs';
import axios from 'axios';

interface NewUserValues {
  FirstName: string;
  LastName: string;
  Username: string;
  Email: string;
  Company?: string | '' | undefined;
  Password: string;
  PasswordVerify: string;
}

const Register: NextPage<{}> = ({}) => {
  const router = useRouter();

  const handleSubmit = async (e: {
    FirstName: string;
    LastName: string;
    Username: string;
    Password: string;
  }) => {
    const { FirstName, LastName, Username, Password } = e;

    const extraSalty =
      Username.substr(0, 2) + Username.substr(Username.length - 2, 2);
    console.log(e);

    bcrypt
      .hash(extraSalty + Password, '$2a$10$kdIGcQMl8inZeZTJIBZxy.;')
      .then(async (hash) => {
        let results = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_HOST}/inferno/v1/users/register`,
          {
            ...e,
            Password: hash,
            PasswordVerify: hash,
          },
        );
        console.log(hash);
        console.log(results);
        router.push('/auth/login');
      });
  };
  const initialVals = {};

  return (
    <div className="flex flex-col items-center flex-1 md:mt-6 md:mr-10 md:items-end h-1/5">
      <Image
        src="/we_do_imPossible_b.jpg"
        layout="fill"
        sizes="100%"
        alt="bg_we-do-the-imPossible"
      />
      <div className="z-50 flex flex-col items-center w-2/5 px-4 py-16 bg-white border rounded-lg shadow-md opacity-95">
        <Formik
          enableReinitialize
          initialValues={initialVals}
          validate={(values) => {
            const errors: FormikErrors<NewUserValues> = {};

            if (!values.FirstName) errors.FirstName = 'Required';
            if (!values.LastName) errors.LastName = 'Required';
            if (!values.Username) errors.Username = 'Required';
            if (!values.Email) errors.Email = 'Required';
            if (!values.Password) errors.Password = 'Required';
            if (!values.PasswordVerify) errors.PasswordVerify = 'Required';

            return errors;
          }}
          onSubmit={handleSubmit}
        >
          {({ errors, isSubmitting, handleSubmit, values, handleChange }) => (
            <div className="flex flex-col flex-1 w-3/4 h-full gap-12">
              <div className="flex flex-col gap-3">
                <h3 className="flex text-3xl font-bold text-nowrap text-porter">
                  Let's get you an account!
                </h3>
                <div>
                  <div className="flex flex-row gap-1">
                    <p>Already have an account? | </p>
                    <Link href="/auth/login" passHref>
                      <p className="text-porter-accent"> Sign in! </p>
                    </Link>
                  </div>
                </div>
              </div>
              <Form className="flex flex-col flex-1 w-1/2 gap-4">
                <div className="">
                  <label
                    className="block mb-2 font-bold text-gray-700 text-md"
                    htmlFor="first-name"
                  >
                    First Name
                  </label>
                  <InputField
                    className="w-full border rounded shadow"
                    type="input"
                    id="first-name"
                    name="FirstName"
                    required
                  />
                </div>
                <div className="">
                  <label
                    className="block mb-2 font-bold text-gray-700 text-md"
                    htmlFor="last-name"
                  >
                    Last Name
                  </label>
                  <InputField
                    className="w-full border rounded shadow"
                    type="input"
                    id="last-name"
                    name="LastName"
                    required
                  />
                </div>
                <div className="">
                  <label
                    className="block mb-2 font-bold text-gray-700 text-md"
                    htmlFor="e-mail"
                  >
                    E-mail
                  </label>
                  <InputField
                    className="w-full border rounded shadow"
                    type="input"
                    id="e-mail"
                    name="Email"
                  />
                </div>
                <div className="">
                  <label
                    className="block mb-2 font-bold text-gray-700 text-md"
                    htmlFor="Company"
                  >
                    Company
                  </label>
                  <InputField
                    className="w-full border rounded shadow"
                    type="input"
                    id="Company"
                    name="Company"
                  />
                </div>
                <div className="">
                  <label
                    className="block mb-2 font-bold text-gray-700 text-md"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <InputField
                    className="w-full border rounded shadow"
                    type="input"
                    id="username"
                    name="Username"
                    required
                  />
                </div>

                <div className="">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <InputField
                    as="input"
                    className="w-full border rounded shadow appearance-none"
                    type="password"
                    id="password"
                    name="Password"
                  />
                </div>
                <div className="">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="password-verfiy"
                  >
                    Confirm Password
                  </label>
                  <InputField
                    as="input"
                    className="w-full border rounded shadow appearance-none"
                    type="password"
                    id="password-verify"
                    name="PasswordVerify"
                  />
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

export default Register;
