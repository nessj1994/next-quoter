import { useEffect } from 'react';
import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import { quoteHeaderSelectors, useAppDispatch, useAppSelector } from 'store';
import { fetchQuotes } from 'store';

import {} from '../auth/login';

interface Props {
  Message: string;
}

const QuoteList: NextPage<Props> = (props) => {
  const dispatch = useAppDispatch();

  const headers = useAppSelector(quoteHeaderSelectors.selectAll);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      dispatch(fetchQuotes('800221', 'jness', '2021-05-01', false));
      console.log(headers);
    }

    return () => {
      mounted = false;
    };
  }, []);

  const { Message = 'bye' } = props;
  return (
    <div className="container text-center">
      List here...
      <ul>
        {headers
          ? headers.map((header, index) => (
              <li
                className={`text-${index % 2 === 0 ? 'red-500' : 'blue-500'}`}
              >
                {JSON.stringify(header)}
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};

// export const getServerSideProps: GetServerSideProps = async (
//   context: GetServerSidePropsContext,
// ) => {
//   console.log(headers);
//   return {
//     props: {
//       Message: 'Hi',
//     },
//   };
// };

export default QuoteList;
