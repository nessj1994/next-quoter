import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const AuthRoute = ({ children }) => {
  const { data: session, status } = useSession();
  const userExists = !!session?.user;
  const router = useRouter();

  useEffect(() => {
    if (status !== 'loading' && !userExists) {
      router.push('/auth/login');
    }
  }, [status, userExists]);

  if (status === 'loading' || !userExists) {
    return <div>Waiting</div>;
  }

  return children;
};

export default AuthRoute;
