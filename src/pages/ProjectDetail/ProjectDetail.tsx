import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import type { Project } from '../../types/project';
import './ProjectDetail.css';

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (slug) {
      loadProject(slug);
    }
  }, [slug]);

  const loadProject = async (projectSlug: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await apiService.getPublicProject(projectSlug);
      if (response.success && response.data) {
        setProject(response.data);
      } else {
        setError(response.error || '项目不存在');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const renderProjectDetails = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  if (loading) {
    return (
      <div className="project-detail">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-detail">
        <div className="error-state">
          <h2>项目未找到</h2>
          <p>{error || '抱歉，您访问的项目不存在或已被删除。'}</p>
          <Link to="/projects" className="btn btn-primary">
            返回项目列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail">
      <nav className="project-breadcrumb">
        <Link to="/">首页</Link>
        <span className="separator">/</span>
        <Link to="/projects">项目</Link>
        <span className="separator">/</span>
        <span>{project.title}</span>
      </nav>

      <header className="project-header">
        <div className="project-meta">
          <span className="category">{project.category}</span>
          {project.featured && (
            <span className="featured-badge">推荐项目</span>
          )}
        </div>
        
        <h1 className="project-title">{project.title}</h1>
        
        <div className="project-info-grid">
          <div className="info-item">
            <label>建筑师</label>
            <span>{project.architect}</span>
          </div>
          <div className="info-item">
            <label>地点</label>
            <span>{project.location}</span>
          </div>
          <div className="info-item">
            <label>年份</label>
            <span>{project.project_year}</span>
          </div>
          {project.area && (
            <div className="info-item">
              <label>建筑面积</label>
              <span>{project.area} m²</span>
            </div>
          )}
          {project.client && (
            <div className="info-item">
              <label>委托方</label>
              <span>{project.client}</span>
            </div>
          )}
        </div>

        {project.description && (
          <div className="project-description">
            <p>{project.description}</p>
          </div>
        )}
      </header>

      {project.images && project.images.length > 0 && (
        <section className="project-gallery">
          <div className="main-image">
            <img
              src={project.images[selectedImageIndex]?.original_url}
              alt={project.images[selectedImageIndex]?.alt || project.title}
              className="featured-image"
            />
            
            {project.images.length > 1 && (
              <div className="gallery-nav">
                <button
                  onClick={() => setSelectedImageIndex(prev => 
                    prev > 0 ? prev - 1 : project.images!.length - 1
                  )}
                  className="nav-btn prev"
                  aria-label="上一张图片"
                >
                  ◀
                </button>
                <button
                  onClick={() => setSelectedImageIndex(prev => 
                    prev < project.images!.length - 1 ? prev + 1 : 0
                  )}
                  className="nav-btn next"
                  aria-label="下一张图片"
                >
                  ▶
                </button>
              </div>
            )}
          </div>

          {project.images.length > 1 && (
            <div className="thumbnail-gallery">
              {project.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                >
                  <img
                    src={image.thumbnail_url || image.original_url}
                    alt={image.alt || `${project.title} - 图片 ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="project-content">
        <div className="content-wrapper">
          {project.details && (
            <div 
              className="project-details"
              dangerouslySetInnerHTML={renderProjectDetails(project.details)}
            />
          )}
        </div>
      </section>

      {project.tags && (
        <section className="project-tags">
          <h3>相关标签</h3>
          <div className="tags-list">
            {project.tags.split(',').map((tag, index) => (
              <span key={index} className="tag">
                {tag.trim()}
              </span>
            ))}
          </div>
        </section>
      )}

      <footer className="project-footer">
        <div className="project-actions">
          <Link to="/projects" className="btn btn-outline">
            返回项目列表
          </Link>
          
          <div className="share-buttons">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: project.title,
                    text: project.description || `${project.architect}设计的${project.title}`,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('链接已复制到剪贴板');
                }
              }}
              className="btn btn-secondary"
            >
              分享项目
            </button>
          </div>
        </div>

        <div className="project-metadata">
          <small>最后更新：{formatDate(project.updated_at)}</small>
        </div>
      </footer>
    </div>
  );
};
