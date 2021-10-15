import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import moment from 'moment';
import {
  quoteHeaderSelectors,
  useAppDispatch,
  useAppSelector,
  setEditing,
} from 'store';
import { fetchQuotes } from 'store';
import { Table } from 'components/containers/Table/TableBase';
import { QuoteHeader } from 'store';
// import {} from '../auth/login';

interface Props {
  Message: string;
}

const QuoteList: NextPage<Props> = (props) => {
  const dispatch = useAppDispatch();

  const headers = useAppSelector(quoteHeaderSelectors.selectAll);

  useEffect(() => {
    let mounted = true;

    if (mounted && headers.length <= 0) {
      dispatch(fetchQuotes('800221', 'jness', '2021-010-01', false));
      console.log(headers);
    }

    return () => {
      mounted = false;
    };
  }, []);

  const deletionHook = (hooks: Hooks<any>) => {
    hooks.allColumns.push((columns) => [
      // Let's make a column for selection
      {
        id: '_deletor',
        disableResizing: true,
        disableGroupBy: true,
        minWidth: 45,
        width: 45,
        align: 'center',
        hideFooter: true,
        maxWidth: 45,
        Header: () => '',
        // The cell can use the individual row's getToggleRowSelectedProps method
        // to the render a checkbox
        Cell: ({ row }: CellProps<any>) => (
          <button
            type="submit"
            className="btn btn-round"
            onClick={(e) => {
              // eslint-disable-next-line no-alert
              const answer = confirm(
                `Are you sure you'd like to delete quote ${row.values.QuoteNumber}`,
              );
              if (answer) {
                // console.log(row.values.QuoteNumber);
                // quoteHeaders?.quoteHeaders?.markAsDeleted(
                //   row.original,
                //   auth.loggedInUser.FSID,
                // );
              } else {
                // console.log(`${row.values.QuoteNumber} was not deleted`);
              }
              e.stopPropagation();
            }}
          >
            <i className="bi bi-x-circle" />
          </button>
        ),
      },
      ...columns,
    ]);
    hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
      // fix the parent group of the selection button to not be resizable
      const selectionGroupHeader = headerGroups[0].headers[0];
      selectionGroupHeader.canResize = false;
    });
  };

  const addonHooks = [deletionHook];

  const columns = React.useMemo(
    () =>
      [
        {
          Header: 'Quotes',
          show: false,
          hideHeader: true,
          id: 'Quotes',
          canResize: true,
          columns: [
            {
              Header: 'Quote Number',
              id: 'QuoteNumber',
              canResize: true,
              accessor: 'QuoteNumber',
              Cell: (row) => {
                // console.log(row);
                return (
                  <div>
                    <a
                      href={`./info?quoteNum=${row.cell.value}`}
                      onClick={() => dispatch(setEditing(row.row.original))}
                    >
                      {row.cell.value}
                    </a>
                  </div>
                );
              },
              align: 'center',
              width: 64,
              minWidth: 48,
              maxWidth: 72,
              // hideHeader: true,
              hideFooter: true,
              disableGroupBy: true,
            },
            {
              Header: 'Created',
              id: 'QuoteDate',
              canResize: true,
              accessor: (row: QuoteHeader) => {
                return moment.utc(row.QuoteDate).format('YYYY-MM-DD');
              },
              align: 'center',
              width: 72,
              minWidth: 64,
              maxWidth: 128,
              filter: 'fuzzyText',
              hideFooter: true,
              disableGroupBy: true,
            },
            {
              Header: 'Total Price',
              id: 'QuoteTotalVal',
              canResize: true,
              accessor: (row: any) => {
                return row.QuoteTotalVal?.toFixed(2);
              },
              align: 'center',
              width: 72,
              minWidth: 64,
              maxWidth: 128,
              filter: 'fuzzyText',
              hideFooter: true,
              disableGroupBy: true,
            },
            {
              id: 'ShipTo',
              Header: 'Ship To',
              hideFooter: true,
              accessor: 'ShipName',
              Cell: (row: any) => {
                return (
                  <div
                    style={{
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                  >
                    <span>{row.row.original.ShipName}</span>
                  </div>
                );
              },
              filter: 'fuzzyText',
              disableGroupBy: true,
            },
            {
              Header: 'State',
              id: 'State',
              accessor: (row: QuoteHeader) => {
                return row.ShipState?.toUpperCase();
              },
              align: 'center',
              width: 32,
              minWidth: 32,
              maxWidth: 64,
              hideFooter: true,
              filter: 'fuzzyText',
              disableGroupBy: true,
            },
            {
              Header: 'Ship Date',
              id: 'ShipDate',
              accessor: (row: QuoteHeader) =>
                row.ShipDate ? moment(row.ShipDate).format('YYYY-MM-DD') : '',
              align: 'center',
              width: 72,
              minWidth: 64,
              maxWidth: 128,
              hideFooter: true,
              disableGroupBy: true,
            },
            {
              id: 'Created By',
              Header: 'Created By',
              accessor: 'QuoteUser',
              Cell: (row) => {
                return (
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {row.cell.value?.toUpperCase()}
                  </div>
                );
              },
              align: 'center',
              width: 90,
              minWidth: 64,
              maxWidth: 128,
              hideFooter: true,
              disableGroupBy: true,
            },
          ],
        },
      ].flatMap((c: any) => c.columns), // remove comment to drop header groups
    [headers],
  );

  return (
    <>
      <div className="min-h-full w-full m-auto">
        <Table<QuoteHeader>
          name="quote-list-table"
          columns={columns}
          data={headers}
          // adminSetting={adminEnabled}
          updateMyData={(updatedInfo) => {
            return true;
          }}
          sortOptions={{ id: 'QuoteDate', desc: true }}
          addonHooks={addonHooks}
        />
      </div>
    </>
  );
};

export default QuoteList;
