import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Cadastro from "./pages/Cadastro/Cadastro";
import Confirmacao from "./pages/Cadastro/Confirmacao";
import Login from "./pages/Login/Login";
import RecuperarSenha from "./pages/Login/RecuperarSenha";
import RedefinirSenha from "./pages/Login/RedefinirSenha";
import Unidades from "./pages/Main/Unidades";
import CadastroUnidades from "./pages/Main/CadastroUnidades";
import EdicaoUnidade from "./pages/Main/EdicaoUnidade";
import PecasOficina from "./pages/Main/PecasOficina";
import CadastroPecas from "./pages/Main/CadastroPecas";
import VincularPecas from "./pages/Main/VincularPecas";
import PecasVinculadas from "./pages/Main/PecasVinculadas";
import Perfil from "./pages/Perfil/Perfil";
import CarrinhoPage from "./pages/Main/CarrinhoPage";
import PecasRouter from "./pages/Main/PecasRouter";
import { CarrinhoProvider } from "./context/CarrinhoContext";
import PecasFornecedor from "./pages/Main/PecasFornecedor";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/cadastroUnidades",
        element: <CadastroUnidades />,
      },
      {
        path: "/vincularPecas",
        element: <VincularPecas />,
      },
      {
        path: "/pecasVinculadas",
        element: <PecasVinculadas />,
      },
      {
        path: "/PecasOficina",
        element: <PecasOficina />,
      },
      {
        path: "/PecasFornecedor",
        element: <PecasFornecedor />,
      },
      {
        path: "/PecasRouter",
        element: <PecasRouter />,
      },
      {
        path: "/CarrinhoPage",
        element: <CarrinhoPage />,
      },
      {
        path: "/cadastroPecas",
        element: <CadastroPecas />,
      },
      {
        path: "/Cadastro",
        element: <Cadastro />,
      },
      {
        path: "/RecuperarSenha",
        element: <RecuperarSenha />,
      },
      {
        path: "/RedefinirSenha",
        element: <RedefinirSenha />,
      },
      {
        path: "/Confirmacao",
        element: <Confirmacao />,
      },
      {
        path: "/Unidades",
        element: <Unidades />,
      },
      {
        path: "/edicaoUnidade",
        element: <EdicaoUnidade />,
      },
      {
        path: "/Login",
        element: <Login />,
      },
      {
        path: "/Perfil",
        element: <Perfil />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CarrinhoProvider>
      <RouterProvider router={router} />
    </CarrinhoProvider>
  </StrictMode>
);
