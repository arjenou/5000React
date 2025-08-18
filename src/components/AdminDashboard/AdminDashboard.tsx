import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AdminLogin } from '../AdminLogin/AdminLogin';
import { OptimizedProjectList } from '../OptimizedProjectList/OptimizedProjectList';
import ProjectForm from '../ProjectForm/ProjectForm';
import { apiService } from '../../services/apiService';
// import { useToastHelpers } from '../Toast/Toast'; // 待后续使用
import './AdminDashboard.css';

export const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  // const { success, error } = useToastHelpers(); // 待后续使用

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    
    // 首先检查本地是否有 token
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    // 验证 token 是否有效
    try {
      const isAuth = await apiService.verifyAuth();
      setIsAuthenticated(isAuth);
    } catch (error) {
      // 如果验证失败，清除本地 token
      localStorage.removeItem('admin_token');
      setIsAuthenticated(false);
    }
    
    setLoading(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/admin/projects');
  };

  const handleLogout = () => {
    apiService.logout();
    setIsAuthenticated(false);
    navigate('/admin/login');
  };

  const menuItems = [
    {
      path: '/admin/projects',
      label: '项目管理',
      icon: '📁',
      description: '查看、创建和编辑建筑项目'
    },
    {
      path: '/admin/projects/new',
      label: '创建项目',
      icon: '➕',
      description: '添加新的建筑项目'
    },
    {
      path: '/admin/settings',
      label: '系统设置',
      icon: '⚙️',
      description: '管理系统配置'
    }
  ];

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-auth-wrapper">
        <Routes>
          <Route path="/admin/login" element={<AdminLogin onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <h2>建筑项目管理</h2>
            <p>Architecture CMS</p>
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? '收起菜单' : '展开菜单'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-menu">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {sidebarOpen && (
                    <div className="nav-content">
                      <span className="nav-label">{item.label}</span>
                      <small className="nav-description">{item.description}</small>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            {sidebarOpen && <span>退出登录</span>}
          </button>
        </div>
      </aside>

      <main className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="admin-header">
          <div className="header-left">
            <button
              className="mobile-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <div className="breadcrumb">
              <span>管理后台</span>
              <span className="breadcrumb-separator">/</span>
              <span>{menuItems.find(item => item.path === location.pathname)?.label || '页面'}</span>
            </div>
          </div>

          <div className="header-right">
            <div className="user-info">
              <span className="user-avatar">👤</span>
              <span className="user-name">管理员</span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Routes>
            <Route path="/" element={<Navigate to="projects" replace />} />
            <Route path="projects" element={<OptimizedProjectList isAdmin={true} />} />
            <Route path="projects/new" element={<ProjectForm isEdit={false} />} />
            <Route path="projects/:id/edit" element={<ProjectForm isEdit={true} />} />
            <Route path="projects/:id" element={<ProjectDetailAdmin />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

// 临时组件，待后续实现
const ProjectDetailAdmin: React.FC = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>项目详情页面</h2>
      <p>此页面正在开发中...</p>
    </div>
  );
};

const AdminSettings: React.FC = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>系统设置</h2>
      <p>此页面正在开发中...</p>
    </div>
  );
};

const NotFound: React.FC = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>页面未找到</h2>
      <p>抱歉，您访问的页面不存在。</p>
      <Link to="/admin/projects" style={{ color: '#3498db', textDecoration: 'none' }}>
        返回项目列表
      </Link>
    </div>
  );
};
