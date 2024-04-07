import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { TypingProvider } from './TypingContext';

ReactDOM.render(
  <TypingProvider>
    <App />
  </TypingProvider>,
  document.getElementById('root')
);
