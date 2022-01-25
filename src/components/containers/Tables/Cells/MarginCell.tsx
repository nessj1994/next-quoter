import React, { useEffect } from 'react';
import { CellProps } from 'react-table';
import {
  useAppSelector,
  editing,
  useAppDispatch,
  QuoteLine,
} from '../../../../store';

function MarginCell(props: CellProps<QuoteLine>) {
  const {
    row: { original },
  } = props;

  const current = useAppSelector(editing);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let mounted = true;

    if (mounted) {
    }

    return () => {
      mounted = false;
    };
  }, [dispatch, current]);

  const itemCost = original.item_cost;
  const enabled = Number(original.enabled);

  const price =
    original.unit_price! *
    original!.line_multiplier *
    current!.quote_multiplier;
  const profit = price - itemCost;

  const margin = profit / price;
  return (
    <div
      className="container td"
      style={{
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      }}
    >
      {`% ${Number(margin * 100 * enabled).toFixed(2)}`}
    </div>
  );
}

export default MarginCell;