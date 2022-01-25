import React, { FC } from 'react';

import { TableContext } from './types';

const TBody: React.FC<any> = (props: React.PropsWithChildren<any>) => {
  const tableInstance = React.useContext(TableContext);
  const { children } = props;
  const {
    page,
    pageCount,
    getTableBodyProps,
    prepareRow,
    state: { pageIndex, pageSize },
  } = tableInstance;
  return (
    <>
      <tbody {...getTableBodyProps()}>{children}</tbody>
    </>
  );
};

export default TBody;
