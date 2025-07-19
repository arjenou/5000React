import React from 'react';
import './CategoryNav.css';

const CategoryNav: React.FC = () => {
  return (
    <div className="category-nav">
      <div className="container">
        <div className="category-nav-content">
          <div className="category-buttons">
            <button className="category-btn active">展览策划</button>
            <span className="category-separator">|</span>
            <button className="category-btn">空间设计</button>
            <span className="category-separator">|</span>
            <button className="category-btn">专项游学</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
