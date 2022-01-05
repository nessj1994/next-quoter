import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios, { AxiosResponse } from 'axios';
import { getToken } from 'next-auth/jwt';

const options = (req, res) => ({
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Login',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const { username, password } = credentials;

        try {
          // Retreive credentials from passed in data
          const {
            data: authData,
            headers: authHeaders,
          }: AxiosResponse<unknown, any> = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_HOST}/inferno/v1/auth/`,
            {
              username: `${username}`,
              password: `${password}`,
            },
          );
          console.log('headers: ', authHeaders);
          res.setHeader('Set-Cookie', authHeaders['set-cookie']);
          // store and check that auth token is valid

          const accessToken = authData.accessToken;
          if (!accessToken) {
            return null;
          }

          console.log('Access Token: ', accessToken);
          const { data: userData }: AxiosResponse<unknown, any> =
            await axios.get(
              `${process.env.NEXT_PUBLIC_SERVER_HOST}/inferno/v1/users/me/`,
              {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
              },
            );

          console.log(userData);
          if (!userData) {
            return null;
          }
          let finalResult = {
            accessToken: accessToken,
            ...userData,
          };
          return finalResult;
        } catch (err) {
          console.log(err);
          return null;
        }
      },
    }),
  ],
  secret: 'JyRnwEM+eAuIWJ16QOlflYnp/lVvs0NqImaQnkToa+c=',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60,
  },
  jwt: {
    cookieName: 'lsgweb_token',
  },
  cookies: {
    csrfToken: {
      name: `csrftoken`,
      options: {
        httpOnly: false,
        sameSite: 'None',
        path: '/',
        secure: true,
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('User in JWT:', user);
        const { accessToken, ...rest } = user;
        token.user = rest;
        token.accessToken = accessToken;
      }

      return token;
    },

    async session({ session, token }) {
      console.log('Data passed when signed in:', token);
      session.accessToken = token.accessToken;
      session.user = token.user;
      console.log('Session data: ', session);
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
    error: '/auth/login',
    // newUser: '/auth/register',
  },
});

// eslint-disable-next-line import/no-anonymous-default-export
export default (req, res) => NextAuth(req, res, options(req, res));
