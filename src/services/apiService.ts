import type { Project, ProjectFormData, ProjectImage, ApiResponse, AdminUser } from '../types/project';
import { cache } from '../utils/cache';
import { retry, generateCacheKey } from '../utils/helpers';

class ApiService {
  private baseUrl = 'https://archdaily-5000react.wangyunjie1101.workers.dev/api';
  private token: string | null = null;
  private requestQueue = new Map<string, Promise<any>>();

  constructor() {
    this.token = localStorage.getItem('admin_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
      console.debug('Adding Authorization header with token:', this.token.substring(0, 20) + '...');
    } else {
      console.debug('No token available for Authorization header');
    }

    return headers;
  }

  private getFormHeaders(): HeadersInit {
    const headers: HeadersInit = {};

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // 通用请求方法，支持缓存和重试
  private async request<T>(
    url: string,
    options: RequestInit = {},
    useCache: boolean = false,
    cacheKey?: string
  ): Promise<ApiResponse<T>> {
    // 检查缓存
    if (useCache && cacheKey) {
      const cachedData = cache.get<ApiResponse<T>>(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      // 避免重复请求
      if (this.requestQueue.has(cacheKey)) {
        return this.requestQueue.get(cacheKey);
      }
    }

    const requestPromise = retry(async () => {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // 缓存成功的结果
      if (useCache && cacheKey && result.success) {
        cache.set(cacheKey, result, 5 * 60 * 1000); // 5分钟缓存
      }

      return result;
    }, 3, 1000);

    // 添加到请求队列
    if (useCache && cacheKey) {
      this.requestQueue.set(cacheKey, requestPromise);
      
      // 请求完成后清理队列
      requestPromise.finally(() => {
        this.requestQueue.delete(cacheKey);
      });
    }

    try {
      return await requestPromise;
    } catch (error) {
      console.error('Request error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '请求失败'
      };
    }
  }

  // 清除相关缓存
  private clearRelatedCache(): void {
    cache.clear();
  }

  // 认证相关
  async login(username: string, password: string): Promise<ApiResponse<{ token: string; user: AdminUser }>> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data?.token) {
        this.token = result.data.token;
        localStorage.setItem('admin_token', result.data.token);
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '登录失败'
      };
    }
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('admin_token');
  }

  async verifyAuth(): Promise<boolean> {
    if (!this.token) {
      console.debug('No token found for auth verification');
      return false;
    }

    try {
      console.debug('Verifying auth with token:', this.token.substring(0, 20) + '...');
      
      const response = await fetch(`${this.baseUrl}/admin/verify`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      console.debug('Auth verification response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.debug('Auth verification result:', result);
        return result.success === true;
      } else {
        const errorText = await response.text();
        console.debug('Auth verification failed:', response.status, errorText);
        return false;
      }
    } catch (error) {
      console.error('Auth verification error:', error);
      return false;
    }
  }

  // 项目相关 - 公开接口（带缓存）
  async getPublicProjects(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<ApiResponse<Project[]>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);

    const url = `${this.baseUrl}/projects?${searchParams}`;
    const cacheKey = generateCacheKey('public-projects', params || {});

    return this.request<Project[]>(url, { method: 'GET' }, true, cacheKey);
  }

  async getPublicProject(slug: string): Promise<ApiResponse<Project>> {
    const url = `${this.baseUrl}/projects/${slug}`;
    const cacheKey = generateCacheKey('public-project', { slug });

    return this.request<Project>(url, { method: 'GET' }, true, cacheKey);
  }

  // 项目相关 - 管理接口
  async getAdminProjects(params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<Project[]>> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.category) searchParams.append('category', params.category);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.search) searchParams.append('search', params.search);

      const response = await fetch(`${this.baseUrl}/admin/projects?${searchParams}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get admin projects error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取项目列表失败'
      };
    }
  }

  async getProject(id: string): Promise<ApiResponse<Project>> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/projects/${id}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get project error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取项目失败'
      };
    }
  }

  async createProject(data: ProjectFormData): Promise<ApiResponse<Project>> {
    const response = await this.request<Project>(
      `${this.baseUrl}/admin/projects`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    // 创建成功后清理相关缓存
    if (response.success) {
      this.clearRelatedCache();
    }

    return response;
  }

  async updateProject(id: string, data: ProjectFormData): Promise<ApiResponse<Project>> {
    const response = await this.request<Project>(
      `${this.baseUrl}/admin/projects/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );

    // 更新成功后清理相关缓存
    if (response.success) {
      this.clearRelatedCache();
    }

    return response;
  }

  async deleteProject(id: string): Promise<ApiResponse<void>> {
    const response = await this.request<void>(
      `${this.baseUrl}/admin/projects/${id}`,
      { method: 'DELETE' }
    );

    // 删除成功后清理相关缓存
    if (response.success) {
      this.clearRelatedCache();
    }

    return response;
  }

  // 获取所有项目（公开API）
  async getProjects(): Promise<ApiResponse<Project[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/projects`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get projects error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取项目列表失败'
      };
    }
  }

  // 按类型获取项目
  async getProjectsByType(type: string): Promise<ApiResponse<Project[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/projects?type=${encodeURIComponent(type)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get projects by type error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取项目列表失败'
      };
    }
  }

  // 搜索项目
  async searchProjects(query: string): Promise<ApiResponse<Project[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/projects/search?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Search projects error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '搜索失败'
      };
    }
  }

  // 测试连接
  async testConnection(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Test connection error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '连接测试失败'
      };
    }
  }

  // 文件上传（带进度）
  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<ProjectImage>> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve) => {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              resolve({
                success: false,
                error: '响应解析失败'
              });
            }
          } else {
            resolve({
              success: false,
              error: `HTTP error! status: ${xhr.status}`
            });
          }
        };

        xhr.onerror = () => {
          resolve({
            success: false,
            error: '网络错误'
          });
        };

        xhr.open('POST', `${this.baseUrl}/admin/upload`);
        
        // 设置请求头
        const headers = this.getFormHeaders();
        Object.entries(headers).forEach(([key, value]) => {
          if (key !== 'Content-Type' && typeof value === 'string') { // 不设置 Content-Type，让浏览器自动设置
            xhr.setRequestHeader(key, value);
          }
        });

        xhr.send(formData);
      });
    } catch (error) {
      console.error('Upload file error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '文件上传失败'
      };
    }
  }

  // 图片上传
  async uploadImage(file: File): Promise<ApiResponse<ProjectImage>> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${this.baseUrl}/admin/upload`, {
        method: 'POST',
        headers: this.getFormHeaders(),
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Upload image error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '图片上传失败'
      };
    }
  }
}

export const apiService = new ApiService();