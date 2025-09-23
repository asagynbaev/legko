import { useEffect, useState } from 'react';
import { getStaffByBusinessId } from '../../api/api';
import Image from 'next/image';
import Head from 'next/head';
import StaffHeader from '../../components/StaffHeader';
import Footer from '../../components/Footer';

interface Staff {
  id: string;
  name: string;
  phone: string;
  speciality: string;
  aboutMe: string;
  address: string | null;
  isFeatured: boolean;
  photo: string;
  experience: number;
  numberOfClients: number;
  rating: number;
  interval: number;
  isAutoApproved: boolean;
  branchId: string;
}

const StaffPage = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

  useEffect(() => {
    getStaffByBusinessId().then((res) => {
      if (res && Array.isArray(res.message)) {
        setStaff(res.message);
      }
      setLoading(false);
    });
  }, []);


  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i 
          key={i} 
          className={`fas fa-star ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1) {
      return words[0][0].toUpperCase();
    }
    return 'У';
  };

  const handleBookingClick = (specialistId: string) => {
    // Сразу открываем в новом окне, так как booka.kg блокирует iframe
    window.open(`https://booka.kg/master/${specialistId}`, '_blank');
  };


  const handleImageError = (specialistId: string) => {
    setImageErrors(prev => new Set(prev).add(specialistId));
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const toggleDescription = (specialistId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(specialistId)) {
        newSet.delete(specialistId);
      } else {
        newSet.add(specialistId);
      }
      return newSet;
    });
  };

  return (
    <>
      <Head>
        <title>Наши специалисты - Legko</title>
        <meta name="description" content="Познакомьтесь с нашими квалифицированными психологами. Найдите подходящего специалиста для решения ваших задач." />
      </Head>
      <StaffHeader />
      
      <main className="specialists-page">
        {/* Hero Section */}
        <section className="specialists-hero">
          <div className="container">
            <div className="specialists-hero-content">
              <h1>Наши специалисты</h1>
              <p className="specialists-hero-subtitle">
                Высококвалифицированные психологи с опытом работы от 2 лет. 
                Каждый специалист прошел тщательный отбор и имеет необходимые сертификаты.
              </p>
            </div>
          </div>
        </section>

        {/* Specialists Grid */}
        <section className="specialists-grid-section">
          <div className="container">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Загружаем информацию о специалистах...</p>
              </div>
            ) : (
              <div className="specialists-grid">
                {staff.map((specialist) => (
                  <div key={specialist.id} className="specialist-card">
                    <div className="specialist-card-header">
                      <div className="specialist-photo">
                        {specialist.photo && !imageErrors.has(specialist.id) ? (
                          <Image
                            src={specialist.photo}
                            alt={specialist.name}
                            width={120}
                            height={120}
                            className="specialist-avatar"
                            onError={() => handleImageError(specialist.id)}
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                          />
                        ) : (
                          <div className="specialist-avatar-initials">
                            {getInitials(specialist.name)}
                          </div>
                        )}
                      </div>
                      <div className="specialist-basic-info">
                        <h3 className="specialist-name">{specialist.name}</h3>
                        <p className="specialist-title">{specialist.speciality}</p>
                        <div className="specialist-rating">
                          <div className="stars">
                            {renderStars(specialist.rating || 5)}
                          </div>
                          <span className="rating-text">
                            {specialist.rating || 5}.0 ({specialist.numberOfClients || 0}+ клиентов)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="specialist-card-body">
                      <div className="specialist-experience">
                        <i className="fas fa-graduation-cap"></i>
                        <span>Опыт работы: {specialist.experience} лет</span>
                      </div>
                      
                      <div className="specialist-description">
                        <p className={`description-text ${expandedDescriptions.has(specialist.id) ? 'expanded' : ''}`}>
                          {expandedDescriptions.has(specialist.id) 
                            ? specialist.aboutMe 
                            : truncateText(specialist.aboutMe)
                          }
                        </p>
                        {specialist.aboutMe.length > 150 && (
                          <button 
                            className="description-toggle"
                            onClick={() => toggleDescription(specialist.id)}
                          >
                            {expandedDescriptions.has(specialist.id) ? 'Свернуть' : 'Читать далее'}
                            <i className={`fas ${expandedDescriptions.has(specialist.id) ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                          </button>
                        )}
                      </div>
                      
                      <div className="specialist-card-footer">
                        <button 
                          className="btn btn--primary btn--specialist btn--full-width"
                          onClick={() => handleBookingClick(specialist.id)}
                        >
                          <i className="fas fa-calendar-alt"></i>
                          Записаться на консультацию
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!loading && staff.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-content">
                  <i className="fas fa-user-friends empty-state-icon"></i>
                  <h3>Специалисты временно недоступны</h3>
                  <p>Мы работаем над пополнением команды. Попробуйте зайти позже.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="specialists-cta">
          <div className="container">
            <div className="cta-content">
              <h2>Не нашли подходящего специалиста?</h2>
              <p>Свяжитесь с нами через социальные сети, и мы поможем подобрать психолога под ваши потребности</p>
            </div>
          </div>
        </section>
      </main>

      
      <Footer />
    </>
  );
};

export default StaffPage;
