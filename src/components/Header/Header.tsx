import React, { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const threshold = 80;
      
      // 使用requestAnimationFrame优化性能
      requestAnimationFrame(() => {
        setIsScrolled(scrollTop > threshold);
      });
    };

    // 节流处理
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledHandleScroll);
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
          {/* Default Layout - Centered Logo (始终渲染，通过CSS控制显示) */}
          <div className="logo-section-centered">
            <div className="yukkuri-logo">
              <div className="yukkuri-text-en">YUKKURI</div>
              <div className="yukkuri-text-jp">ユックリ</div>
            </div>
          </div>

          {/* Scrolled Layout - Navigation Bar (始终渲染，通过CSS控制显示) */}
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
            <a href="#" className="mobile-nav-link">空间设计</a>
            <a href="#" className="mobile-nav-link">专项游学</a>
            <a href="#" className="mobile-nav-link">展览策划</a>
          </nav>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu} />}
    </header>
  );
};

export default Header;
