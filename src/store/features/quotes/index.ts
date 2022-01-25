// eslint-disable-next-line import/no-cycle
import {
  quoteSliceReducer,
  changeAgeChoice,
  createNewQuote,
  createQuote,
  deleteQuote,
  editing,
  fetchQuotes,
  loadPricingModes,
  loadQuotes,
  quoteHeaderSelectors,
  quoteSliceActions,
  setEditing,
  setLoading,
  fetchCsrList,
  selectQuoteByQuoteNum,
  updateQuote,
  updateHeader,
  markQuoteDeleted,
  getQuotesState,
  toggleAdminMode,
  getAdminEnabled,
} from './headersSlice';
// eslint-disable-next-line import/no-cycle
import {
  linesSliceReducer,
  fetchLines,
  retrieveFile,
  processGyms,
  updateLine,
  addNewLine,
  removeLine,
  emptyLines,
  retrieveLineCSI,
  retrieveLineConf,
  retrieveLineSpec,
  quoteLinesSelectors,
  selectComponents,
  addComponent,
} from './linesSlice';

// Export Types
export * from './types';

// Export Reducers
export { linesSliceReducer, quoteSliceReducer };

// Export selectors
export { quoteHeaderSelectors, editing, quoteLinesSelectors, selectComponents };

// Export actions
export {
  toggleAdminMode,
  setEditing,
  getAdminEnabled,
  fetchQuotes,
  createNewQuote,
  updateHeader,
  updateQuote,
  fetchCsrList,
  selectQuoteByQuoteNum,
  fetchLines,
  retrieveFile,
  addNewLine,
  updateLine,
  removeLine,
  emptyLines,
  retrieveLineCSI,
  retrieveLineConf,
  retrieveLineSpec,
  processGyms,
  addComponent,
  markQuoteDeleted,
  getQuotesState,
};
