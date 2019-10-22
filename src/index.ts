/* eslint @typescript-eslint/no-explicit-any: off */

import {
  useCallback,
  useReducer,
  Dispatch,
  Reducer,
  ReducerState,
  ReducerAction,
} from 'react';

type AsyncFunctions<AsyncAction, Action> = AsyncAction extends {
    type: infer Types;
} ? Types extends string ? {
    [T in Types]: AsyncAction extends infer A ? A extends {
        type: T;
    } ? (d: Dispatch<Action>) => (a: A) => Promise<void> : never : never;
} : never : never;

export function useReducerAsync<R extends Reducer<unknown, unknown>, I, AsyncAction>(
  reducer: R,
  initializerArg: I,
  initializer: (arg: I) => ReducerState<R>,
  asyncFunctions: AsyncFunctions<AsyncAction, ReducerAction<R>>,
): [ReducerState<R>, Dispatch<AsyncAction | ReducerAction<R>>];

/**
 * useReducer with async action functions
 * @example
 * import { useReducerAsync } from 'use-reducer-async';
 *
 * const asyncActions = {
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
 * const [state, dispatch] = useReducerAsync(reducer, initialState, asyncActions);
 */
export function useReducerAsync<R extends Reducer<any, any>, AsyncAction>(
  reducer: R,
  initialState: ReducerState<R>,
  asyncFunctions: AsyncFunctions<AsyncAction, ReducerAction<R>>,
): [ReducerState<R>, Dispatch<AsyncAction | ReducerAction<R>>];

export function useReducerAsync<R extends Reducer<any, any>, I, AsyncAction>(
  reducer: R,
  initializerArg: I | ReducerState<R>,
  initializer: unknown,
  asyncFunctions?: AsyncFunctions<AsyncAction, ReducerAction<R>>,
): [ReducerState<R>, Dispatch<AsyncAction | ReducerAction<R>>] {
  const asyncFuncs = asyncFunctions || initializer as AsyncFunctions<AsyncAction, ReducerAction<R>>;
  const [state, rawDispatch] = useReducer(
    reducer,
    initializerArg as any,
    asyncFunctions && initializer as any,
  );
  const dispatch = useCallback((action: AsyncAction | ReducerAction<R>) => {
    const asyncFunc = asyncFuncs[(action as any).type] as any;
    if (asyncFunc) {
      asyncFunc(rawDispatch)(action as AsyncAction);
    } else {
      rawDispatch(action as ReducerAction<R>);
    }
  }, [asyncFuncs]);
  return [state, dispatch];
}
