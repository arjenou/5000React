import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import './SpaceDesign.css';

interface Project {
  id: number;
  title: string;
  subtitle: string;
  architect: string;
  location: string;
  category: string;
  images: string[];
  tags: string[];
}

const SpaceDesign: React.FC = () => {
  const projects: Project[] = [
    {
      id: 1,
      title: "比达达利公园",
      subtitle: "Henning Larsen",
      architect: "CPG Consultants, Henning Larsen",
      location: "新加坡, 新加坡",
      category: "城市公共空间, 景观城市, 公园",
      images: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["16小时前", "1周8名份"]
    },
    {
      id: 2,
      title: "Apricity 开发品牌总部",
      subtitle: "Soar Design Studio + Ray Architects",
      architect: "Soar Design Studio + Ray Architects",
      location: "新北市, 台湾",
      category: "办公设施, Nanshi",
      images: [
        "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["18小时前", "1周8名份"]
    },
    {
      id: 3,
      title: "上海张江信息技术产业平台创芯天地",
      subtitle: "致正建筑工作室",
      architect: "致正建筑工作室",
      location: "浦东新区, 中国",
      category: "混合用途建筑, 办公设施, 上海, 浦东新区",
      images: [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["1天前", "1周8名份"]
    },
    {
      id: 4,
      title: "倍耐力35号办公楼",
      subtitle: "Park Associati + Snøhetta",
      architect: "Park Associati, Snøhetta",
      location: "米兰, 意大利",
      category: "办公设施, 改造项目, 可持续性住, 绿色设计, 米兰",
      images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["1天前", "1周8名份"]
    },
    {
      id: 5,
      title: "气味咖啡",
      subtitle: "拾号建筑",
      architect: "拾号建筑",
      location: "保山市, 中国",
      category: "更新项目, 咖啡店室内设计, Baoshan",
      images: [
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["1天前", "项目名称"]
    }
  ];

  return (
    <div className="space-design">
      <div className="space-design-container">

        <div className="projects-grid">
          {projects.map((project) => {
            return (
              <article key={project.id} className="project-card">
                <Link to={`/project/${project.id}`} className="project-link">
                  <div className="project-image">
                    <img 
                      src={project.images[0]} 
                      alt={`${project.title}`} 
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
                    <h3 className="project-subtitle">{project.subtitle}</h3>
                    
                    <div className="project-details">
                      <div className="detail-row">
                        <span className="detail-label">建筑设计:</span>
                        <span className="detail-value architect-link">{project.architect}</span>
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">地址:</span>
                        <span className="detail-value">{project.location}</span>
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">类别:</span>
                        <span className="detail-value category-links">{project.category}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SpaceDesign;
