import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon"></span>
            <span className="logo-text">ComplaintHub</span>
          </div>
          <nav className="nav">
            <NavLink to="/app/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
            <NavLink to="/app/my-complaints" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>My Complaints</NavLink>
            <NavLink to="/app/submit" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Submit</NavLink>
            {user?.role === 'officer' && <NavLink to="/app/officer" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Officer Queue</NavLink>}
            {user?.role === 'admin' && (
              <>
                <NavLink to="/app/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Admin</NavLink>
                <NavLink to="/app/analytics" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Analytics</NavLink>
              </>
            )}
          </nav>
          <div className="user-menu">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
