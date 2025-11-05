import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes } from './app/routes';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>
);
