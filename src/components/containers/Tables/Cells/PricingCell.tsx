import React, { useEffect } from 'react';
import { CellProps, Row } from 'react-table';
import {
  useAppSelector,
  editing,
  useAppDispatch,
  QuoteLine,
} from '../../../../store';
import { debounce } from 'utils';

type PriceCellProps = CellProps<QuoteLine> & {
  updateMyData;
};

function PricingCell({
  value: initialValue,
  column: { id, width },
  row: { original, index, values },
  updateMyData,
}: PriceCellProps) {
  // Array of the possible pricing modes
  const pricingMethods = ['Default', 'Manual', 'Retail'];
  // create a single source to reference debounce timer.
  const debounceTimer = 500;

  const initPricing = () => {
    return {
      line_multiplier: original.line_multiplier,
      manual_price: original.manual_price,
      pricing_mode: original.pricing_mode,
    };
  };

  const [value, setValue] = React.useState(initPricing);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setValue(initPricing);
      console.log(value);
    }
    return () => {
      mounted = false;
    };
  }, [original, initialValue]);

  const onChangeMultiplier = debounce((e: any) => {
    setValue({ ...value, line_multiplier: e.target.value });
    updateMyData({
      original,
      index,
      field: 'line_multiplier',
      value: e.target.value,
    });
  }, debounceTimer);

  const onChangeMode = debounce((e: any) => {
    setValue({ ...value, pricing_mode: e.target.value });
    updateMyData({
      original,
      index,
      field: 'pricing_mode',
      value: e.target.value,
    });
  }, debounceTimer);

  const onChangeManualPrice = debounce((e: any) => {
    setValue({ ...value, manual_price: e.target.value });
    updateMyData({
      original,
      index,
      field: 'manual_price',
      value: e.target.value,
    });
  }, debounceTimer);

  console.log(value);

  // Destructure value for further ease. We opt not to do this above
  // so that we can also access value by name

  return (
    <>
      <div className="container flex flex-col justify-start print:hidden">
        <div>
          <label htmlFor="price-method">Method</label>
          <select
            className="text-black custom-input w-100"
            defaultValue={value.pricing_mode}
            onChange={onChangeMode}
          >
            {pricingMethods.map((method, i) => (
              <option value={i} key={`pricing-${method}`}>
                {method}
              </option>
            ))}
          </select>
        </div>
        {initialValue !== 1 && initialValue !== '1' ? (
          <div key={`line-multiplier-${original.line_number}`} className="">
            <label htmlFor="multiplier">Multiplier</label>
            <input
              id="line-multiplier"
              className="text-black custom-input w-100"
              type="number"
              defaultValue={value.line_multiplier}
              step={0.05}
              onChange={onChangeMultiplier}
              // style={{ width: '50px' }}
            />
          </div>
        ) : (
          <div key={`man-price-${original.line_number}`} className="">
            <label htmlFor="man-price">Price</label>
            <input
              id="man-price"
              className="text-black custom-input w-100"
              defaultValue={Number(value.manual_price).toFixed(2)}
              onChange={onChangeManualPrice}
            />
          </div>
        )}
      </div>
    </>
  );
}
export default PricingCell;
