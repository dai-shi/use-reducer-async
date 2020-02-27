import React, { Reducer } from 'react';

import { useReducerAsync, AsyncActionHandlers } from 'use-reducer-async';

type State = {
  sleeping: boolean;
};

const initialState: State = {
  sleeping: false,
};

type Action =
  | { type: 'START_SLEEP' }
  | { type: 'END_SLEEP' };

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'START_SLEEP': return { ...state, sleeping: true };
    case 'END_SLEEP': return { ...state, sleeping: false };
    default: throw new Error('no such action type');
  }
};


type AsyncAction = { type: 'SLEEP'; ms: number }

const asyncActionHandlers: AsyncActionHandlers<Reducer<State, Action>, AsyncAction> = {
  SLEEP: (dispatch, _getState, signal) => async (action) => {
    dispatch({ type: 'START_SLEEP' });
    const timer = setTimeout(() => {
      dispatch({ type: 'END_SLEEP' });
    }, action.ms);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
    });
  },
};

const Sleep: React.FC = () => {
  const [state, dispatch] = useReducerAsync(reducer, initialState, asyncActionHandlers);
  return (
    <div>
      <span>{state.sleeping ? 'Sleeping' : 'Idle'}</span>
      <button type="button" onClick={() => dispatch({ type: 'SLEEP', ms: 1000 })}>Click</button>
    </div>
  );
};

export default Sleep;
