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
                <li><a href="#">Найти психолога</a></li>
                <li><a href="#">Как это работает</a></li>
                <li><a href="#">Цены</a></li>
                <li><a href="#">Специализации</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Поддержка</h4>
              <ul>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Связаться с нами</a></li>
                <li><a href="#">Техподдержка</a></li>
                <li><a href="#">Статьи</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Информация</h4>
              <ul>
                <li><a href="#">О нас</a></li>
                <li><a href="#privacy-policy">Политика конфиденциальности</a></li>
                <li><a href="#terms-of-use">Условия использования</a></li>
                <li><a href="#">Для психологов</a></li>
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
