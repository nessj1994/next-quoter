/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/display-name */

import React, {
  PropsWithChildren,
  ReactElement,
  useState,
  useEffect,
} from 'react';
import {
  Cell,
  HeaderGroup,
  HeaderProps,
  FooterProps,
  Meta,
  Row,
  useColumnOrder,
  useExpanded,
  useFilters,
  useFlexLayout,
  useGroupBy,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  Hooks,
  useTable,
  TableState,
  FilterProps,
} from 'react-table';
import { camelToWords, useDebounce } from 'utils';
import { FuzzyText, NumericText } from '../Filters';
import ResizeHandle from '../ResizeHandle';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowRightIcon,
} from '@heroicons/react/outline';
import { TableProperties } from '../types';

const DefaultHeader: React.FC<HeaderProps<any>> = ({ column }: any) => (
  <>
    <strong className="text-blue-400">
      {column.id.startsWith('_') ? null : camelToWords(column.id)}
    </strong>
  </>
);

const DefaultFooter: React.FC<FooterProps<any>> = ({ column }: any) => (
  // <>{camelToWords(column.id)}</>
  <> </>
);

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      className="filter custom-input"
      placeholder={`Search`}
    />
  );
}

const getStyles = (props: any, disableResizing = false, align = 'left') => [
  props,
  {
    style: {
      justifyContent:
        align === 'right'
          ? 'flex-end'
          : align === 'center'
          ? 'center'
          : 'flex-start',
      display: 'flex',
    },
  },
];

const headerProps = <T extends Record<string, unknown>>(
  props: any,
  { column }: Meta<T, { column: ExtendedHeaderProps }>,
) => getStyles(props, column && column.disableResizing, column && column.align);

const footerProps = <T extends Record<string, unknown>>(
  props: any,
  { column }: Meta<T, { column: ExtendedHeaderProps }>,
) => getStyles(props, column && column.disableResizing, column && column.align);

const cellProps = <T extends Record<string, unknown>>(
  props: any,
  { cell }: Meta<T, { cell: Cell<T> & any }>,
) =>
  getStyles(
    props,
    cell.column && cell.column.disableResizing,
    cell.column && cell.column.align,
  );

// Object containing our filterTypes
const filterTypes = {
  fuzzyText: FuzzyText,
  numeric: NumericText,
};

// A Type to add our custom fields onto the headers
// This allows for hiding and other custom features
type ExtendedHeaderProps = HeaderGroup & any;

// The Table itself
function Table<T extends Record<string, unknown>>(
  props: PropsWithChildren<TableProperties<T>>,
): ReactElement {
  const {
    name,
    columns,
    onEdit,
    onClick,
    adminSetting,
    addonHooks,
    sortOptions,
  } = props;

  // Memo-ized defaultColumn object
  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
      Header: DefaultHeader,
      // When using the useFlexLayout:
      Footer: DefaultFooter,
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 128, // width is used for both the flex-basis and flex-grow
      maxWidth: 200, // maxWidth is only used as a limit for resizing
    }),
    [],
  );

  // Array containing all the hooks we want the table to use
  const hooks: ((hooks: Hooks<any>) => void)[] = [
    useColumnOrder,
    useFilters,
    useGroupBy,
    useSortBy,
    useExpanded,
    useFlexLayout,
    useResizeColumns,
    useRowSelect,
  ];

  const allHooks = addonHooks !== undefined ? hooks.concat(addonHooks) : hooks;

  const [initialState, setInitialState] = useState(() => {
    let init = sortOptions ? { sortBy: [sortOptions] } : ({} as TableState<T>);

    return init;
  });

  const instance = useTable<T>(
    {
      ...props,
      columns,
      defaultColumn,
    },
    ...allHooks,
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,

    state,
  } = instance;

  // Prevents render from ocurring too many extra times. Visual examples of this available online
  const debouncedState = useDebounce(state, 500);

  useEffect(() => {
    const { sortBy, filters, columnResizing, hiddenColumns } = debouncedState;
    const value = {
      sortBy,
      filters,
      columnResizing,
      hiddenColumns,
    };

    setInitialState(value);
  }, [setInitialState, debouncedState]);
  // Custom Row renderer to help with dynamic update logic, and subheaders
  const renderRow = React.useMemo(
    () => (row: Row<any>) => {
      const rowProps = { ...row.getRowProps() };

      return (
        <tr
          {...rowProps}
          className="table-row gap-1 border-b-2 row hover:bg-blue-500 hover:text-white hover:bg-opacity-90"
        >
          {row.cells.map((cell) => {
            return cell.column.hideHeader ? null : (
              <td
                className={`flex py-3 font-sans col whitespace-nowrap ${
                  cell.column.printable ? '' : 'print:invisible'
                }`}
                {...cell.getCellProps(cellProps)}
              >
                {cell.isGrouped ? (
                  // If it's a grouped cell, add an expander and row count4
                  <>
                    <span {...row.getToggleRowExpandedProps()}>
                      {row.isExpanded ? (
                        <ArrowDownIcon className="inline w-5 h-5 ml-3" />
                      ) : (
                        <ArrowRightIcon className="inline w-5 h-5 ml-3" />
                      )}
                    </span>
                    {' | '}
                    {cell.render('Cell', { editable: false })}
                    {row?.subRows.length}
                  </>
                ) : cell.isAggregated ? (
                  // If the cell is aggregated, use the Aggregated
                  // renderer for cell
                  cell.render('Aggregated')
                ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                  // Otherwise, just render the regular cell
                  cell.render('Cell', { editable: true })
                )}
              </td>
            );
          })}
        </tr>
      );
    },
    [],
  );

  // The final return for our table component. Returns our rendered data
  return (
    // {/* Base React Fragment */ }
    //! make new table component for lines. Add if check and variable to track and check the current lines gym if it's greater than current gym var render out tr then cell. This will allow for gym edit row
    <>
      <div className="my-3 overflow-x-auto bg-white bg-opacity-50 rounded-lg shadow-lg print:border-none print:m-0 print:overflow-visible">
        {/* The table root - normally <table> */}
        <table
          id="table"
          {...getTableProps()}
          className={`w-full h-full relative `}
        >
          {/* <TableHead />*/}

          <thead
            id="table-head"
            className="sticky top-0 table-header-group bg-white border-b-2"
          >
            {headerGroups.map((headerGroup, index) => (
              // Table header row - normally <tr>
              <tr
                {...headerGroup.getHeaderGroupProps()}
                id="table-row"
                className="table-row gap-1 row print:gap-0"
                key={`header-group-${index}`}
              >
                {/* Table Headers mapped from array - normally <th> */}
                {headerGroup.headers.map((column) => {
                  const { hideHeader, printable } = column; // custom prop
                  return (
                    hideHeader || (
                      <th
                        id="table-header"
                        className={`table-cell uppercase border border-porter-light hover:shadow-sm  ${
                          !printable ? 'printer-friendly' : ''
                        }`}
                        {...column.getHeaderProps(
                          column.getSortByToggleProps(),
                        )}
                        {...column.getHeaderProps(headerProps)}
                      >
                        {/* contain our header and sort icon */}
                        <div className="flex justify-between flex-1 overflow-hidden">
                          {column.render('Header')}
                          {column.canSort && (
                            <div className="inline-flex justify-end">
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <ArrowDownIcon className="inline w-5 h-5 " />
                                ) : (
                                  <ArrowUpIcon className="inline w-5 h-5" />
                                )
                              ) : (
                                ''
                              )}
                            </div>
                          )}
                        </div>
                        {/* {column.canFilter ? column.render('Filter') : null} */}
                      </th>
                    )
                  );
                })}
              </tr>
            ))}
          </thead>
          {/* TABLE BODY is rendered here */}
          <tbody {...getTableBodyProps()} className={``}>
            {rows && rows.length > 0 ? (
              rows.map((row) => {
                prepareRow(row);

                return renderRow({ ...row });
              })
            ) : (
              <div className="m-3 text-center">No data was found...</div>
            )}
          </tbody>

          {/* TABLE FOOTER is rendered here */}

          <tfoot className="">
            {footerGroups.map((group, index) => {
              // console.log(group);
              return (
                <tr
                  className="gap-1"
                  {...group.getFooterGroupProps()}
                  key={`table-footer-${index}`}
                >
                  {group.headers.map((column: ExtendedHeaderProps) => {
                    return !column.hideHeader ? (
                      <td
                        {...column.getHeaderProps(footerProps)}
                        className="px-4 py-2 mx-auto overflow-hidden text-xs font-medium tracking-wider text-center text-gray-500 uppercase overflow-ellipsis col-span "
                      >
                        {!column.hideFooter && column.render('Footer')}
                      </td>
                    ) : null;
                  })}
                </tr>
              );
            })}
          </tfoot>
        </table>
      </div>
    </>
  );
}

export default Table;
