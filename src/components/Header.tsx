import Image from 'next/image';
import Link from 'next/link';

const Header = () => (
    <header className="header">
        <nav className="nav container">
            <div className="nav__brand">
                <div className="logo">
                    <Image src="/images/Group_12_3.png.webp" alt="Legko - поиск психологов" width={120} height={40} className="logo__image" />
                </div>
            </div>
            <div className="nav__menu" id="nav-menu">
                <ul className="nav__list">
                    <li className="nav__item"><a href="#how-it-works" className="nav__link">Как это работает</a></li>
                    <li className="nav__item"><a href="#benefits" className="nav__link">Преимущества</a></li>
                    <li className="nav__item"><a href="#specialists" className="nav__link">Специалисты</a></li>
                    <li className="nav__item"><a href="#faq" className="nav__link">FAQ</a></li>
                </ul>
                <div className="nav__mobile-actions">
                    <Link href="/login" legacyBehavior><a className="btn btn--outline btn--mobile">Войти</a></Link>
                    <a href="#" className="btn btn--primary btn--mobile">Найти психолога</a>
                </div>
            </div>
            <div className="nav__actions">
                <Link href="/login" legacyBehavior><a className="btn btn--outline">Войти</a></Link>
                <a href="#" className="btn btn--primary">Найти психолога</a>
            </div>
            <div className="nav__toggle" id="nav-toggle">
                <i className="fas fa-bars"></i>
            </div>
        </nav>
    </header>
);

export default Header;
