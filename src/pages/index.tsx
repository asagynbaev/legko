import Head from 'next/head';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import FirstSession from '../components/FirstSession';
import Benefits from '../components/Benefits';
import Problems from '../components/Problems';
import Specialists from '../components/Specialists';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import CTABottom from '../components/CTABottom';
import Footer from '../components/Footer';
import Header from '../components/Header';

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
            </Head>
            <Header />
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