import React from 'react';
import { ColumnInstance } from 'react-table';

export const ResizeHandle = <T extends Record<string, unknown>>({
  column,
}: {
  column: ColumnInstance<T>;
}): React.ReactElement => {
  return (
    <>
      {/* <div >
      {...column.getResizerProps()}
        {column.canResize ? (
          <div className={`resizer ${column.isResizing ? 'isResizing' : ''}`} />
        ) : null}
      </div> */}
    </>
  );
};
