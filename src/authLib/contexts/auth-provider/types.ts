import { ReactNode, Dispatch } from 'react';
import { History } from 'history';
import { AxiosResponse } from 'axios';

interface IAuthProps {
  children: ReactNode;
  navigate: History;
  customPropertyNamespace: string;
}

export type AuthProps = IAuthProps & any;

export type AuthProviderInterface = ({
  children,
  navigate,
  customPropertyNamespace,
}: AuthProps) => JSX.Element;

export type AuthContextState = {
  state: AuthState;
  dispatch: AuthDispatch;
  callbackDomain: string;
  customPropertyNamespace: string;
  navigate: History | null;
  auth: Auth | null;
};

// @TODO: Determine which of these need moved to their own types file? (likely to be ./reducers/types.ts)

export type AuthState = {
  loading: boolean;
  isAuthenticated: boolean;
  user: User | {};
  expiresAt: Date | null;
  isAdmin: boolean;
  adminEnabled: boolean;
  // authResult?: boolean | null;
  // errorType?: string;
  // error?: Error;
};

export interface Auth {
  registerUser: (user_data: User) => Promise<any>;
  resetPassword: (user_data: User) => Promise<void>;
  login: (username: string, password: string) => Promise<any>;
  logout: () => void;
  findExistingSession: () => Promise<void | AxiosResponse<any>>;
  toggleAdminMode: (enabled: boolean) => Promise<void>;
}

export enum AuthActionTypes {
  AUTH_USER_REGISTER = '@auth/register',
  AUTH_USER_LOGIN = '@auth/login',
  AUTH_USER_LOGOUT = '@auth/logout',
  AUTH_ERROR = '@auth/error',
  AUTH_START = '@auth/startAuth',
  AUTH_STOP = '@auth/stopAuth',
  AUTH_USER_EDIT = '@auth/userEdit',
  AUTH_TOGGLE_ADMIN = '@auth/toggleAdmin',
}

export type User = {
  Username: String;
  UserClass: Number;
  FSID: String;
  FirstName: String;
  LastName: String;
  Email: String;
  Company: String;
};

export interface AuthRegisterAction {
  type: typeof AuthActionTypes.AUTH_USER_REGISTER;
  payload: {
    authResult: boolean;
    user: User;
    expiresAt: Date;
  };
}
export interface AuthLoginAction {
  type: typeof AuthActionTypes.AUTH_USER_LOGIN;
  payload: {
    authResult: boolean;
    user: User;
    expiresAt: Date;
  };
}

export interface AuthLogoutAction {
  type: typeof AuthActionTypes.AUTH_USER_LOGOUT;
  payload: {
    authResult: boolean;
    user: {};
    expiresAt: Date;
  };
}

export interface AuthStartAction {
  type: typeof AuthActionTypes.AUTH_START;
  payload: {
    loading: boolean;
  };
}

export interface AuthStopAction {
  type: typeof AuthActionTypes.AUTH_STOP;
  payload: {
    loading: boolean;
  };
}
export interface AuthErrorAction {
  type: typeof AuthActionTypes.AUTH_ERROR;
  payload: {
    error: any;
  };
}

export interface AuthUserEditAction {
  type: typeof AuthActionTypes.AUTH_USER_EDIT;
  payload: {
    user: User;
  };
}

export interface AuthUserEditAction {
  type: typeof AuthActionTypes.AUTH_USER_EDIT;
  payload: {
    user: User;
  };
}

export interface AuthToggleAdminAction {
  type: typeof AuthActionTypes.AUTH_TOGGLE_ADMIN;
  payload: {
    enabled: boolean;
  };
}

export type AuthAction =
  | AuthRegisterAction
  | AuthLoginAction
  | AuthLogoutAction
  | AuthStartAction
  | AuthStopAction
  | AuthErrorAction
  | AuthUserEditAction
  | AuthToggleAdminAction;

export type AuthDispatch = Dispatch<AuthAction>;
