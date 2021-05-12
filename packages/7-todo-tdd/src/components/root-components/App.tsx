import React, { FC, ReactElement } from 'react';

const App: FC = (): ReactElement => {
  return (
      <div id='todo'>
        <div id='todo__list'></div>
        <input id='todo__input' type='text' />
        <button id='todo__add-btn'></button>
      </div>
  );
}

export default App;
