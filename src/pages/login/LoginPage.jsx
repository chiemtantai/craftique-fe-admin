import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import accountService from '../../services/accountService';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(''); // Clear error khi user nhập lại
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(''); // Clear error khi user nhập lại
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await accountService.login(email, password);
      
      // Kiểm tra quyền truy cập
      if (!accountService.hasAdminAccess()) {
        accountService.logout();
        setError('Bạn không có quyền truy cập vào hệ thống này. Chỉ Admin và Staff được phép.');
        return;
      }

      // Đăng nhập thành công, chuyển đến trang quản lý
      navigate('/manage');
    } catch (error) {
      setError(error.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/manage');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section" onClick={handleBackToHome}>
          <h1 className="brand-name">Craftique</h1>
        </div>
        
        <h2 className="login-title">Đăng Nhập</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
              className="login-input"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="Mật Khẩu"
              value={password}
              onChange={handlePasswordChange}
              required
              className="login-input"
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
          
          <div className="forgot-password">
            <a href="/forgot-password">Quên mật khẩu?</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;