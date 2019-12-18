import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import { useReducerAsync } from 'use-reducer-async';

const initialState = {
  sleeping: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'START_SLEEP': return { ...state, sleeping: true };
    case 'END_SLEEP': return { ...state, sleeping: false };
    default: throw new Error('no such action type');
  }
};

const asyncActions = {
  SLEEP: (dispatch) => async (action) => {
    dispatch({ type: 'START_SLEEP' });
    await new Promise((r) => setTimeout(r, action.ms));
    dispatch({ type: 'END_SLEEP' });
  },
};

const Component = () => {
  const [state, dispatch] = useReducerAsync(reducer, initialState, asyncActions);
  return (
    <div>
      <span>{state.sleeping ? 'Sleeping' : 'Idle'}</span>
      <button type="button" onClick={() => dispatch({ type: 'SLEEP', ms: 1000 })}>Click</button>
    </div>
  );
};

const App = () => (
  <StrictMode>
    <Component />
  </StrictMode>
);

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
