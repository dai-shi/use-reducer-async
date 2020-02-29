import { Dispatch, Reducer, ReducerState, ReducerAction } from 'react';
export declare type AsyncActionHandlers<R extends Reducer<any, any>, AsyncAction extends {
    type: string;
}> = {
    [T in AsyncAction['type']]: AsyncAction extends infer A ? A extends {
        type: T;
    } ? (s: {
        dispatch: Dispatch<ReducerAction<R>>;
        getState: () => ReducerState<R>;
        signal: AbortSignal;
    }) => (a: A) => Promise<void> : never : never;
};
export declare function useReducerAsync<R extends Reducer<any, any>, I, AsyncAction extends {
    type: string;
}, ExportAction extends AsyncAction | ReducerAction<R> = AsyncAction | ReducerAction<R>>(reducer: R, initializerArg: I, initializer: (arg: I) => ReducerState<R>, asyncActionHandlers: AsyncActionHandlers<R, AsyncAction>): [ReducerState<R>, Dispatch<ExportAction>];
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
export declare function useReducerAsync<R extends Reducer<any, any>, AsyncAction extends {
    type: string;
}, ExportAction extends AsyncAction | ReducerAction<R> = AsyncAction | ReducerAction<R>>(reducer: R, initialState: ReducerState<R>, asyncActionHandlers: AsyncActionHandlers<R, AsyncAction>): [ReducerState<R>, Dispatch<ExportAction>];
