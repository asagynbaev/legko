
import { useEffect, useState } from 'react';
import SpecialistCard from './SpecialistCard';
import { getStaffByBusinessId } from '../api/api';

const Specialists = () => {
    const [staff, setStaff] = useState<any[]>([]);
    useEffect(() => {
        getStaffByBusinessId()
            .then((res) => {
                if (res && Array.isArray(res.message)) {
                    setStaff(res.message);
                }
            })
            .catch(() => setStaff([]));
    }, []);

    return (
        <section className="specialists" id="specialists">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Наши психологи</h2>
                    <p className="section-subtitle">Высококвалифицированные специалисты с опытом от 5 лет</p>
                </div>
                <div className="specialists-content">
                    <div className="specialists-info">
                        <div className="criteria">
                            <div className="criteria-item">
                                <i className="fas fa-graduation-cap"></i>
                                <div>
                                    <h4>Высшее образование</h4>
                                    <p>Диплом психолога или смежной специальности</p>
                                </div>
                            </div>
                            <div className="criteria-item">
                                <i className="fas fa-certificate"></i>
                                <div>
                                    <h4>Дополнительное обучение</h4>
                                    <p>Сертификаты по различным терапевтическим методам</p>
                                </div>
                            </div>
                            <div className="criteria-item">
                                <i className="fas fa-chart-line"></i>
                                <div>
                                    <h4>Практический опыт</h4>
                                    <p>Минимум 5 лет работы с клиентами</p>
                                </div>
                            </div>
                            <div className="criteria-item">
                                <i className="fas fa-users"></i>
                                <div>
                                    <h4>Супервизия</h4>
                                    <p>Регулярная работа с супервизором</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="specialists-visual">
                        <div className="specialists-cards">
                            {staff.length > 0 ? (
                                staff.slice(0, 2).map((item) => (
                                    <SpecialistCard
                                        key={item.id}
                                        avatar={item.photo || "/images/пушистик обьятия.png"}
                                        name={item.name}
                                        title={item.speciality}
                                        rating={item.rating || 5}
                                    />
                                ))
                            ) : (
                                // Заглушки пока API не загрузился
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
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Specialists;
