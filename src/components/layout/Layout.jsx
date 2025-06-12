
import { useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  
  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  // Hàm kiểm tra active nav
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
          <div className="search-box">
            <input type="text" placeholder="Tìm kiếm" />
          </div>
          <button className="cart-button"><i className="cart-icon">🛒</i></button>
          <button className="login-nav-button" onClick={handleLoginClick}>Đăng nhập</button>
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

      {/* Main Content - sẽ render các component con */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;