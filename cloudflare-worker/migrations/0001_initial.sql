-- 创建项目表
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  excerpt TEXT,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'published',
  author TEXT,
  architect TEXT,
  location TEXT,
  area TEXT,
  year INTEGER,
  photographer TEXT,
  category TEXT,
  tags TEXT, -- JSON array as text
  featured_image TEXT,
  images TEXT, -- JSON array as text
  thumbnails TEXT, -- JSON array as text
  metadata TEXT, -- JSON object as text
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  published_at TEXT DEFAULT CURRENT_TIMESTAMP,
  slug TEXT
);