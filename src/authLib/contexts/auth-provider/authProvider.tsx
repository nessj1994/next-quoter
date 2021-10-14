/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useReducer, useEffect, useState } from 'react';
import axios from 'axios';
import authReducer from '../../reducers/auth-reducer';
import {
  AuthState,
  AuthAction,
  AuthContextState,
  AuthProviderInterface,
  AuthProps,
  AuthActionTypes,
  Auth,
  User,
} from './types';
import toast from 'react-hot-toast';
// import { handleAuthResult } from '../hooks/useAuth';

const initState = (): AuthState => {
  const defaultState = {
    loading: false,
    user: {} as User,
    isAdmin: false,
    adminEnabled: false,
    isAuthenticated: false,
    expiresAt: null,
  };

  let overrideState = {} as Partial<AuthState>;

  let expires;
  // if (typeof localStorage !== undefined) {
  //   expires = new Date(
  //     JSON.parse(localStorage.getItem('lsgauth:expires') || '0'),
  //   );

  //   const overrideUser: User = JSON.parse(
  //     localStorage.getItem('lsgauth:user') || '{}',
  //   );
  //   const overrideAdmin = overrideUser.UserClass === 0 ? true : false;
  //   if (expires > new Date()) {
  //     overrideState = {
  //       user: overrideUser,
  //       expiresAt: expires,
  //       isAuthenticated: true,
  //       isAdmin: overrideAdmin,
  //     };

  //     console.log(overrideState);
  //   }
  // }

  return {
    ...defaultState,
    ...overrideState,
  };
};

// Create the context we will use for our provider
export const AuthContext = createContext<AuthContextState>({
  state: initState(),
  dispatch: () => {},
  callbackDomain: 'http://localhost:3000',
  customPropertyNamespace: '',
  navigate: null,
  auth: null,
});

// Export the provider so we can wrap our app in it
export const AuthProvider: AuthProviderInterface = (props: AuthProps) => {
  // Callback info
  const callbackDomain =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : 'http://localhost:8000';
  // State creation
  const [state, dispatch] = useReducer<React.Reducer<AuthState, AuthAction>>(
    authReducer,
    initState(),
  );
  const [error, setError] = useState<any>();

  // If we change page, reset the error state.
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [props.navigate?.location.pathname]);

  // First load check if we already
  useEffect(() => {
    let mounted = true;

    const getAuth = async () => {
      await findExistingSession();
    };

    getAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Declare functions that need used by custom hook
  async function authenticateUser(username: string, password: string) {
    try {
      let resp = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/inferno/v1/users/login`,
        { Username: `${username}`, Password: `${password}` },
        {
          withCredentials: true,
        },
      );

      if (resp) {
        console.log(resp);
        if (!resp.data.Username) {
          throw resp; // Throw the response to our catch block
        }

        // We're good to go. Return the data from our response
        return resp;
      }
    } catch (err: any) {
      // We have a problem
      if (err.response) {
        toast.error(err.response.data, { position: 'bottom-center' });
      }
      return false;
    }
  }

  async function registerUser(user_data: User) {
    await axios.post(
      `${process.env.SERVER_HOST}/inferno/v1/users/register`,
      user_data,
    );

    return dispatch({
      type: AuthActionTypes.AUTH_USER_REGISTER,
      payload: {
        authResult: true,
        user: { ...user_data },
        expiresAt: new Date('05/22/2022'),
      },
    });
  }

  async function resetPassword(user_data: User) {
    await axios.post(
      `${process.env.SERVER_HOST}/inferno/v1/users/reset_pass`,
      user_data,
    );

    // return dispatch({
    //   type: AuthActionTypes.
    // })
  }

  async function login(username: string, password: string) {
    const user = await authenticateUser(username, password);
    console.log(user);
    const expiresAt = new Date('05/22/2022');
    if (user) {
      dispatch({
        type: AuthActionTypes.AUTH_USER_LOGIN,
        payload: {
          authResult: true,
          user: { ...user.data },
          expiresAt,
        },
      });
      return user;
    }
  }

  async function logout() {
    axios
      .post(
        `${process.env.SERVER_HOST}/inferno/v1/users/logout`,
        {},
        {
          withCredentials: true,
          validateStatus(status: any) {
            return status < 400; // Resolve only if the status code is less than 500
          },
        },
      )
      .then((resp) => {
        console.log('Logged out', resp);
        dispatch({
          type: AuthActionTypes.AUTH_USER_LOGOUT,
          payload: {
            authResult: false,
            expiresAt: new Date('01/01/1999'),
            user: {},
          },
        });
        props.navigate.push('/auth/login');
      });
  }

  async function toggleAdminMode(enabled: boolean) {
    console.log('We toggle now!');
    return dispatch({
      type: AuthActionTypes.AUTH_TOGGLE_ADMIN,
      payload: { enabled: enabled },
    });
  }

  const findExistingSession = async () => {
    axios
      .get(`${process.env.SERVER_HOST}/inferno/v1/users/verify_session`, {
        withCredentials: true,
      })
      .then(async (resp) => {
        // console.log(resp);
        return resp;
      })
      .catch(async (err) => {
        // console.log(err);
        return err;
      });
  };
  // MAGIC HAPPENS NOW
  // Take all that stuff we just made that we want to hook into
  // And pass it right on into our hook as props and supply the context with data

  // Pass necessary functions to create custom hook with our context
  const auth: Auth = {
    registerUser,
    resetPassword,
    login,
    logout,
    findExistingSession,
    toggleAdminMode,
  };

  // Save values to be sent down the chain
  const [contextValue, setContextValue] = useState<AuthContextState>({
    state,
    dispatch,
    callbackDomain,
    customPropertyNamespace: '',
    navigate: props.navigate,
    auth,
  });

  // Update our context whenever our auth state gets changed
  useEffect(() => {
    setContextValue((contextValue) => ({
      ...contextValue,
      state,
    }));
  }, [state]);

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
