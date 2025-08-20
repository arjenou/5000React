# Cloudflare Pages 配置

## 构建设置
- 构建命令: `npm run build`
- 构建输出目录: `dist`
- 根目录: `/`

## 环境变量
- NODE_VERSION: `18`
- NPM_VERSION: `8`

## 部署分支
- 生产分支: `main`
- 预览分支: 所有其他分支

## 兼容性设置
- 兼容性日期: `2024-08-15`
- 兼容性标志: `nodejs_compat`

## 函数路由 (如果需要)
- `/api/*` -> 重定向到 Worker: `https://archdaily-5000react.wangyunjie1101.workers.dev/api/*`
