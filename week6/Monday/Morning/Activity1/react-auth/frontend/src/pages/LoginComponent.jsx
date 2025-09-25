import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginComponent = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // endpoint: POST /api/user/login
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        // Store user data in local storage, similar to signup
        sessionStorage.setItem("user", JSON.stringify(user));
        console.log("User logged in successfully!");
        // Update authentication state
        setIsAuthenticated(true);
        // Navigate to the home page or dashboard
        navigate("/");
      } else {
        // Handle failed login (e.g., wrong credentials)
        console.error("Login failed");
        // Optionally, you might want to display an error message to the user here.
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <label>
        Username:
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
};

export default LoginComponent;
