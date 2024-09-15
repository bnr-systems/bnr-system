import React from 'react';
import logo from '../assets/images/bnr-logo-remove.png';
import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();

    const handleCadastro = () => {
        navigate("/");
    };

    return (
        <header className="header bg-[#14213D] py-4 flex items-center justify-between px-4">
            <img
                className="w-24 h-24 ml-4 sm:ml-8 lg:ml-16 cursor-pointer"
                src={logo}
                alt="Logo"
                onClick={handleCadastro}
            />
            <div className="text-white mr-4 sm:mr-8 lg:mr-16 font-bold">
                Área do Assinante
            </div>
        </header>
    );
}

export default Header;
