import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const StaffHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navMenuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    toggleRef.current?.focus();
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // When menu closes, move focus out of it to avoid aria-hidden on focused element
  useEffect(() => {
    if (!isMobileMenuOpen && navMenuRef.current?.contains(document.activeElement)) {
      toggleRef.current?.focus();
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="header">
      <nav className="nav container">
        <div className="nav__brand">
          <Link href="/" className="logo">
            <Image
              src="/images/Group_12_3.png.webp"
              alt="Legko - поиск психологов"
              width={120}
              height={40}
              className="logo__image"
            />
          </Link>
        </div>

        <div
          ref={navMenuRef}
          className={`nav__menu ${isMobileMenuOpen ? 'show' : ''}`}
          id="nav-menu"
          aria-hidden={!isMobileMenuOpen}
        >
          <ul className="nav__list">
            <li className="nav__item">
              <Link href="/" className="nav__link" onClick={closeMobileMenu}>
                Главная
              </Link>
            </li>
            <li className="nav__item">
              <Link href="/#how-it-works" className="nav__link" onClick={closeMobileMenu}>
                Как это работает
              </Link>
            </li>
            <li className="nav__item">
              <Link href="/#benefits" className="nav__link" onClick={closeMobileMenu}>
                Преимущества
              </Link>
            </li>
            <li className="nav__item">
              <Link href="/#faq" className="nav__link" onClick={closeMobileMenu}>
                FAQ
              </Link>
            </li>
          </ul>
          <div className="nav__mobile-actions">
            <Link href="/" className="btn btn--secondary" onClick={closeMobileMenu}>
              <i className="fas fa-arrow-left"></i>
              На главную
            </Link>
          </div>
        </div>

        <div className="nav__actions">
          <Link href="/" className="btn btn--secondary">
            <i className="fas fa-arrow-left"></i>
            На главную
          </Link>
        </div>

        <button
          ref={toggleRef}
          className="nav__toggle"
          id="nav-toggle"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="nav-menu"
          type="button"
        >
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden="true"></i>
        </button>
      </nav>
    </header>
  );
};

export default StaffHeader;
