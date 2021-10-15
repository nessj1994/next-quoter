import React, { MouseEventHandler, useEffect } from 'react';
import { CellProps } from 'react-table';
// import * as Icons from 'react-bootstrap-icons';
import { removeLine } from '../../../../store/features/quotes/linesSlice';
import { useAppDispatch } from '../../../../store';

type IDeleteCellProps = {};

type DeletionCellProps = CellProps<any> & IDeleteCellProps;

function DeletionCell(props: DeletionCellProps) {
  // We need to keep and update the state of the cell normally
  const {
    column: { id, width, align },
    row: { original },
  } = props;
  const dispatch = useAppDispatch();
  // console.log(props);
  // We'll only update the external data when the input is blurred
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    console.log('clicky');
    dispatch(removeLine(original.LineID));
  };

  // If the initialValue is changed external, sync it up with our state

  return (
    <>
      <button type="submit" onClick={handleClick}>
        <i className="bi bi-trash" />
      </button>
    </>
  );
}
export default DeletionCell;
