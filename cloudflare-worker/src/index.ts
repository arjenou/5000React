/**
 * Cloudflare Worker - ArchDaily Clone Backend API
 * 建筑项目管理系统
 */

export interface Env {
  DB: D1Database;
  R2_BUCKET: R2Bucket;
  ENVIRONMENT: string;
  CORS_ORIGIN: string;
  JWT_SECRET: string;
}

// 项目数据类型定义
interface ProjectImage {
  original_url: string;
  alt: string;
  width: number;
  height: number;
  thumbnail_url: string;
}

interface Project {
  id: string;
  title: string;
  architect: string;
  location: string;
  category: '空间设计' | '专项游学' | '展览策划';
  area?: number;
  project_year: number;
  photographer?: string;
  details: string; // 富文本内容 JSON
  images: ProjectImage[];
  slug: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

// 管理员用户类型
interface AdminUser {
  id: string;
  username: string;
  email?: string;
  role: string;
}

// JWT payload 类型
interface JWTPayload {
  userId: string;
  username: string;
  exp: number;
}

// 项目数据输入类型
interface ProjectInput {
  title?: string;
  architect?: string;
  location?: string;
  category?: string;
  area?: number;
  project_year?: number;
  photographer?: string;
  details?: any;
  images?: ProjectImage[];
  slug?: string;
  status?: string;
  [key: string]: any;
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

// 生成唯一ID
function generateId(): string {
  return crypto.randomUUID();
}

// 生成 slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/\s+/g, '-') // 替换空格为连字符
    .replace(/-+/g, '-') // 合并多个连字符
    .trim();
}

// 简单的JWT签名和验证（生产环境应使用更安全的实现）
async function signJWT(payload: JWTPayload, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  
  const data = `${encodedHeader}.${encodedPayload}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));
  
  return `${data}.${encodedSignature}`;
}

async function verifyJWT(token: string, secret: string): Promise<JWTPayload | null> {
  try {
    const [header, payload, signature] = token.split('.');
    const data = `${header}.${payload}`;
    
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const signatureBuffer = Uint8Array.from(atob(signature), c => c.charCodeAt(0));
    const isValid = await crypto.subtle.verify('HMAC', key, signatureBuffer, new TextEncoder().encode(data));
    
    if (!isValid) return null;
    
    const decodedPayload = JSON.parse(atob(payload)) as JWTPayload;
    
    // 检查过期时间
    if (decodedPayload.exp < Date.now() / 1000) return null;
    
    return decodedPayload;
  } catch {
    return null;
  }
}

// 验证管理员权限
async function verifyAdmin(request: Request, env: Env): Promise<AdminUser | null> {
  const authorization = request.headers.get('Authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authorization.slice(7);
  
  // 临时简化验证 - 允许特定token进行测试
  if (token === 'test-admin-token') {
    return {
      id: 'test-admin',
      username: 'admin',
      email: 'admin@test.com',
      role: 'admin'
    };
  }
  
  const payload = await verifyJWT(token, env.JWT_SECRET || 'default-secret');
  
  if (!payload) return null;
  
  try {
    // 从数据库验证用户
    const user = await env.DB.prepare(`
      SELECT id, username, email, role FROM admin_users WHERE id = ?
    `).bind(payload.userId).first();
    
    return user ? user as unknown as AdminUser : null;
  } catch (error) {
    console.error('Database error in verifyAdmin:', error);
    return null;
  }
}

// 管理员登录
async function handleAdminLogin(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as { username?: string; password?: string };
    const { username, password } = body;
    
    if (!username || !password) {
      return createResponse({
        success: false,
        error: '用户名和密码不能为空',
      }, 400, request, env);
    }
    
    // 临时硬编码管理员账户
    if (username === 'admin' && (password === 'admin123' || password === 'admin')) {
      const token = 'test-admin-token';
      
      return createResponse({
        success: true,
        data: {
          token,
          user: {
            id: 'test-admin',
            username: 'admin',
            email: 'admin@test.com',
            role: 'admin',
          },
        },
        message: '登录成功',
      }, 200, request, env);
    }
    
    try {
      // 查找用户
      const user = await env.DB.prepare(`
        SELECT id, username, password_hash, email, role FROM admin_users WHERE username = ?
      `).bind(username).first();
      
      if (!user) {
        return createResponse({
          success: false,
          error: '用户名或密码错误',
        }, 401, request, env);
      }
      
      // 简化的密码验证（生产环境应使用 bcrypt）
      // 对于演示，我们允许用户名为 admin，密码为 admin123
      const isValidPassword = password === 'admin123' || password === 'admin' || user.password_hash === password;
      
      if (!isValidPassword) {
        return createResponse({
          success: false,
          error: '用户名或密码错误',
        }, 401, request, env);
      }
      
      // 生成JWT token
      const payload: JWTPayload = {
        userId: user.id as string,
        username: user.username as string,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24小时过期
      };
      
      const token = await signJWT(payload, env.JWT_SECRET || 'default-secret');
      
      return createResponse({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        },
        message: '登录成功',
      }, 200, request, env);
    } catch (dbError) {
      console.error('Database error:', dbError);
      // 如果数据库查询失败，使用临时硬编码管理员账户
      if (username === 'admin' && (password === 'admin123' || password === 'admin')) {
        const token = 'test-admin-token';
        
        return createResponse({
          success: true,
          data: {
            token,
            user: {
              id: 'test-admin',
              username: 'admin',
              email: 'admin@test.com',
              role: 'admin',
            },
          },
          message: '登录成功（使用临时账户）',
        }, 200, request, env);
      }
      
      return createResponse({
        success: false,
        error: '数据库连接错误',
      }, 500, request, env);
    }
  } catch (error) {
    console.error('Login error:', error);
    return createResponse({
      success: false,
      error: '登录失败',
    }, 500, request, env);
  }
}

// 管理员身份验证
async function handleAdminVerify(request: Request, env: Env): Promise<Response> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createResponse({
        success: false,
        error: '未提供认证令牌',
      }, 401, request, env);
    }

    const token = authHeader.substring(7);
    const payload = await verifyJWT(token, env.JWT_SECRET || 'default-secret');
    
    if (!payload) {
      return createResponse({
        success: false,
        error: '无效的认证令牌',
      }, 401, request, env);
    }

    // 验证用户是否仍然存在
    const user = await env.DB.prepare(`
      SELECT id, username, email, role FROM admin_users WHERE id = ?
    `).bind(payload.userId).first();

    if (!user) {
      return createResponse({
        success: false,
        error: '用户不存在',
      }, 401, request, env);
    }

    return createResponse({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    }, 200, request, env);
    
  } catch (error) {
    console.error('Verify error:', error);
    return createResponse({
      success: false,
      error: '验证失败',
    }, 500, request, env);
  }
}

// 前台获取项目列表（公开接口）
async function handleGetProjects(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '12');
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    
    let query = `
      SELECT id, title, architect, location, category, area, project_year, 
             photographer, images, slug, created_at, updated_at
      FROM projects 
      WHERE status = 'published'
    `;
    
    const params: any[] = [];
    
    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (search) {
      query += ' AND (title LIKE ? OR architect LIKE ? OR location LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    
    // 获取总数
    const countQuery = query.replace(/SELECT.*FROM/, 'SELECT COUNT(*) as total FROM');
    const countResult = await env.DB.prepare(countQuery).bind(...params).first();
    const total = (countResult?.total as number) || 0;
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);
    
    const result = await env.DB.prepare(query).bind(...params).all();
    
    const projects = result.results?.map((row: any) => ({
      ...row,
      images: row.images ? JSON.parse(row.images) : [],
      area: row.area ? parseFloat(row.area) : null,
    })) || [];
    
    return createResponse({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
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

// 前台获取项目详情（公开接口）
async function handleGetProject(request: Request, env: Env, slug: string): Promise<Response> {
  try {
    const result = await env.DB.prepare(`
      SELECT * FROM projects WHERE slug = ? AND status = 'published'
    `).bind(slug).first();
    
    if (!result) {
      return createResponse({
        success: false,
        error: '项目未找到',
      }, 404, request, env);
    }
    
    const project = {
      ...result,
      images: result.images ? JSON.parse(result.images as string) : [],
      details: result.details ? JSON.parse(result.details as string) : {},
      area: result.area ? parseFloat(result.area as string) : null,
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

// 管理后台获取项目列表
async function handleAdminGetProjects(request: Request, env: Env): Promise<Response> {
  try {
    const admin = await verifyAdmin(request, env);
    if (!admin) {
      return createResponse({
        success: false,
        error: '无权限访问',
      }, 401, request, env);
    }
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    
    let query = `
      SELECT id, title, architect, location, category, area, project_year, 
             status, slug, created_at, updated_at
      FROM projects 
      WHERE 1=1
    `;
    
    const params: any[] = [];
    
    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (search) {
      query += ' AND (title LIKE ? OR architect LIKE ? OR location LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    
    // 获取总数
    const countQuery = query.replace(/SELECT.*FROM/, 'SELECT COUNT(*) as total FROM');
    const countResult = await env.DB.prepare(countQuery).bind(...params).first();
    const total = (countResult?.total as number) || 0;
    
    query += ' ORDER BY updated_at DESC LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);
    
    const result = await env.DB.prepare(query).bind(...params).all();
    
    const projects = result.results?.map((row: any) => ({
      ...row,
      area: row.area ? parseFloat(row.area) : null,
    })) || [];
    
    return createResponse({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }, 200, request, env);
    
  } catch (error) {
    console.error('Error fetching admin projects:', error);
    return createResponse({
      success: false,
      error: '获取项目列表失败',
    }, 500, request, env);
  }
}

// 管理后台获取单个项目详情
async function handleAdminGetProject(request: Request, env: Env, projectId: string): Promise<Response> {
  try {
    const admin = await verifyAdmin(request, env);
    if (!admin) {
      return createResponse({
        success: false,
        error: '无权限访问',
      }, 401, request, env);
    }
    
    const result = await env.DB.prepare(`
      SELECT * FROM projects WHERE id = ?
    `).bind(projectId).first();
    
    if (!result) {
      return createResponse({
        success: false,
        error: '项目未找到',
      }, 404, request, env);
    }
    
    const project = {
      ...result,
      images: result.images ? JSON.parse(result.images as string) : [],
      details: result.details ? JSON.parse(result.details as string) : {},
      area: result.area ? parseFloat(result.area as string) : null,
    };
    
    return createResponse({
      success: true,
      data: project,
    }, 200, request, env);
    
  } catch (error) {
    console.error('Error fetching admin project:', error);
    return createResponse({
      success: false,
      error: '获取项目详情失败',
    }, 500, request, env);
  }
}

// 管理后台创建项目
async function handleAdminCreateProject(request: Request, env: Env): Promise<Response> {
  try {
    const admin = await verifyAdmin(request, env);
    if (!admin) {
      return createResponse({
        success: false,
        error: '无权限访问',
      }, 401, request, env);
    }
    
    const projectData = await request.json() as ProjectInput;
    
    // 验证必填字段
    const requiredFields = ['title', 'architect', 'location', 'category', 'project_year', 'details'];
    for (const field of requiredFields) {
      if (!projectData[field]) {
        return createResponse({
          success: false,
          error: `字段 ${field} 为必填项`,
        }, 400, request, env);
      }
    }
    
    // 验证类别
    const validCategories = ['空间设计', '专项游学', '展览策划'];
    if (!validCategories.includes(projectData.category!)) {
      return createResponse({
        success: false,
        error: '无效的项目类别',
      }, 400, request, env);
    }
    
    // 验证年份
    const currentYear = new Date().getFullYear();
    if (projectData.project_year! < 1900 || projectData.project_year! > currentYear) {
      return createResponse({
        success: false,
        error: `项目年份必须在 1900 到 ${currentYear} 之间`,
      }, 400, request, env);
    }
    
    // 生成ID和slug
    const id = generateId();
    let slug = projectData.slug || generateSlug(projectData.title!);
    
    // 检查slug唯一性
    const existingProject = await env.DB.prepare(`
      SELECT id FROM projects WHERE slug = ?
    `).bind(slug).first();
    
    if (existingProject) {
      slug = `${slug}-${Date.now()}`;
    }
    
    const now = new Date().toISOString();
    
    await env.DB.prepare(`
      INSERT INTO projects (
        id, title, architect, location, category, area, project_year, 
        photographer, details, images, slug, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      projectData.title,
      projectData.architect,
      projectData.location,
      projectData.category,
      projectData.area || null,
      projectData.project_year,
      projectData.photographer || null,
      JSON.stringify(projectData.details),
      JSON.stringify(projectData.images || []),
      slug,
      projectData.status || 'draft',
      now,
      now
    ).run();
    
    return createResponse({
      success: true,
      data: { id, slug },
      message: '项目创建成功',
    }, 201, request, env);
    
  } catch (error) {
    console.error('Error creating project:', error);
    
    // 提供更详细的错误信息
    let errorMessage = '创建项目失败';
    if (error instanceof Error) {
      errorMessage = `创建项目失败: ${error.message}`;
    }
    
    return createResponse({
      success: false,
      error: errorMessage,
    }, 500, request, env);
  }
}

// 管理后台更新项目
async function handleAdminUpdateProject(request: Request, env: Env, projectId: string): Promise<Response> {
  try {
    const admin = await verifyAdmin(request, env);
    if (!admin) {
      return createResponse({
        success: false,
        error: '无权限访问',
      }, 401, request, env);
    }
    
    const projectData = await request.json() as ProjectInput;
    
    // 检查项目是否存在
    const existingProject = await env.DB.prepare(`
      SELECT id, slug FROM projects WHERE id = ?
    `).bind(projectId).first();
    
    if (!existingProject) {
      return createResponse({
        success: false,
        error: '项目不存在',
      }, 404, request, env);
    }
    
    // 如果是发布状态，验证必填字段
    if (projectData.status === 'published') {
      const requiredFields = ['title', 'architect', 'location', 'category', 'project_year', 'details'];
      for (const field of requiredFields) {
        if (!projectData[field]) {
          return createResponse({
            success: false,
            error: `发布时字段 ${field} 为必填项`,
          }, 400, request, env);
        }
      }
    }
    
    // 验证类别
    if (projectData.category) {
      const validCategories = ['空间设计', '专项游学', '展览策划'];
      if (!validCategories.includes(projectData.category)) {
        return createResponse({
          success: false,
          error: '无效的项目类别',
        }, 400, request, env);
      }
    }
    
    // 验证年份
    if (projectData.project_year) {
      const currentYear = new Date().getFullYear();
      if (projectData.project_year < 1900 || projectData.project_year > currentYear) {
        return createResponse({
          success: false,
          error: `项目年份必须在 1900 到 ${currentYear} 之间`,
        }, 400, request, env);
      }
    }
    
    // 处理slug更新
    let slug = projectData.slug;
    if (slug && slug !== existingProject.slug) {
      const slugExists = await env.DB.prepare(`
        SELECT id FROM projects WHERE slug = ? AND id != ?
      `).bind(slug, projectId).first();
      
      if (slugExists) {
        return createResponse({
          success: false,
          error: 'URL 别名已存在',
        }, 400, request, env);
      }
    }
    
    const now = new Date().toISOString();
    
    // 构建更新查询
    const updateFields = [];
    const updateParams = [];
    
    if (projectData.title !== undefined) {
      updateFields.push('title = ?');
      updateParams.push(projectData.title);
    }
    
    if (projectData.architect !== undefined) {
      updateFields.push('architect = ?');
      updateParams.push(projectData.architect);
    }
    
    if (projectData.location !== undefined) {
      updateFields.push('location = ?');
      updateParams.push(projectData.location);
    }
    
    if (projectData.category !== undefined) {
      updateFields.push('category = ?');
      updateParams.push(projectData.category);
    }
    
    if (projectData.area !== undefined) {
      updateFields.push('area = ?');
      updateParams.push(projectData.area);
    }
    
    if (projectData.project_year !== undefined) {
      updateFields.push('project_year = ?');
      updateParams.push(projectData.project_year);
    }
    
    if (projectData.photographer !== undefined) {
      updateFields.push('photographer = ?');
      updateParams.push(projectData.photographer);
    }
    
    if (projectData.details !== undefined) {
      updateFields.push('details = ?');
      updateParams.push(JSON.stringify(projectData.details));
    }
    
    if (projectData.images !== undefined) {
      updateFields.push('images = ?');
      updateParams.push(JSON.stringify(projectData.images));
    }
    
    if (slug !== undefined) {
      updateFields.push('slug = ?');
      updateParams.push(slug);
    }
    
    if (projectData.status !== undefined) {
      updateFields.push('status = ?');
      updateParams.push(projectData.status);
    }
    
    updateFields.push('updated_at = ?');
    updateParams.push(now);
    
    updateParams.push(projectId);
    
    await env.DB.prepare(`
      UPDATE projects SET ${updateFields.join(', ')} WHERE id = ?
    `).bind(...updateParams).run();
    
    return createResponse({
      success: true,
      message: '项目更新成功',
    }, 200, request, env);
    
  } catch (error) {
    console.error('Error updating project:', error);
    return createResponse({
      success: false,
      error: '更新项目失败',
    }, 500, request, env);
  }
}

// 管理后台删除项目
async function handleAdminDeleteProject(request: Request, env: Env, projectId: string): Promise<Response> {
  try {
    const admin = await verifyAdmin(request, env);
    if (!admin) {
      return createResponse({
        success: false,
        error: '无权限访问',
      }, 401, request, env);
    }
    
    const result = await env.DB.prepare(`
      DELETE FROM projects WHERE id = ?
    `).bind(projectId).run();
    
    if (result.meta.changes === 0) {
      return createResponse({
        success: false,
        error: '项目不存在',
      }, 404, request, env);
    }
    
    return createResponse({
      success: true,
      message: '项目删除成功',
    }, 200, request, env);
    
  } catch (error) {
    console.error('Error deleting project:', error);
    return createResponse({
      success: false,
      error: '删除项目失败',
    }, 500, request, env);
  }
}

// 上传图片到R2
async function handleUploadImage(request: Request, env: Env): Promise<Response> {
  try {
    const admin = await verifyAdmin(request, env);
    if (!admin) {
      return createResponse({
        success: false,
        error: '无权限访问',
      }, 401, request, env);
    }
    
    const formData = await request.formData();
    const file = formData.get('file') as unknown as File;
    
    if (!file) {
      return createResponse({
        success: false,
        error: '未找到文件',
      }, 400, request, env);
    }
    
    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return createResponse({
        success: false,
        error: '只支持 JPG、PNG、WebP 格式的图片',
      }, 400, request, env);
    }
    
    // 验证文件大小 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return createResponse({
        success: false,
        error: '文件大小不能超过 10MB',
      }, 400, request, env);
    }
    
    // 生成文件名
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    
    // 上传原图
    await env.R2_BUCKET.put(fileName, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    });
    
    // 这里应该生成缩略图，但为了简化，我们先跳过这一步
    // 在实际生产环境中，你需要使用 image processing library
    const originalUrl = `https://your-r2-domain.com/${fileName}`;
    const thumbnailUrl = originalUrl; // 暂时使用原图
    
    // 返回图片信息
    const imageInfo = {
      original_url: originalUrl,
      thumbnail_url: thumbnailUrl,
      alt: file.name,
      width: 0, // 这里应该从图片文件中读取
      height: 0, // 这里应该从图片文件中读取
    };
    
    return createResponse({
      success: true,
      data: imageInfo,
    }, 200, request, env);
    
  } catch (error) {
    console.error('Error uploading image:', error);
    return createResponse({
      success: false,
      error: '上传图片失败',
    }, 500, request, env);
  }
}

// 主处理函数
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;
    const method = request.method;

    // 处理 CORS 预检请求
    if (method === 'OPTIONS') {
      return handleOptions(request, env);
    }

    try {
      // 健康检查
      if (pathname === '/health') {
        return createResponse({
          status: 'ok',
          timestamp: new Date().toISOString(),
          environment: env.ENVIRONMENT,
        }, 200, request, env);
      }

      // 管理员登录
      if (pathname === '/api/admin/login' && method === 'POST') {
        return await handleAdminLogin(request, env);
      }

      // 管理员身份验证
      if (pathname === '/api/admin/verify' && method === 'GET') {
        return await handleAdminVerify(request, env);
      }

      // 前台公开 API
      if (pathname === '/api/projects' && method === 'GET') {
        return await handleGetProjects(request, env);
      }

      if (pathname.match(/^\/api\/projects\/[^\/]+$/) && method === 'GET') {
        const slug = pathname.split('/').pop()!;
        return await handleGetProject(request, env, slug);
      }

      // 管理后台 API
      if (pathname === '/api/admin/projects' && method === 'GET') {
        return await handleAdminGetProjects(request, env);
      }

      if (pathname === '/api/admin/projects' && method === 'POST') {
        return await handleAdminCreateProject(request, env);
      }

      if (pathname.match(/^\/api\/admin\/projects\/[^\/]+$/) && method === 'GET') {
        const projectId = pathname.split('/').pop()!;
        return await handleAdminGetProject(request, env, projectId);
      }

      if (pathname.match(/^\/api\/admin\/projects\/[^\/]+$/) && method === 'PUT') {
        const projectId = pathname.split('/').pop()!;
        return await handleAdminUpdateProject(request, env, projectId);
      }

      if (pathname.match(/^\/api\/admin\/projects\/[^\/]+$/) && method === 'DELETE') {
        const projectId = pathname.split('/').pop()!;
        return await handleAdminDeleteProject(request, env, projectId);
      }

      // 图片上传
      if (pathname === '/api/admin/upload' && method === 'POST') {
        return await handleUploadImage(request, env);
      }

      // 404 处理
      return createResponse({
        success: false,
        error: 'API 端点未找到',
      }, 404, request, env);

    } catch (error) {
      console.error('Request processing error:', error);
      return createResponse({
        success: false,
        error: '服务器内部错误',
      }, 500, request, env);
    }
  },
};
