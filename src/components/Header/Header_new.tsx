import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="header">
      {/* Top Navigation */}
      <div className="top-nav">
        <div className="top-nav-container">
          <div className="top-nav-left">
            <a href="#" className="top-nav-link">提交</a>
            <a href="#" className="top-nav-link">广告</a>
            <a href="#" className="top-nav-link">Architonic</a>
            <div className="country-flag">
              <span className="flag">🇨🇳</span>
              <span>中国</span>
            </div>
          </div>
          <div className="top-nav-right">
            <a href="#" className="top-nav-link">登录</a>
            <a href="#" className="register-btn">注册</a>
            <a href="#" className="top-nav-link">分类</a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="header-container">
          {/* Logo */}
          <div className="logo-section">
            <div className="logo">
              <div className="logo-icon">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M15 45V15h15v30M30 15h15v30" stroke="white" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>
            <div className="logo-text">
              <span className="logo-subtitle">全球访问量最大的建筑平台</span>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="菜单"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-list">
            <li><a href="#" className="nav-link">项目</a></li>
            <li><a href="#" className="nav-link">图片</a></li>
            <li><a href="#" className="nav-link">新闻</a></li>
            <li><a href="#" className="nav-link">工作机会</a></li>
            <li><a href="#" className="nav-link">建筑视频</a></li>
          </ul>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu} />}
    </header>
  );
};

export default Header;
