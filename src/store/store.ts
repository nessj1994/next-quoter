// import { createBrowserHistory } from 'history';
import { configureStore } from '@reduxjs/toolkit';
import { applyMiddleware } from 'redux';
// import { routerMiddleware } from 'connected-react-router';
// eslint-disable-next-line import/no-cycle
import createRootReducer from './reducers';

// export const history = createBrowserHistory();
const rootReducer = createRootReducer();
// const router = applyMiddleware(routerMiddleware(history));

function configureAppStore(preloadedState?: RootState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
    preloadedState,
    enhancers: [],
  });

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(rootReducer));
  }

  return store;
}

export const store = configureAppStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
// Inferred type: {quotes: QuotesState, lines: QuoteLineState, }
export type AppDispatch = typeof store.dispatch;
