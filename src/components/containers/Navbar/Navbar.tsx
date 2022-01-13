import React, { useState } from 'react';
import Image from 'next/image';
// import PriceCheck from '../../containers/PriceCheck';
// import AdminSwitch from '../AdminSwitch';
import Link from 'next/link';
import PorterLogo from '/public/images/Porter_Logo.jpg';

import useAuth from '../../../services/authLib/hooks/useAuth';
import {
  editing,
  createNewQuote,
  toggleAdminMode,
  setEditing,
  emptyLines,
  fetchQuotes,
} from '../../../store';
import {
  ArrowDownIcon,
  ArrowRightIcon,
  DocumentAddIcon,
  FolderOpenIcon,
  UserIcon,
  CogIcon,
  LogoutIcon,
  MenuIcon,
  HomeIcon,
  PlusIcon,
  SearchIcon,
} from '@heroicons/react/outline';
import { useAppSelector, useAppDispatch } from '../../../store/hooks/hooks';
import { useEffect } from 'react';
import {
  emptyQuoteList,
  getAdminEnabled,
} from 'store/features/quotes/headersSlice';
import { signOut, useSession } from 'next-auth/react';
import AdminSwitch from 'components/elements/AdminSwitch';

const Navbar = (props: any) => {
  const current = useAppSelector(editing);
  const adminOn = useAppSelector(getAdminEnabled);
  const dispatch = useAppDispatch();
  const { data: auth, status } = useSession();
  // const quoteHeaders = useQuoteHeaders();
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [expandSearch, setExpandSearch] = useState(false);
  const [expandPriceCheck, setExpandPriceCheck] = useState(false);

  // const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   auth.toggleAdminMode(e.target.checked);
  // };

  const handleQuoteSearch = () => {
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

  console.log(props.session);

  return (
    <nav className="sticky top-0 flex bg-white rounded-b-lg md:w-1/6 md:rounded-r-lg z-60">
      <div className="flex flex-col flex-grow w-full gap-3 shadow-md md:w-1/6 md:rounded-r-lg ">
        <div className="flex flex-row items-center justify-between flex-shrink-0 px-8 py-4">
          <Image
            className="d-none d-lg-inline img-fluid"
            src={PorterLogo}
            alt="Porter"
          />
          <button
            className="rounded-lg md:hidden focus:outline-none focus:shadow-outline"
            onClick={(e: any) => {
              setMenuExpanded(!menuExpanded);
            }}
          >
            <MenuIcon className="w-5 h-5 print:hidden" />
          </button>
        </div>
        <ul
          className={`flex flex-col flex-grow  ${
            menuExpanded ? 'visible' : 'hidden'
          } md:inline-flex md:h-full px-4 pb-4 md:pb-0 `}
          id="menu"
        >
          <li>
            <div className="row align-items-center d-flex w-100">
              <div className="col-auto">
                <Link href="/quotes/list" passHref>
                  <a
                    onClick={() => {
                      dispatch(
                        fetchQuotes(
                          auth?.user?.customer_id,
                          auth?.user.username,
                          90,
                        ),
                      );
                    }}
                  >
                    <span className="nav-item">
                      <HomeIcon className="inline w-5 h-5 mr-3" />
                      Home
                    </span>
                  </a>
                </Link>
              </div>
            </div>
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
                <span className="nav-item">
                  <SearchIcon className="inline w-5 h-5 mr-3" />
                  Search
                  {expandSearch ? (
                    <ArrowDownIcon className="inline w-5 h-5 ml-3" />
                  ) : (
                    <ArrowRightIcon className="inline w-5 h-5 ml-3" />
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
                          handleQuoteSearch();
                        }
                      }}
                      id="sidenav-user-search"
                      className="form-control"
                      placeholder=""
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuoteSearch();
                      }}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>

          <li>
            <div className="row align-items-center d-flex w-100">
              <div className="col">
                <Link href="/quotes/info" passHref>
                  <a
                    onClick={async (e: any) => {
                      dispatch(emptyLines());
                      dispatch(setEditing(null));
                    }}
                    className="nav-link text-nowrap"
                  >
                    <span className="nav-item">
                      <DocumentAddIcon className="inline w-5 h-5 mr-3" />
                      New Quote
                    </span>
                  </a>
                </Link>
              </div>
            </div>
          </li>
          {auth?.user?.is_staff ? (
            <li>
              <span className="nav-item flex flex-row  justify-between">
                <Link
                  href={`${process.env.NEXT_PUBLIC_SERVER_HOST}/admin`}
                  passHref
                >
                  <div className="inline-flex">
                    <CogIcon className="inline w-5 h-5 mr-3" />
                    <p>Admin</p>
                  </div>
                </Link>
                <AdminSwitch
                  {...props}
                  onChange={() => {
                    dispatch(toggleAdminMode());
                  }}
                  adminEnabled={adminOn}
                />
              </span>
            </li>
          ) : null}

          <li className="pb-3 mt-auto">
            <div className="row ">
              <div className="col-auto">
                <a
                  onClick={() => {
                    dispatch(() => emptyQuoteList);
                    signOut({
                      callbackUrl: '/auth/login',
                    });
                  }}
                >
                  <span className="block px-4 py-2 mt-2 text-sm m nav-item">
                    <LogoutIcon className="inline w-5 h-5 mr-3 md:visible" />
                    Logout
                  </span>
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};
export default Navbar;
