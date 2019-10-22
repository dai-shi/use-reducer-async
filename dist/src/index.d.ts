import { Dispatch, Reducer, ReducerState, ReducerAction } from 'react';
declare type AsyncFunctions<AsyncAction extends {
    type: string;
}, Action> = AsyncAction extends {
    type: infer Types;
} ? Types extends string ? {
    [T in Types]: AsyncAction extends infer A ? A extends {
        type: T;
    } ? (d: Dispatch<Action>) => (a: A) => Promise<void> : never : never;
} : never : never;
export declare function useReducerAsync<R extends Reducer<any, any>, I, AsyncAction extends {
    type: string;
}, OuterAction>(reducer: R, initializerArg: I, initializer: (arg: I) => ReducerState<R>, asyncFunctions: AsyncFunctions<AsyncAction, ReducerAction<R>>): Exclude<OuterAction, AsyncAction | ReducerAction<R>> extends never ? [ReducerState<R>, Dispatch<OuterAction>] : never;
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
export declare function useReducerAsync<R extends Reducer<any, any>, AsyncAction extends {
    type: string;
}, OuterAction>(reducer: R, initialState: ReducerState<R>, asyncFunctions: AsyncFunctions<AsyncAction, ReducerAction<R>>): Exclude<OuterAction, AsyncAction | ReducerAction<R>> extends never ? [ReducerState<R>, Dispatch<OuterAction>] : never;
export {};
