import React from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowRightIcon,
} from '@heroicons/react/outline';
import { HeaderGroup } from 'react-table';

type TableHeadProps = {
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
  headerGroups: Array<HeaderGroup<any>>;
};

export const TableHead: React.FC<Partial<TableHeadProps>> = (
  props: TableHeadProps,
) => {
  const { headerGroups } = props;

  return <></>;
};

export default TableHead;
