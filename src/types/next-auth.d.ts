import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      company: string | null;
      email: string | null;
      customer_id: string;
      first_name: string;
      last_name: string | null;
      user_class: Number;
      user_id: Number;
      username: string;
      is_staff: boolean;
    };
  }
}
