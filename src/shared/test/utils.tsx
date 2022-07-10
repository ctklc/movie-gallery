/* eslint-disable */
import {
  AnyAction,
  combineReducers,
  configureStore,
  EnhancedStore,
  Middleware,
  Reducer,
  Store
} from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { setupListeners } from '@reduxjs/toolkit/query';
import { act, cleanup } from '@testing-library/react';

export const DEFAULT_DELAY_MS = 150;

export async function waitMs(time = DEFAULT_DELAY_MS) {
  const now = Date.now();
  while (Date.now() < now + time) {
    await new Promise((res) => process.nextTick(res));
  }
}

export const hookWaitFor = async (cb: () => void, time = 2000) => {
  const startedAt = Date.now();

  while (true) {
    try {
      cb();
      return true;
    } catch (e) {
      if (Date.now() > startedAt + time) {
        throw e;
      }
      await act(() => waitMs(2));
    }
  }
};

export function withProvider(store: Store<any>) {
  return function Wrapper({ children }: any) {
    return <Provider store={store}>{children}</Provider>;
  };
}

export function setupApiStore<
  A extends {
    reducerPath: string;
    reducer: Reducer<any, any>;
    middleware: Middleware;
    util: { resetApiState(): any };
  },
  R extends Record<string, Reducer<any, any>> = Record<never, never>
>(
  api: A,
  extraReducers?: R,
  options: { withoutListeners?: boolean; withoutTestLifecycles?: boolean } = {}
) {
  const getStore = () =>
    configureStore({
      reducer: combineReducers({
        [api.reducerPath]: api.reducer,
        ...extraReducers
      }),
      middleware: (gdm) =>
        gdm({ serializableCheck: false, immutableCheck: false }).concat(
          api.middleware
        )
    });

  type StoreType = EnhancedStore<
    {
      api: ReturnType<A['reducer']>;
    } & {
      [K in keyof R]: ReturnType<R[K]>;
    },
    AnyAction,
    ReturnType<typeof getStore> extends EnhancedStore<any, any, infer M>
      ? M
      : never
  >;

  const initialStore = getStore() as StoreType;
  const refObj = {
    api,
    store: initialStore,
    wrapper: withProvider(initialStore)
  };
  let cleanupListeners: () => void;

  if (!options.withoutTestLifecycles) {
    beforeEach(() => {
      const store = getStore() as StoreType;
      refObj.store = store;
      refObj.wrapper = withProvider(store);
      if (!options.withoutListeners) {
        cleanupListeners = setupListeners(store.dispatch);
      }
    });
    afterEach(() => {
      cleanup();
      if (!options.withoutListeners) {
        cleanupListeners();
      }
      refObj.store.dispatch(api.util.resetApiState());
    });
  }

  return refObj;
}
