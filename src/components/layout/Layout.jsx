import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import accountService from '../../services/accountService';
import { Button } from '../ui/button/Button'
import './Layout.css';

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    if (accountService.isAuthenticated()) {
      setUser(accountService.getCurrentUser());
    }
  }, [location]);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    accountService.logout();
    setUser(null);
    navigate('/login');
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  const isActiveNav = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="container">
      <nav className="navbar">
        <div className="navbar-left" onClick={() => handleNavClick('/manage')}> 
          <div className="logo-circle">C</div>
          <span className="logo-text">Craftique<br/>Admin</span>
        </div>
        <div className="navbar-center">
          <button 
            onClick={() => handleNavClick('/manage')} 
            className={isActiveNav('/manage') || isActiveNav('/') ? 'nav-link active' : 'nav-link'}
          >
            Quản lí
          </button>
          <button 
            onClick={() => handleNavClick('/order')}
            className={isActiveNav('/order') ? 'nav-link active' : 'nav-link'}
          >
            Order
          </button>
          <button 
            onClick={() => handleNavClick('/products')}
            className={isActiveNav('/products') ? 'nav-link active' : 'nav-link'}
          >
            Sản phẩm
          </button>
          <button 
            onClick={() => handleNavClick('/custom')}
            className={isActiveNav('/custom') ? 'nav-link active' : 'nav-link'}
          >
            Custom
          </button>
          <button 
            onClick={() => handleNavClick('/workshop')}
            className={isActiveNav('/workshop') ? 'nav-link active' : 'nav-link'}
          >
            Workshop
          </button>
          <button 
            onClick={() => handleNavClick('/blog')}
            className={isActiveNav('/blog') ? 'nav-link active' : 'nav-link'}
          >
            Chuyện của gốm
          </button>
        </div>
        <div className="navbar-right">
          {user ? (
            <div className="user-section">
              <span className="user-name">Xin chào,<br/>{user.name || 'Administrator'}</span>
              <button className="button logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="login-nav-button" onClick={handleLoginClick}>
              👤 Đăng nhập
            </button>
          )}
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;