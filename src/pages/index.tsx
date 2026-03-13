import Head from 'next/head';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
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
                <title>Legko - Найдите своего психолога Легко</title>
                <meta name="description" content="Быстрый и удобный поиск психологов онлайн. Подберем специалиста под ваши потребности. Конфиденциально и профессионально." />
                <meta name="keywords" content="психолог онлайн, поиск психолога, психологическая помощь, онлайн консультация психолога, психолог Кыргызстан" />
                <link rel="canonical" href="https://legko.live/" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://legko.live/" />
                <meta property="og:title" content="Legko - Найдите своего психолога Легко" />
                <meta property="og:description" content="Быстрый и удобный поиск психологов онлайн. Подберем специалиста под ваши потребности." />
                <meta property="og:image" content="https://legko.live/images/Group_12_3.png.webp" />
                <meta property="og:locale" content="ru_RU" />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Legko - Найдите своего психолога Легко" />
                <meta name="twitter:description" content="Быстрый и удобный поиск психологов онлайн. Подберем специалиста под ваши потребности." />
                <meta name="twitter:image" content="https://legko.live/images/Group_12_3.png.webp" />
                
                {/* Schema.org structured data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            "name": "Legko",
                            "url": "https://legko.live",
                            "logo": "https://legko.live/images/Group_12_3.png.webp",
                            "description": "Быстрый и удобный поиск психологов онлайн",
                            "sameAs": [
                                "https://t.me/legko_psychology",
                                "https://wa.me/996509339333"
                            ],
                            "contactPoint": {
                                "@type": "ContactPoint",
                                "telephone": "+996-509-339-333",
                                "contactType": "customer service",
                                "availableLanguage": "Russian"
                            }
                        })
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Service",
                            "serviceType": "Психологическая консультация",
                            "provider": {
                                "@type": "Organization",
                                "name": "Legko"
                            },
                            "areaServed": {
                                "@type": "Country",
                                "name": "Кыргызстан"
                            },
                            "description": "Онлайн консультации с профессиональными психологами"
                        })
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": [
                                {
                                    "@type": "Question",
                                    "name": "Что насчет конфиденциальности?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Мы гарантируем 100% конфиденциальность видеоконсультаций. Это означает, что никто не узнает о том, что было сказано на сессии, все остается строго между вами и терапевтом."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "Работаете ли вы с детьми и подростками?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Мы предоставляем консультации только для лиц, достигших 18-летнего возраста."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "Можно ли менять психолога?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Да, вы сами выбираете себе психолога. Если психолог вам не подошел, вы можете без проблем выбрать другого."
                                    }
                                }
                            ]
                        })
                    }}
                />
            </Head>
            <Header />
            <Hero />
            <Problems />
            <HowItWorks />
            <Benefits />
            <Specialists />
            <Testimonials />
            <FAQ />
            <CTABottom />
            <Footer />
        </>
    );
}
