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
    // Kiểm tra trạng thái đăng nhập khi component mount
    if (accountService.isAuthenticated()) {
      setUser(accountService.getCurrentUser());
    }
  }, [location]); // Re-check khi location thay đổi

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
      {/* Header */}
      <header className="header">
        <div className="contact-info">
          <span>📞0987654321</span>
          <span>📞0123456789</span>
          <span>📧Craftique2023@gmail.com</span>
        </div>
        <div className="logo-container">
          <h1 onClick={() => handleNavClick('/')}>Craftique</h1>
        </div>
        <div className="search-cart">        
          {user ? (
            <div className="user-info">
              <span className="user-name">Xin chào, {user.name}</span>
              <Button variant="logout" size="md" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </div>
          ) : (
            /* ✅ Sử dụng Button component cho login */
            <Button variant="login" size="md" onClick={handleLoginClick}>
              Đăng nhập
            </Button>
          )}
        </div>
      </header>

      {/* Navigation */}
      <nav className="main-nav">
        <ul>
          <li>
            <a 
              href="#" 
              onClick={() => handleNavClick('/manage')} 
              className={isActiveNav('/manage') || isActiveNav('/') ? 'active' : ''}
            >
              Quản lí
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={() => handleNavClick('/order')}
              className={isActiveNav('/order') ? 'active' : ''}
            >
              Đơn hàng
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={() => handleNavClick('/products')}
              className={isActiveNav('/products') ? 'active' : ''}
            >
              Sản phẩm
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={() => handleNavClick('/workshop')}
              className={isActiveNav('/workshop') ? 'active' : ''}
            >
              Workshop
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={() => handleNavClick('/blog')}
              className={isActiveNav('/blog') ? 'active' : ''}
            >
              Chuyện của gốm
            </a>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;