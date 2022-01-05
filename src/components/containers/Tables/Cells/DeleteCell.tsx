import React, { MouseEventHandler, useEffect } from 'react';
import { CellProps } from 'react-table';
import { TrashIcon } from '@heroicons/react/outline';
import { removeLine } from '../../../../store/features/quotes/linesSlice';
import { useAppDispatch } from '../../../../store';

type IDeleteCellProps = {};

type DeletionCellProps = CellProps<any> & IDeleteCellProps;

function DeletionCell(props: DeletionCellProps) {
  // We need to keep and update the state of the cell normally
  const {
    column: { id, width },
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
      {original.ACGymID <= 0 && (
        <button type="submit" onClick={handleClick}>
          <TrashIcon className="inline w-5 h-5 mx-3" />
        </button>
      )}
    </>
  );
}
export default DeletionCell;
