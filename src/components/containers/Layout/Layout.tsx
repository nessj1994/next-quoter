import { Navbar } from '../Navbar';
import { useRouter } from 'next/router';
export default function Layout({ children }) {
  const router = useRouter();

  return (
    <div className=" main">
      {!router.pathname.includes('/auth/') && <Navbar />}
      <div className="flex flex-col w-full overflow-y-auto print:overflow-y-visible ">
        {children}
      </div>
    </div>
  );
}
