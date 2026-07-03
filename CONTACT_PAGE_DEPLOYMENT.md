# 联系页面本番构建

Cloudflare Pages 中修改前的本番 UI 来自部署 `aa9c5aa4`，与当前仓库的 React 源码并不一致。为避免改变现有 UI，联系页面通过 `scripts/add-contact-to-production.mjs` 添加到该本番构建中。

脚本只执行以下变更：

1. 将原导航中的“联系我们”按钮改为 `#/contact` 链接，保留原 class。
2. 添加 `#/contact` 路由、招聘文案、邮箱链接和二维码。
3. 在移动端“平面策划”下增加同样式的“联系我们”入口，桌面端隐藏该入口。
4. 在原 CSS 末尾追加独立的 `.contact-*` 样式，不修改任何原选择器。

生成命令：

```sh
node scripts/add-contact-to-production.mjs \
  <原本番构建目录> \
  <输出目录> \
  public/contact-wechat-qr.png
```

原本番构建来源：`https://aa9c5aa4.yukkuri-frontend.pages.dev`
