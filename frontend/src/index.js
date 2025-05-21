import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './store/store';
import { Provider } from 'react-redux';

import { Buffer } from 'buffer';
import process from 'process/browser';

window.Buffer = Buffer;
window.process = process;



const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found!');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
