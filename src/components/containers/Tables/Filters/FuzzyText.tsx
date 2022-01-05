import { matchSorter } from 'match-sorter';
import { FilterValue, IdType, Row } from 'react-table';

export default function FuzzyText<T extends Record<string, unknown>>(
  rows: Array<Row<T>>,
  id: IdType<T>,
  filterValue: FilterValue,
): Array<Row<T>> {
  return matchSorter(rows, filterValue, {
    keys: [(row: Row<T>) => [...row.values[id]]],
  });
}

// Let the table remove the filter if the string is empty
FuzzyText.autoRemove = (val: any) => !val;
