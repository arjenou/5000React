import React, { useState, useEffect } from 'react';
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
            <button className="category-btn">空间设计</button>
            <span className="category-separator">|</span>
            <button className="category-btn">展览策划</button>
            <span className="category-separator">|</span>
            <button className="category-btn">专项游学</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
