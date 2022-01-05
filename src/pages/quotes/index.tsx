import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';

const Ind: NextPage = (pageProps) => {
  const { data: session, status } = useSession({ required: true });

  if (status === 'loading') {
    return 'loading';
  }

  return <p>logged in as {session?.user.Username}</p>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      session: await getSession(context),
    },
  };
};

export default Ind;
