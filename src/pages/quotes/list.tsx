import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import moment from 'moment';
import {
  quoteHeaderSelectors,
  useAppDispatch,
  useAppSelector,
  QuoteHeader,
  fetchQuotes,
  setEditing,
  markQuoteDeleted,
  fetchCsrList,
} from 'store';
import Table from 'components/containers/Tables/Core';
import {
  TrashIcon,
  AdjustmentsIcon,
  CalendarIcon,
  EyeOffIcon,
} from '@heroicons/react/outline';
import {
  UserGroupIcon,
  UserIcon,
  SearchIcon,
  LockClosedIcon,
} from '@heroicons/react/solid';

import { useSession } from 'next-auth/react';
import { WrappedTable } from 'components/Table/WrappedTable';
import { debounce } from 'utils';

const QuoteList: NextPage = (pageProps) => {
  // Grab the dispatch function from our redux store
  const dispatch = useAppDispatch();

  // Retrieve our session from the app's context
  const { data: session } = useSession();

  // Grab the headers from our redux store with our selector
  const headers = useAppSelector(quoteHeaderSelectors.selectAll);

  // Create a ref variable for our fetch requests
  const fetchIdRef = React.useRef(0);

  // Create variables to track and set the state for our filters
  const [pageCount, setPageCount] = React.useState(0);
  const [ageFilter, setAgeFilter] = React.useState(90);
  const [searchBar, setSearchBar] = React.useState({
    searchString: '',
    searchField: 'ship_name',
  });
  const [statusFilter, setStatusFilter] = React.useState({
    Converted: false,
    Expired: false,
    Deleted: false,
  });
  const [csrFilter, setCsrFilter] = React.useState(session.user.username);
  const [cuidFilter, setCuidFilter] = React.useState(
    session.user?.is_staff && csrFilter !== '' ? '' : session.user?.customer_id,
  );

  const desiredPagesize = 20;

  const fetchData = React.useCallback(
    async (props: { pageIndex: number; pageSize: number; filters: string }) => {
      const fetchId = ++fetchIdRef.current;
      let fetchCUID = cuidFilter.length >= 6 && csrFilter ? cuidFilter : '';

      if (fetchId === fetchIdRef.current) {
        let response = await dispatch(
          fetchQuotes(
            fetchCUID,
            csrFilter,
            ageFilter,
            props.pageIndex,
            props.pageSize ?? 10,
            {
              private: session?.user.is_staff,
              deleted: statusFilter.Deleted,
              expired: statusFilter.Expired,
              converted: statusFilter.Converted,
              search: searchBar,
            },
          ),
        );

        setPageCount(Math.ceil(response.data?.count / props.pageSize ?? 10));
      }
    },
    [
      ageFilter,
      csrFilter,
      cuidFilter,
      session,
      dispatch,
      statusFilter,
      searchBar,
    ],
  );

  // Custom deletion hook to be passed to our table
  // This will append a delete button column to each row
  const deletionHook = (hooks: Hooks<any>) => {
    hooks.allColumns.push((columns) => [
      // Let's make a column for selection
      ...columns,

      {
        id: '_deletor',
        disableResizing: true,
        disableGroupBy: true,
        disableFilters: true,
        maxWidth: 64,
        align: 'center',
        hideFooter: true,
        Header: () => '',
        // The cell can use the individual row's getToggleRowSelectedProps method
        // to the render a checkbox
        Cell: ({ row }: CellProps<any>) => (
          <div>
            <button
              type="submit"
              className="text-red-600 rounded-full disabled:text-gray-600"
              disabled={row.original.deleted}
              onClick={(e) => {
                // eslint-disable-next-line no-alert
                const answer = confirm(
                  `Are you sure you'd like to delete quote ${row.values.QuoteNumber}?`,
                );
                if (answer) {
                  console.log(row.values.QuoteNumber);
                  dispatch(
                    markQuoteDeleted(
                      row.original,
                      Number(session.user?.customer_id),
                    ),
                  );
                } else {
                  console.log(`${row.values.QuoteNumber} was not deleted`);
                }
                e.stopPropagation();
              }}
            >
              <TrashIcon className="w-5 h-5 " />
            </button>
          </div>
        ),
      },
    ]);
    hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
      // fix the parent group of the selection button to not be resizable
      const selectionGroupHeader = headerGroups[0].headers[0];
      selectionGroupHeader.canResize = false;
    });
  };

  // We will pass the deletionHook in via an array
  // This will allow us to add other custom hooks later if we want
  const addonHooks = [deletionHook];

  const columns = React.useMemo(
    () =>
      [
        {
          Header: 'Quotes',
          show: false,
          hideHeader: true,
          id: 'Quotes',
          canResize: false,
          columns: [
            {
              id: 'Quote #',
              canResize: true,
              accessor: 'quote_number',
              Cell: (row) => {
                // console.log(row);
                return (
                  <div className="overflow-hidden overflow-ellipsis">
                    <Link href={`./info/${row.cell.value}`} passHref>
                      <a
                        className="inline-flex"
                        onClick={() => dispatch(setEditing(row.row.original))}
                      >
                        {row.row.original.private && (
                          <EyeOffIcon height={12} width={12} />
                        )}{' '}
                        {row.row.original.lock && (
                          <LockClosedIcon height={12} width={12} />
                        )}{' '}
                        {row.cell.value}
                      </a>
                    </Link>
                  </div>
                );
              },
              align: 'center',
              canFilter: false,
              minWidth: 100,
              maxWidth: 300,
              hideFooter: true,
              disableFilters: true,
              disableGroupBy: true,
            },
            // {
            //   id: 'Gyms',
            //   accessor: 'gyms',
            //   disableFilters: true,
            //   show
            // },
            {
              id: 'Created',
              canResize: true,
              accessor: (row: QuoteHeader) => {
                return moment.utc(row.quote_date).format('MM/DD/YYYY');
              },
              align: 'center',
              minWidth: 150,
              maxWidth: 50,
              disableFilters: true,

              filter: 'fuzzyText',
              hideFooter: true,
              disableGroupBy: true,
            },

            {
              id: 'Ship To',
              hideFooter: true,
              accessor: 'ship_name',
              Cell: (row: any) => {
                return (
                  <div
                    style={{
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                  >
                    <span>{row.row.original.ship_name}</span>
                  </div>
                );
              },
              align: 'left',
              minWidth: 300,
              maxWidth: 150,
              filter: 'fuzzyText',
              disableGroupBy: true,
              disableFilters: true,
            },
            {
              id: 'State',
              accessor: (row: QuoteHeader) => {
                return row.ship_state?.toUpperCase();
              },
              // Footer: () => {
              //   return 'footer';
              // },
              align: 'center',
              width: 40,
              maxWidth: 64,
              hideFooter: false,
              filter: 'fuzzyText',
              disableFilters: true,
              disableGlobalFilter: true,
              disableGroupBy: true,
            },
            {
              id: 'Ship Date',
              accessor: (row: QuoteHeader) =>
                row.ship_date ? moment(row.ship_date).format('MM/DD/YYYY') : '',
              Cell: (row) => {
                return (
                  <div className="inline-block overflow-hidden overflow-ellipsis">
                    {row.cell.value}
                  </div>
                );
              },
              // Footer: () => {
              //   return 'footer';
              // },
              align: 'center',
              minWidth: 100,
              width: 100,
              maxWidth: 100,
              hideFooter: false,
              disableFilters: true,
              disableGroupBy: true,
            },
            {
              id: 'Creator',
              accessor: 'quote_user',
              Cell: (row) => {
                return (
                  <div
                    className={`flex flex-shrink overflow-hidden overflow-ellipsis uppercase`}
                  >
                    {row.cell.value}
                  </div>
                );
              },
              align: 'left',
              minWidth: 100,
              maxWidth: 100,
              disableFilters: true,
              hideFooter: true,
              disableGroupBy: true,
            },
            {
              id: 'Total',
              canResize: true,
              accessor: (row: any) => {
                return `${Number(row.quote_total_val).toLocaleString('en-us', {
                  style: 'currency',
                  currency: 'usd',
                })}`;
              },
              align: 'right',
              minWidth: 120,
              maxWidth: 50,
              Cell: (row) => {
                let rowExpired =
                  new Date(row.row.original.expire_date).getTime() <
                  new Date().getTime();
                console.log(rowExpired);
                return (
                  <div
                    {...row.props}
                    className={`${rowExpired && 'text-red-500'}`}
                  >
                    {rowExpired
                      ? `Expired - ${row.cell.value}`
                      : row.cell.value}
                  </div>
                );
              },
              filter: 'fuzzyText',
              disableFilters: true,
              hideFooter: true,
              disableGroupBy: true,
            },
          ],
        },
      ].flatMap((c: any) => c.columns), // remove comment to drop header groups
    [headers], // Our dependency array contains the headers so the table gets rebuilt when our header array changes
  );

  const [csrList, setCsrList] = React.useState<Array<any>>([]);

  useEffect(() => {
    let mounted = true;

    const fetch = async () => {
      let fetchUsing =
        cuidFilter !== '' ? cuidFilter : session.user?.customer_id;
      let csrs = await dispatch(fetchCsrList(Number(fetchUsing)));

      if (csrs) {
        console.log(csrs);
        setCsrList(csrs);
      }
    };
    if (mounted) {
      fetch();
    }
    return () => {
      mounted = false;
    };
  }, [dispatch, cuidFilter]);

  const handleAgeFilterChange = (e: any) => {
    console.log('Age filter changed to :', e.target.value);
    setAgeFilter(e.target.value);
  };

  const handleSearchSubmit = debounce((value) => {
    setSearchBar({ ...searchBar, searchString: value });
  }, 500);

  const handleSearchChange = debounce((e: any) => {
    setSearchBar({ ...searchBar, searchString: e.target.value });
  }, 500);

  const handleSearchFieldChange = (e: any) => {
    console.log(e.target.value);
    setSearchBar({ ...searchBar, searchField: e.target.value });
  };

  const handleCSRFilterChange = (e: any) => {
    console.log('CSR filter changed to :', e.target.value);

    let updatedCustID = null;
    let updatedCSRFilter = null;

    if (!cuidFilter && !e.target.value) {
      updatedCustID = session.user?.customer_id;
      setCuidFilter(updatedCustID);
      updatedCSRFilter = e.target.value;
    } else {
      updatedCSRFilter = e.target.value;
    }
    setCsrFilter(updatedCSRFilter);
  };

  const handleCuidFilterChange = debounce((e: any) => {
    console.log('CUID filter changed to :', e.target.value);

    let updatedCSR = null;
    let updatedCustID = null;

    if (session.user?.is_staff) {
      if (!csrFilter && !e.target.value) {
        updatedCSR = session.user?.username;
      } else {
        updatedCSR = '';
      }
      updatedCustID = e.target.value;
      setCsrFilter(updatedCSR);
      setCuidFilter(updatedCustID);
    }
  }, 500);

  const [optionsVisible, setOptionsVisible] = useState(false);

  const Toolbar = (props) => {
    return session ? (
      <>
        <div className="inset-x-0 flex flex-col flex-1 bg-white border rounded-md">
          <div className="flex flex-row items-center justify-between gap-2 rounded-md min-w-fit">
            <div className="flex items-center h-full ml-3 ">
              <h1 className="text-xl font-semibold text-porter">Quotes</h1>
            </div>

            <div className="flex flex-1 max-w-lg py-1 ">
              <input
                type="search"
                id="quote-list-search"
                defaultValue={searchBar.searchString}
                className="flex-1 block w-full min-w-0 p-1.5 text-sm  rounded-none rounded-l-md border border-r-0"
                placeholder="Search"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchChange(e);
                  }
                }}
              />

              <select
                defaultValue={searchBar.searchField}
                onChange={handleSearchFieldChange}
                className="relative"
              >
                <option value={`quote_number`}>Quote Number</option>
                <option value={`ship_name`}>Ship Name</option>
              </select>
              <button
                className="inline-flex items-center px-2 text-sm text-white bg-porter rounded-r-md"
                onClick={(e) => {
                  e.preventDefault();
                  let searchVal = document
                    .getElementById('quote-list-search')
                    .innerHTML.valueOf();
                  handleSearchSubmit(searchVal);
                }}
              >
                <SearchIcon height={24} width={24} className="text-white" />
              </button>
            </div>
            <div className="flex flex-row gap-3 mx-2 flex-shrink-1">
              <div className="flex gap-1">
                {session.user?.is_staff ? (
                  <div className="flex flex-1 max-w-lg py-1">
                    <span className="inline-flex items-center px-2 text-sm text-white bg-porter rounded-l-md ">
                      <UserGroupIcon
                        height={24}
                        width={24}
                        className="text-white "
                      />
                    </span>
                    <input
                      type="search"
                      id="quote-list-search"
                      defaultValue={cuidFilter}
                      className="flex-1 block w-full min-w-0 p-1.5 text-sm  rounded-none rounded-r-md border border-l-0 "
                      placeholder="Cust ID"
                      onChange={handleCuidFilterChange}
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 max-w-lg py-1">
                  <span className="inline-flex items-center px-2 text-sm text-white bg-porter rounded-l-md ">
                    <UserIcon height={24} width={24} className="text-white " />
                  </span>
                  <select
                    id="csr-select"
                    className="flex-1 block w-full min-w-0 p-1.5 text-sm  rounded-none rounded-r-md border border-l-0 "
                    value={csrFilter}
                    defaultValue={42}
                    onChange={handleCSRFilterChange}
                  >
                    {!(csrList.length > 0) ? (
                      <option value="">Loading</option>
                    ) : (
                      <option value="">All Users</option>
                    )}
                    {csrList.map((csr: any) => (
                      <option
                        key={`csr-list-${csr.user_id}`}
                        value={csr.username}
                        className="overflow-none text-ellipsis "
                      >
                        {csr.username.split('@')[0]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col items-center flex-1 w-full bg-white rounded-full text-porter group">
                <button
                  className="px-1 py-1"
                  onClick={() => setOptionsVisible(!optionsVisible)}
                >
                  <AdjustmentsIcon
                    width={32}
                    height={32}
                    className="rounded-full hover:bg-slate-100"
                  />
                </button>
              </div>
            </div>
          </div>
          <div
            className={`flex flex-1 m-2 items-center ${
              !optionsVisible ? 'hidden' : ''
            }`}
          >
            <div className="inset-x-0 w-full border rounded-md bg-slate-200 border-slate-300">
              <div className="m-3 font-bold">
                <h1>Filters</h1>
              </div>
              <div className="flex flex-row h-full gap-12 mx-3 my-2 ">
                <div className="flex flex-col ">
                  <h1>Status</h1>
                  <div className="flex flex-row items-end flex-1 h-full gap-3">
                    <div className="flex gap-1">
                      <input
                        type="checkbox"
                        checked={statusFilter.Converted}
                        onChange={(e) => {
                          setStatusFilter({
                            ...statusFilter,
                            Converted: e.target.checked,
                          });
                        }}
                      />
                      <label>Converted</label>
                    </div>
                    <div className="flex gap-1">
                      <input
                        type="checkbox"
                        checked={statusFilter.Expired}
                        onChange={(e) => {
                          setStatusFilter({
                            ...statusFilter,
                            Expired: e.target.checked,
                          });
                        }}
                      />
                      <label>Expired</label>
                    </div>
                    <div className="flex gap-1">
                      <input
                        type="checkbox"
                        checked={statusFilter.Deleted}
                        onChange={(e) => {
                          setStatusFilter({
                            ...statusFilter,
                            Deleted: e.target.checked,
                          });
                        }}
                      />
                      <label>Deleted</label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 ">
                  <label>Created Within</label>
                  <div className="flex flex-row gap-3">
                    <select
                      className="px-3 mr-3 custom-input"
                      defaultValue={ageFilter}
                      onChange={handleAgeFilterChange}
                    >
                      <option value={30}>30 days</option>
                      <option value={90}>90 days</option>
                      <option value={180}>180 days</option>
                      <option value={365}>365 days</option>
                      <option value={365 * 3}>3+ years</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    ) : null;
  };

  return (
    <div className="flex-col justify-start w-full h-full ">
      {session && (
        <div className="rounded-md ">
          <WrappedTable<QuoteHeader>
            name="quote-list-table"
            columns={columns}
            data={headers}
            toolbarPlugin={Toolbar}
            // adminSetting={session.user?.is_admin}
            // updateMyData={(updatedInfo) => {
            //   return true;
            // }}
            fetchData={fetchData}
            controlledPageCount={pageCount}
            sortOptions={{ id: 'QuoteDate', desc: true }}
            addonHooks={addonHooks}
          />
        </div>
      )}
    </div>
  );
};

QuoteList.auth = true;
// Default export is default
export default QuoteList;
