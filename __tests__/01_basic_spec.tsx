import React, {
  StrictMode,
  Reducer,
  Dispatch,
} from 'react';

import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
} from '@testing-library/react';

import { useReducerAsync } from 'use-reducer-async';

describe('basic spec', () => {
  afterEach(cleanup);

  it('sleep', async () => {
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
    type AsyncAction = { type: 'SLEEP'; ms: number };
    const asyncActions = {
      SLEEP: (dispatch: Dispatch<Action>) => async (action: AsyncAction) => {
        dispatch({ type: 'START_SLEEP' });
        await new Promise(r => setTimeout(r, action.ms));
        dispatch({ type: 'END_SLEEP' });
      },
    };
    const Component = () => {
      const [state, dispatch] = useReducerAsync<
        Reducer<State, Action>,
        AsyncAction,
        AsyncAction | Action
      >(
        reducer,
        initialState,
        asyncActions,
      );
      return (
        <div>
          <span>{state.sleeping ? 'Sleeping' : 'Idle'}</span>
          <button type="button" onClick={() => dispatch({ type: 'SLEEP', ms: 100 })}>Click</button>
        </div>
      );
    };
    const App = () => (
      <StrictMode>
        <Component />
      </StrictMode>
    );
    const { getAllByText, container } = render(<App />);
    expect(container).toMatchSnapshot();
    fireEvent.click(getAllByText('Click')[0]);
    expect(container).toMatchSnapshot();
    await waitForElement(() => getAllByText('Idle'));
    expect(container).toMatchSnapshot();
  });
});
