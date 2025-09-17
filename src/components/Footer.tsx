import Image from 'next/image';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="logo">
              <Image src="/images/Group_12_3.png.webp" alt="Legko - поиск психологов" width={120} height={40} className="logo__image logo__image--footer" />
            </div>
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
                <li><a href="#">Политика конфиденциальности</a></li>
                <li><a href="#">Условия использования</a></li>
                <li><a href="#">Для психологов</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-social">
            <a href="https://t.me/legko_psychology"><i className="fab fa-telegram"></i></a>
            <a href="https://www.instagram.com/legko.psychology"><i className="fab fa-instagram"></i></a>
            <a href="https://wa.me/996509339333"><i className="fab fa-whatsapp"></i></a>
          </div>
          <p>&copy; 2025 Legko. Все права защищены.</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
