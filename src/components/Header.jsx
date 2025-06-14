import React, { useEffect, useRef, useState } from "react";
import logo from "../assets/images/bnr-logo-remove.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "/src/context/AuthContext";
function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Fecha menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header bg-[#14213D] py-4 flex items-center justify-between px-4 relative">
      <img
        className="w-24 h-24 ml-4 sm:ml-8 lg:ml-16 cursor-pointer"
        src={logo}
        alt="Logo"
      />

      <div
        className="relative z-50"
        onMouseEnter={() => setMenuOpen(true)}
        ref={menuRef}
      >
        <div
          className="text-white mr-4 sm:mr-8 lg:mr-16 font-bold cursor-pointer"
          onClick={() => !user && navigate("/login")}
        >
          {user?.name
            ? `Olá, ${user.name.split(" ")[0]}!`
            : "Área do Assinante"}
        </div>

        {menuOpen && user && (
          <div
            className="absolute right-4 sm:right-8 lg:right-16 top-10 bg-white shadow-md rounded-lg w-48 z-50"
            onMouseLeave={() => setMenuOpen(false)}
          >
            <ul className="py-2 text-gray-800">
              <li
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  navigate("/perfil");
                  setMenuOpen(false);
                }}
              >
                Ver Perfil
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-red-600"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Sair
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
