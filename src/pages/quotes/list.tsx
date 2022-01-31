import React, { useEffect } from 'react';
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
import { TrashIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import { WrappedTable } from 'components/Table/WrappedTable';

const QuoteList: NextPage = (pageProps) => {
  // Grab the dispatch function from our redux store
  const dispatch = useAppDispatch();

  const { data: session } = useSession();

  const fetchIdRef = React.useRef(0);

  // Grab the headers from our redux store with our selector
  const headers = useAppSelector(quoteHeaderSelectors.selectAll);

  const [pageCount, setPageCount] = React.useState(0);
  const [ageFilter, setAgeFilter] = React.useState(90);
  const [cuidFilter, setCuidFilter] = React.useState(
    session.user?.customer_id ?? '',
  );

  console.log(cuidFilter);
  const [csrFilter, setCsrFilter] = React.useState(session.user.username);

  const desiredPagesize = 20;

  const fetchData = React.useCallback(
    async (props: { pageIndex: number; pageSize: number; filters: string }) => {
      const fetchId = ++fetchIdRef.current;

      if (fetchId === fetchIdRef.current) {
        let response = await dispatch(
          fetchQuotes(
            cuidFilter,
            csrFilter,
            ageFilter,
            false,
            props.pageIndex,
            props.pageSize,
            props.filters,
          ),
        );

        console.log(response.data.count / desiredPagesize);

        setPageCount(Math.ceil(response.data?.count / desiredPagesize));
      }
    },
    [ageFilter, csrFilter, cuidFilter, session, dispatch],
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
              className="rounded-full "
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
              <TrashIcon className="w-5 h-5 text-red-600" />
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
                      <a onClick={() => dispatch(setEditing(row.row.original))}>
                        {row.cell.value}
                      </a>
                    </Link>
                  </div>
                );
              },
              align: 'center',
              canFilter: false,
              minWidth: 90,
              maxWidth: 112,
              hideFooter: true,
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
                return (
                  <div className="overflow-hidden overflow-ellipsis">
                    {moment.utc(row.quote_date).format('MM/DD/YYYY')}
                  </div>
                );
              },
              align: 'left',
              minWidth: 110,
              width: 110,
              maxWidth: 110,
              disableFilters: true,

              filter: 'fuzzyText',
              hideFooter: true,
              disableGroupBy: true,
            },
            {
              id: 'Total',
              canResize: true,
              accessor: (row: any) => {
                return (
                  <div>
                    {Number(row.quote_total_val).toLocaleString('en-us', {
                      style: 'currency',
                      currency: 'usd',
                    })}
                  </div>
                );
              },
              align: 'left',
              minWidth: 110,
              width: 110,
              maxWidth: 110,
              Cell: (row) => {
                return (
                  <div className="overflow-hidden overflow-ellipsis">
                    {row.cell.value}
                  </div>
                );
              },
              filter: 'fuzzyText',
              disableFilters: true,
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
              minWidth: 110,
              width: 140,
              maxWidth: 140,
              filter: 'fuzzyText',
              disableGroupBy: true,
            },
            {
              id: 'State',
              accessor: (row: QuoteHeader) => {
                return (
                  <span className="overflow-hidden overflow-ellipsis">
                    {row.ship_state?.toUpperCase()}
                  </span>
                );
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
              width: 64,
              maxWidth: 64,
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
  //  TODO: add cuidFilter to the deps list and update the fetch to use it
  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      let csrs = await dispatch(fetchCsrList());

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
  }, [dispatch]);

  const handleAgeFilterChange = (e: any) => {
    console.log('Age filter changed to :', e.target.value);
    setAgeFilter(e.target.value);
  };

  const handleCSRFilterChange = (e: any) => {
    console.log('CSR filter changed to :', e.target.value);
    setCsrFilter(e.target.value);
  };

  const handleCuidFilterChange = (e: any) => {
    console.log('CUID filter changed to :', e.target.value);
    setCuidFilter(e.target.value);
  };

  const Toolbar = session ? (
    <>
      <div className="flex flex-row justify-start flex-1 gap-3 m-auto bg-transparent ">
        <div className="flex flex-row flex-1 gap-3">
          <div className="px-3 py-3 mx-auto ml-3 font-bold bg-white rounded-md shadow-lg ">
            {`Welcome back, ${session.user?.first_name}`}
          </div>
          <div className="flex flex-1 gap-3">
            {session.user?.is_staff ? (
              <div className="flex flex-col">
                <label htmlFor="cuid-select">Cuid</label>
                <input
                  type="text"
                  className=" custom-input"
                  onChange={handleCuidFilterChange}
                />
              </div>
            ) : null}
            <div className="flex flex-col">
              <label htmlFor="cuid-select">Users</label>

              <select
                id="csr-select"
                className="px-3 py-3 bg-gray-200 rounded-md "
                value={csrFilter}
                onChange={handleCSRFilterChange}
              >
                {csrList.length > 0 ? (
                  csrList.map((csr: any) => (
                    <option
                      key={`csr-list-${csr.user_id}`}
                      value={csr.username}
                    >
                      {csr.username}
                    </option>
                  ))
                ) : (
                  <option value={0}>No CSRs</option>
                )}
              </select>
            </div>
          </div>
        </div>
        <select
          className="px-3 my-1 mr-3"
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
    </>
  ) : null;

  if (session) {
    return (
      <div className="flex-col justify-start flex-shrink w-full h-screen py-6">
        {session && (
          <div className="px-3 rounded-md ">
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
  }
};

QuoteList.auth = true;
// Default export is default
export default QuoteList;
