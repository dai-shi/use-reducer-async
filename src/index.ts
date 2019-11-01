import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  Dispatch,
  Reducer,
  ReducerState,
  ReducerAction,
} from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type AsyncActionHandlers<
  R extends Reducer<any, any>,
  AsyncAction extends { type: string }
> = {
  [T in AsyncAction['type']]: AsyncAction extends infer A ? A extends {
    type: T;
  } ? (
    dispatch: Dispatch<ReducerAction<R>>,
    getState: () => ReducerState<R>,
  ) => (a: A) => Promise<void> : never : never;
};

export function useReducerAsync<
  R extends Reducer<any, any>,
  I,
  AsyncAction extends { type: string },
  OuterAction extends AsyncAction | ReducerAction<R>
>(
  reducer: R,
  initializerArg: I,
  initializer: (arg: I) => ReducerState<R>,
  asyncActionHandlers: AsyncActionHandlers<R, AsyncAction>,
): [ReducerState<R>, Dispatch<OuterAction>];

/**
 * useReducer with async actions
 * @example
 * import { useReducerAsync } from 'use-reducer-async';
 *
 * const asyncActionHandlers = {
 *   SLEEP: dispatch => async (action) => {
 *     dispatch({ type: 'START_SLEEP' });
 *     await new Promise(r => setTimeout(r, action.ms));
 *     dispatch({ type: 'END_SLEEP' });
 *   },
 *   FETCH: dispatch => async (action) => {
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
  OuterAction extends AsyncAction | ReducerAction<R>
>(
  reducer: R,
  initialState: ReducerState<R>,
  asyncActionHandlers: AsyncActionHandlers<R, AsyncAction>,
): [ReducerState<R>, Dispatch<OuterAction>];

export function useReducerAsync<
  R extends Reducer<any, any>,
  I,
  AsyncAction extends { type: string },
  OuterAction extends AsyncAction | ReducerAction<R>
>(
  reducer: R,
  initializerArg: I | ReducerState<R>,
  initializer: unknown,
  asyncActionHandlers?: AsyncActionHandlers<R, AsyncAction>,
): [ReducerState<R>, Dispatch<OuterAction>] {
  const aaHandlers = (
    asyncActionHandlers || initializer
  ) as AsyncActionHandlers<R, AsyncAction>;
  const [state, rawDispatch] = useReducer(
    reducer,
    initializerArg as any,
    asyncActionHandlers && initializer as any,
  );
  const lastState = useRef(state);
  useIsomorphicLayoutEffect(() => {
    lastState.current = state;
  }, [state]);
  const getState = useCallback((() => lastState.current), []);
  const dispatch = useCallback((action: AsyncAction | ReducerAction<R>) => {
    const { type } = (action || {}) as { type?: AsyncAction['type'] };
    const aaHandler = (
      (type && aaHandlers[type]) || null
    ) as (typeof action extends AsyncAction ? (
      dispatch: Dispatch<ReducerAction<R>>,
      getState: () => ReducerState<R>,
    ) => (a: typeof action) => Promise<void> : null);
    if (aaHandler) {
      aaHandler(rawDispatch, getState)(action as AsyncAction);
    } else {
      rawDispatch(action as ReducerAction<R>);
    }
  }, [aaHandlers, getState]);
  return [state, dispatch];
}
