import React from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useApi';
import './ArticleList.css';

interface ArticleListProps {
  category?: string;
  type?: string;
  limit?: number;
}

export const ArticleList: React.FC<ArticleListProps> = ({ category, type, limit }) => {
  const { data: projects, loading, error } = useProjects();

  if (loading) {
    return (
      <div className="article-list">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="article-list">
        <div className="error">加载失败: {error}</div>
      </div>
    );
  }

  // 根据条件过滤项目
  let filteredProjects = projects?.filter(project => {
    if (category && project.category !== category) return false;
    if (type && project.type !== type) return false;
    return true;
  }) || [];

  // 限制数量
  if (limit && limit > 0) {
    filteredProjects = filteredProjects.slice(0, limit);
  }

  return (
    <div className="article-list">
      <div className="articles-grid">
        {filteredProjects.map((project) => (
          <article key={project.id} className="article-card">
            <Link to={`/project/${project.id}`} className="article-link">
              <div className="article-image">
                <img 
                  src={typeof project.images?.[0] === 'string' ? project.images[0] : project.images?.[0]?.original_url || '/api/placeholder/400/250'} 
                  alt={project.title} 
                />
              </div>
              
              <div className="article-content">
                <div className="article-header">
                  <span className="article-category">{project.category}</span>
                  <h2 className="article-title">{project.title}</h2>
                  <p className="article-excerpt">{project.description || ''}</p>
                </div>

                <div className="article-meta">
                  <div className="meta-row">
                    <span className="meta-label">建筑师</span>
                    <span className="meta-value">{project.architect}</span>
                  </div>
                  
                  <div className="meta-row">
                    <span className="meta-label">地点</span>
                    <span className="meta-value">{project.location}</span>
                  </div>
                  
                  {project.project_year && (
                    <div className="meta-row">
                      <span className="meta-label">年份</span>
                      <span className="meta-value">{project.project_year}</span>
                    </div>
                  )}
                </div>

                <div className="article-footer">
                  <span className="publish-time">{project.created_at}</span>
                  {project.tags && project.tags.length > 0 && (
                    <div className="article-tags">
                      {project.tags.split(',').slice(0, 3).map((tag: string, index: number) => (
                        <span key={index} className="tag">
                          {tag.trim()}
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
      
      {filteredProjects.length === 0 && (
        <div className="empty-state">
          <p>暂无相关项目</p>
        </div>
      )}
    </div>
  );
};

export default ArticleList;
