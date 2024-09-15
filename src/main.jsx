import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Cadastro  from './pages/Cadastro/cadastro'
import Confirmacao from './pages/Cadastro/Confirmacao';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: '/',
        element: <Cadastro />,
      },
      {
        path: '/Confirmacao',
        element: <Confirmacao />
      }
    ],
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
