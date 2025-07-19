import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CategoryNav.css';

const CategoryNav: React.FC = () => {
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const threshold = 50; // 与Header使用相同的阈值
      
      // 使用与Header相同的逻辑
      if (scrollTop > threshold + 10) {
        setIsHeaderScrolled(true);
      } else if (scrollTop < threshold - 10) {
        setIsHeaderScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`category-nav ${isHeaderScrolled ? 'hidden' : ''}`}>
      <div className="container">
        <div className="category-nav-content">
          <div className="category-buttons">
            <Link to="/space-design" className="category-btn">空间设计</Link>
            <span className="category-separator">|</span>
            <Link to="/exhibition-planning" className="category-btn">展览策划</Link>
            <span className="category-separator">|</span>
            <Link to="/study-tours" className="category-btn">专项游学</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
