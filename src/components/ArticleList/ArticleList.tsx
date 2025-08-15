import React from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useApi';
import './ArticleList.css';

interface ArticleListProps {
  category?: string;
  type?: string;
  limit?: number;
}

const ArticleList: React.FC<ArticleListProps> = ({ category, type, limit }) => {
  const { data: projects, loading, error } = useProjects();

  if (loading) {
    return (
      <div className="article-list loading">
        <p>正在加载项目...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="article-list error">
        <p>加载失败: {error}</p>
      </div>
    );
  }

  // Filter projects based on category and type if provided
  let filteredProjects = projects?.filter(project => {
    if (category && project.category !== category) return false;
    if (type && project.type !== type) return false;
    return true;
  }) || [];

  // Apply limit if specified
  if (limit && limit > 0) {
    filteredProjects = filteredProjects.slice(0, limit);
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="article-list empty">
        <p>暂无项目</p>
      </div>
    );
  }

  return (
    <div className="article-list">
      <div className="articles-grid">
        {filteredProjects.map((project) => (
          <article key={project.id} className="article-card">
            <Link to={`/project/${project.id}`} className="article-link">
              <div className="article-image">
                <img 
                  src={project.images?.[0] || '/api/placeholder/400/250'} 
                  alt={project.title} 
                />
                <div className="article-category">{project.category}</div>
              </div>
              <div className="article-content">
                <h3 className="article-title">{project.title}</h3>
                <p className="article-excerpt">{project.excerpt || project.subtitle}</p>
                
                <div className="article-meta">
                  <div className="meta-row">
                    <span className="meta-label">建筑师:</span>
                    <span className="meta-value">{project.architect}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">地址:</span>
                    <span className="meta-value">{project.location}</span>
                  </div>
                  {project.area && (
                    <div className="meta-row">
                      <span className="meta-label">面积:</span>
                      <span className="meta-value">{project.area}</span>
                    </div>
                  )}
                  {project.year && (
                    <div className="meta-row">
                      <span className="meta-label">年份:</span>
                      <span className="meta-value">{project.year}</span>
                    </div>
                  )}
                </div>

                <div className="article-footer">
                  <span className="publish-time">{project.created_at}</span>
                  {project.tags && project.tags.length > 0 && (
                    <div className="article-tags">
                      {project.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ArticleList;
