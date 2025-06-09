import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { useAuth } from "/src/context/AuthContext";

const PecasRouter = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

    const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return; 

    if (user?.userType === "fornecedor") {
      navigate("/PecasFornecedor", { replace: true });
    } else if (user?.userType === "oficina") {
      navigate("/PecasOficina", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [user, isLoading, navigate]);

  return <FaSpinner className="animate-spin mr-2" />
};

export default PecasRouter;
