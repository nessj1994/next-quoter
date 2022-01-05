import React, { useEffect } from 'react';
import { CellProps } from 'react-table';

type IEditableCellProps = {
  updateMyData: (props: any) => void;
};

type EditableCellProps = CellProps<any> & IEditableCellProps;

function EditableCell(props: EditableCellProps) {
  // We need to keep and update the state of the cell normally
  const {
    value: initialValue,
    column: { id, width },
    row: { original, index, values },
    updateMyData,
  } = props;
  const [value, setValue] = React.useState(initialValue);
  const onChange = (e: any) => {
    setValue(e.target.value);
    updateMyData({ original, index, id, value: e.target.value });
  };

  // We'll only update the external data when the input is blurred
  const onBlur = (e: any) => {
    setValue(e.target.value);
    updateMyData({ original, index, id, value: e.target.value });
  };
  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  return (
    <>
      <div className="text-black">
        <input
          disabled={original.ACGymID >= 1}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          style={{ width }}
        />
      </div>
    </>
  );
}
export default EditableCell;
