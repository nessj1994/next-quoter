import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';
import axios from 'axios';
// import moment from 'moment';
import { QuoteHeaderState, QuoteHeader } from './types';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';

const quotesAdapter = createEntityAdapter<QuoteHeader>({
  selectId: (quote) => quote.QuoteID ?? 0,
  sortComparer: (a, b) => b.QuoteDate.localeCompare(a.QuoteDate),
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
      else if (state.entities[action.payload.QuoteID])
        state.currentQuote = state.entities[action.payload.QuoteID]!;
    },
    ageChoiceUpdated: (state, action) => {
      state.ageSelection = action.payload.age;
    },
    deleteQuote: quotesAdapter.removeOne,
    emptyQuoteList: quotesAdapter.removeAll,
  },
});

// Thunks
export const fetchQuotes =
  (custID: string, csr = '', age = 365 * 2, includeDeleted = false) =>
  async (dispatch: any) => {
    // const convertedAge = moment().subtract(age, 'days').format('YYYY-MM-DD');

    dispatch(setLoading(true));

    await dispatch(emptyQuoteList());
    const response = await axios.get(
      `http://localhost:8082/inferno/v1/quotes/headers/`,
      {
        params: { custID, csr, age: '2021-05-01', includeDeleted },
        paramsSerializer: (params) => {
          // "Hide" the `custID` param
          return Object.entries({ ...params })
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
        },
        withCredentials: true,
      },
    );
    console.log(response.data);
    await dispatch(loadQuotes(response.data));
    dispatch(setLoading(false));
    return response.data;
  };

export const changeAgeChoice = (age: number) => async (dispatch: any) => {
  dispatch(changeAgeChoice(age));
};

export const updateHeader = (updated: QuoteHeader) => async (dispatch: any) => {
  const response = await axios.post(
    `${process.env.SERVER_HOST}/inferno/v1/quotes/headers/update`,
    updated,
    { withCredentials: true },
  );

  if (response.data) {
    dispatch(updateQuote(response.data[0]));
    dispatch(setEditing(response.data[0]));
  }

  return response;
};

export const createNewQuote =
  (QuoteNum: string, CustomerCustID: number, Username: string) =>
  async (dispatch: any) => {
    const response = await axios.post(
      `${process.env.SERVER_HOST}/inferno/v1/quotes/headers/create_new`,
      {
        QuoteNum,
        CustomerCustID,
        Username,
      },
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

export const editing = (state: RootState): QuoteHeader | {} =>
  state.quotes.currentQuote;

export const selectQuoteByQuoteNum = (which: string) => {
  return createSelector(quoteHeaderSelectors.selectAll, (items) => {
    return items.find((item) => item.QuoteNumber === which);
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
} = quoteSliceActions;

export default quoteSlice;

export { quoteSliceActions, quoteSliceReducer };
