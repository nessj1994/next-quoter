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

  const enabled = Number(original.enabled);
  const itemCost = original.item_cost;

  const price = original.unit_price! * current!.quote_multiplier;
  console.log(price);
  const profit = price - itemCost;
  console.log(profit);
  let margin = profit / price;
  if (!margin) {
    margin = 0;
    console.log(margin);
  }
  return (
    <div
      className={`${enabled ? '' : 'line-through'}`}
      style={{
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      }}
    >
      {`% ${Number(margin * 100).toFixed(2)}`}
    </div>
  );
}

export default MarginCell;
