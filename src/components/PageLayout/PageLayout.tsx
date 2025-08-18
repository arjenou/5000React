import React from 'react';
import type { Project } from '../../types/project';
import ProjectCard from '../ProjectCard/ProjectCard';
import '../shared.css';

interface PageLayoutProps {
  title: string;
  projects: Project[] | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  labelMap?: {
    architect?: string;
    location?: string;
    category?: string;
  };
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  projects,
  loading,
  error,
  onRetry,
  labelMap,
  className = 'space-design'
}) => {
  if (loading) {
    return (
      <div className={className}>
        <div className="container">
          <h1>{title}</h1>
          <div className="loading-state">
            <p>正在加载项目...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <div className="container">
          <h1>{title}</h1>
          <div className="error-state">
            <p>加载失败: {error}</p>
            <button onClick={onRetry} className="retry-btn">重试</button>
          </div>
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className={className}>
        <div className="container">
          <h1>{title}</h1>
          <div className="empty-state">
            <p>暂无{title}项目</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-design-container">
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              labelMap={labelMap}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
