import React, { MouseEventHandler } from 'react';
import { Table } from './Table';
import THead from './THead';
import TBody from './TBody';
import TableRow from './TRow';
import Pagination from './Pagination';
import {
  usePagination,
  useTable,
  TableInstance,
  Hooks,
  useColumnOrder,
  useFilters,
  useGroupBy,
  useSortBy,
  useFlexLayout,
  useExpanded,
  useResizeColumns,
  useRowSelect,
  TableOptions,
  Row,
  HeaderProps,
  HeaderGroup,
  Meta,
  Cell,
} from 'react-table';

import { TableContext } from './types';
import { camelToWords, debounce } from 'utils';

interface TableProps<T extends Record<string, unknown>>
  extends TableOptions<T> {
  name: string;
  onAdd?: (instance: TableInstance<T>) => MouseEventHandler;
  onDelete?: (instance: TableInstance<T>) => MouseEventHandler;
  onEdit?: (instance: TableInstance<T>) => MouseEventHandler;
  onClick?: (row: Row<T>) => void;
  updateData?: (props: any) => void;
  fetchData?: (...args: any) => void;
  toolbarPlugin?: React.ReactNode;

  controlledPageCount: number;
  skipPageReset?: boolean;
  adminView?: boolean;
  addonHooks: ((hooks: Hooks<any>) => void)[] | undefined;
}

function DefaultHeader({ column }) {
  return <>{column.id.startsWith('_') ? null : camelToWords(column.id)}</>;
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  // const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      className="filter"
      placeholder={`Search`}
    />
  );
}

// Commonly this is a styles function, but we're using tailwind so we set classNames prop instead
const configureClassNames = (props, column) => {
  return [
    props,
    {
      className: `flex text-${column.align} flex-col justify-${
        column.align === 'center'
          ? 'center'
          : column.align === 'right'
          ? 'end'
          : 'start'
      } ${column.hide ? 'hidden' : ''}`,
    },
  ];
};
const headerProps = <T extends Record<string, unknown>>(
  props: any,
  { column }: Meta<T, { column: HeaderGroup<T> }>,
) => configureClassNames(props, { ...column });

const footerProps = <T extends Record<string, unknown>>(
  props: any,
  { column }: Meta<T, { column: HeaderGroup<T> }>,
) => configureClassNames(props, { ...column });

const cellProps = <T extends Record<string, unknown>>(
  props: any,
  { cell }: Meta<T, { cell: Cell<T> & any }>,
) => configureClassNames(props, { ...cell.column });

export function WrappedTable<T extends Record<string, unknown>>(
  props: React.PropsWithChildren<TableProps<T>>,
) {
  const {
    columns,
    data,
    addonHooks,
    fetchData,
    controlledPageCount,
    controlledCSR,
    controlledAgeFilter,
  } = props;

  // Array containing all the hooks we want the table to use
  const hooks: ((hooks: Hooks<any>) => void)[] = [
    useColumnOrder,
    useFilters,
    useGroupBy,
    useSortBy,
    useExpanded,
    useFlexLayout,
    useResizeColumns,
    usePagination,
    useRowSelect,
  ];

  // Memo-ized defaultColumn object
  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
      Header: DefaultHeader,
      minWidth: 60, // minWidth is only used as a limit for resizing
      width: 128, // width is used for both the flex-basis and flex-grow
      maxWidth: 200, // maxWidth is only used as a limit for resizing
    }),
    [],
  );

  const allHooks = addonHooks !== undefined ? hooks.concat(addonHooks) : hooks;

  const tableInstance: TableInstance<T> = useTable<T>(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: 10 },
      manualPagination: true,
      manualFilters: true,
      pageCount: controlledPageCount,
      autoResetPage: false,
    },
    ...allHooks,
  );

  const {
    getTableProps,
    page,
    prepareRow,
    headerGroups,
    pageCount,
    gotoPage,
    state: { pageIndex, pageSize, filters },
  } = tableInstance;

  React.useEffect(() => {
    let mounted = true;
    let fetchIndex = pageIndex + 1;
    console.log(fetchIndex);
    let filter = undefined;

    if (filters[0]) filter = filters[0].value;
    console.log('FILTERS: ', filters);
    console.log(filter);
    if (mounted) {
      fetchData({
        pageIndex: fetchIndex,
        pageSize,
        filters: filters,
      });
    }

    return () => {
      mounted = false;
    };
  }, [fetchData, pageIndex, pageSize, filters]);

  React.useEffect(() => {
    let mounted = true;

    if (mounted) {
      gotoPage(0);
    }

    return () => {
      mounted = false;
    };
  }, [controlledCSR, controlledAgeFilter]);

  return (
    <TableContext.Provider value={tableInstance}>
      {/* Conditionally add Toolbar */}
      {props.toolbarPlugin && props.toolbarPlugin}
      {/* <Toolbar />  */}
      <div className="my-3 overflow-x-auto bg-white bg-opacity-50 rounded-lg shadow-lg print:border-none print:m-0 print:overflow-visible">
        <Table {...getTableProps()}>
          <THead>
            {headerGroups?.map((headerGroup, index) => {
              return (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  key={`header-group-${index}`}
                >
                  {headerGroup.headers.map((column) => {
                    return (
                      <th
                        key={`column-${column.id}`}
                        {...column.getHeaderProps(headerProps)}
                      >
                        <p className="text-porter">{column.render('Header')}</p>
                        <div className="overflow-hidden">
                          {column.canFilter && column.render('Filter')}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </THead>
          <TBody>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow key={`row-${i}`} row={row}>
                  {row.cells.map((cell, i) => {
                    return (
                      <td
                        key={`cell-${i}`}
                        className={`flex py-3 font-sans col whitespace-nowrap `}
                        {...cell.getCellProps(cellProps)}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </TableRow>
              );
            })}
          </TBody>
          {/* 
          includeFooter && 
          <TFooter />
         */}
        </Table>
        <Pagination />
      </div>
    </TableContext.Provider>
  );
}
