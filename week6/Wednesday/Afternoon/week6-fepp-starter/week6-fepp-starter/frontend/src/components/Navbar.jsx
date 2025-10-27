// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import localSession from "../utils/localSession";  // 新增

function Navbar({ setIsAuthenticated, isAuthenticated }) {
  const handleClick = () => {
    // remove user from session storage
    localSession.remove("user");
    setIsAuthenticated(false);
  };

  return (
    <nav>
      {isAuthenticated && (
        <div>
          <span>Welcome</span>
          <button onClick={handleClick}>Log out</button>
        </div>
      )}
      {!isAuthenticated && (
        <div>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
