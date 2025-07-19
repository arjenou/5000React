import React from 'react';
import { Calendar, User, Heart, Share2 } from 'lucide-react';
import './ArticleCard.css';

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  publishDate: string;
  category: string;
  likes?: number;
  isLarge?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  excerpt,
  imageUrl,
  author,
  publishDate,
  category,
  likes = 0,
  isLarge = false
}) => {
  return (
    <article className={`article-card ${isLarge ? 'article-card--large' : ''}`}>
      <div className="article-image">
        <img src={imageUrl} alt={title} loading="lazy" />
        <div className="article-category">{category}</div>
        <div className="article-actions">
          <button className="action-btn" aria-label="收藏">
            <Heart size={18} />
          </button>
          <button className="action-btn" aria-label="分享">
            <Share2 size={18} />
          </button>
        </div>
      </div>
      
      <div className="article-content">
        <h3 className="article-title">{title}</h3>
        <p className="article-excerpt">{excerpt}</p>
        
        <div className="article-meta">
          <div className="meta-item">
            <User size={14} />
            <span>{author}</span>
          </div>
          <div className="meta-item">
            <Calendar size={14} />
            <span>{publishDate}</span>
          </div>
          {likes > 0 && (
            <div className="meta-item likes">
              <Heart size={14} />
              <span>{likes}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
