import React, { Reducer } from 'react';

import { useReducerAsync, AsyncActionHandlers } from 'use-reducer-async';

type State = {
  firstName: string;
  loading: boolean;
  count: number;
};

const initialState: State = {
  firstName: '',
  loading: false,
  count: 0,
};

type InnerAction =
  | { type: 'START_FETCH' }
  | { type: 'FINISH_FETCH'; firstName: string }
  | { type: 'ERROR_FETCH' };

type OuterAction = { type: 'INCREMENT' };

type Action = InnerAction | OuterAction;

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'START_FETCH':
      return {
        ...state,
        loading: true,
      };
    case 'FINISH_FETCH':
      return {
        ...state,
        loading: false,
        firstName: action.firstName,
      };
    case 'ERROR_FETCH':
      return {
        ...state,
        loading: false,
      };
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1,
      };
    default:
      throw new Error('unknown action type');
  }
};

type AsyncAction = { type: 'FETCH_PERSON'; id: number }

const asyncActionHandlers: AsyncActionHandlers<Reducer<State, Action>, AsyncAction> = {
  FETCH_PERSON: ({ dispatch }) => async (action) => {
    dispatch({ type: 'START_FETCH' });
    try {
      const response = await fetch(`https://reqres.in/api/users/${action.id}?delay=1`);
      const data = await response.json();
      const firstName = data.data.first_name;
      if (typeof firstName !== 'string') throw new Error();
      dispatch({ type: 'FINISH_FETCH', firstName });
    } catch (e) {
      dispatch({ type: 'ERROR_FETCH' });
    }
  },
};

const Person = () => {
  const [state, dispatch] = useReducerAsync<
    Reducer<State, Action>,
    AsyncAction,
    AsyncAction | OuterAction
  >(
    reducer,
    initialState,
    asyncActionHandlers,
  );
  return (
    <div>
      First Name:
      {state.firstName}
      <div>{state.loading && 'Loading...'}</div>
      <button
        type="button"
        onClick={() => dispatch({ type: 'FETCH_PERSON', id: 2 })}
      >
        Fetch
      </button>
    </div>
  );
};

export default Person;
