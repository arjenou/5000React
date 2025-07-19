import React from 'react';
import './ArticleList.css';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  author: string;
  publishTime: string;
  location?: string;
  area?: string;
  year?: string;
  type: 'project' | 'news' | 'featured';
}

const articles: Article[] = [
  {
    id: '1',
    title: '国家馆设计：世博会中的权力与身份认同',
    excerpt: '展馆建筑能揭示一个国家的哪些信息？在大型世博会上，国家馆的设计旨在回答这一问题，它们化身为充满象征意义的空间。',
    imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop',
    category: '文章',
    author: 'ArchDaily',
    publishTime: '大约1小时之前',
    type: 'featured'
  },
  {
    id: '2',
    title: '比达达利公园 / Henning Larsen',
    excerpt: '建筑师: CPG Consultants, Henning Larsen',
    imageUrl: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=400&h=300&fit=crop',
    category: '项目',
    author: 'Henning Larsen',
    publishTime: '大约19小时之前',
    location: '新加坡',
    area: '130000 m²',
    year: '2024 年',
    type: 'project'
  },
  {
    id: '3',
    title: 'Apricity 开发品牌总部 / Soar Design Studio + Ray Architects',
    excerpt: '建筑师: Soar Design Studio + Ray Architects',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
    category: '项目',
    author: 'Soar Design Studio',
    publishTime: '大约21小时之前',
    location: '新北市, 台湾',
    area: '728 m²',
    year: '2024',
    type: 'project'
  },
  {
    id: '4',
    title: '探索日式房间内部：历史、设计与现代实践',
    excerpt: '在查看日本房屋的照片时，人们常常会注意到一个反复出现的空间：铺有榻榻米垫子，通常略高于地面且与家中的公共区域融为一体。',
    imageUrl: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400&h=300&fit=crop',
    category: '文章',
    author: 'ArchDaily',
    publishTime: '大约23小时之前',
    type: 'news'
  },
  {
    id: '5',
    title: '全球各地建筑师如何设计微型住宅？',
    excerpt: 'Buildner 与建筑材料制造商 Kingspan 合作，共同揭晓了MICROHOME Kingspan Edition 竞赛获奖名单，奖金总额达 10 万欧元。',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    category: '新闻',
    author: 'Buildner',
    publishTime: '1天之前',
    type: 'news'
  },
  {
    id: '6',
    title: '上海张江信息技术产业平台创芯天地 / 致正建筑工作室',
    excerpt: '建筑师: 致正建筑工作室',
    imageUrl: 'https://images.unsplash.com/photo-1590725140246-20acdee442be?w=400&h=300&fit=crop',
    category: '项目',
    author: '致正建筑工作室',
    publishTime: '1天之前',
    location: '浦东新区, 中国',
    area: '238 m²',
    year: '2023 年',
    type: 'project'
  },
  {
    id: '7',
    title: '倍耐力 35 号办公楼 / Park Associati + Snøhetta',
    excerpt: '建筑师: Park Associati, Snøhetta',
    imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
    category: '项目',
    author: 'Park Associati',
    publishTime: '2天之前',
    location: '米兰, 意大利',
    area: '27000 m²',
    year: '2025 年',
    type: 'project'
  },
  {
    id: '8',
    title: '气味咖啡 / 拾号建筑',
    excerpt: '建筑师: 拾号建筑',
    imageUrl: 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=400&h=300&fit=crop',
    category: '项目',
    author: '拾号建筑',
    publishTime: '2天之前',
    location: '保山市, 中国',
    area: '160 m²',
    year: '2025 年',
    type: 'project'
  }
];

const ArticleList: React.FC = () => {
  const featuredArticle = articles.find(article => article.type === 'featured');
  const regularArticles = articles.filter(article => article.type !== 'featured');

  return (
    <div className="article-list">
      <div className="container">
        {/* Featured Article */}
        {featuredArticle && (
          <div className="featured-article">
            <div className="featured-image">
              <img src={featuredArticle.imageUrl} alt={featuredArticle.title} />
              <div className="featured-overlay">
                <span className="featured-category">{featuredArticle.category}</span>
                <h1 className="featured-title">{featuredArticle.title}</h1>
                <p className="featured-excerpt">{featuredArticle.excerpt}</p>
                <div className="featured-meta">
                  <span>{featuredArticle.publishTime}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div className="articles-grid">
          {regularArticles.map((article) => (
            <article key={article.id} className="article-card">
              <div className="article-image">
                <img src={article.imageUrl} alt={article.title} loading="lazy" />
                <span className="article-category">{article.category}</span>
              </div>
              
              <div className="article-content">
                <h3 className="article-title">{article.title}</h3>
                <p className="article-excerpt">{article.excerpt}</p>
                
                <div className="article-meta">
                  <div className="meta-row">
                    <span className="publish-time">{article.publishTime}</span>
                    {article.location && <span className="location">• {article.location}</span>}
                  </div>
                  
                  {article.type === 'project' && (
                    <div className="project-specs">
                      {article.area && (
                        <div className="spec-item">
                          <span className="spec-label">面积</span>
                          <span className="spec-value">{article.area}</span>
                        </div>
                      )}
                      {article.year && (
                        <div className="spec-item">
                          <span className="spec-label">项目年份</span>
                          <span className="spec-value">{article.year}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="article-actions">
                    <button className="action-btn save">收藏{article.type === 'project' ? '项目' : '文章'}</button>
                    <button className="action-btn read-more">阅读更多 »</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
