// src/hooks/useLogin.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import localSession from "../utils/localSession";  // 新增

const useLogin = (setIsAuthenticated) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        localSession.set("user", user);
        setIsAuthenticated(true);
        navigate("/");
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } catch (err) {
      setError("Error during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLogin;
