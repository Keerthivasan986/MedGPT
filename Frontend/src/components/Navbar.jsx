import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { ROLES } from '../utils/constants.js';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      <Link className="brand" to="/">
        <div>
          Med<span>GPT</span>
          <small>Get Pills Timely</small>
        </div>
        <div className="brand-subtitle">Enhanced with AI(Availability Intimation)</div>
      </Link>
      <div className="nav-links">
        <Link to="/">Search</Link>
        {user && <Link to="/reservations">Reservations</Link>}
        {user?.role === ROLES.PHARMACIST && <Link to="/dashboard">Dashboard</Link>}
        {user ? (
          <>
            <span className="muted">{user.name}</span>
            <button type="button" className="ghost" onClick={logout}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Sign in</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
