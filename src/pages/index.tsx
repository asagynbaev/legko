import Head from 'next/head';
import Image from 'next/image';

import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import FirstSession from '../components/FirstSession';
import Benefits from '../components/Benefits';
import Problems from '../components/Problems';
import Specialists from '../components/Specialists';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import CTASection from '../components/CTASection.tsx';
import CTABottom from '../components/CTABottom';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
        <Head>
            <title>Legko - Найдите своего психолога за 5 минут</title>
            <meta name="description" content="Быстрый и удобный поиск психологов онлайн. Подберем специалиста под ваши потребности. Конфиденциально и профессионально." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://legko.live/" />
            <meta property="og:title" content="Legko - Найдите своего психолога за 5 минут" />
            <meta property="og:description" content="Быстрый и удобный поиск психологов онлайн. Подберем специалиста под ваши потребности." />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
            <script src="/js/legko-main.js" defer></script>
        </Head>
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
                        <a href="#" className="btn btn--outline btn--mobile">Войти</a>
                        <a href="#" className="btn btn--primary btn--mobile">Найти психолога</a>
                    </div>
                </div>
                <div className="nav__actions">
                    <a href="#" className="btn btn--outline">Войти</a>
                    <a href="#" className="btn btn--primary">Найти психолога</a>
                </div>
                <div className="nav__toggle" id="nav-toggle">
                    <i className="fas fa-bars"></i>
                </div>
            </nav>
        </header>
        <Hero />
        <HowItWorks />
        <FirstSession />
        <Benefits />
        <Problems />
        <Specialists />
        <Testimonials />
        <FAQ />
        <CTABottom />
        <Footer />
    </>
    );
}