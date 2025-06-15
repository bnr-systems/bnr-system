import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import iconMenu from "/src/assets/images/icon-menu.png";
import { useAuth } from "/src/context/AuthContext";

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => setMenuOpen(true)}
        className={`absolute top-4 left-4 z-[1000] p-2 rounded text-white transition-opacity duration-300 ${menuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
      >
        <img src={iconMenu} alt="Menu" className="w-7 h-7" />
      </button>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-[900] transition-opacity duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setMenuOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-[950] transition-transform duration-300 transform ${menuOpen ? "translate-x-0" : "-translate-x-full"
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
        <nav className="flex flex-col">
          <button
            className="p-4 hover:bg-gray-700 text-left w-full"
            onClick={() => navigate("/unidades")}
          >
            Unidades
          </button>

          <button
            className="p-4 hover:bg-gray-700 text-left w-full"
            onClick={() => navigate("/PecasRouter")}
          >
            Peças
          </button>

          {user?.userType === "fornecedor" && (
            <>
            <button
                className="p-4 hover:bg-gray-700 text-left w-full"
                onClick={() => navigate("/VincularPecaModelo")}
              >
                Vincular Peça a Modelo
              </button>
              
              <button
                className="p-4 hover:bg-gray-700 text-left w-full"
                onClick={() => navigate("/pecasVinculadas")}
              >
                Peças Vinculadas
              </button>
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Menu;
