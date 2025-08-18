import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { apiService } from '../../services/apiService';
import type { Project } from '../../types/project';
import { EnhancedSearchBar } from '../EnhancedSearchBar/EnhancedSearchBar';
import { SkeletonLoader, ErrorState, EmptyState } from '../LoadingStates/LoadingStates';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { formatDate } from '../../utils/helpers';
import './OptimizedProjectList.css';

interface ProjectListProps {
  isAdmin?: boolean;
}

interface SearchFilters {
  category: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  dateRange: {
    start: string;
    end: string;
  };
}

export const OptimizedProjectList: React.FC<ProjectListProps> = ({ isAdmin = false }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    status: 'all',
    sortBy: 'updated_at',
    sortOrder: 'desc',
    dateRange: {
      start: '',
      end: ''
    }
  });
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());

  // 配置选项
  const categories = [
    { value: '空间设计', label: '空间设计' },
    { value: '专项游学', label: '专项游学' },
    { value: '展览策划', label: '展览策划' }
  ];

  const statuses = [
    { value: 'draft', label: '草稿' },
    { value: 'published', label: '已发布' }
  ];

  const sortOptions = [
    { value: 'updated_at', label: '更新时间' },
    { value: 'created_at', label: '创建时间' },
    { value: 'title', label: '标题' },
    { value: 'project_year', label: '项目年份' }
  ];

  const loadProjects = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {
        page: currentPage,
        limit: 20,
        ...(filters.category !== 'all' && { category: filters.category }),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(searchQuery && { search: searchQuery }),
      };

      const response = isAdmin 
        ? await apiService.getAdminProjects(params)
        : await apiService.getPublicProjects(params);

      if (response.success && response.data) {
        setProjects(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
        }
      } else {
        setError(response.error || '加载项目失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [currentPage, filters, searchQuery, isAdmin]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // 重置到第一页
  }, []);

  const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // 重置到第一页
  }, []);

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('确定要删除这个项目吗？')) {
      return;
    }

    try {
      const response = await apiService.deleteProject(projectId);
      if (response.success) {
        loadProjects(); // 重新加载项目列表
      } else {
        alert(response.error || '删除失败');
      }
    } catch (err) {
      alert('删除失败，请稍后重试');
    }
  };

  const handleBatchDelete = async () => {
    if (selectedProjects.size === 0) return;
    
    if (!window.confirm(`确定要删除选中的 ${selectedProjects.size} 个项目吗？`)) {
      return;
    }

    const deletePromises = Array.from(selectedProjects).map(id => 
      apiService.deleteProject(id)
    );

    try {
      await Promise.all(deletePromises);
      setSelectedProjects(new Set());
      loadProjects();
    } catch (err) {
      alert('批量删除失败，请稍后重试');
    }
  };

  const toggleProjectSelection = (projectId: string) => {
    const newSelection = new Set(selectedProjects);
    if (newSelection.has(projectId)) {
      newSelection.delete(projectId);
    } else {
      newSelection.add(projectId);
    }
    setSelectedProjects(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedProjects.size === projects.length) {
      setSelectedProjects(new Set());
    } else {
      setSelectedProjects(new Set(projects.map(p => p.id)));
    }
  };

  // 辅助函数
  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return '草稿';
      case 'published':
        return '已发布';
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'space-design':
        return '空间设计';
      case 'study-tours':
        return '专项游学';
      case 'exhibition-planning':
        return '展览策划';
      default:
        return type;
    }
  };

  // 如果有错误，显示错误状态
  if (error && !loading) {
    return (
      <ErrorBoundary>
        <div className="project-list-container">
          <ErrorState 
            error={error} 
            onRetry={loadProjects}
          />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="optimized-project-list">
        {/* 搜索和筛选区域 */}
        <div className="project-list-header">
          <h1>{isAdmin ? '项目管理' : '建筑项目'}</h1>
          
          {isAdmin && (
            <Link to="/admin/projects/new" className="create-btn">
              <Plus size={16} />
              创建新项目
            </Link>
          )}
        </div>

        <EnhancedSearchBar
          onSearch={handleSearch}
          onFiltersChange={handleFiltersChange}
          categories={categories}
          statuses={isAdmin ? statuses : undefined}
          sortOptions={sortOptions}
          placeholder="搜索项目标题、建筑师或地点..."
        />

        {/* 管理员工具栏 */}
        {isAdmin && selectedProjects.size > 0 && (
          <div className="admin-toolbar">
            <span className="selection-count">
              已选择 {selectedProjects.size} 个项目
            </span>
            <button 
              onClick={handleBatchDelete}
              className="batch-action-btn danger"
            >
              <Trash2 size={16} />
              批量删除
            </button>
          </div>
        )}

        {/* 项目列表内容 */}
        {loading ? (
          <SkeletonLoader type="card" count={6} />
        ) : projects.length === 0 ? (
          <EmptyState
            title="暂无项目"
            description={searchQuery ? "没有找到匹配的项目" : "还没有创建任何项目"}
            action={isAdmin ? (
              <Link to="/admin/projects/new" className="empty-action-btn">
                <Plus size={16} />
                创建第一个项目
              </Link>
            ) : undefined}
          />
        ) : (
          <>
            {/* 全选控制 */}
            {isAdmin && (
              <div className="selection-controls">
                <label className="select-all-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedProjects.size === projects.length && projects.length > 0}
                    onChange={toggleSelectAll}
                  />
                  全选
                </label>
              </div>
            )}

            <div className="projects-grid">
              {projects.map(project => (
                <div key={project.id} className="project-card">
                  {isAdmin && (
                    <div className="card-select">
                      <input
                        type="checkbox"
                        checked={selectedProjects.has(project.id)}
                        onChange={() => toggleProjectSelection(project.id)}
                      />
                    </div>
                  )}

                  <div className="project-image">
                    {project.images && project.images.length > 0 ? (
                      <img 
                        src={project.images[0].thumbnail_url || project.images[0].original_url}
                        alt={project.images[0].alt || project.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="placeholder-image">
                        <span>暂无图片</span>
                      </div>
                    )}
                    
                    {project.featured && (
                      <div className="featured-badge">精选</div>
                    )}
                  </div>

                  <div className="project-content">
                    <div className="project-meta">
                      <span className="category">{project.category}</span>
                      <span className="type">{getTypeText(project.type)}</span>
                      {isAdmin && (
                        <span className={`status ${project.status}`}>
                          {getStatusText(project.status)}
                        </span>
                      )}
                    </div>

                    <h3 className="project-title">
                      <Link to={isAdmin ? `/admin/projects/${project.id}` : `/project/${project.slug}`}>
                        {project.title}
                      </Link>
                    </h3>

                    <div className="project-info">
                      <p><strong>建筑师：</strong>{project.architect}</p>
                      <p><strong>地点：</strong>{project.location}</p>
                      <p><strong>年份：</strong>{project.project_year}</p>
                      {project.area && (
                        <p><strong>面积：</strong>{project.area} m²</p>
                      )}
                    </div>

                    {project.description && (
                      <p className="project-description">
                        {project.description.length > 100 
                          ? `${project.description.substring(0, 100)}...` 
                          : project.description
                        }
                      </p>
                    )}

                    <div className="project-actions">
                      <Link 
                        to={isAdmin ? `/admin/projects/${project.id}` : `/project/${project.slug}`}
                        className="action-btn primary"
                      >
                        <Eye size={14} />
                        查看
                      </Link>
                      
                      {isAdmin && (
                        <>
                          <Link 
                            to={`/admin/projects/${project.id}/edit`}
                            className="action-btn secondary"
                          >
                            <Edit size={14} />
                            编辑
                          </Link>
                          <button 
                            onClick={() => handleDeleteProject(project.id)}
                            className="action-btn danger"
                          >
                            <Trash2 size={14} />
                            删除
                          </button>
                        </>
                      )}
                    </div>

                    <div className="project-footer">
                      <small>更新于 {formatDate(project.updated_at)}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  上一页
                </button>
                
                <span className="page-info">
                  第 {currentPage} 页，共 {totalPages} 页
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};
