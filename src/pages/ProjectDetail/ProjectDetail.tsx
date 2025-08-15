import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bookmark, Share2, ChevronRight } from 'lucide-react';
import { useProject } from '../../hooks/useApi';
import './ProjectDetail.css';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project, loading, error } = useProject(id || '');

  if (loading) {
    return (
      <div className="project-detail">
        <div className="container">
          <div className="loading-state">
            <p>正在加载项目详情...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-detail">
        <div className="container">
          <div className="error-state">
            <p>加载失败: {error}</p>
            <Link to="/" className="back-link">返回首页</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail">
        <div className="container">
          <div className="not-found-state">
            <p>项目未找到</p>
            <Link to="/" className="back-link">返回首页</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-image">
          <img 
            src={project.images?.[0] || '/api/placeholder/1200/600'} 
            alt={project.title} 
          />
        </div>
        
        <div className="hero-overlay">
          <div className="container">
            <div className="hero-content">
              <div className="breadcrumb">
                <Link to="/">ArchDaily</Link>
                <ChevronRight size={16} />
                <span>项目</span>
              </div>
              
              <h1 className="project-title">{project.title}</h1>
              <p className="project-subtitle">{project.subtitle}</p>
              
              <div className="hero-actions">
                <button className="save-btn">
                  <Bookmark size={20} />
                  <span>保存</span>
                </button>
                <button className="share-btn">
                  <Share2 size={20} />
                  <span>分享</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="content-section">
        <div className="container">
          <div className="content-grid">
            {/* Main Content */}
            <div className="main-content">
              {/* Project Info */}
              <div className="project-info">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">建筑设计</span>
                    <span className="info-value">{project.architect}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">地址</span>
                    <span className="info-value">{project.location}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">年份</span>
                    <span className="info-value">{project.year}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">面积</span>
                    <span className="info-value">{project.area}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">摄影师</span>
                    <span className="info-value">{project.photographer}</span>
                  </div>
                </div>
              </div>

              {/* Project Description */}
              <div className="project-description">
                <p>{project.excerpt || project.title}</p>
              </div>

              {/* Project Images */}
              <div className="project-images">
                {project.images && project.images.slice(1).map((image, index) => (
                  <div key={index} className="image-container">
                    <img src={image} alt={`${project.title} - Image ${index + 2}`} />
                  </div>
                ))}
              </div>

              {/* Rich Content - placeholder for now */}
              <div className="project-content">
                <p>项目详细信息正在加载中...</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="sidebar">
              {/* Project Stats */}
              <div className="stats-card">
                <h3>项目统计</h3>
                <div className="stats-list">
                  <div className="stat-item">
                    <span className="stat-label">建成年份</span>
                    <span className="stat-value">{project.year}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">项目面积</span>
                    <span className="stat-value">{project.area}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">项目类型</span>
                    <span className="stat-value">{project.category}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="tags-card">
                  <h3>标签</h3>
                  <div className="tags-list">
                    {project.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
