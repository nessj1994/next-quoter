import React, { useEffect, useState } from 'react';

import {
  useAppDispatch,
  useAppSelector,
  quoteLinesSelectors,
  retrieveLineConf,
  selectComponents,
  addComponent,
  LineComponent,
} from '../../../store';
import { Cell, CellProps, Hooks } from 'react-table';
import { Table } from '../Tables';
import ComponentTableToolbar from './ComponentTableToolbar/index';
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
          updateMyData({ original, index, id, value: e.target.checked });
        };
        return (
          <input
            type="checkbox"
            defaultChecked={original?.Enabled}
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

const LineComponentTable = (props: { lineID: number }) => {
  const dispatch = useAppDispatch();

  // const auth = useAuth();

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
              accessor: 'Part',
              hideFooter: false,
              disableGroupBy: true,
              disableFilters: true,
            },
            {
              Header: 'Description',
              accessor: 'PartDescription',
              hideFooter: false,
              disableGroupBy: true,
              disableFilters: true,
            },
            {
              Header: 'Quantity',
              accessor: 'Quantity',
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
              accessor: 'Cost',
              Cell: (cell: Cell<LineComponent>) => {
                const cellData = cell.row.original;
                return (
                  <>
                    <div>
                      Per Unit: ${cellData.Cost.toFixed(2)} <br /> Total: $
                      {Number(cellData.Cost * cellData.Quantity).toFixed(2)}
                    </div>
                  </>
                );
              },
              Footer: (info: any) => {
                const total = info.rows.reduce((sum: number, row: any) => {
                  // console.log(row);
                  return (
                    parseFloat(row.values['Cost']) *
                      row.original?.Quantity *
                      Number(row.original?.Enabled) +
                    sum
                  );
                }, 0);
                return <span>Total: ${total.toFixed(2)}</span>;
              },
              hideHeader: false, //!auth.state.adminEnabled,
              hideFooter: false, //!auth.state.adminEnabled,
              disableGroupBy: true,
              disableFilters: true,
            },
            {
              Header: 'Weight',
              accessor: 'Weight',
              Cell: (cell: Cell<LineComponent>) => {
                const cellData = cell.row.original;
                return (
                  <>
                    <div>
                      Per Unit: {cellData.Weight.toFixed(2)} LBS. <br /> Total:{' '}
                      {Number(cellData.Weight * cellData.Quantity).toFixed(2)}{' '}
                      LBS.
                    </div>
                  </>
                );
              },
              Footer: (info: any) => {
                const total = info.rows.reduce((sum: number, row: any) => {
                  // console.log(row);
                  return parseFloat(row.values['Weight']) + sum;
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
    [],
  );

  const addonHooks = [selectionHook];

  return (
    <>
      {components && (
        <div>
          <Table<LineComponent>
            name="Components"
            data={components}
            columns={columns}
            sortOptions={{ id: 'Part', desc: false }}
            // addonHooks={auth.state.isAdmin ? addonHooks : []}
          />
        </div>
      )}
    </>
  );
};

export default LineComponentTable;
