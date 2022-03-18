import React, { useState, useEffect } from 'react';
import Image from 'next/image';
// import PriceCheck from '../../containers/PriceCheck';
// import AdminSwitch from '../AdminSwitch';
import Link from 'next/link';
import PLogo from '/public/P-Logo.png';
import Orter from '/public/orter.png';

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
  HomeIcon,
  MenuIcon,
  SearchCircleIcon,
  UserCircleIcon,
  CogIcon,
  FilterIcon,
  DocumentAddIcon,
  SearchIcon,
  LogoutIcon,
  ArrowDownIcon,
  ChevronDownIcon,
} from '@heroicons/react/solid';
import { useAppSelector, useAppDispatch } from '../../../store/hooks/hooks';
import {
  emptyQuoteList,
  getAdminEnabled,
  searchQuotes,
} from 'store/features/quotes/headersSlice';
import { signOut, useSession } from 'next-auth/react';
import AdminSwitch from 'components/elements/AdminSwitch';
import { useRouter } from 'next/router';

const Navbar = (props: any) => {
  const current = useAppSelector(editing);
  const adminOn = useAppSelector(getAdminEnabled);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: auth, status } = useSession();
  // const quoteHeaders = useQuoteHeaders();
  const [open, setOpen] = useState(props.open);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [expandSearch, setExpandSearch] = useState(false);
  const [expandPriceCheck, setExpandPriceCheck] = useState(false);

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    auth.toggleAdminMode(e.target.checked);
  };

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      setOpen(props.open);
    }

    return () => {
      mounted = false;
    };
  }, [props.open]);

  const handleQuoteSearch = async () => {
    const searchFor = document.getElementById(
      'sidenav-user-search',
    ) as HTMLInputElement;

    if (!searchFor.value) {
      return;
    }
    console.log(searchFor.value);
    setExpandSearch(false);
    let answer = await dispatch(searchQuotes(searchFor.value));
    console.log(answer.data);
    if (answer) {
      router.push(`/quotes/info/${answer.data.quote_number}`);
    }
    searchFor.value = '';
  };

  console.log(props.session);
  const [hasFocus, setHasFocus] = useState(true);

  return (
    <nav className=" sticky-nav">
      <header className={`inset-x-0 flex h-16 divide-y bg-white `}>
        <div id="menu-button-container" className={`menu-btn-container `}>
          <button
            id="menu-button"
            className="self-center w-8 h-8 transition-all duration-200 ease-linear bg-white rounded-full hover:bg-gray-100 text-porter outline-1 active:ring-1 active:ring-porter"
            onClick={() => {
              props.changeOpen(!props.open);
            }}
          >
            {/* <MenuIcon height={32} width={32} /> */}
            <div className="flex items-center justify-center">
              <span
                aria-hidden="true"
                className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${
                  open ? 'rotate-45' : '-translate-y-1.5'
                }`}
              ></span>
              <span
                aria-hidden="true"
                className={`block absolute  h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${
                  open ? 'opacity-0' : ''
                }`}
              ></span>
              <span
                aria-hidden="true"
                className={`block absolute  h-0.5 w-5 bg-current transform  transition duration-500 ease-in-out ${
                  open ? '-rotate-45' : 'translate-y-1.5'
                }`}
              ></span>
            </div>
          </button>
        </div>
        <div className="logo-container">
          <div className="logo-main">
            <Image src={PLogo} layout="fill" objectFit="contain" />
          </div>
          <div className={`logo-expanded ${open ? 'expanded' : 'closed'}`}>
            <Image src={Orter} layout="fill" objectFit="contain" />
          </div>
        </div>
        <div className="flex flex-row items-center justify-center gap-2 px-3 mr-3 ">
          <UserCircleIcon height={32} width={32} className="text-porter" />
          <span className="font-bold">{`${auth?.user?.first_name}`}</span>
          <div className="bg-white rounded-full text-porter hover:bg-slate-100 group">
            <div className="relative group ">
              <ChevronDownIcon width={24} height={24} />
              <div className="absolute right-0 hidden pt-1 text-right text-gray-700 origin-top-right group-hover:block">
                <ul className="bg-gray-200 rounded-md">
                  <li className="rounded-t">
                    <a
                      className="block px-4 py-2 rounded-t whitespace-nowrap hover:bg-gray-400"
                      href="#"
                    >
                      Do a Thing
                    </a>
                  </li>
                  <li className="">
                    <a
                      className="block px-4 py-2 whitespace-nowrap hover:bg-gray-400"
                      href="#"
                    >
                      Do a Thing but even longer
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      <aside
        className={`fixed flex flex-1 text-porter duration-500 ease-in-out ${
          open ? '' : 'hidden'
        } max-h-[calc(100%-64px)] h-full  ${
          !open ? 'w-24' : 'w-68'
        }  text-gray-700 transition-all  sm:flex`}
      >
        <ul
          className={`border-1 flex w-full flex-1 flex-col gap-10 ${
            open ? 'items-start' : 'items-center'
          }`}
        >
          <li className="flex w-full rounded-lg ">
            <div className="top-0 left-0 flex h-[48px] w-full border-separate flex-row items-center self-start rounded-sm  transition-all duration-150 group">
              <span
                className={`absolute left-0 ml-[-6px] block h-[0px] w-[8px] flex-1 transform-none rounded bg-porter-accent transition-all duration-150 ease-linear group-hover:h-[32px]`}
              />
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
                  className={`mx-auto  flex w-full flex-1 font-medium ${
                    open ? 'gap-8' : ''
                  }  flex-${!open ? 'col' : 'row'} items-${
                    open ? 'start' : 'center'
                  } `}
                >
                  <HomeIcon
                    width={30}
                    height={30}
                    className={`${open ? 'ml-8' : ''}`}
                  />
                  <label className={`self-center ${open ? 'font-bold' : ''} `}>
                    Home
                  </label>
                </a>
              </Link>
            </div>
          </li>

          <li className="flex w-full rounded-lg ">
            <div className="top-0 left-0 flex h-[48px] w-full border-separate flex-row items-center self-start rounded-sm   transition-all duration-150 group">
              <span
                className={`absolute left-0 ml-[-6px] block h-[0px] w-[8px] flex-1 transform-none rounded bg-porter-accent transition-all duration-150 ease-linear group-hover:h-[32px]`}
              />
              <Link href="/quotes/info" passHref>
                <a
                  onClick={async (e: any) => {
                    dispatch(emptyLines());
                    dispatch(setEditing(null));
                  }}
                  className={`mx-auto  flex w-full flex-1 font-medium ${
                    open ? 'gap-8' : ''
                  }  flex-${!open ? 'col' : 'row'} items-${
                    open ? 'start' : 'center'
                  } `}
                >
                  <DocumentAddIcon
                    width={30}
                    height={30}
                    className={`${open ? 'ml-8' : ''}`}
                  />
                  <label className={`self-center ${open ? 'font-bold' : ''} `}>
                    New Quote
                  </label>
                </a>
              </Link>
            </div>
          </li>
          {auth?.user?.is_staff ? (
            <li className="relative flex w-full rounded-lg ">
              <div className="top-0 left-0 flex h-[48px] w-full border-separate flex-row items-center self-start rounded-sm   transition-all duration-150 group">
                <span
                  className={`absolute left-0 ml-[-6px] block h-[0px] w-[8px] flex-1 transform-none rounded bg-porter-accent transition-all duration-150 ease-linear group-hover:h-[32px]`}
                />
                <div
                  className={`mx-auto  flex w-full flex-1 font-medium ${
                    open ? 'gap-8' : ''
                  }  flex-${!open ? 'col' : 'row'} items-${
                    open ? 'start' : 'center'
                  } `}
                >
                  <SearchCircleIcon
                    width={30}
                    height={30}
                    className={`${open ? 'ml-8' : ''}`}
                  />
                  <label className={`self-center ${open ? 'font-bold' : ''} `}>
                    Search
                  </label>
                  <div className="absolute z-30 hidden h-auto dropdown-menu left-8 top-2 group-hover:block">
                    <div className="top-0 flex-1 px-6 py-8 bg-white rounded-md shadow">
                      <div className="form-group d-flex w-100">
                        <label
                          className="float:top text-nowrap "
                          htmlFor="sidenav-user-search"
                        >
                          <strong>Quote #</strong>
                        </label>
                        <div
                          className="flex items-center border custom-input border-porter"
                          style={{ zIndex: 99999 }}
                        >
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
                            className=""
                            placeholder=""
                          />
                          <button
                            type="submit"
                            className="w-full min-h-full rounded-md "
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
                </div>
              </div>
            </li>
          ) : null}
          {auth?.user?.is_staff ? (
            <li className="flex w-full rounded-lg ">
              <div className="top-0 left-0 flex h-[48px] w-full border-separate flex-row items-center self-start rounded-sm   transition-all duration-150 group ">
                <span
                  className={`absolute left-0 ml-[-6px] block h-[0px] w-[8px] flex-1 transform-none rounded bg-porter-accent transition-all duration-150 ease-linear group-hover:h-[32px]`}
                />
                <Link
                  href={`${process.env.NEXT_PUBLIC_SERVER_HOST}/admin`}
                  passHref
                >
                  <a
                    className={`mx-auto  flex w-full flex-1 font-medium ${
                      open ? 'gap-8' : ''
                    }  flex-col open:flex-row items-center open:items-start
                    } `}
                    open={open}
                  >
                    <CogIcon
                      width={30}
                      height={30}
                      className={`${open ? 'ml-8' : ''}`}
                    />
                    <label
                      className={`self-center open:font-bold `}
                      open={open}
                    >
                      Admin
                    </label>
                  </a>
                </Link>
                {open && (
                  <AdminSwitch
                    {...props}
                    onChange={() => {
                      dispatch(toggleAdminMode());
                    }}
                    adminEnabled={adminOn}
                  />
                )}
              </div>
            </li>
          ) : null}

          <li className="flex flex-col justify-end flex-auto w-full mb-3 rounded-lg">
            <div className=" flex h-[48px] w-full border-separate flex-row items-center self-start rounded-sm border  transition-all duration-150 group">
              <span
                className={`absolute left-0 ml-[-6px] block h-[0px] w-[8px] flex-1 transform-none rounded bg-porter-accent transition-all duration-150 ease-linear group-hover:h-[32px]`}
              />

              <a
                className={`mx-auto  flex w-full flex-1 font-medium ${
                  open ? 'gap-8' : ''
                }  flex-${!open ? 'col' : 'row'} items-${
                  open ? 'start' : 'center'
                } `}
                onClick={() => {
                  dispatch(() => emptyQuoteList);
                  signOut({
                    callbackUrl: '/auth/login',
                  });
                }}
              >
                <LogoutIcon
                  width={30}
                  height={30}
                  className={`${open ? 'ml-8' : ''}`}
                />

                <label
                  className={`self-center place-self-end ${
                    open ? 'font-bold' : ''
                  } `}
                >
                  Logout
                </label>
              </a>
            </div>
          </li>
        </ul>
      </aside>
    </nav>
  );
};
export default Navbar;
