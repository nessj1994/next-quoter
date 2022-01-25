import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';
import initAPIConnection from 'services/api/apiConnector';
import { AxiosResponse } from 'axios';
// import moment from 'moment';
import { QuoteHeaderState, QuoteHeader } from './types';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';
import moment from 'moment';
let api;
if (typeof window !== undefined) {
  api = initAPIConnection({});
}

const quotesAdapter = createEntityAdapter<QuoteHeader>({
  selectId: (quote) => quote.quote_id ?? 0,
  sortComparer: (a, b) => b.quote_date.localeCompare(a.quote_date),
});

const initialState = quotesAdapter.getInitialState<QuoteHeaderState>({
  loading: false,
  ageSelection: 90,
  currentQuote: <QuoteHeader>{},
});
const quoteSlice = createSlice({
  name: 'quotes',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    loadQuotes: quotesAdapter.addMany,
    loadPricingModes: (state, action) => {
      // currently not implemented
    },
    createQuote: (state, action) => {
      quotesAdapter.addOne(state, action.payload);
      state.currentQuote = action.payload;

      return state;
    },
    updateQuote: quotesAdapter.upsertOne,
    setEditing: (state, action) => {
      // Set the currently selected quote to edit
      if (action.payload === null) state.currentQuote = null;
      else if (state.entities[action.payload.quote_id]) {
        console.log('matched');
        console.log('Action: ', action.payload);
        state.currentQuote = state.entities[action.payload.quote_id]!;
      }
    },
    ageChoiceUpdated: (state, action) => {
      state.ageSelection = action.payload.age;
    },
    deleteQuote: quotesAdapter.removeOne,
    emptyQuoteList: quotesAdapter.removeAll,
    toggleAdmin: (state) => {
      state.adminEnabled = !state.adminEnabled;
    },
  },
});

// Thunks
export const fetchQuotes =
  (
    customer_id: string,
    csr = '',
    age = 90,
    includeDeleted = false,
    page,
    pageSize = 10,
    filter = undefined,
  ) =>
  async (dispatch: any) => {
    const convertedAge = moment()
      .subtract(age, 'days')
      .format('YYYY-MM-DD HH:MM:ss');
    dispatch(setLoading(true));
    console.log('Fetch quotes was passed the following for csr: ', csr);
    await dispatch(emptyQuoteList());
    let url = `${process.env.NEXT_PUBLIC_SERVER_HOST}/inferno/v1/quotes/headers/?cust_id=${customer_id}&quote_date__gte=${convertedAge}&page=${page}&page_size=${pageSize}`;
    if (csr) url += `&quote_user=${csr}`;
    if (filter) url += `&quote_number__contains=${filter}`;
    const response: AxiosResponse<any, any> = await api.get(url, {
      withCredentials: true,
    });
    console.log(response.data?.results);
    await dispatch(loadQuotes(response.data?.results));
    dispatch(setLoading(false));
    return response;
  };

export const fetchCsrList = () => async (dispatch: any) => {
  const url = `${process.env.NEXT_PUBLIC_SERVER_HOST}/inferno/v1/users/coworkers/`;
  const response = await api.get(url, {
    withCredentials: true,
  });
  console.log(response.data);
  return response.data;
};

export const markQuoteDeleted =
  (quote: QuoteHeader, custID: number) => async (dispatch: any) => {
    console.log(`hello, ${custID}`);

    const response = await api.patch(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/inferno/v1/quotes/headers/${quote.quote_id}/toggle_deleted/`,
    );
    dispatch(deleteQuote(quote.quote_id));

    return response;
  };

export const changeAgeChoice = (age: number) => async (dispatch: any) => {
  dispatch(changeAgeChoice(age));
};

type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> &
    Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];
export const updateHeader =
  (updated: RequireAtLeastOne<QuoteHeader>) => async (dispatch: any) => {
    console.log(updated);
    let response;
    if (updated.quote_id) {
      response = await api.patch(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/inferno/v1/quotes/headers/${updated.quote_id}/`,
        updated,
        { withCredentials: true },
      );
    } else {
      response = await api.post(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/inferno/v1/quotes/headers/`,
        updated,
        { withCredentials: true },
      );
    }

    if (response.data) {
      dispatch(updateQuote(response.data));
      dispatch(setEditing(response.data));
    }

    return response;
  };

export const toggleAdminMode = () => async (dispatch: any) => {
  dispatch(toggleAdmin());
};

export const createNewQuote =
  (QuoteNum: string, CustomerCustID: number, Username: string) =>
  async (dispatch: any) => {
    const response = await api.post(
      `${process.env.SERVER_HOST}/inferno/v1/quotes/headers/create_new`,
      {
        QuoteNum,
        CustomerCustID,
        Username,
      },
      { withCredentials: true },
    );

    if (response.data) {
      await dispatch(createQuote(response.data[0]));
      dispatch(setEditing(response.data[0]));
      console.log(response.data);
      return response.data[0];
    }

    return response.data[0];
  };

// Selectors
export const quoteHeaderSelectors = quotesAdapter.getSelectors(
  (state: RootState) => state.quotes,
);

export const getQuotesState = (state: RootState): QuoteHeaderState => {
  return state.quotes;
};

export const getAdminEnabled = (state: RootState): Boolean => {
  return state.quotes.adminEnabled;
};

export const editing = (state: RootState): QuoteHeader | Partial<QuoteHeader> =>
  state.quotes.currentQuote;

export const selectQuoteByQuoteNum = (which: string) => {
  return createSelector(quoteHeaderSelectors.selectAll, (items) => {
    return items.find((item) => item.quote_number === which);
  });
};

// Separate quoteSlice into pieces for easier use
const quoteSliceActions = quoteSlice.actions;
const quoteSliceReducer = quoteSlice.reducer;

// Export Actions
export const {
  loadQuotes,
  loadPricingModes,
  createQuote,
  updateQuote,
  setEditing,
  setLoading,
  deleteQuote,
  emptyQuoteList,
  toggleAdmin,
} = quoteSliceActions;

export default quoteSlice;

export { quoteSliceActions, quoteSliceReducer };
