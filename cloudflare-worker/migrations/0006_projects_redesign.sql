-- 重新设计 projects 表以符合新需求
DROP TABLE IF EXISTS projects;

CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  architect TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('空间设计', '专项游学', '展览策划')),
  area REAL,  -- 可选，单位 m²
  project_year INTEGER NOT NULL CHECK (project_year >= 1900 AND project_year <= strftime('%Y', 'now')),
  photographer TEXT,
  details TEXT NOT NULL,  -- 富文本内容，存储为 JSON
  images TEXT,  -- JSON array: [{"original_url": "", "alt": "", "width": 0, "height": 0, "thumbnail_url": ""}]
  slug TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以优化查询性能
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_year ON projects(project_year);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_created ON projects(created_at);
CREATE INDEX idx_projects_updated ON projects(updated_at);

-- 创建管理员用户表（简化版）
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'admin',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  last_login TEXT
);

-- 创建会话表
CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES admin_users(id)
);

-- 插入默认管理员用户 (用户名: admin, 密码: admin123)
-- 密码为 bcrypt hash
INSERT OR IGNORE INTO admin_users (id, username, password_hash, email, role) VALUES 
('admin-001', 'admin', '$2b$10$BZZYw./q1Lh4K4o4E4HLXeXR8O1hJQVZ8V5bX.9q7w8Qo9Qd8Qo8Q', 'admin@archdaily.com', 'admin');
