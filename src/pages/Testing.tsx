import React from 'react';
import { WrappedTable } from 'components/Table/WrappedTable';

const Testing = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        disableFilter: true,
      },
      {
        Header: 'Age',
        accessor: (d: any): number => d.age,
      },
      {
        Header: 'ID',
        accessor: 'id',
        align: 'right',
        hide: true,
      },
    ],
    [],
  );

  const data = [
    {
      name: 'John Doe',
      age: 32,
      id: '1',
    },
    {
      name: 'Jane Doe',
      age: 26,
      id: '2',
    },
  ];

  return <WrappedTable<typeof data[0]> data={data} columns={columns} />;
};

export default Testing;
