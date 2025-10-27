// src/hooks/useSignup.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import localSession from "../utils/localSession";

const useSignup = (setIsAuthenticated) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 增加 password2 参数
  const signup = async (email, password, password2) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, password2 }), // 发送 password2
      });

      if (response.ok) {
        const user = await response.json();
        localSession.set("user", user); 
        setIsAuthenticated(true);
        navigate("/");
      } else {
        // 把后端返回的错误信息显示出来
        const err = await response.json();
        setError(err.error || "Signup failed. Please check your input and try again.");
      }
    } catch (err) {
      setError("Error during signup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
};

export default useSignup;
