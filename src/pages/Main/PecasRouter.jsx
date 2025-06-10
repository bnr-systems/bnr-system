import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { useAuth } from "/src/context/AuthContext";

const PecasRouter = () => {
  const navigate = useNavigate();
  const { isLoading, userPecasRoute } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      navigate(userPecasRoute, { replace: true });
    }
  }, [isLoading, userPecasRoute, navigate]);

  return <FaSpinner className="animate-spin mr-2" />;
};

export default PecasRouter;
