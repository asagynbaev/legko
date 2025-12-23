
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SpecialistCard from './SpecialistCard';
import { getStaffByBusinessId } from '../api/api';

const Specialists = () => {
    const [staff, setStaff] = useState<Array<{
        id: string;
        name: string;
        photo?: string;
        speciality: string;
        rating?: number;
        experience?: number;
        numberOfClients?: number;
    }>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        getStaffByBusinessId()
            .then((res) => {
                if (res && Array.isArray(res.message)) {
                    setStaff(res.message);
                } else {
                    setError('Не удалось загрузить данные');
                }
            })
            .catch((err) => {
                console.error('Error loading staff:', err);
                setError('Произошла ошибка при загрузке специалистов');
                setStaff([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <section className="specialists-modern" id="specialists">
            <div className="specialists-modern-bg"></div>
            <div className="container">
                <div className="section-header">
                    <div className="section-badge">
                        <span className="modern-badge">
                            <span className="badge-icon">👥</span>
                            Наша команда
                        </span>
                    </div>
                    <h2 className="section-title">
                        Профессиональные <span className="gradient-text">психологи</span>
                    </h2>
                    <p className="section-subtitle">
                        Специалисты с высшим образованием и опытом работы от 5 лет
                    </p>
                </div>

                <div className="specialists-modern-features">
                    <div className="modern-feature-item">
                        <div className="feature-icon-wrapper">
                            <i className="fas fa-graduation-cap"></i>
                        </div>
                        <span>Высшее образование</span>
                    </div>
                    <div className="modern-feature-item">
                        <div className="feature-icon-wrapper">
                            <i className="fas fa-certificate"></i>
                        </div>
                        <span>Сертификаты</span>
                    </div>
                    <div className="modern-feature-item">
                        <div className="feature-icon-wrapper">
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <span>5+ лет опыта</span>
                    </div>
                    <div className="modern-feature-item">
                        <div className="feature-icon-wrapper">
                            <i className="fas fa-users"></i>
                        </div>
                        <span>Супервизия</span>
                    </div>
                </div>

                <div className="specialists-modern-grid">
                    {loading ? (
                        <div className="specialists-loading" aria-live="polite" aria-label="Загрузка специалистов">
                            <div className="loading-spinner"></div>
                            <span>Загрузка специалистов...</span>
                        </div>
                    ) : error ? (
                        <div className="specialists-error" role="alert">
                            <i className="fas fa-exclamation-triangle"></i>
                            <p>{error}</p>
                            <p className="specialists-error-note">Показываем примеры специалистов</p>
                        </div>
                    ) : null}
                    {staff.length > 0 ? (
                        staff.slice(0, 3).map((item) => (
                            <SpecialistCard
                                key={item.id}
                                id={item.id}
                                avatar={item.photo || "/images/пушистик обьятия.png"}
                                name={item.name}
                                title={item.speciality}
                                rating={item.rating || 5}
                                experience={item.experience}
                                numberOfClients={item.numberOfClients}
                            />
                        ))
                    ) : !loading && (
                        <>
                            <SpecialistCard
                                avatar="/images/пушистик обьятия.png"
                                name="Айдана Мадишова"
                                title="Психолог"
                                rating={5}
                            />
                            <SpecialistCard
                                avatar="/images/пушистик самолюбование.png"
                                name="Алина Сасаза"
                                title="Психолог"
                                rating={5}
                            />
                            <SpecialistCard
                                avatar="/images/пушистик нежность.png"
                                name="Мария Иванова"
                                title="Психолог-консультант"
                                rating={5}
                            />
                        </>
                    )}
                </div>

                <div className="specialists-modern-cta">
                    <Link href="/staff" className="btn btn--primary btn--modern btn--large">
                        <i className="fas fa-search"></i>
                        Посмотреть всех специалистов
                        <i className="fas fa-arrow-right"></i>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Specialists;
