import React, { FC, PropsWithChildren } from 'react';
import { TableContext } from './types';

const TableRow: FC<any> = (props: PropsWithChildren<any>) => {
  const tableInstance = React.useContext(TableContext);
  const { row, children } = props;

  return (
    <tr
      className="table-row gap-1 py-2 border-b-2 row hover:bg-blue-500 hover:text-white hover:bg-opacity-90"
      {...row.getRowProps()}
    >
      {children}
    </tr>
  );
};

export default TableRow;
