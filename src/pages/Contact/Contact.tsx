import React from 'react';
import { Mail } from 'lucide-react';
import './Contact.css';

const Contact: React.FC = () => {
  return (
    <main className="contact-page">
      <div className="contact-page-container">
        <header className="contact-page-header">
          <p className="contact-page-eyebrow">CONTACT US</p>
          <h1>联系我们</h1>
          <p>期待与你相遇，也欢迎优秀人才加入我们。</p>
        </header>

        <section className="recruitment-card" aria-labelledby="recruitment-title">
          <div className="recruitment-copy">
            <p className="recruitment-label">人才招聘</p>
            <h2 id="recruitment-title">本公司常年招聘优秀人才</h2>
            <p>有意者联系：</p>
            <a
              className="recruitment-email"
              href="mailto:zhangxinfu@yukkuri.com.cn"
            >
              <Mail size={20} aria-hidden="true" />
              <span>zhangxinfu@yukkuri.com.cn</span>
            </a>
          </div>

          <figure className="recruitment-qr">
            <img
              src="/images/contact-wechat-qr.png"
              alt="招聘联系微信二维码"
              width="333"
              height="323"
            />
            <figcaption>扫码添加微信</figcaption>
          </figure>
        </section>
      </div>
    </main>
  );
};

export default Contact;
