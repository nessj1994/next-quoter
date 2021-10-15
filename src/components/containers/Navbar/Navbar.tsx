import React, { useState } from 'react';
import Image from 'next/image';
// import * as Icons from 'react-bootstrap-icons';
// import PriceCheck from '../../containers/PriceCheck';
// import AdminSwitch from '../AdminSwitch';
import Link from 'next/link';
import PorterLogo from '/public/images/Porter_Logo.jpg';

import useAuth from '../../../services/authLib/hooks/useAuth';
import {
  editing,
  createNewQuote,
  setEditing,
  emptyLines,
  fetchQuotes,
} from '../../../store';
import {
  ArrowDownIcon,
  ArrowRightIcon,
  DocumentAddIcon,
  FolderOpenIcon,
  LogoutIcon,
  MenuIcon,
} from '@heroicons/react/outline';
import { useAppSelector, useAppDispatch } from '../../../store/hooks/hooks';
// import './styles.scss';
import { useEffect } from 'react';
import { emptyQuoteList } from 'store/features/quotes/headersSlice';

const Navbar = (props: any) => {
  const current = useAppSelector(editing);
  const dispatch = useAppDispatch();
  const auth = useAuth();
  // const quoteHeaders = useQuoteHeaders();
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [expandSearch, setExpandSearch] = useState(false);
  const [expandPriceCheck, setExpandPriceCheck] = useState(false);

  // const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   auth.toggleAdminMode(e.target.checked);
  // };

  const handleQuoteSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchFor = document.getElementById(
      'sidenav-user-search',
    ) as HTMLInputElement;

    if (!searchFor.value) {
      return;
    }
    console.log(searchFor.value);
    setExpandSearch(false);
    dispatch(fetchQuotes(searchFor.value));
    searchFor.value = '';
  };

  // useEffect(() => {
  //   let mounted = true;

  //   if (mounted) {
  //   }

  //   return () => {
  //     mounted = false;
  //   };
  // }, [auth.state.isAdmin]);

  return (
    <>
      <div className="flex flex-col w-full md:w-64 dark-mode:text-gray-200 bg-gray-100 flex-shrink-0 mr-3">
        <div className="flex-shrink-0 px-8 py-4 flex flex-row items-center justify-between">
          <Image
            className="d-none d-lg-inline img-fluid"
            src={PorterLogo}
            alt="Porter"
          />
          <button
            className="md:hidden rounded-lg focus:outline-none focus:shadow-outline"
            onClick={(e: any) => {
              setMenuExpanded(!menuExpanded);
            }}
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
        <ul
          className={`flex-grow ${
            menuExpanded ? 'visible' : 'hidden'
          } md:block px-4 pb-4 md:pb-0 md:overflow-y-auto`}
          id="menu"
        >
          <li className="">
            <a href="#" className="text-truncate">
              <i className="fs-5 bi-house"></i>
              <span className="block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-gray-200 rounded-lg dark-mode:bg-gray-700 dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                Home
              </span>
            </a>
          </li>
          {/* {auth.state.isAdmin ? ( */}
          <li
            data-bs-toggle="searchCollapse"
            data-bs-target="#searchCollapse"
            aria-expanded="false"
            aria-controls="collapseExample"
            onClick={(e: any) => {
              setExpandSearch(!expandSearch);
            }}
          >
            <div className="justify-content-between">
              <Link href="#" passHref>
                <span className="block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-gray-200 rounded-lg dark-mode:bg-gray-700 dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                  Search
                  {expandSearch ? (
                    <ArrowDownIcon className="inline ml-3 h-5 w-5" />
                  ) : (
                    <ArrowRightIcon className="inline ml-3 h-5 w-5" />
                  )}
                </span>
              </Link>
            </div>
            <div
              className={`collapse ${expandSearch ? 'visible' : 'hidden'}`}
              id="searchCollapse"
            >
              <div className="card card-body show">
                <div className="form-group d-flex w-100">
                  <label
                    className="float:top text-nowrap"
                    htmlFor="sidenav-user-search"
                  >
                    User / Customer
                  </label>
                  <div className="input-group" style={{ zIndex: 99999 }}>
                    <input
                      type="text"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleQuoteSearch(e);
                        }
                      }}
                      id="sidenav-user-search"
                      className="form-control"
                      placeholder=""
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      // onClick={(e) => {
                      //   e.stopPropagation();
                      //   handleQuoteSearch(e);
                      // }}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
          {/* ) : (
            ''
          )} */}

          <li>
            <div className="row align-items-center d-flex w-100">
              <div className="col-auto">
                <Link
                  href="/quotes/list"
                  onClick={() => {
                    dispatch(
                      fetchQuotes(
                        auth.loggedInUser.FSID,
                        auth.loggedInUser.Username,
                        90,
                      ),
                    );
                  }}
                  passHref
                >
                  <span className="block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-gray-200 rounded-lg dark-mode:bg-gray-700 dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                    <FolderOpenIcon className="inline mr-3 h-5 w-5" />
                    My Quotes
                  </span>
                </Link>
              </div>
            </div>
          </li>
          <li>
            <div className="row align-items-center d-flex w-100">
              <div className="col">
                {/* <Link
                  to="/quotes/info"
                  onClick={async (e: any) => {
                    dispatch(emptyLines());
                    dispatch(setEditing(null));
                  }}
                  className="nav-link text-nowrap"
                >
                  <i className="fs-5 bi-file-earmark-plus" />
                  <span className="ms-1 d-none d-lg-inline">New Quote</span>
                </Link> */}
              </div>
            </div>
          </li>
          {/* {auth.state.isAdmin ? (
            <div>
              <li>
                <div className="row align-items-center d-flex w-100">
                  <div className="col-auto">
                    <Link to="/quotes/admin" className="nav-link text-truncate">
                      <i className="fs-5 bi-gear-wide-connected" />
                      <span className="ms-1 d-none d-lg-inline">Admin</span>
                    </Link>
                  </div>

                  <div className="col-1">
                    <AdminSwitch
                      {...props}
                      onChange={handleAdminChange}
                      adminEnabled={auth.state.adminEnabled}
                    />
                  </div>
                </div>
              </li>

              <li>
                <div className="col-auto">
                  <Link to="/auth/account" className="nav-link text-truncate">
                    <i className="fs-5 bi-people" />
                    <span className="ms-1 d-none d-lg-inline ">My Account</span>
                  </Link>
                </div>
              </li>
            </div>
          ) : null} */}

          <li>
            <div className="row flex-end">
              <div className="col-auto">
                <a
                  onClick={() => {
                    dispatch(emptyQuoteList);
                    auth.logout();
                  }}
                >
                  <span className="self-end block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-gray-200 rounded-lg dark-mode:bg-gray-700 dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                    <LogoutIcon className="invisible md:visible inline mr-3 h-5 w-5 " />
                    Logout
                  </span>
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};
export default Navbar;
