-- 修复 project_year 约束问题
-- 删除原有的 CHECK 约束中的 strftime 函数

-- 创建新的表，去掉有问题的约束
CREATE TABLE projects_new (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  architect TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('空间设计', '专项游学', '展览策划')),
  area REAL,  -- 可选，单位 m²
  project_year INTEGER NOT NULL CHECK (project_year >= 1900 AND project_year <= 2030),
  photographer TEXT,
  details TEXT NOT NULL,  -- 富文本内容，存储为 JSON
  images TEXT,  -- JSON array: [{"original_url": "", "alt": "", "width": 0, "height": 0, "thumbnail_url": ""}]
  slug TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 复制现有数据
INSERT INTO projects_new SELECT * FROM projects;

-- 删除原表
DROP TABLE projects;

-- 重命名新表
ALTER TABLE projects_new RENAME TO projects;
