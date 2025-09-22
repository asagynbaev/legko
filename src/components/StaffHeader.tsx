import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const StaffHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
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

  return (
    <header className="header header--staff">
      <nav className="nav container">
        <div className="nav__brand">
          <Link href="/" legacyBehavior>
            <a className="logo">
              <Image src="/images/Group_12_3.png.webp" alt="Legko - поиск психологов" width={120} height={40} className="logo__image" />
            </a>
          </Link>
        </div>
        
        <div className={`nav__menu ${isMobileMenuOpen ? 'show' : ''}`} id="nav-menu">
          <ul className="nav__list">
            <li className="nav__item">
              <Link href="/" legacyBehavior>
                <a className="nav__link" onClick={closeMobileMenu}>
                  Вернуться на главную
                </a>
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="nav__actions">
        </div>
        
        <div className="nav__toggle" id="nav-toggle" onClick={toggleMobileMenu}>
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </div>
      </nav>
    </header>
  );
};

export default StaffHeader;
