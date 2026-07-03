import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const [sourceDirectory, outputDirectory, qrSource] = process.argv.slice(2);

if (!sourceDirectory || !outputDirectory || !qrSource) {
  throw new Error('Usage: node scripts/add-contact-to-production.mjs <source-dir> <output-dir> <qr-source>');
}

const sourceScriptName = 'index-DHKmZtn5.js';
const sourceStyleName = 'index-XWe7HBlg.css';
const outputScriptName = 'index-contact-page-v1.js';
const outputStyleName = 'index-contact-page-v1.css';

const sourceScriptPath = join(sourceDirectory, 'assets', sourceScriptName);
const sourceStylePath = join(sourceDirectory, 'assets', sourceStyleName);
const outputScriptPath = join(outputDirectory, 'assets', outputScriptName);
const outputStylePath = join(outputDirectory, 'assets', outputStyleName);

let script = await readFile(sourceScriptPath, 'utf8');
const contactButton = 'd.jsx("button",{className:"nav-link contact-btn-nav",children:"联系我们"})';
const contactLink = 'd.jsx(Ht,{to:"/contact",className:"nav-link contact-btn-nav",children:"联系我们"})';

if (!script.includes(contactButton)) {
  throw new Error('Existing contact navigation button was not found in the production bundle.');
}

script = script.replace(contactButton, contactLink);

const projectRoute = 'd.jsx(ti,{path:"/project/:id",element:d.jsx(wy,{})})]})';
const contactRoute = 'd.jsx(ti,{path:"/project/:id",element:d.jsx(wy,{})}),d.jsx(ti,{path:"/contact",element:d.jsx("main",{className:"contact-page",children:d.jsxs("section",{className:"contact-card",children:[d.jsx("h1",{children:"联系我们"}),d.jsxs("p",{className:"contact-recruitment",children:["本公司常年招聘优秀人才，有意者联系：",d.jsx("a",{href:"mailto:zhangxinfu@yukkuri.com.cn",children:"zhangxinfu@yukkuri.com.cn"})]}),d.jsxs("figure",{className:"contact-qr",children:[d.jsx("img",{src:"/contact-wechat-qr.png",alt:"联系微信二维码",width:333,height:323}),d.jsx("figcaption",{children:"微信扫码联系"})]})]})})})]})';

if (!script.includes(projectRoute)) {
  throw new Error('Route insertion point was not found in the production bundle.');
}

script = script.replace(projectRoute, contactRoute);
await writeFile(outputScriptPath, script);

const originalStyles = await readFile(sourceStylePath, 'utf8');
const contactStyles = `
.contact-page{min-height:calc(100vh - 60px);padding:72px 20px;background:#f7f8fa}
.contact-card{max-width:760px;margin:0 auto;padding:52px;background:#fff;border:1px solid #eee;border-radius:12px;text-align:center}
.contact-card h1{margin:0 0 24px;color:#222;font-size:36px;font-weight:600}
.contact-recruitment{margin:0;color:#444;font-size:18px;line-height:1.8}
.contact-recruitment a{color:#1e5ba8;text-decoration:none;overflow-wrap:anywhere}
.contact-recruitment a:hover{text-decoration:underline}
.contact-qr{width:min(100%,333px);margin:36px auto 0}
.contact-qr img{display:block;width:100%;height:auto}
.contact-qr figcaption{margin-top:12px;color:#777;font-size:14px}
@media(max-width:768px){.contact-page{padding:40px 16px}.contact-card{padding:32px 20px}.contact-card h1{font-size:28px}.contact-recruitment{font-size:16px}}
`;

await writeFile(outputStylePath, `${originalStyles}${contactStyles}`);

let html = await readFile(join(sourceDirectory, 'index.html'), 'utf8');
html = html
  .replace(`/assets/${sourceScriptName}`, `/assets/${outputScriptName}`)
  .replace(`/assets/${sourceStyleName}`, `/assets/${outputStyleName}`);
await writeFile(join(outputDirectory, 'index.html'), html);

await copyFile(join(sourceDirectory, 'logo.png'), join(outputDirectory, 'logo.png'));
await copyFile(qrSource, join(outputDirectory, 'contact-wechat-qr.png'));

console.log('Contact page production bundle created without modifying existing UI selectors.');
