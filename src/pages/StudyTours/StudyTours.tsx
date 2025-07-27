import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import './StudyTours.css';

interface StudyTour {
  id: number;
  title: string;
  subtitle: string;
  organizer: string;
  location: string;
  category: string;
  images: string[];
  tags: string[];
}

const StudyTours: React.FC = () => {
  const studyTours: StudyTour[] = [
    {
      id: 1,
      title: "日本现代建筑深度游学",
      subtitle: "Modern Architecture Tour Japan",
      organizer: "建筑游学专家团队",
      location: "东京, 大阪, 京都",
      category: "建筑游学, 现代设计, 文化体验",
      images: [
        "https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["热门线路", "7天6夜"]
    },
    {
      id: 2,
      title: "欧洲古典建筑艺术之旅",
      subtitle: "European Classical Architecture",
      organizer: "国际建筑文化交流中心",
      location: "巴黎, 罗马, 佛罗伦萨",
      category: "古典建筑, 艺术历史, 文化遗产",
      images: [
        "https://images.unsplash.com/photo-1471919743851-c4df8b6ee133?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["经典路线", "10天9夜"]
    },
    {
      id: 3,
      title: "北欧可持续建筑考察",
      subtitle: "Nordic Sustainable Architecture",
      organizer: "绿色建筑研究院",
      location: "哥本哈根, 斯德哥尔摩, 奥斯陆",
      category: "可持续建筑, 环保设计, 北欧文化",
      images: [
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["专业考察", "5天4夜"]
    },
    {
      id: 4,
      title: "中国古建筑文化探索",
      subtitle: "Chinese Traditional Architecture",
      organizer: "中华建筑文化学会",
      location: "北京, 西安, 苏州",
      category: "传统建筑, 文化遗产, 工艺技术",
      images: [
        "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["文化深度", "6天5夜"]
    },
    {
      id: 5,
      title: "迪拜未来建筑科技游学",
      subtitle: "Dubai Future Architecture",
      organizer: "未来建筑研究中心",
      location: "迪拜, 阿布扎比",
      category: "未来建筑, 智能建筑, 科技创新",
      images: [
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      tags: ["科技前沿", "4天3夜"]
    }
  ];

  return (
    <div className="study-tours">
      <div className="study-tours-container">
        <div className="tours-grid">
          {studyTours.map((tour) => {
            return (
              <article key={tour.id} className="tour-card">
                <Link to={`/tour/${tour.id}`} className="tour-link">
                  <div className="tour-image">
                    <img 
                      src={tour.images[0]} 
                      alt={`${tour.title}`} 
                    />
                    
                    {/* Save Button */}
                    <button 
                      className="save-btn" 
                      aria-label="保存游学"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <Bookmark size={16} />
                      <span>保存</span>
                    </button>
                  </div>
                  
                  <div className="tour-content">
                    <h2 className="tour-title">{tour.title}</h2>
                    <h3 className="tour-subtitle">{tour.subtitle}</h3>
                    
                    <div className="tour-details">
                      <div className="detail-row">
                        <span className="detail-label">组织方:</span>
                        <span className="detail-value organizer-link">{tour.organizer}</span>
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">目的地:</span>
                        <span className="detail-value">{tour.location}</span>
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">类别:</span>
                        <span className="detail-value category-links">{tour.category}</span>
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

export default StudyTours;
