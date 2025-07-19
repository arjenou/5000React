# ArchDaily Clone - React TypeScript

这是一个使用React TypeScript创建的ArchDaily建筑网站克隆项目。

## 项目特点

- 🏗️ **现代建筑设计** - 复刻了ArchDaily的专业建筑网站设计
- 📱 **响应式布局** - 完美适配桌面端和移动端
- 🔍 **搜索功能** - 内置搜索栏和建议功能
- 🏷️ **标签系统** - 热门建筑标签分类
- 📖 **文章系统** - 支持大图文章和标准文章布局
- 🌐 **中文支持** - 完全的中文界面和内容
- ⚡ **高性能** - 使用Vite构建，快速开发和构建

## 技术栈

- **React 18** - 现代React框架
- **TypeScript** - 类型安全的JavaScript
- **Vite** - 快速的构建工具
- **CSS3** - 现代CSS特性和响应式设计
- **Lucide React** - 美观的图标库

## 项目结构

```
src/
├── components/
│   ├── Header/           # 顶部导航组件
│   │   ├── Header.tsx
│   │   └── Header.css
│   └── ArticleCard/      # 文章卡片组件
│       ├── ArticleCard.tsx
│       └── ArticleCard.css
├── App.tsx              # 主应用组件
├── App.css              # 主样式文件
├── index.css            # 全局样式
└── main.tsx             # 应用入口
```

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 主要功能

### 1. 响应式导航
- 桌面端水平导航菜单
- 移动端汉堡菜单
- 搜索功能集成
- 语言选择器

### 2. 文章展示
- 网格布局的文章卡片
- 大图文章突出显示
- 悬停效果和动画
- 文章元信息（作者、日期、点赞数）

### 3. 侧边栏功能
- 热门标签云
- 推荐文章列表
- 粘性定位设计

### 4. 设计特色
- 专业的建筑网站配色方案
- 现代卡片式设计
- 渐变背景和阴影效果
- 平滑的过渡动画

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 开发说明

本项目基于ArchDaily中国站的设计进行开发，注重以下几个方面：

1. **用户体验** - 快速加载和流畅的交互
2. **可访问性** - 语义化HTML和ARIA标签
3. **性能优化** - 图片懒加载和代码分割
4. **代码质量** - TypeScript类型检查和模块化设计

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
