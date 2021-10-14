// /* eslint-disable @typescript-eslint/naming-convention */
// import { ReactNode, Dispatch } from 'react';

// export type AuthState = {
//   user: { [key: string]: any };
//   authResult?: boolean | null;
//   expiresAt: number | null;
//   isAuthenticating: boolean;
//   errorType?: string;
//   error?: Error;
// };

// export interface useAuthInterface {
//   (): {
//     isAuthenticating: boolean;
//     isAuthenticated: () => boolean;
//     isAuthorized: (role: string | string[]) => boolean;
//     user: { [key: string]: any };
//     userID: string | null | undefined;
//     authResult: boolean | undefined | null;
//     register: () => void;
//     login: () => void;
//     logout: () => void;
//     handleAuthentication: ({
//       postLoginRoute,
//     }: {
//       postLoginRoute?: string;
//     }) => void;
//   };
// }

// export type handleAuthResultInterface = ({
//   err,
//   dispatch,
//   authResult,
// }: {
//   err?: Error | null;
//   dispatch: AuthDispatch;
//   authResult: boolean | null;
// }) => Promise<boolean>;

// export type setSessionInterface = ({
//   dispatch,
//   authResult,
// }: {
//   dispatch: AuthDispatch;
//   authResult: boolean;
// }) => Promise<any>; // @TODO: Change any to user profile object
