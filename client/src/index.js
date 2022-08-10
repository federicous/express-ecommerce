import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import CartContextProvider from './components/CartContext/CartContext';

ReactDOM.render(
  <React.StrictMode>
     <CartContextProvider>
     <App />

     </CartContextProvider>
    {/* <App /> */}
  </React.StrictMode>,
  document.getElementById('root')
);

