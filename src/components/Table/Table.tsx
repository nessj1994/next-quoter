import React from 'react';

export const Table: React.FC<any> = (props) => {
  const { children } = props;
  return (
    <table className="table-fixed min-w-full h-full divide-y divide-porter relative">
      {children}
    </table>
  );
};
