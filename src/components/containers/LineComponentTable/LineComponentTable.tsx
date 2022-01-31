import React, { useEffect, useState } from 'react';

import {
  useAppDispatch,
  useAppSelector,
  quoteLinesSelectors,
  retrieveLineConf,
  selectComponents,
  addComponent,
  LineComponent,
  getAdminEnabled,
} from '../../../store';
import { Cell, CellProps, Hooks } from 'react-table';
import { Table } from '../Tables';
import ComponentTableToolbar from './ComponentTableToolbar/index';
import { DeletionCell } from '../Tables/Cells';
import { useSession } from 'next-auth/react';
// import useAuth from '../../../authLib/hooks/useAuth';

type ISelectionCellProps = {
  updateMyData: (props: any) => void;
};
type SelectionCellProps = CellProps<any> & ISelectionCellProps;

const selectionHook = (hooks: Hooks<any>) => {
  hooks.allColumns.push((columns) => [
    // Let's make a column for selection
    {
      id: 'Enabled',
      disableResizing: true,
      disableGroupBy: true,
      minWidth: 45,
      width: 45,
      maxWidth: 45,
      hideFooter: false,
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      Header: () => '',
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      Aggregated: () => null,
      Cell: ({
        value: initialValue,
        column: { id, width },
        row: { original, index, values },
        updateMyData,
      }: SelectionCellProps) => {
        const updateEnabled = (e: any) => {
          updateMyData({
            original,
            index,
            field: 'enabled',
            value: e.target.checked,
          });
        };
        return (
          <input
            type="checkbox"
            defaultChecked={original?.enabled}
            onChange={updateEnabled}
          />
        );
      },
      Footer: () => '',
    },
    ...columns,
  ]);
  hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
    // fix the parent group of the selection button to not be resizable
    // const selectionGroupHeader = headerGroups[0].headers[0];
    // selectionGroupHeader.canResize = false;
  });
};

const deletionHook = (hooks: Hooks<any>) => {
  hooks.allColumns.push((columns) => [
    // Let's make a column for selection
    ...columns,
    {
      id: '_deletor',
      disableResizing: true,
      disableGroupBy: true,
      align: 'center',
      width: 45,
      minWidth: 45,
      maxWidth: 45,
      hideFooter: false,
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      Header: () => '',
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox

      Cell: DeletionCell,
    },
  ]);
  hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
    // fix the parent group of the selection button to not be resizable
    // const selectionGroupHeader = headerGroups[0].headers[0];
    // selectionGroupHeader.canResize = false;
  });
};

const LineComponentTable = (props: { lineID: number }) => {
  const dispatch = useAppDispatch();

  const adminOn = useAppSelector(getAdminEnabled);

  const components = useAppSelector(selectComponents);

  useEffect(() => {
    let mounted = true;
    console.log(components);

    if (mounted) {
    }

    return () => {
      mounted = false;
    };
  }, [dispatch, components]);

  const columns = React.useMemo(
    () =>
      [
        {
          Header: 'Components',
          hideHeader: true,
          hideFooter: true,
          columns: [
            {
              Header: 'Part',
              accessor: 'part',
              hideFooter: false,
              disableGroupBy: true,
              disableFilters: true,
            },
            {
              Header: 'Description',
              accessor: 'part_description',
              hideFooter: false,
              disableGroupBy: true,
              disableFilters: true,
              Cell: ({ value }: CellProps<any>) => {
                return <span className="truncate">{value}</span>;
              },
            },
            {
              Header: 'Quantity',
              accessor: 'quantity',
              hideFooter: false,
              align: 'center',
              width: 64,
              minWidth: 48,
              maxWidth: 72,
              disableGroupBy: true,
              disableFilters: true,
            },
            {
              Header: 'Cost',
              accessor: 'cost',
              Cell: (cell: Cell<LineComponent>) => {
                const cellData = cell.row.original;
                return (
                  <>
                    <div>
                      Per Unit: ${Number(cellData.cost).toFixed(2)} <br />{' '}
                      Total: $
                      {Number(cellData.cost * cellData.quantity).toFixed(2)}
                    </div>
                  </>
                );
              },
              Footer: (info: any) => {
                const total = info.rows.reduce((sum: number, row: any) => {
                  // console.log(row);
                  return (
                    parseFloat(row.values['cost']) *
                      row.original?.quantity *
                      Number(row.original?.enabled) +
                    sum
                  );
                }, 0);
                return <span>Total: ${total.toFixed(2)}</span>;
              },
              hideHeader: !adminOn, //!auth.state.adminEnabled,
              hideFooter: !adminOn, //!auth.state.adminEnabled,
              disableGroupBy: true,
              disableFilters: true,
            },
            {
              Header: 'Weight',
              accessor: 'weight',
              Cell: (cell: Cell<LineComponent>) => {
                const cellData = cell.row.original;
                return (
                  <>
                    <div>
                      Per Unit: {Number(cellData.weight).toFixed(2)} LBS. <br />{' '}
                      Total:{' '}
                      {Number(cellData.weight * cellData.quantity).toFixed(2)}{' '}
                      LBS.
                    </div>
                  </>
                );
              },
              Footer: (info: any) => {
                const total = info.rows.reduce((sum: number, row: any) => {
                  // console.log(row);
                  return parseFloat(row.values['weight']) + sum;
                }, 0);
                return <span>Total: {total.toFixed(2)} LBS.</span>;
              },
              hideFooter: false,
              disableGroupBy: true,
              disableFilters: true,
            },
          ],
        },
      ].flatMap((c: any) => c.columns), // remove comment to drop header groups
    [adminOn],
  );

  const addonHooks = [selectionHook, deletionHook];

  return (
    <>
      {components && (
        <div>
          <Table<LineComponent>
            name="Components"
            data={components}
            columns={columns}
            sortOptions={{ id: 'part_num', desc: false }}
            addonHooks={addonHooks}
          />
        </div>
      )}
    </>
  );
};

export default LineComponentTable;
