import React, { useEffect } from 'react';
import { CellProps } from 'react-table';

type IPricingCellProps = {
  updateMyData: (props: any) => void;
};

type EditableCellProps = CellProps<any> & IPricingCellProps;

function PricingCell(props: EditableCellProps) {
  // We need to keep and update the state of the cell normally
  const {
    value: initialValue,
    column: { id, width, align },
    row: { index, values, original },
    updateMyData,
  } = props;
  const [value, setValue] = React.useState(initialValue);

  // console.log(props);

  const onChange = (e: any) => {
    setValue(e.target.value);
    console.log(original);
    updateMyData({ original, index, id, value: e.target.value });
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData({ original, index, id, value });
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  return (
    <>
      <div className="container-fluid">
        <input
          className="form-control-sm w-75"
          type="number"
          value={value}
          step={0.05}
          onChange={onChange}
          onBlur={onBlur}
          style={{ width: '50px', textAlign: `${align}` }}
        />
      </div>
    </>
  );
}
export default PricingCell;
