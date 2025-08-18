import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import type { Project } from '../../types/project';
import '../shared.css';

interface ProjectCardProps {
  project: Project;
  labelMap?: {
    architect?: string;
    location?: string;
    category?: string;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  labelMap = {
    architect: '建筑师',
    location: '地址',
    category: '类别'
  }
}) => {
  return (
    <article className="project-card">
      <Link to={`/project/${project.id}`} className="project-link">
        <div className="project-image">
          <img 
            src={typeof project.images?.[0] === 'string' ? project.images[0] : project.images?.[0]?.original_url || '/api/placeholder/400/300'} 
            alt={project.title} 
          />
          
          {/* Save Button */}
          <button 
            className="save-btn" 
            aria-label="保存项目"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Bookmark size={16} />
            <span>保存</span>
          </button>
        </div>
        
        <div className="project-content">
          <h2 className="project-title">{project.title}</h2>
          
          <div className="project-details">
            {project.architect && (
              <div className="detail-row">
                <span className="detail-label">{labelMap.architect}:</span>
                <span className="detail-value architect-link">{project.architect}</span>
              </div>
            )}
            
            {project.location && (
              <div className="detail-row">
                <span className="detail-label">{labelMap.location}:</span>
                <span className="detail-value">{project.location}</span>
              </div>
            )}
            
            {project.category && (
              <div className="detail-row">
                <span className="detail-label">{labelMap.category}:</span>
                <span className="detail-value category-links">{project.category}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProjectCard;
