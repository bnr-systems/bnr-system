import React, { createContext, useContext, useState } from "react";

const CarrinhoContext = createContext();

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);

  const adicionarAoCarrinho = (peca) => {
    if (!carrinho.some((item) => item.id === peca.id)) {
      setCarrinho([...carrinho, peca]);
    } else {
      alert("Esta peça já está no seu carrinho!");
    }
  };

  const removerDoCarrinho = (pecaId) => {
    setCarrinho(carrinho.filter((item) => item.id !== pecaId));
  };

  const limparCarrinho = () => {
    setCarrinho([]);
  };

  return (
    <CarrinhoContext.Provider
      value={{ carrinho, adicionarAoCarrinho, removerDoCarrinho, limparCarrinho }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => useContext(CarrinhoContext);
