import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bookmark, Share2, ChevronRight } from 'lucide-react';
import './ProjectDetail.css';

interface Project {
  id: number;
  title: string;
  subtitle: string;
  architect: string;
  location: string;
  Create_date: string;
  images: string[];
  tags: string[];
  analysis: string;
  area: string;
  year: string;
  photographer: string;
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // 项目数据（实际应用中可能从API获取）
  const projects: Project[] = [
    {
      id: 1,
      title: "比达达利公园",
      subtitle: "Henning Larsen",
      architect: "CPG Consultants, Henning Larsen",
      location: "新加坡, 新加坡",
      Create_date: "2024/07/06",
      images: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ],
      tags: ["16小时前", "1周8名份"],
      area: "1002 m²",
      year: "2024",
      photographer: "Wen Studio",
      analysis: "位北京 751 园区内的更生业态单元，Yatofu 受委托设计AITASHOP 全新数字空间，设计师说'The Future Run成年文字描述的时间，借助商标与记忆的表意，在商景的困惑在工厂重新引入当代性计算者，通过现代化的空间重塑、装置架构、让构文文化的当代性得与业态开发一统合于空间，过程贯穿知识对话。'"
    },
    {
      id: 2,
      title: "Apricity 开发品牌总部",
      subtitle: "Soar Design Studio + Ray Architects",
      architect: "Soar Design Studio + Ray Architects",
      location: "新北市, 台湾",
      Create_date: "2024/07/06",
      images: [
        "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ],
      tags: ["18小时前", "1周8名份"],
      area: "850 m²",
      year: "2024",
      photographer: "Studio A",
      analysis: "这个创新的办公空间设计融合了现代建筑美学与功能性需求。设计师通过开放式布局和自然光线的巧妙运用，创造出一个既专业又舒适的工作环境。空间中的每个细节都体现了对员工福祉和工作效率的深度考虑。"
    },
    {
      id: 3,
      title: "上海张江信息技术产业平台创芯天地",
      subtitle: "致正建筑工作室",
      architect: "致正建筑工作室",
      location: "浦东新区, 中国",
      Create_date: "2024/07/06",
      images: [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ],
      tags: ["1天前", "1周8名份"],
      area: "2500 m²",
      year: "2024",
      photographer: "Zhang Ming",
      analysis: "作为上海张江高科技园区的重要组成部分，该项目体现了现代科技园区的发展趋势。建筑设计强调可持续性和智能化，通过创新的外立面设计和内部空间布局，为科技企业提供了理想的工作环境。"
    },
    {
      id: 4,
      title: "倍耐力35号办公楼",
      subtitle: "Park Associati + Snøhetta",
      architect: "Park Associati, Snøhetta",
      location: "米兰, 意大利",
      Create_date: "2024/07/06",
      images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ],
      tags: ["1天前", "1周8名份"],
      area: "3200 m²",
      year: "2024",
      photographer: "Marco Rossi",
      analysis: "这座标志性的办公建筑代表了米兰现代建筑设计的最高水准。项目将可持续发展理念与创新设计完美结合，通过智能建筑系统和绿色技术的应用，创造出一个高效、环保的办公环境。"
    },
    {
      id: 5,
      title: "气味咖啡",
      subtitle: "拾号建筑",
      architect: "拾号建筑",
      location: "保山市, 中国",
      Create_date: "2024/07/06",
      images: [
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ],
      tags: ["1天前", "项目名称"],
      area: "120 m²",
      year: "2024",
      photographer: "Li Wei",
      analysis: "这个小而精致的咖啡空间展现了如何在有限的面积内创造出丰富的空间体验。设计师通过巧妙的空间分割和材料运用，打造出一个温馨而富有个性的社交空间，完美诠释了现代咖啡文化的精髓。"
    }
  ];

  const project = projects.find(p => p.id === parseInt(id || '0'));

  if (!project) {
    return (
      <div className="project-detail">
        <div className="container">
          <h1>项目未找到</h1>
          <Link to="/space-design">返回列表</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail">
      {/* 面包屑导航 */}
      <nav className="breadcrumb-nav">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">ArchDaily</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <Link to="/space-design" className="breadcrumb-link">项目</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-current">{project.title}</span>
          </div>
        </div>
      </nav>

      {/* 项目标题部分 */}
      <header className="project-header">
        <div className="container">
          <div className="project-meta">
            <div className="project-actions">
              <button className="action-btn save-btn" aria-label="保存项目">
                <Bookmark size={18} />
              </button>
              <button className="action-btn share-btn" aria-label="分享项目">
                <Share2 size={18} />
              </button>
            </div>
          </div>
          
          <h1 className="project-title">{project.title}</h1>
          <h2 className="project-subtitle">{project.subtitle}</h2>
          <div className="project-info">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">作者:</span>
                <span className="info-value">{project.photographer}</span>
              </div>
              <div className="info-item">
                <span className="info-label">地点:</span>
                <span className="info-value">{project.location}</span>
              </div>
              <div className="info-item">
                <span className="info-label">面积:</span>
                <span className="info-value">{project.area}</span>
              </div>
              <div className="info-item">
                <span className="info-label">项目日期:</span>
                <span className="info-value">{project.year}</span>
              </div>

              <div className="info-item">
                <span className="info-label">创作日期:</span>
                <span className="info-value Create_date-links">{project.Create_date}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 项目图片 */}
      <section className="project-image-section">
        <div className="container">
          <div className="main-image">
            <img src={project.images[0]} alt={project.title} />
          </div>
        </div>
      </section>

      {/* 项目分析 */}
      <section className="project-analysis">
        <div className="container">
          <div className="analysis-content">
            <h3 className="analysis-title">项目分析</h3>
            <div className="analysis-text">
              <p>{project.analysis}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
