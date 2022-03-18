import React, { useState, useEffect } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import {
  editing,
  setEditing,
  quoteHeaderSelectors,
  fetchQuotes,
  fetchLines,
  updateHeader,
  getAdminEnabled,
  emptyLines,
} from 'store';
import { useAppSelector, useAppDispatch } from '../../../store/hooks/hooks';
import QuoteInfoLines from '../../../components/containers/QuoteLines/index';
import QuoteInfoHeader from '../../../components/containers/QuoteHeader/index';
// import embedHFWidget from '../../components/presentational/Happy-Fox-Embed/happy-fox-widget-embed';
import selectQuoteByQuoteNum from '../../../utils/selectQuoteByNum';
import { getSession, useSession } from 'next-auth/react';
import router, { useRouter } from 'next/router';
import { dispatch } from 'react-hot-toast/dist/core/store';

// QuoteInfoPage component
const QuoteInfoPage: NextPage = (pageProps) => {
  // Grab the dispatch function from our redux store
  const dispatch = useAppDispatch();
  const adminOn = useAppSelector(getAdminEnabled);
  // Call useSession() to retrieve the session passed through our props
  // Look below in getServerSideProps to see the where it is passed in
  // In this case we require the session, and if it's not valid we send the user
  // back to the the Login page
  const session = useSession();
  const { query } = useRouter();

  // Grab the headers from our redux store with our selector
  const headers = useAppSelector((state) =>
    quoteHeaderSelectors.selectAll(state),
  );

  // Grab the headers from our redux store with our selector
  const currQuote = useAppSelector((state) => editing(state));

  // Grab all our query params using our router
  const quoteNum = query.quoteNum;

  // Effect  to load quotes on session change
  useEffect(() => {
    // Create mounted var
    let mounted = true;
    const initQuotes = async () => {
      await dispatch(
        fetchQuotes(
          session.data?.user?.customer_id,
          session.data?.user?.username,
          90,
          1,
          10,
          {
            expired: true,
            converted: true,
            deleted: true,
            search: {
              searchString: quoteNum?.toString() ?? '',
              searchField: 'quote_num',
            },
          },
        ),
      );
    };

    // Are we mounted?
    if (mounted) {
      // Check if the session is valid and the headers have been loaded
      if (session.data && headers.length === 0) {
        // All of our checks passed. Time to get the quotes
        // dispatch our event to load quotes into redux
        initQuotes();
      }
    }

    return () => {
      // No longer mounted
      mounted = false;
    };
  }, [session, quoteNum]); // Re-run on change to session

  // Effect to change the current selected quote when related data changes
  useEffect(() => {
    // Create mounted var
    let mounted = true;
    let tempQuoteNum = quoteNum;
    // Are we mounted?
    if (mounted) {
      // Use custom selection util to get data for the desired quote
      if (quoteNum && headers.length > 0) {
        console.log(tempQuoteNum, 'Fetching now...');
        if (tempQuoteNum.length > 6) {
          tempQuoteNum = String(quoteNum).substring(7, 13);
        }
        console.log(tempQuoteNum, 'Fetching now...');
        const quote = selectQuoteByQuoteNum(headers, String(quoteNum));

        // Make sure the quote is valid
        // Quote is valid so set it to our current choice for editing
        // Then fetch related lines
        console.log(quote);
        if (quote) {
          dispatch(setEditing(quote));
          dispatch(fetchLines(quote.quote_id));
        }
      }
    }

    return () => {
      // No longer mounted
      mounted = false;
    };
  }, [dispatch, headers, quoteNum]);

  // Quote overall multiplier field value
  const [quoteMultiplier, setQuoteMultiplier] = useState(() => {
    return currQuote?.quote_multiplier || 1;
  });

  const updateQuoteMultiplier = (value: number) => {
    setQuoteMultiplier(value);
    dispatch(updateHeader({ ...currQuote, quote_multiplier: value }));
  };

  return (
    <div className="flex flex-col w-full">
      <QuoteInfoHeader {...pageProps} quote={currQuote} adminEnabled={false} />

      <QuoteInfoLines
        {...pageProps}
        quote={currQuote}
        quoteMultiplier={quoteMultiplier}
        adminSetting={adminOn}
        updateQuoteMultiplier={updateQuoteMultiplier}
      />
    </div>
  );
};

QuoteInfoPage.auth = true;

export default QuoteInfoPage;
