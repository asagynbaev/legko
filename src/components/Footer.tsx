import Image from 'next/image';
import Link from 'next/link';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <Link href="/" legacyBehavior>
              <a className="logo">
                <Image src="/images/Group_12_3.png.webp" alt="Legko - поиск психологов" width={120} height={40} className="logo__image logo__image--footer" />
              </a>
            </Link>
            <p>Делаем психологическую помощь доступной и удобной для каждого</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Сервис</h4>
              <ul>
                <li><Link href="/staff" legacyBehavior><a>Найти психолога</a></Link></li>
                <li><a href="#specialists">Специалисты</a></li>
                <li><a href="#how-it-works">Как это работает</a></li>
                <li><a href="#pricing">Цены</a></li>
                <li><a href="#specializations">Специализации</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Поддержка</h4>
              <ul>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#contact">Связаться с нами</a></li>
                <li><a href="#support">Техподдержка</a></li>
                <li><a href="#blog">Статьи</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Информация</h4>
              <ul>
                <li><a href="#about">О нас</a></li>
                <li><Link href="#" legacyBehavior><a onClick={(e) => {e.preventDefault(); if (typeof window !== 'undefined') {window.dispatchEvent(new CustomEvent('openPrivacyPolicyModal'));}}}>Политика конфиденциальности</a></Link></li>
                <li><Link href="#" legacyBehavior><a onClick={(e) => {e.preventDefault(); if (typeof window !== 'undefined') {window.dispatchEvent(new CustomEvent('openTermsOfUseModal'));}}}>Условия использования</a></Link></li>
                <li><a href="#for-psychologists">Для психологов</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-social">
            <a href="https://t.me/legko_psychology" title="Написать в Telegram">
              <i className="fab fa-telegram"></i>
              <span>Telegram</span>
            </a>
            <a href="https://wa.me/996509339333" title="Написать в WhatsApp">
              <i className="fab fa-whatsapp"></i>
              <span>WhatsApp</span>
            </a>
          </div>
          <p>&copy; 2025 Legko. Все права защищены.</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
