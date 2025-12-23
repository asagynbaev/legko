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
                <li><a href="#benefits">Преимущества</a></li>
                <li><a href="#problems">Направления работы</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Поддержка</h4>
              <ul>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="https://wa.me/996509339333" target="_blank" rel="noopener noreferrer">Связаться с нами</a></li>
                <li><a href="https://t.me/legko_psychology" target="_blank" rel="noopener noreferrer">Telegram поддержка</a></li>
                <li><Link href="/forpsychologists" legacyBehavior><a>Для психологов</a></Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Информация</h4>
              <ul>
                <li><a href="#benefits">О нас</a></li>
                <li><Link href="#" legacyBehavior><a onClick={(e) => {e.preventDefault(); if (typeof window !== 'undefined') {window.dispatchEvent(new CustomEvent('openPrivacyPolicyModal'));}}}>Политика конфиденциальности</a></Link></li>
                <li><Link href="#" legacyBehavior><a onClick={(e) => {e.preventDefault(); if (typeof window !== 'undefined') {window.dispatchEvent(new CustomEvent('openTermsOfUseModal'));}}}>Условия использования</a></Link></li>
                <li><Link href="/forpsychologists" legacyBehavior><a>Для психологов</a></Link></li>
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
