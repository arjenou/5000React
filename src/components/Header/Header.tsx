import React, { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
          {/* Scrolled Layout - Navigation Bar */}
          {isScrolled && (
            <div className="scrolled-nav">
              {/* Logo on left */}
              <div className="logo-section-left">
                <div className="yukkuri-logo-small">
                  <div className="yukkuri-text-en-small">YUKKURI</div>
                  <div className="yukkuri-text-jp-small">ユックリ</div>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="nav-menu">
                <a href="#" className="nav-link">空间设计</a>
                <a href="#" className="nav-link">专项游学</a>
                <a href="#" className="nav-link">展览策划</a>
                <a href="#" className="nav-link contact-btn-nav">联系我们</a>
              </nav>
            </div>
          )}

          {/* Default Layout - Centered Logo */}
          {!isScrolled && (
            <div className="logo-section-centered">
              <div className="yukkuri-logo">
                <div className="yukkuri-text-en">YUKKURI</div>
                <div className="yukkuri-text-jp">ユックリ</div>
              </div>
            </div>
          )}

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
          <div className="mobile-search">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="搜索 ArchDaily" 
              className="mobile-search-input"
            />
          </div>
          <nav className="mobile-nav">
            <a href="#" className="mobile-nav-link">项目</a>
            <a href="#" className="mobile-nav-link">图片</a>
            <a href="#" className="mobile-nav-link">新闻</a>
            <a href="#" className="mobile-nav-link">工作机会</a>
            <a href="#" className="mobile-nav-link">建筑视频</a>
          </nav>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu} />}
    </header>
  );
};

export default Header;
