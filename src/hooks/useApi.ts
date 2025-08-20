/**
 * React Hooks for API data management
 */
import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import type { Project, ProjectFormData } from '../types/project';

// 通用的API状态类型
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// 项目列表Hook
export const useProjects = () => {
  const [state, setState] = useState<ApiState<Project[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchProjects = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiService.getProjects();
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || '获取项目列表失败',
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : '网络错误',
      });
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    ...state,
    refetch: fetchProjects,
  };
};

// 根据类型获取项目的Hook
export const useProjectsByType = (type: Project['type']) => {
  const [state, setState] = useState<ApiState<Project[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchProjectsByType = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiService.getProjectsByType(type);
      
      if (response.success && response.data) {
        // 由于后端筛选可能有问题，在前端再次筛选确保正确性
        const filteredData = response.data.filter((project: Project) => project.type === type);
        
        setState({
          data: filteredData,
          loading: false,
          error: null,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || '获取项目列表失败',
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : '网络错误',
      });
    }
  }, [type]);

  useEffect(() => {
    fetchProjectsByType();
  }, [fetchProjectsByType]);

  return {
    ...state,
    refetch: fetchProjectsByType,
  };
};

// 单个项目Hook
export const useProject = (id: string | undefined) => {
  const [state, setState] = useState<ApiState<Project>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchProject = useCallback(async () => {
    if (!id) {
      setState({
        data: null,
        loading: false,
        error: '项目ID不存在',
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiService.getProject(id);
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || '获取项目详情失败',
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : '网络错误',
      });
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    ...state,
    refetch: fetchProject,
  };
};

// 搜索Hook
export const useSearch = () => {
  const [state, setState] = useState<ApiState<Project[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setState({
        data: null,
        loading: false,
        error: null,
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiService.searchProjects(query);
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || '搜索失败',
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : '网络错误',
      });
    }
  }, []);

  const clearSearch = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    search,
    clearSearch,
  };
};

// 项目管理Hook (用于后台管理)
export const useProjectManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = useCallback(async (project: ProjectFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.createProject(project);
      
      if (response.success) {
        setLoading(false);
        return response.data;
      } else {
        setError(response.error || '创建项目失败');
        setLoading(false);
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '网络错误';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  }, []);

  const updateProject = useCallback(async (id: string, project: ProjectFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.updateProject(id, project);
      
      if (response.success) {
        setLoading(false);
        return response.data;
      } else {
        setError(response.error || '更新项目失败');
        setLoading(false);
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '网络错误';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.deleteProject(id);
      
      if (response.success) {
        setLoading(false);
        return true;
      } else {
        setError(response.error || '删除项目失败');
        setLoading(false);
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '网络错误';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  }, []);

  return {
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
  };
};

// 文件上传Hook
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      const response = await apiService.uploadFile(file, (progress: number) => {
        setProgress(progress);
      });
      
      if (response.success && response.data) {
        setUploading(false);
        setProgress(100);
        return response.data;
      } else {
        setError(response.error || '文件上传失败');
        setUploading(false);
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '上传失败';
      setError(errorMessage);
      setUploading(false);
      return null;
    }
  }, []);

  return {
    uploading,
    progress,
    error,
    uploadFile,
  };
};

// 认证Hook
export { useAuth } from './useAuth';
