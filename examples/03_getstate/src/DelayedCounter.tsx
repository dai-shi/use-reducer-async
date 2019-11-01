import React, { Reducer } from 'react';

import { useReducerAsync, AsyncActionHandlers } from 'use-reducer-async';

type State = {
  count1: number;
  count2: number;
};

const initialState: State = {
  count1: 0,
  count2: 0,
};

type LocalAction = { type: 'SET_COUNT2'; count2: number };

type ExportAction = { type: 'INCREMENT1' };

type Action = LocalAction | ExportAction;

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'INCREMENT1':
      return {
        ...state,
        count1: state.count1 + 1,
      };
    case 'SET_COUNT2':
      return {
        ...state,
        count2: action.count2,
      };
    default:
      throw new Error('unknown action type');
  }
};

type AsyncAction = { type: 'DELAYED_INCREMENT2' }

const asyncActionHandlers: AsyncActionHandlers<Reducer<State, Action>, AsyncAction> = {
  DELAYED_INCREMENT2: (dispatch, getState) => async () => {
    await new Promise(r => setTimeout(r, 1000));
    dispatch({ type: 'SET_COUNT2', count2: getState().count2 + 1 });
  },
};

const DelayedCounter = () => {
  const [state, dispatch] = useReducerAsync<
    Reducer<State, Action>,
    AsyncAction,
    AsyncAction | ExportAction
  >(
    reducer,
    initialState,
    asyncActionHandlers,
  );
  return (
    <div>
      <h1>Normal Counter</h1>
      Count1: {state.count1}
      <button
        type="button"
        onClick={() => dispatch({ type: 'INCREMENT1' })}
      >
        +1
      </button>
      <h1>Delayed Counter</h1>
      Count2: {state.count2}
      <button
        type="button"
        onClick={() => dispatch({ type: 'DELAYED_INCREMENT2' })}
      >
        +1
      </button>
    </div>
  );
};

export default DelayedCounter;
