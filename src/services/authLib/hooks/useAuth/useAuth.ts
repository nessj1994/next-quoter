import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/auth-provider';
import { User } from '../../contexts/auth-provider/types';

export const useAuth = () => {
  const { state, dispatch, auth } = useContext(AuthContext);

  async function login(username: string, password: string) {
    return await auth!.login(username, password);
  }

  async function registerUser(user_data: User) {
    auth!.registerUser(user_data);
  }

  async function resetPassword(user_data: User) {
    auth!.resetPassword(user_data);
  }

  const verify = () => {
    auth!.findExistingSession();
  };

  const logout = () => {
    auth!.logout();
  };

  const toggleAdminMode = (enabled: boolean) => {
    auth!.toggleAdminMode(enabled);
  };
  // const updateUser = () => {
  //   console.log('Updating');
  //   auth!.updateUser();
  // };

  const loggedInUser = state.user;

  return {
    state,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    registerUser,
    resetPassword,
    login,
    verify,
    logout,
    toggleAdminMode,
    // updateUser,
    loggedInUser,
  };
};

export default useAuth;
