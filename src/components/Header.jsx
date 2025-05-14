
import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/images/bnr-logo-remove.png";
import { useNavigate } from "react-router-dom";
import api from "/src/api/api";

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Listen for clicks outside the menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initial data load from localStorage
  useEffect(() => {
    const loadUserData = () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user"));

      setToken(storedToken || null);
      setUser(storedUser || null);
    };

    loadUserData();
    
    // Listen for login/logout events
    window.addEventListener("userUpdated", loadUserData);
    window.addEventListener("storage", loadUserData);

    return () => {
      window.removeEventListener("userUpdated", loadUserData);
      window.removeEventListener("storage", loadUserData);
    };
  }, []);

  // Fetch user profile when token changes
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await api.get(
          "https://vps55372.publiccloud.com.br/api/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(response.data.data);
        localStorage.setItem("user", JSON.stringify(response.data.data));
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        setUser(null);
        localStorage.removeItem("user");
      }
    };

    fetchUserProfile();
  }, [token]);

  const handleLogout = async () => {
    try {
      await api.get("https://vps55372.publiccloud.com.br/api/logout", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/login");
  };

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
        <div className="text-white mr-4 sm:mr-8 lg:mr-16 font-bold cursor-pointer" onClick={() => !user && navigate("/login")}>
          {user?.name ? `Olá, ${user.name.split(" ")[0]}!` : "Área do Assinante"}
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
                onClick={handleLogout}
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