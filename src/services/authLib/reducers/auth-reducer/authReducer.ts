import Cookies from 'js-cookie';
import {
  AuthActionTypes,
  AuthState,
  AuthAction,
} from '../../contexts/auth-provider/types';

export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case AuthActionTypes.AUTH_START: {
      return { ...state, loading: true };
    }
    case AuthActionTypes.AUTH_STOP: {
      return { ...state, loading: false };
    }
    case AuthActionTypes.AUTH_USER_REGISTER: {
      if (action.payload.user) {
        localStorage.setItem(
          'lsgauth:user',
          JSON.stringify(action.payload.user),
        );
        localStorage.setItem(
          'lsgauth:expires',
          JSON.stringify(action.payload.expiresAt),
        );
        return { ...state, user: action.payload.user, isAuthenticated: true };
      }
    }
    case AuthActionTypes.AUTH_USER_LOGIN: {
      let adminAccount = false;

      if (action.payload.user) {
        localStorage.setItem(
          'lsgauth:user',
          JSON.stringify(action.payload.user),
        );
        localStorage.setItem(
          'lsgauth:expires',
          JSON.stringify(action.payload.expiresAt),
        );

        adminAccount = action.payload.user?.UserClass === 0 ? true : false;
        return {
          ...state,
          user: action.payload.user,
          isAdmin: adminAccount,
          isAuthenticated: true,
        };
      }
    }
    case AuthActionTypes.AUTH_USER_LOGOUT: {
      localStorage.removeItem('lsgauth:user');
      localStorage.removeItem('lsgauth:expires');
      Cookies.remove('lsg_id');
      return {
        ...state,
        user: {},
        isAuthenticated: false,
        isAdmin: false,
        adminEnabled: false,
      };
    }
    case AuthActionTypes.AUTH_USER_EDIT: {
      // console.log(action.payload.user);
      return { ...state, user: action.payload.user };
    }
    case AuthActionTypes.AUTH_TOGGLE_ADMIN: {
      return { ...state, adminEnabled: action.payload.enabled };
    }
    default:
      return state;
  }
};

export default authReducer;
