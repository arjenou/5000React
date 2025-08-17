/**
 * Cloudflare Worker - ArchDaily Clone Backend API
 */

export interface Env {
  DB: D1Database;
  R2_BUCKET: R2Bucket;
  ENVIRONMENT: string;
  CORS_ORIGIN: string;
}

// CORS头部配置
function getCorsHeaders(request: Request, env: Env): HeadersInit {
  const origin = request.headers.get('Origin');
  const allowedOrigins = env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'];
  
  const corsHeaders: HeadersInit = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
  };

  if (origin && allowedOrigins.some(allowed => allowed.trim() === origin)) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
  } else {
    corsHeaders['Access-Control-Allow-Origin'] = allowedOrigins[0];
  }

  return corsHeaders;
}

// 处理OPTIONS预检请求
function handleOptions(request: Request, env: Env): Response {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request, env),
  });
}

// 创建响应
function createResponse(data: any, status: number = 200, request: Request, env: Env): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...getCorsHeaders(request, env),
    },
  });
}

// 健康检查
async function handleHealth(request: Request, env: Env): Promise<Response> {
  return createResponse({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.ENVIRONMENT,
  }, 200, request, env);
}

// 获取项目列表
async function handleGetProjects(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const category = url.searchParams.get('category');
    const type = url.searchParams.get('type');
    
    let query = `
      SELECT id, title, subtitle, excerpt, type, status, author, architect, 
             location, area, year, photographer, category, tags, 
             featured_image, images, thumbnails, metadata,
             created_at, updated_at, published_at
      FROM projects 
      WHERE status = 'published'
    `;
    
    const params: any[] = [];
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY published_at DESC LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);
    
    const result = await env.DB.prepare(query).bind(...params).all();
    
    const projects = result.results?.map((row: any) => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : [],
      images: row.images ? JSON.parse(row.images) : [],
      thumbnails: row.thumbnails ? JSON.parse(row.thumbnails) : [],
      metadata: row.metadata ? JSON.parse(row.metadata) : { views: 0, likes: 0, bookmarks: 0 },
    })) || [];
    
    return createResponse({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total: result.results?.length || 0,
      },
    }, 200, request, env);
    
  } catch (error) {
    console.error('Error fetching projects:', error);
    return createResponse({
      success: false,
      error: '获取项目列表失败',
    }, 500, request, env);
  }
}

// 获取项目详情
async function handleGetProject(request: Request, env: Env, projectId: string): Promise<Response> {
  try {
    const result = await env.DB.prepare(`
      SELECT * FROM projects WHERE id = ? AND status = 'published'
    `).bind(projectId).first();
    
    if (!result) {
      return createResponse({
        success: false,
        error: '项目未找到',
      }, 404, request, env);
    }
    
    const project = {
      ...result,
      tags: result.tags ? JSON.parse(result.tags as string) : [],
      images: result.images ? JSON.parse(result.images as string) : [],
      thumbnails: result.thumbnails ? JSON.parse(result.thumbnails as string) : [],
      metadata: result.metadata ? JSON.parse(result.metadata as string) : { views: 0, likes: 0, bookmarks: 0 },
    };
    
    return createResponse({
      success: true,
      data: project,
    }, 200, request, env);
    
  } catch (error) {
    console.error('Error fetching project:', error);
    return createResponse({
      success: false,
      error: '获取项目详情失败',
    }, 500, request, env);
  }
}

// 搜索项目
async function handleSearch(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    if (!query.trim()) {
      return createResponse({
        success: false,
        error: '搜索关键词不能为空',
      }, 400, request, env);
    }
    
    const searchQuery = `%${query}%`;
    const result = await env.DB.prepare(`
      SELECT id, title, subtitle, excerpt, type, status, author, architect,
             location, area, year, photographer, category, tags,
             featured_image, images, thumbnails, metadata,
             created_at, updated_at, published_at
      FROM projects 
      WHERE status = 'published' 
        AND (title LIKE ? OR excerpt LIKE ? OR category LIKE ? OR location LIKE ?)
      ORDER BY published_at DESC 
      LIMIT ? OFFSET ?
    `).bind(searchQuery, searchQuery, searchQuery, searchQuery, limit, (page - 1) * limit).all();
    
    const projects = result.results?.map((row: any) => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : [],
      images: row.images ? JSON.parse(row.images) : [],
      thumbnails: row.thumbnails ? JSON.parse(row.thumbnails) : [],
      metadata: row.metadata ? JSON.parse(row.metadata) : { views: 0, likes: 0, bookmarks: 0 },
    })) || [];
    
    return createResponse({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total: result.results?.length || 0,
      },
    }, 200, request, env);
    
  } catch (error) {
    console.error('Error searching projects:', error);
    return createResponse({
      success: false,
      error: '搜索失败',
    }, 500, request, env);
  }
}

// 获取分类列表
async function handleGetCategories(request: Request, env: Env): Promise<Response> {
  try {
    const result = await env.DB.prepare(`
      SELECT DISTINCT category, COUNT(*) as count
      FROM projects 
      WHERE status = 'published' AND category IS NOT NULL
      GROUP BY category
      ORDER BY count DESC
    `).all();
    
    return createResponse({
      success: true,
      data: result.results || [],
    }, 200, request, env);
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return createResponse({
      success: false,
      error: '获取分类列表失败',
    }, 500, request, env);
  }
}

// 主请求处理器
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // 处理OPTIONS预检请求
    if (request.method === 'OPTIONS') {
      return handleOptions(request, env);
    }
    
    // 路由处理
    if (url.pathname === '/health') {
      return handleHealth(request, env);
    }
    
    if (url.pathname === '/api/projects') {
      if (request.method === 'GET') {
        return handleGetProjects(request, env);
      }
    }
    
    if (url.pathname.startsWith('/api/projects/')) {
      const projectId = url.pathname.split('/').pop();
      if (projectId && request.method === 'GET') {
        return handleGetProject(request, env, projectId);
      }
    }
    
    if (url.pathname === '/api/search') {
      if (request.method === 'GET') {
        return handleSearch(request, env);
      }
    }
    
    if (url.pathname === '/api/categories') {
      if (request.method === 'GET') {
        return handleGetCategories(request, env);
      }
    }
    
    // 404 - 路由未找到
    return createResponse({
      success: false,
      error: '路由未找到',
    }, 404, request, env);
  },
};
