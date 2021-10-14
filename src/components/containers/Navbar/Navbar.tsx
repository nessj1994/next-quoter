import React, { useState } from 'react';
import Image from 'next/image';
// import * as Icons from 'react-bootstrap-icons';
// import PriceCheck from '../../containers/PriceCheck';
// import AdminSwitch from '../AdminSwitch';
// import { Link } from 'react-router-dom';
import PorterLogo from '/public/images/Porter_Logo.jpg';

// import useAuth from '../../../authLib/hooks/useAuth';
// import {
//   editing,
//   createNewQuote,
//   setEditing,
//   emptyLines,
//   fetchQuotes,
// } from '../../../store';
// import { useAppSelector, useAppDispatch } from '../../../store/hooks/hooks';
// import './styles.scss';
import { useEffect } from 'react';

const Navbar = (props: any) => {
  // const current = useAppSelector(editing);
  // const dispatch = useAppDispatch();
  // const auth = useAuth();
  // const quoteHeaders = useQuoteHeaders();
  const [expandSearch, setExpandSearch] = useState(false);
  const [expandPriceCheck, setExpandPriceCheck] = useState(false);

  // const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   auth.toggleAdminMode(e.target.checked);
  // };

  // const handleQuoteSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const searchFor = document.getElementById(
  //     'sidenav-user-search',
  //   ) as HTMLInputElement;

  //   if (!searchFor.value) {
  //     return;
  //   }
  //   console.log(searchFor.value);
  //   setExpandSearch(false);
  //   dispatch(fetchQuotes(searchFor.value));
  //   searchFor.value = '';
  // };

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
      <div className="container-fluid d-flex flex-row flex-lg-column flex-grow-0 align-items-center align-items-lg-start px-3 pt-2 ">
        <div className="flex-col flex-lg-row mb-4">
          <Image
            className="d-none d-lg-inline img-fluid"
            src={PorterLogo}
            alt="Porter"
          />
        </div>
        <ul
          className="nav nav-pills flex-lg-column flex-row flex-nowrap flex-shrink-1 flex-lg-grow-0 flex-grow-1 mb-lg- mb-0 justify-content-center align-items-center align-items-lg-start sticky-top"
          id="menu"
        >
          <li className="">
            <a href="#" className="text-truncate">
              <i className="fs-5 bi-house"></i>
              <span className="text-black">Home</span>
            </a>
          </li>
          {/* {auth.state.isAdmin ? (
            <li
              data-bs-toggle="searchCollapse"
              data-bs-target="#searchCollapse"
              aria-expanded="false"
              aria-controls="collapseExample"
              // onClick={(e: any) => {
              //   setExpandSearch(!expandSearch);
              // }}
            >
              <div className="justify-content-between">
                <a href="#" className="nav-link text-truncate">
                  <i className="fs-5 bi-search"></i>
                  <span className="ms-1 d-none d-lg-inline">Search</span>
                  {expandSearch ? (
                    <i className="bi bi-arrow-down" />
                  ) : (
                    <i className="bi bi-arrow-right" />
                  )}
                </a>
              </div>
              <div
                className={`collapse ${expandSearch && 'show'}`}
                id="searchCollapse"
              >
                <div className="card card-body show">
                  <div className="form-group d-flex w-100">
                    <label
                      className="float:top text-nowrap"
                      htmlFor="sidenav-user-search"
                    >
                      User or Customer
                    </label>
                    <div className="input-group" style={{ zIndex: 99999 }}>
                      <input
                        type="text"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        // onKeyPress={(e) => {
                        //   if (e.key === 'Enter') {
                        //     handleQuoteSearch(e);
                        //   }
                        // }}
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
          ) : (
            ''
          )} */}

          <li>
            <div className="row align-items-center d-flex w-100">
              <div className="col-auto">
                {/* <Link
                  to="/quotes/list"
                  onClick={() => {
                    dispatch(
                      fetchQuotes(
                        auth.loggedInUser.FSID,
                        auth.loggedInUser.Username,
                        90,
                      ),
                    );
                  }}
                  className="nav-link text-nowrap"
                >
                  <i className="fs-5 bi-table" />
                  <span className="ms-1 d-none d-lg-inline">My Quotes</span>
                </Link> */}
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
                {/* <Link to="/auth/logout" className="nav-link text-truncate">
                  <i className="fs-5 bi-door-closed" />
                  <span className="ms-1 d-none d-lg-inline">Logout</span>
                </Link> */}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};
export default Navbar;
