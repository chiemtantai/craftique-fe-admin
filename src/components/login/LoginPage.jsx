import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
// import logoImage from './assets/craftique-logo.png'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
    // Here you would typically handle authentication
    // For now, we'll just log the attempt
  };

  const handleBackToHome = () => {
    navigate('/manage');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section" onClick={handleBackToHome}>
          {/* <img src={logoImage} alt="Craftique Logo" className="login-logo" /> */}
          <h1 className="brand-name">Craftique</h1>
        </div>
        
        <h2 className="login-title">Đăng Nhập</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
              className="login-input"
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
            />
          </div>
          
          <button type="submit" className="login-button">Đăng Nhập</button>
          
          <div className="forgot-password">
            <a href="/forgot-password">Quên mật khẩu?</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;