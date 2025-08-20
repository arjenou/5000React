import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: any | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    loading: true,
    error: null,
    user: null,
  });

  // 检查认证状态
  const checkAuth = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    // 首先检查本地是否有 token
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setState({
        isAuthenticated: false,
        loading: false,
        error: null,
        user: null,
      });
      return;
    }

    try {
      // 验证 token 是否有效
      const isValid = await apiService.verifyAuth();
      if (isValid) {
        setState({
          isAuthenticated: true,
          loading: false,
          error: null,
          user: null, // 可以在这里获取用户信息
        });
      } else {
        // token 无效，清除本地存储
        localStorage.removeItem('admin_token');
        setState({
          isAuthenticated: false,
          loading: false,
          error: 'Token 已过期或无效',
          user: null,
        });
      }
    } catch (error) {
      // 验证失败，清除本地存储
      localStorage.removeItem('admin_token');
      setState({
        isAuthenticated: false,
        loading: false,
        error: error instanceof Error ? error.message : '认证验证失败',
        user: null,
      });
    }
  }, []);

  // 登录
  const login = useCallback(async (username: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiService.login(username, password);
      
      if (response.success && response.data) {
        setState({
          isAuthenticated: true,
          loading: false,
          error: null,
          user: response.data.user,
        });
        return { success: true };
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || '登录失败',
        }));
        return { success: false, error: response.error || '登录失败' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '登录失败';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // 登出
  const logout = useCallback(() => {
    apiService.logout();
    setState({
      isAuthenticated: false,
      loading: false,
      error: null,
      user: null,
    });
  }, []);

  // 清除错误
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // 初始化时检查认证状态
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    ...state,
    login,
    logout,
    checkAuth,
    clearError,
  };
};
