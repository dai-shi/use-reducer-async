import React, { StrictMode, useReducer } from 'react';

import Sleep from './Sleep';
import Person from './Person';

const App = () => {
  const [show, toggleShow] = useReducer((s) => !s, true);
  return (
    <StrictMode>
      <button type="button" onClick={toggleShow}>Show/Hide</button>
      <hr />
      {show && (
        <div>
          <Sleep />
          <Person />
        </div>
      )}
    </StrictMode>
  );
};

export default App;
