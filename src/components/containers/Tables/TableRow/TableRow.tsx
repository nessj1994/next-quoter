import { ArrowDownIcon, ArrowRightIcon } from '@heroicons/react/solid';
import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { TableProperties, Row } from '../types';

function TableRow(data: Row<any>): ReactElement {
  //   const {
  //     name,
  //     columns,
  //     onEdit,
  //     onClick,
  //     adminSetting,
  //     addonHooks,
  //     sortOptions,
  //   } = props;

  const rowProps = { ...data.getRowProps() };

  return (
    <tr
      {...rowProps}
      className="table-row gap-1 border-b-2 row hover:bg-blue-500 hover:text-white hover:bg-opacity-90"
    >
      {data.cells.map((cell) => {
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
                <span {...data.getToggleRowExpandedProps()}>
                  {data.isExpanded ? (
                    <ArrowDownIcon className="inline w-5 h-5 ml-3" />
                  ) : (
                    <ArrowRightIcon className="inline w-5 h-5 ml-3" />
                  )}
                </span>
                {' | '}
                {cell.render('Cell', { editable: false })}
                {data?.subRows.length}
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
}

export default React.memo(TableRow);
