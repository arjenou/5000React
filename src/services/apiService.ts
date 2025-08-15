/**
 * 前端API服务 - 与Cloudflare Worker后端通信
 */

// API配置 - 硬编码后端URL以避免环境变量问题
const API_BASE_URL = 'https://archdaily-5000react.wangyunjie1101.workers.dev';

// 请求超时时间
const REQUEST_TIMEOUT = 10000;

// 项目类型定义
export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  type: 'space_design' | 'study_tours' | 'exhibition_planning' | 'article' | 'news';
  status: 'draft' | 'published' | 'archived';
  author?: string;
  architect?: string;
  location?: string;
  area?: string;
  year?: number;
  photographer?: string;
  category?: string;
  tags?: string[];
  featured_image?: string;
  images?: string[];
  thumbnails?: string[];
  metadata?: {
    views: number;
    likes: number;
    bookmarks: number;
  };
  created_at: string;
  updated_at: string;
  published_at?: string;
  slug?: string;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 基础HTTP客户端类
class HttpClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.timeout = REQUEST_TIMEOUT;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('请求超时，请稍后重试');
      }
      
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// API服务类
class ApiService {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient();
  }

  // 健康检查
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.client.get('/health');
  }

  // 获取所有项目
  async getProjects(): Promise<ApiResponse<Project[]>> {
    return this.client.get('/api/projects');
  }

  // 根据类型获取项目
  async getProjectsByType(type: Project['type']): Promise<ApiResponse<Project[]>> {
    return this.client.get('/api/projects', { type });
  }

  // 根据分类获取项目
  async getProjectsByCategory(category: string): Promise<ApiResponse<Project[]>> {
    return this.client.get(`/api/projects/category/${encodeURIComponent(category)}`);
  }

  // 获取单个项目
  async getProject(id: string): Promise<ApiResponse<Project>> {
    return this.client.get(`/api/projects/${id}`);
  }

  // 搜索项目
  async searchProjects(query: string): Promise<ApiResponse<Project[]>> {
    return this.client.get('/api/projects/search', { q: query });
  }

  // 创建项目
  async createProject(project: Partial<Project>): Promise<ApiResponse<Project>> {
    return this.client.post('/api/projects', project);
  }

  // 更新项目
  async updateProject(id: string, project: Partial<Project>): Promise<ApiResponse<Project>> {
    return this.client.put(`/api/projects/${id}`, project);
  }

  // 删除项目
  async deleteProject(id: string): Promise<ApiResponse<void>> {
    return this.client.delete(`/api/projects/${id}`);
  }

  // 文件上传
  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{ url: string; name: string }>> {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('响应解析失败'));
          }
        } else {
          reject(new Error(`上传失败: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('网络错误'));
      });

      xhr.open('POST', `${API_BASE_URL}/api/upload`);
      xhr.send(formData);
    });
  }
}

// 导出单例实例
export const apiService = new ApiService();
export default apiService;
