
import Image from 'next/image';

const Specialists = () => (
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
                        <div className="specialist-preview">
                            <div className="specialist-avatar">
                                <Image src="/images/пушистик обьятия.png" alt="Специалист" width={40} height={40} className="mascot-icon" />
                            </div>
                            <h4>Алтынай Муратбек кызы</h4>
                            <p>Клинический психолог</p>
                            <div className="rating">
                                <span>4.9</span>
                                <div className="stars">⭐⭐⭐⭐⭐</div>
                            </div>
                        </div>
                        <div className="specialist-preview">
                            <div className="specialist-avatar">
                                <Image src="/images/пушистик самолюбование.png" alt="Специалист" width={40} height={40} className="mascot-icon" />
                            </div>
                            <h4>Дария Рыспаева</h4>
                            <p>Нарративный терапевт</p>
                            <div className="rating">
                                <span>4.8</span>
                                <div className="stars">⭐⭐⭐⭐⭐</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default Specialists;
