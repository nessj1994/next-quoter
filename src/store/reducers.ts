import { combineReducers } from 'redux';
// import { connectRouter } from 'connected-react-router';
// eslint-disable-next-line import/no-cycle
import { quoteSliceReducer, linesSliceReducer } from './features';

const createRootReducer = () =>
  combineReducers({
    quotes: quoteSliceReducer,
    lines: linesSliceReducer,
    // router: connectRouter(history),
  });
export default createRootReducer;
