import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Cadastro  from './pages/Cadastro/Cadastro'
import Confirmacao from './pages/Cadastro/Confirmacao';
import Login from './pages/Login/Login';
import RecuperarSenha from './pages/Login/RecuperarSenha';
import ValidacaoEmail from './pages/Login/ValidacaoEmail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: '/',
        element: <Login />,
      },
      {
        path: '/Cadastro',
        element: <Cadastro />,
      },
      {
        path: '/RecuperarSenha',
        element: <RecuperarSenha />,
      },
      {
        path: '/ValidacaoEmail',
        element: <ValidacaoEmail />,
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
