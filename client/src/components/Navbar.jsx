import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {}
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🏠 NaiRent</Link>
      <div className="navbar-links">
        <Link to="/browse">Browse</Link>
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <span className="navbar-user">Hi, {user.name.split(' ')[0]}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;