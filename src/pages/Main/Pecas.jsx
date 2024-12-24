import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import iconMenu from "/src/assets/images/icon-menu.svg";
import api from "/src/api/api";

function Pecas() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // Controle do estado da barra lateral

  return (
    <div className="flex h-screen">
      {/* Botão para abrir o menu */}
      {!menuOpen && (
        <button
          onClick={() => setMenuOpen(true)}
          className="absolute top-4 left-4 z-50 p-2 rounded text-white"
        >
          <img src={iconMenu} alt="Menu" className="w-6 h-6" />
        </button>
      )}

      {/* Fundo translúcido e barra lateral */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)} // Fecha o menu ao clicar fora
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform ease-in-out duration-500 z-40 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 font-bold text-lg border-b border-gray-700 flex justify-between items-center">
          <span>Menu</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-white hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        <button
          className="p-4 hover:bg-gray-700 text-left w-full"
          onClick={() => navigate("/unidades")}
        >
          Unidades
        </button>
        <button
          className="p-4 hover:bg-gray-700 text-left w-full"
          onClick={() => navigate("/pecas")}
        >
          Peças
        </button>
      </aside>
    </div>
  );
}

export default Pecas;
