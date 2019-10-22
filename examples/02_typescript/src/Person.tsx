import React, { Reducer, Dispatch } from 'react';

import { useReducerAsync } from 'use-reducer-async';

type State = {
  firstName: string;
  loading: boolean;
};

const initialState: State = {
  firstName: '',
  loading: false,
};

type Action =
  | { type: 'START_FETCH' }
  | { type: 'FINISH_FETCH'; firstName: string }
  | { type: 'ERROR_FETCH' };

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
    default:
      throw new Error('unknown action type');
  }
};

type AsyncAction = { type: 'FETCH_PERSON'; id: number }

const asyncActions = {
  FETCH_PERSON: (dispatch: Dispatch<Action>) => async (action: AsyncAction) => {
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
  const [state, dispatch] = useReducerAsync<Reducer<State, Action>, AsyncAction>(
    reducer,
    initialState,
    asyncActions,
  );
  return (
    <div>
      First Name:
      {state.firstName}
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
