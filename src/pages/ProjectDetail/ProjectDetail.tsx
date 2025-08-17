import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bookmark, Share2, ChevronRight, MessageCircle, Heart } from 'lucide-react';
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
      {/* 面包屑导航 */}
      <div className="breadcrumb-section">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">ArchDaily</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-link">{project.category}</span>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-current">{project.title}</span>
          </div>
        </div>
      </div>

      {/* 项目标题和操作 */}
      <div className="project-header">
        <div className="container">
          <div className="header-content">
            <div className="title-section">
              <h1 className="project-title">{project.title}</h1>
              <p className="project-subtitle">{project.architect}</p>
            </div>
            
            <div className="action-buttons">
              <button className="action-btn save-btn">
                <Bookmark size={20} />
              </button>
              <button className="action-btn share-btn">
                <Share2 size={20} />
              </button>
              <button className="action-btn comment-btn">
                <MessageCircle size={20} />
              </button>
              <button className="collect-btn">
                <Heart size={16} />
                <span>收藏项目</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="main-content">
        <div className="container">
          <div className="content-layout">
            {/* 左侧内容 */}
            <div className="content-main">
              {/* 主图 */}
              <div className="main-image-container">
                <img 
                  src={project.images?.[0] || project.featured_image || '/api/placeholder/800/500'} 
                  alt={project.title}
                  className="main-image"
                />
                <div className="image-counter">
                  <span>1 / {project.images?.length || 1}</span>
                </div>
              </div>

              {/* 缩略图 */}
              {project.images && project.images.length > 1 && (
                <div className="thumbnail-gallery">
                  {project.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="thumbnail-item">
                      <img src={image} alt={`${project.title} - ${index + 2}`} />
                    </div>
                  ))}
                  {project.images.length > 5 && (
                    <div className="thumbnail-item more-images">
                      <span>+ {project.images.length - 5}</span>
                    </div>
                  )}
                </div>
              )}

              {/* 项目描述 */}
              <div className="project-description">
                <div className="description-label">概述</div>
                <div className="description-content">
                  <p>{project.excerpt}</p>
                  {/* 这里可以添加更多项目描述内容 */}
                </div>
              </div>
            </div>

            {/* 右侧信息栏 */}
            <div className="content-sidebar">
              <div className="project-info-card">
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">建筑师</span>
                    <span className="info-value architect-name">{project.architect}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">地点</span>
                    <span className="info-value">{project.location}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">类别</span>
                    <span className="info-value category-links">{project.category}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">面积</span>
                    <span className="info-value">{project.area}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">项目年份</span>
                    <span className="info-value">{project.year}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">摄影师</span>
                    <span className="info-value photographer-name">{project.photographer}</span>
                  </div>
                </div>

                {/* 标签 */}
                {project.tags && project.tags.length > 0 && (
                  <div className="tags-section">
                    <div className="tags-label">标签</div>
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
    </div>
  );
};

export default ProjectDetail;
