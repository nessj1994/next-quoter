/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */

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
  useGlobalFilter,
  useFlexLayout,
  useGroupBy,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  Hooks,
  useTable,
  TableState,
} from 'react-table';
import styles from './datatable-base.module.scss';
import { camelToWords, useDebounce } from 'utils';
import { fuzzyTextFilter, numericTextFilter } from './filters';
import { TableProperties } from './types';
import ResizeHandle from '../ResizeHandle';

const DefaultHeader: React.FC<HeaderProps<any>> = ({ column }: any) => (
  <>
    <strong>
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
      className="filter"
      placeholder={`Search ${count} records...`}
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
  { column }: Meta<T, { column: HeaderGroup<T> }>,
) => getStyles(props, column && column.disableResizing, column && column.align);

const cellProps = <T extends Record<string, unknown>>(
  props: any,
  { cell }: Meta<T, { cell: Cell<T> }>,
) =>
  getStyles(
    props,
    cell.column && cell.column.disableResizing,
    cell.column && cell.column.align,
  );

// Object containing our filterTypes
const filterTypes = {
  fuzzyText: fuzzyTextFilter,
  numeric: numericTextFilter,
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
      width: 200, // width is used for both the flex-basis and flex-grow
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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
    state,
  } = useTable<T>(
    {
      ...props,
      columns,
      filterTypes,
      defaultColumn,
      // initialState,
    },
    ...allHooks,
  );

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
        <div {...rowProps} className={styles.tr}>
          {row.cells.map((cell) => {
            // console.log(cell);
            return cell.column.hideHeader ? null : (
              <div
                className={`${styles.td} items-center `}
                {...cell.getCellProps(cellProps)}
              >
                {cell.isGrouped ? (
                  // If it's a grouped cell, add an expander and row count4
                  <>
                    <span {...row.getToggleRowExpandedProps()}>
                      {row.isExpanded ? (
                        <i className="bi bi-arrow-down-square" />
                      ) : (
                        <i className="bi bi-arrow-right-square" />
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
              </div>
            );
          })}
        </div>
      );
    },
    [],
  );

  // The final return for our table component. Returns our rendered data
  return (
    <>
      <div {...getTableProps()} className={`${styles.table} w-full `}>
        <div className={styles.thead}>
          {headerGroups.map((headerGroup) => (
            <div className={styles.tr} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                const { hideHeader } = column;
                return (
                  hideHeader || (
                    <div
                      className={styles.th}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      <div className="row row-cols-2">
                        <div
                          {...column.getHeaderProps(headerProps)}
                          className="col text-nowrap"
                        >
                          <strong>{column.render('Header')}</strong>
                        </div>
                        {column.canSort && (
                          <div className="col">
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <i className="bi bi-arrow-down" />
                              ) : (
                                <i className="bi bi-arrow-up" />
                              )
                            ) : (
                              ''
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        {column.canFilter ? column.render('Filter') : null}
                      </div>

                      {column.canResize ? (
                        <ResizeHandle column={column} />
                      ) : null}
                    </div>
                  )
                );
              })}
            </div>
          ))}
        </div>

        <div {...getTableBodyProps()} className={styles.tbody}>
          {rows &&
            rows.map((row) => {
              prepareRow(row);

              return renderRow({ ...row });
            })}
        </div>
        <div className={styles.tfoot}>
          {footerGroups.map((group, index) => {
            // console.log(group);
            return (
              <div
                className={styles.tr}
                {...group.getFooterGroupProps()}
                key={index}
              >
                {group.headers.map((column: ExtendedHeaderProps) => {
                  // console.log(column);
                  return (
                    column.hideFooter || (
                      <div
                        className={styles.td}
                        {...column.getFooterProps(footerProps)}
                      >
                        {column.render('Footer')}
                      </div>
                    )
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Table;
