import React, { useState } from 'react';
import { Navbar } from '../Navbar';
import { useRouter } from 'next/router';
export default function Layout({ children }) {
  const router = useRouter();
  const [open, setopen] = useState(false);

  return (
    <div className="absolute w-full h-full overflow-x-hidden overflow-y-auto">
      {!router.pathname.includes('/auth/') && (
        <Navbar open={open} changeOpen={setopen} />
      )}
      {!router.pathname.includes('/auth/') ? (
        <div
          className={`  ${
            open ? 'ml-68 ' : 'sm:ml-24'
          }  linear transition-all duration-500 h-[calc(100%-64px)]`}
        >
          <div
            className={`flex border inset-0 bg-slate-50 relative h-full flex-1 px-3 pt-3 transition-all duration-500 ease-in-out`}
          >
            {children}
          </div>
        </div>
      ) : (
        <div className="z-10">{children}</div>
      )}
    </div>
  );
}
