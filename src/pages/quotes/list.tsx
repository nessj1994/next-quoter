import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import moment from 'moment';
import {
  quoteHeaderSelectors,
  useAppDispatch,
  useAppSelector,
  setEditing,
  QuoteHeader,
  fetchQuotes,
  markQuoteDeleted,
} from 'store';
import Table from 'components/containers/Tables/Core';
import { TrashIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';

const QuoteList: NextPage = (pageProps) => {
  // Grab the dispatch function from our redux store
  const dispatch = useAppDispatch();

  // Call useSession() to retrieve the session passed through our props
  // Look below in getServerSideProps to see the where it is passed in
  // In this case we require the session, and if it's not valid we send the user
  // back to the the Login page
  const { data: session } = useSession();
  // Grab the headers from our redux store with our selector
  const headers = useAppSelector(quoteHeaderSelectors.selectAll);

  // Effect
  useEffect(() => {
    let mounted = true;

    if (mounted && document && headers.length <= 0) {
      dispatch(
        fetchQuotes(
          session?.user?.customer_id,
          session?.user?.username,
          90,
          false,
        ),
      );
    }

    return () => {
      mounted = false;
    };
  }, [dispatch, session]);

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

  // Define the columns for our table
  // ! useMemo is critical here as it prevents us from
  // ! recalculating the data unlessa dependency has changed.
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
              Header: 'Quote #',
              id: 'QuoteNumber',
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
              minWidth: 90,
              maxWidth: 112,
              hideFooter: true,
              disableGroupBy: true,
            },
            {
              Header: 'Created',
              id: 'QuoteDate',
              canResize: true,
              accessor: (row: QuoteHeader) => {
                return (
                  <div className="overflow-hidden overflow-ellipsis">
                    {moment.utc(row.quote_date).format('MM/DD/YYYY')}
                  </div>
                );
              },
              align: 'left',
              minWidth: 72,
              width: 72,

              maxWidth: 80,
              filter: 'fuzzyText',
              hideFooter: true,
              disableGroupBy: true,
            },
            {
              Header: 'Total',
              id: 'QuoteTotalVal',
              canResize: true,
              accessor: (row: any) => {
                // return Number(row.quote_total_val).toFixed(2);
                return (
                  <div>
                    {Number('10000000').toLocaleString('en-us', {
                      style: 'currency',
                      currency: 'usd',
                    })}
                  </div>
                );
              },
              align: 'left',
              width: 64,
              maxWidth: 64,
              Cell: (row) => {
                return (
                  <div className="overflow-hidden overflow-ellipsis">
                    {row.cell.value}
                  </div>
                );
              },
              filter: 'fuzzyText',
              hideFooter: true,
              disableGroupBy: true,
            },
            {
              id: 'ShipTo',
              Header: 'Ship To',
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
              minWidth: 90,
              width: 140,
              maxWidth: 140,
              filter: 'fuzzyText',
              disableGroupBy: true,
            },
            {
              Header: 'State',
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
              disableGroupBy: true,
            },
            {
              Header: 'Ship Date',
              id: 'ShipDate',
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
              align: 'left',
              width: 50,

              maxWidth: 50,
              hideFooter: false,
              disableGroupBy: true,
            },
            {
              id: 'Created By',
              Header: 'Created By',
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
              hideFooter: true,
              disableGroupBy: true,
            },
          ],
        },
      ].flatMap((c: any) => c.columns), // remove comment to drop header groups
    [headers], // Our dependency array contains the headers so the table gets rebuilt when our header array changes
  );

  if (session) {
    // Time for returning
    // Return the table element passing in:
    // - Our columns array built above
    // - Header data loaded from the redux store
    // - updateMyData callback function if needed
    // - The sortOptions for default sorting setup
    // - The addonHooks array containing any custom hooks
    return (
      <div className="flex-col justify-start flex-shrink w-full h-screen py-6">
        {session && (
          <>
            <div className="flex flex-row m-auto bg-transparent ">
              <span className="px-3 py-3 mx-auto ml-3 font-bold bg-white rounded-md shadow-lg">{`Welcome back, ${session.user?.first_name}`}</span>

              <select className="px-3 my-1 mr-3">
                <option>default</option>
              </select>
            </div>
            <div className="px-3 rounded-md ">
              <Table<QuoteHeader>
                name="quote-list-table"
                columns={columns}
                data={headers}
                // adminSetting={session.user?.is_admin}
                updateMyData={(updatedInfo) => {
                  return true;
                }}
                sortOptions={{ id: 'QuoteDate', desc: true }}
                addonHooks={addonHooks}
              />
            </div>
          </>
        )}
      </div>
    );
  }
};

// // * Load session from nextauth provider before displaying page
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   return {
//     props: {
//       session: await getSession(context),
//     },
//   };
// };
QuoteList.auth = true;
// Default export is default
export default QuoteList;
