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
} from '../../../store';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const PageLineComponents: NextPage = (pageProps) => {
  // const auth = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();

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
      <div className="col rows-3">
        <div className="mb-3 row backdrop sticky-top row-cols-2">
          <div className="col col-rows-2">
            <div className="row">
              <h4>
                <nav className="nav " aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="#">Quote</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {lineID}
                    </li>
                  </ol>
                </nav>
              </h4>
            </div>
            <div className="row">
              <h4>Components</h4>
            </div>
          </div>

          <div className="col ">
            {/* {auth.state.isAdmin && auth.state.adminEnabled && ( */}
            <ComponentTableToolbar lineID={lineID} />
            {/* )} */}
          </div>
        </div>

        <div className="row">
          <ComponentTable lineID={lineID} />
        </div>
      </div>
    </>
  );
};

export default PageLineComponents;
