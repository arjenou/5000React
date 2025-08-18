// 项目管理相关的TypeScript类型定义

export interface ProjectImage {
  original_url: string;
  alt: string;
  width: number;
  height: number;
  thumbnail_url: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  architect: string;
  location: string;
  category: string;
  type: 'space-design' | 'study-tours' | 'exhibition-planning';
  project_year: number;
  area?: number;
  budget?: number;
  client?: string;
  status: 'draft' | 'published';
  description?: string;
  details: string;
  tags?: string;
  featured?: boolean;
  images?: ProjectImage[];
  created_at: string;
  updated_at: string;
}

export interface ProjectFormData {
  title: string;
  slug?: string;
  architect: string;
  location: string;
  category: string;
  type: 'space-design' | 'study-tours' | 'exhibition-planning';
  project_year: number;
  area?: number;
  budget?: number;
  client?: string;
  status: 'draft' | 'published';
  description?: string;
  details: string;
  tags?: string;
  featured?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminUser {
  id: string;
  username: string;
  email?: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: AdminUser;
}
