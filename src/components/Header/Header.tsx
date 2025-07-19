import React, { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // 在SpaceDesign页面始终显示scrolled状态
    if (location.pathname === '/space-design') {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const threshold = 50; // 增加滚动阈值以防止闪动
      
      // 添加缓冲区，避免在临界点附近频繁切换
      if (scrollTop > threshold + 10) {
        setIsScrolled(true);
      } else if (scrollTop < threshold - 10) {
        setIsScrolled(false);
      }
      // 在threshold±10px范围内不改变状态，避免闪动
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogoClick = () => {
    // 刷新页面并导航到首页
    window.location.href = '/';
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Top Bar - only visible when not scrolled */}
      <div className={`top-bar ${isScrolled ? 'hidden' : ''}`}>
        <div className="top-bar-container">
          <div className="top-bar-content">
            <div className="country-info">
              <span className="flag">🇨🇳</span>
              <span className="country-text">中国</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="header-container">
          {/* Default Layout - Centered Logo (始终渲染，通过CSS控制显示) */}
          <div className="logo-section-centered">
            <Link to="/" className="yukkuri-logo" onClick={handleLogoClick}>
              <div className="yukkuri-text-en">YUKKURI</div>
              <div className="yukkuri-text-jp">ユックリ</div>
            </Link>
          </div>

          {/* Scrolled Layout - Navigation Bar (始终渲染，通过CSS控制显示) */}
          <div className="scrolled-nav">
            {/* Logo on left */}
            <div className="logo-section-left">
              <Link to="/" className="yukkuri-logo-small" onClick={handleLogoClick}>
                <div className="yukkuri-text-en-small">YUKKURI</div>
                <div className="yukkuri-text-jp-small">ユックリ</div>
              </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="nav-menu">
              <Link to="/space-design" className="nav-link">空间设计</Link>
              <Link to="/study-tours" className="nav-link">专项游学</Link>
              <Link to="/exhibition-planning" className="nav-link">展览策划</Link>
              <Link to="/contact" className="nav-link contact-btn-nav">联系我们</Link>
            </nav>
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
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            <Link to="/space-design" className="mobile-nav-link">空间设计</Link>
            <Link to="/study-tours" className="mobile-nav-link">专项游学</Link>
            <Link to="/exhibition-planning" className="mobile-nav-link">展览策划</Link>
          </nav>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu} />}
    </header>
  );
};

export default Header;
