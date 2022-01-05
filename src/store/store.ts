// import { createBrowserHistory } from 'history';
import { configureStore } from '@reduxjs/toolkit';
import { applyMiddleware } from 'redux';
// import { routerMiddleware } from 'connected-react-router';
// eslint-disable-next-line import/no-cycle
import createRootReducer from './reducers';

// export const history = createBrowserHistory();
const rootReducer = createRootReducer();
// const router = applyMiddleware(routerMiddleware(history));

function makeStore() {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
    enhancers: [],
  });

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(rootReducer));
  }

  return store;
}

const store = makeStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
// Inferred type: {quotes: QuotesState, lines: QuoteLineState, }
export type AppDispatch = typeof store.dispatch;

export default store;
