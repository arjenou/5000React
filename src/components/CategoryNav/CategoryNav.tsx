import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryNav.css';

const CategoryNav: React.FC = () => {
  return (
    <div className="category-nav">
      <div className="container">
        <div className="category-nav-content">
          <Link to="/space-design" className="category-nav-link">空间设计</Link>
          <Link to="/study-tours" className="category-nav-link">专项游学</Link>
          <Link to="/exhibition-planning" className="category-nav-link">展览策划</Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
