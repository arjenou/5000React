import React from 'react';
import './FeaturedLayout.css';

interface FeaturedArticle {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  category: string;
}

const featuredArticles: FeaturedArticle[] = [
  {
    id: '1',
    title: '西岸大剧院',
    subtitle: 'SHL',
    imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop',
    category: '项目'
  },
  {
    id: '2',
    title: '滨水建筑群',
    subtitle: '现代港口设计',
    imageUrl: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=400&h=300&fit=crop',
    category: '项目'
  },
  {
    id: '3',
    title: '城市景观',
    subtitle: '都市更新',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
    category: '项目'
  },
  {
    id: '4',
    title: '绿色公园',
    subtitle: '景观设计',
    imageUrl: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400&h=200&fit=crop',
    category: '项目'
  },
  {
    id: '5',
    title: '新村下办公园',
    subtitle: '建筑公司：追求精神利润为宗旨，建筑定义工厂的设计',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    category: '项目'
  }
];

const FeaturedLayout: React.FC = () => {
  return (
    <div className="featured-layout">
      <div className="featured-grid">
        {/* 主要文章 - 左侧大图 */}
        <div className="main-featured">
          <div className="featured-card large">
            <img src={featuredArticles[0].imageUrl} alt={featuredArticles[0].title} />
            <div className="featured-overlay">
              <span className="featured-category">{featuredArticles[0].category}</span>
              <h2 className="featured-title">{featuredArticles[0].title}</h2>
              <p className="featured-subtitle">{featuredArticles[0].subtitle}</p>
            </div>
          </div>
        </div>

        {/* 右侧网格 */}
        <div className="side-grid">
          {/* 右上角文章 */}
          <div className="featured-card medium">
            <img src={featuredArticles[4].imageUrl} alt={featuredArticles[4].title} />
            <div className="featured-overlay">
              <span className="featured-category">{featuredArticles[4].category}</span>
              <h3 className="featured-title small">{featuredArticles[4].title}</h3>
              <p className="featured-subtitle small">{featuredArticles[4].subtitle}</p>
            </div>
          </div>

          {/* 右侧中间行 */}
          <div className="middle-row">
            <div className="featured-card small">
              <img src={featuredArticles[1].imageUrl} alt={featuredArticles[1].title} />
              <div className="featured-overlay">
                <span className="featured-category">{featuredArticles[1].category}</span>
                <h4 className="featured-title xs">{featuredArticles[1].title}</h4>
              </div>
            </div>
            <div className="featured-card small">
              <img src={featuredArticles[2].imageUrl} alt={featuredArticles[2].title} />
              <div className="featured-overlay">
                <span className="featured-category">{featuredArticles[2].category}</span>
                <h4 className="featured-title xs">{featuredArticles[2].title}</h4>
              </div>
            </div>
          </div>

          {/* 右下角文章 */}
          <div className="featured-card small">
            <img src={featuredArticles[3].imageUrl} alt={featuredArticles[3].title} />
            <div className="featured-overlay">
              <span className="featured-category">{featuredArticles[3].category}</span>
              <h4 className="featured-title xs">{featuredArticles[3].title}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* 下方大文章 */}
      <div className="bottom-featured">
        <div className="featured-card wide">
          <img src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=400&fit=crop" alt="倍耐力 35 号办公楼" />
          <div className="featured-overlay">
            <span className="featured-category">项目</span>
            <h2 className="featured-title">倍耐力 35 号办公楼 / Park Associati + Snohetta</h2>
            <p className="featured-subtitle">大舜可以当家</p>
          </div>
        </div>
      </div>

      {/* 额外内容区域 - 用于测试滚动效果 */}
      <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ color: 'white', marginBottom: '30px', fontSize: '2rem' }}>最新建筑项目</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px' }}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} style={{ 
              background: '#333', 
              borderRadius: '8px', 
              overflow: 'hidden',
              height: '400px' 
            }}>
              <img 
                src={`https://images.unsplash.com/photo-${1487958449943 + i}?w=400&h=250&fit=crop`} 
                alt={`项目 ${i + 1}`}
                style={{ width: '100%', height: '250px', objectFit: 'cover' }}
              />
              <div style={{ padding: '20px' }}>
                <h3 style={{ color: 'white', marginBottom: '10px' }}>建筑项目 {i + 1}</h3>
                <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.5' }}>
                  这是一个现代建筑项目的描述，展示了创新的设计理念和可持续发展的建筑实践。
                </p>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ color: 'white', marginBottom: '30px', fontSize: '2rem' }}>建筑新闻</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px' }}>
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} style={{ 
              background: '#333', 
              borderRadius: '8px', 
              overflow: 'hidden',
              height: '350px' 
            }}>
              <img 
                src={`https://images.unsplash.com/photo-${1558618047000 + i * 1000}?w=400&h=200&fit=crop`} 
                alt={`新闻 ${i + 1}`}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '20px' }}>
                <h3 style={{ color: 'white', marginBottom: '10px' }}>建筑新闻 {i + 1}</h3>
                <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.5' }}>
                  最新的建筑行业动态和趋势分析，为建筑师和设计师提供专业的行业资讯。
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#888', fontSize: '18px' }}>向上滚动查看导航栏缩小效果</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedLayout;
