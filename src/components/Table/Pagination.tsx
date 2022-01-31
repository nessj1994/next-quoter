import React, { FC } from 'react';
import { TableContext } from './types';
import { debounce } from 'utils';

const Pagination = () => {
  const tableInstance = React.useContext(TableContext);

  const {
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageCount,
    state: { pageIndex, pageSize },
  } = tableInstance;

  const debouncedNext = debounce(nextPage, 400);
  const debouncedPrevious = debounce(previousPage, 400);

  return (
    <div id="pagination">
      <span>
        {/* Previous page  */}
        <button
          disabled={!canPreviousPage}
          className={
            'bg-gray-200 !disabled:hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l'
          }
          onClick={() => {
            console.log('prev');
            debouncedPrevious();
          }}
        >
          {'<-'}
        </button>
        {` | Currently displaying page ${
          pageCount ? pageIndex + 1 : 0
        } of ${pageCount} | `}

        {/* Next Page */}
        <button
          disabled={!canNextPage}
          className={
            'bg-gray-200 !disabled:hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l'
          }
          onClick={() => {
            console.log('next');
            debouncedNext();
          }}
        >
          {'->'}
        </button>
      </span>
      {/* <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
            },
            null,
            2,
          )}
        </code>
      </pre> */}
    </div>
  );
};

export default Pagination;
