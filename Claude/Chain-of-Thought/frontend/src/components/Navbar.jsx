import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        Task Manager
      </Link>
      {user && (
        <div className="nav-right">
          <span className="muted">{user.name}</span>
          <button className="secondary" onClick={logout}>
            Log out
          </button>
        </div>
      )}
    </header>
  );
}