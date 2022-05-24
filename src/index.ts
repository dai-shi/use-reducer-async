import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  Dispatch,
  Reducer,
  ReducerState,
  ReducerAction,
} from 'react';

const isClient = (
  typeof window !== 'undefined'
  && !/ServerSideRendering/.test(window.navigator && window.navigator.userAgent)
);

const useIsomorphicLayoutEffect = isClient ? useLayoutEffect : useEffect;

const useAbortSignal = () => {
  const [controller, setController] = useState(() => new AbortController());
  const lastController = useRef(controller);
  useEffect(() => {
    const abort = () => {
      lastController.current.abort();
      lastController.current = new AbortController();
      setController(lastController.current);
    };
    return abort;
  }, []);
  return controller.signal;
};

export type AsyncActionHandlers<
  R extends Reducer<any, any>,
  AsyncAction extends { type: string }
> = {
  [T in AsyncAction['type']]: AsyncAction extends infer A ? A extends {
    type: T;
  } ? (s: {
    dispatch: Dispatch<AsyncAction | ReducerAction<R>>;
    getState: () => ReducerState<R>;
    signal: AbortSignal;
  }) => (a: A) => Promise<void> : never : never;
};

export function useReducerAsync<
  R extends Reducer<any, any>,
  I,
  AsyncAction extends { type: string },
  ExportAction extends AsyncAction | ReducerAction<R> = AsyncAction | ReducerAction<R>
>(
  reducer: R,
  initializerArg: I,
  initializer: (arg: I) => ReducerState<R>,
  asyncActionHandlers: AsyncActionHandlers<R, AsyncAction>,
): [ReducerState<R>, Dispatch<ExportAction>];

/**
 * useReducer with async actions
 * @example
 * import { useReducerAsync } from 'use-reducer-async';
 *
 * const asyncActionHandlers = {
 *   SLEEP: ({ dispatch, getState, signal }) => async (action) => {
 *     dispatch({ type: 'START_SLEEP' });
 *     await new Promise(r => setTimeout(r, action.ms));
 *     dispatch({ type: 'END_SLEEP' });
 *   },
 *   FETCH: ({ dispatch, getState, signal }) => async (action) => {
 *     dispatch({ type: 'START_FETCH' });
 *     try {
 *       const response = await fetch(action.url);
 *       const data = await response.json();
 *       dispatch({ type: 'FINISH_FETCH', data });
 *     } catch (error) {
 *       dispatch({ type: 'ERROR_FETCH', error });
 *     }
 *   },
 * };
 * const [state, dispatch] = useReducerAsync(reducer, initialState, asyncActionHandlers);
 */
export function useReducerAsync<
  R extends Reducer<any, any>,
  AsyncAction extends { type: string },
  ExportAction extends AsyncAction | ReducerAction<R> = AsyncAction | ReducerAction<R>
>(
  reducer: R,
  initialState: ReducerState<R>,
  asyncActionHandlers: AsyncActionHandlers<R, AsyncAction>,
): [ReducerState<R>, Dispatch<ExportAction>];

export function useReducerAsync<
  R extends Reducer<any, any>,
  I,
  AsyncAction extends { type: string },
  ExportAction extends AsyncAction | ReducerAction<R> = AsyncAction | ReducerAction<R>
>(
  reducer: R,
  initializerArg: I | ReducerState<R>,
  initializer: unknown,
  asyncActionHandlers?: AsyncActionHandlers<R, AsyncAction>,
): [ReducerState<R>, Dispatch<ExportAction>] {
  const signal = useAbortSignal();
  const aaHandlers = (
    asyncActionHandlers || initializer
  ) as AsyncActionHandlers<R, AsyncAction>;
  const [state, dispatch] = useReducer(
    reducer,
    initializerArg as any,
    asyncActionHandlers && initializer as any,
  );
  const lastState = useRef(state);
  useIsomorphicLayoutEffect(() => {
    lastState.current = state;
  }, [state]);
  const getState = useCallback((() => lastState.current), []);
  const wrappedDispatch = useCallback((action: AsyncAction | ReducerAction<R>) => {
    const { type } = (action || {}) as { type?: AsyncAction['type'] };
    const aaHandler = (
      (type && aaHandlers[type]) || null
    ) as (typeof action extends AsyncAction ? (s: {
      dispatch: Dispatch<AsyncAction | ReducerAction<R>>;
      getState: () => ReducerState<R>;
      signal: AbortSignal;
    }) => (a: typeof action) => Promise<void> : null);
    if (aaHandler) {
      aaHandler({ dispatch: wrappedDispatch, getState, signal })(action as AsyncAction);
    } else {
      dispatch(action as ReducerAction<R>);
    }
  }, [aaHandlers, getState, signal]);
  return [state, wrappedDispatch];
}
