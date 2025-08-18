import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RichTextEditor } from '../RichTextEditor/RichTextEditor';
import { apiService } from '../../services/apiService';
import type { ProjectFormData } from '../../types/project';
import './ProjectForm.css';

interface ProjectFormProps {
  isEdit?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    slug: '',
    architect: '',
    location: '',
    category: '空间设计',
    type: 'space-design',
    project_year: new Date().getFullYear(),
    area: 0,
    budget: 0,
    client: '',
    status: 'draft',
    description: '',
    details: '',
    tags: '',
    featured: false
  });

  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const categories = ['空间设计', '专项游学', '展览策划'];
  const types = [
    { value: 'space-design', label: '空间设计' },
    { value: 'study-tours', label: '专项游学' },
    { value: 'exhibition-planning', label: '展览策划' }
  ];
  const statuses = [
    { value: 'draft', label: '草稿' },
    { value: 'published', label: '已发布' }
  ];

  useEffect(() => {
    if (isEdit && id) {
      loadProject();
    }
  }, [isEdit, id]);

  const loadProject = async () => {
    if (!id) return;

    setLoading(true);
    setError('');

    try {
      const response = await apiService.getProject(id);
      if (response.success && response.data) {
        const project = response.data;
        setFormData({
          title: project.title,
          slug: project.slug,
          architect: project.architect,
          location: project.location,
          category: project.category,
          type: project.type,
          project_year: project.project_year,
          area: project.area || 0,
          budget: project.budget || 0,
          client: project.client || '',
          status: project.status,
          description: project.description || '',
          details: project.details || '',
          tags: project.tags || '',
          featured: project.featured || false
        });
      } else {
        setError(response.error || '加载项目失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    setFormData((prev: ProjectFormData) => {
      const updated = { ...prev, [field]: value };
      
      // 自动生成 slug
      if (field === 'title' && !isEdit) {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const uploadId = Date.now().toString();
    setUploadProgress((prev: { [key: string]: number }) => ({ ...prev, [uploadId]: 0 }));

    try {
      const response = await apiService.uploadImage(file);

      if (response.success && response.data) {
        setUploadProgress((prev: { [key: string]: number }) => {
          const updated = { ...prev };
          delete updated[uploadId];
          return updated;
        });
        return response.data.original_url;
      } else {
        throw new Error(response.error || '上传失败');
      }
    } catch (error) {
      setUploadProgress((prev: { [key: string]: number }) => {
        const updated = { ...prev };
        delete updated[uploadId];
        return updated;
      });
      throw error;
    }
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('请输入项目标题');
      return false;
    }
    if (!formData.architect.trim()) {
      setError('请输入建筑师');
      return false;
    }
    if (!formData.location.trim()) {
      setError('请输入项目地点');
      return false;
    }
    if (!formData.slug?.trim()) {
      setError('请输入项目别名');
      return false;
    }
    if (formData.project_year < 1900 || formData.project_year > new Date().getFullYear() + 10) {
      setError('请输入有效的项目年份');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      let response;
      
      if (isEdit && id) {
        response = await apiService.updateProject(id, formData);
      } else {
        response = await apiService.createProject(formData);
      }

      if (response.success) {
        setSuccess(isEdit ? '项目更新成功！' : '项目创建成功！');
        setTimeout(() => {
          if (response.data) {
            navigate(`/admin/projects/${response.data.id}`);
          } else {
            navigate('/admin/projects');
          }
        }, 1500);
      } else {
        setError(response.error || '保存失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="project-form-container">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="project-form-container">
      <div className="form-header">
        <h1>{isEdit ? '编辑项目' : '创建新项目'}</h1>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => navigate('/admin/projects')}
        >
          返回列表
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-section">
          <h2>基本信息</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">项目标题 *</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="请输入项目标题"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="slug">项目别名 *</label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="用于URL的唯一标识"
                required
              />
              <small>用于生成项目页面的URL，建议使用英文和数字</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="architect">建筑师 *</label>
              <input
                type="text"
                id="architect"
                value={formData.architect}
                onChange={(e) => handleInputChange('architect', e.target.value)}
                placeholder="请输入建筑师姓名"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location">项目地点 *</label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="请输入项目地点"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">项目类别 *</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="type">项目类型 *</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                required
              >
                {types.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="project_year">项目年份 *</label>
              <input
                type="number"
                id="project_year"
                value={formData.project_year}
                onChange={(e) => handleInputChange('project_year', parseInt(e.target.value) || new Date().getFullYear())}
                min="1900"
                max={new Date().getFullYear() + 10}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>项目详情</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="area">建筑面积 (m²)</label>
              <input
                type="number"
                id="area"
                value={formData.area || ''}
                onChange={(e) => handleInputChange('area', parseFloat(e.target.value) || 0)}
                placeholder="请输入建筑面积"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="budget">项目预算 (万元)</label>
              <input
                type="number"
                id="budget"
                value={formData.budget || ''}
                onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                placeholder="请输入项目预算"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="client">委托方</label>
              <input
                type="text"
                id="client"
                value={formData.client}
                onChange={(e) => handleInputChange('client', e.target.value)}
                placeholder="请输入委托方"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="tags">标签</label>
              <input
                type="text"
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="用逗号分隔多个标签"
              />
              <small>例如：现代主义,可持续设计,城市更新</small>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>发布设置</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">发布状态</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                />
                <span>设为推荐项目</span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>项目描述</h2>
          
          <div className="form-group">
            <label htmlFor="description">简短描述</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="请输入项目的简短描述，将显示在项目列表中"
              rows={3}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>详细内容</h2>
          
          <div className="form-group">
            <label>项目详情</label>
            <RichTextEditor
              value={formData.details}
              onChange={(value) => handleInputChange('details', value)}
              placeholder="请输入项目的详细介绍..."
              onImageUpload={handleImageUpload}
            />
          </div>
        </div>

        {Object.keys(uploadProgress).length > 0 && (
          <div className="upload-progress">
            <h3>图片上传进度</h3>
            {Object.entries(uploadProgress).map(([id, progress]) => (
              <div key={id} className="progress-item">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span>{progress}%</span>
              </div>
            ))}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/admin/projects')}
            disabled={saving}
          >
            取消
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? '保存中...' : (isEdit ? '更新项目' : '创建项目')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
