# 项目内容管理指南

## 如何添加新的项目内容

### 1. 编辑内容数据文件
文件位置: `src/data/projectContent.ts`

### 2. 支持的内容类型

#### 文本块 (type: 'text')
```typescript
{
  id: 'unique-id',
  type: 'text',
  title: '可选标题',
  content: '文案内容...'
}
```

#### 图片块 (type: 'image')
```typescript
{
  id: 'unique-id',
  type: 'image',
  imageUrl: 'https://example.com/image.jpg',
  imageAlt: '图片描述',
  imageCaption: '© 摄影师姓名'
}
```

#### 图文混排块 (type: 'image-text')
```typescript
{
  id: 'unique-id',
  type: 'image-text',
  title: '标题',
  content: '文案内容...',
  imageUrl: 'https://example.com/image.jpg',
  imageAlt: '图片描述',
  imageCaption: '图片说明'
}
```

### 3. 添加新项目内容的步骤

1. 在 `projectContentData` 数组中找到对应的项目ID
2. 在该项目的 `blocks` 数组中添加新的内容块
3. 确保每个内容块都有唯一的ID
4. 按照显示顺序排列内容块

### 4. 示例：为项目添加新内容

```typescript
{
  projectId: 1,
  blocks: [
    {
      id: 'intro-text',
      type: 'text',
      content: '项目介绍文案...'
    },
    {
      id: 'main-image',
      type: 'image',
      imageUrl: 'https://example.com/main.jpg',
      imageAlt: '主要图片',
      imageCaption: '© 摄影师'
    },
    {
      id: 'design-analysis',
      type: 'text',
      title: '设计分析',
      content: '详细的设计分析...'
    },
    {
      id: 'detail-image-text',
      type: 'image-text',
      title: '细节展示',
      content: '关于细节的说明...',
      imageUrl: 'https://example.com/detail.jpg',
      imageAlt: '细节图',
      imageCaption: '精心设计的细节'
    }
  ]
}
```

### 5. 图片资源建议

- 推荐使用高质量的图片（1200px以上宽度）
- 支持常见格式：JPG, PNG, WebP
- 建议使用图片CDN服务（如Unsplash、自建CDN等）
- 为每张图片提供合适的alt文本，提升可访问性

### 6. 文案编写建议

- 段落之间保持适当间距
- 使用清晰、专业的建筑术语
- 结构化内容，避免过长的段落
- 考虑中英文混排的美观性

这样的设计让内容管理变得非常灵活，你只需要编辑数据文件就能轻松管理所有项目的展示内容！
