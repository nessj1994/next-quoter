import React, { useState } from 'react';
import { NextPage } from 'next';
import {
  ComponentTable,
  ComponentTableToolbar,
} from '../../../components/containers/LineComponentTable';
// import useAuth from '../../authLib/hooks/useAuth';

import {
  useAppDispatch,
  useAppSelector,
  quoteLinesSelectors,
  retrieveLineConf,
  selectComponents,
  addComponent,
  LineComponent,
  editing,
} from '../../../store';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const PageLineComponents: NextPage = (pageProps) => {
  // const auth = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const SelectedQuote = useAppSelector((state) => editing(state));

  const { lineID } = router.query;
  const components = useAppSelector(selectComponents);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      dispatch(retrieveLineConf(lineID));
    }

    return () => {
      mounted = false;
    };
  }, [lineID]);

  // console.log(auth.state.adminEnabled);
  return (
    <>
      <div className="m-3 flex flex-col gap-3">
        <div className="col col-rows-2">
          <div className="row">
            <div className="row">
              <strong className="text-2xl text-porter mb-3">Components</strong>
            </div>
            <nav
              className="bg-grey-light rounded-md w-full "
              aria-label="breadcrumb"
            >
              <ol className="list-reset flex">
                <li className="breadcrumb-item font-bold border rounded-full px-2 hover:border-porter">
                  <Link
                    href={`../../quotes/info/${SelectedQuote?.quote_number}`}
                    passHref
                  >
                    <a className="text-blue-600 hover:text-blue-700">
                      {SelectedQuote?.quote_number ?? ''}
                    </a>
                  </Link>
                </li>
                <li>
                  <span className="text-gray-500 mx-2">/</span>
                </li>
                <li
                  className="breadcrumb-item active border rounded-full px-2"
                  aria-current="page"
                >
                  {lineID}
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="border border-porter">
          {/* {auth.state.isAdmin && auth.state.adminEnabled && ( */}
          <ComponentTableToolbar lineID={lineID} />
          {/* )} */}
        </div>

        <div className="row">
          <ComponentTable lineID={lineID} />
        </div>
      </div>
    </>
  );
};

export default PageLineComponents;
