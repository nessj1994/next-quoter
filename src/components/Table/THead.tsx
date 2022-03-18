import React, { FC, PropsWithChildren } from 'react';
import { TableContext } from './types';

const THead: FC<any> = (props: PropsWithChildren<any>) => {
  const tableInstance = React.useContext(TableContext);
  const { children } = props;
  return (
    <thead className="sticky top-0 table-header-group bg-white border-b-2">
      {!tableInstance &&
        console.log(
          'There appears to be an error with the table context supplied to THead',
        )}
      {children}
    </thead>
  );
};

export default THead;
