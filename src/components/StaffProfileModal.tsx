import { useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  MasterProfile,
  MasterWorkSchedule,
  MasterEducation,
} from '../api/api';

const DAY_NAMES = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

interface StaffProfileModalProps {
  master: MasterProfile | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onBook: (masterId: string) => void;
}

function formatSchedule(schedule: MasterWorkSchedule[]) {
  const byDay = schedule
    .filter((s) => !s.dayOff && s.startTime && s.endTime)
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  if (byDay.length === 0) return '—';
  return byDay
    .map((s) => `${DAY_NAMES[s.dayOfWeek]} ${s.startTime!.slice(0, 5)}–${s.endTime!.slice(0, 5)}`)
    .join(', ');
}

function formatEducation(e: MasterEducation) {
  const parts = [e.institution, e.degree, e.fieldOfStudy].filter(Boolean);
  if (parts.every((p) => p === 'string' || !p)) return null;
  const period = e.startDate && e.endDate ? `${e.startDate.slice(0, 4)} – ${e.endDate.slice(0, 4)}` : '';
  const line = parts.join(', ') + (period ? ` (${period})` : '');
  return line;
}

export default function StaffProfileModal({
  master,
  loading,
  error,
  onClose,
  onBook,
}: StaffProfileModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (loading) {
    return (
      <div className="staff-profile-overlay" ref={overlayRef} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label="Анкета специалиста">
        <div className="staff-profile-modal staff-profile-modal--loading">
          <div className="loading-spinner" />
          <p>Загружаем анкету...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="staff-profile-overlay" ref={overlayRef} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label="Анкета специалиста">
        <div className="staff-profile-modal">
          <div className="staff-profile-modal__header">
            <h2 className="staff-profile-modal__title">Ошибка загрузки</h2>
            <button type="button" className="staff-profile-modal__close" onClick={onClose} aria-label="Закрыть">
              <i className="fas fa-times" aria-hidden />
            </button>
          </div>
          <div className="staff-profile-modal__body">
            <p className="staff-profile-modal__error">{error}</p>
            <button type="button" className="btn btn--primary" onClick={onClose}>
              Закрыть
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!master) return null;

  const addressLine = master.address?.addressLine || 'Онлайн';
  const scheduleText = formatSchedule(master.workSchedules);
  const educationsFiltered = (master.educations || []).map(formatEducation).filter(Boolean);

  return (
    <div className="staff-profile-overlay" ref={overlayRef} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="staff-profile-title">
      <div className="staff-profile-modal">
        <div className="staff-profile-modal__header">
          <h2 id="staff-profile-title" className="staff-profile-modal__title">Анкета специалиста</h2>
          <button type="button" className="staff-profile-modal__close" onClick={onClose} aria-label="Закрыть">
            <i className="fas fa-times" aria-hidden />
          </button>
        </div>

        <div className="staff-profile-modal__body">
          <div className="staff-profile-hero">
            <div className="staff-profile-hero__photo-wrap">
              {master.photo ? (
                <Image
                  src={master.photo}
                  alt={master.name}
                  width={120}
                  height={120}
                  className="staff-profile-hero__photo"
                  unoptimized
                />
              ) : (
                <div className="staff-profile-hero__initials">
                  {master.name.trim().split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="staff-profile-hero__info">
              <h3 className="staff-profile-hero__name">{master.name}</h3>
              <p className="staff-profile-hero__speciality">{master.speciality}</p>
              <div className="staff-profile-hero__meta">
                <span><i className="fas fa-briefcase" aria-hidden /> Опыт {master.experience} лет</span>
                {master.numberOfClients != null && master.numberOfClients > 0 && (
                  <span><i className="fas fa-users" aria-hidden /> {master.numberOfClients}+ клиентов</span>
                )}
                {master.rating > 0 && (
                  <span><i className="fas fa-star" aria-hidden /> {master.rating.toFixed(1)}</span>
                )}
              </div>
            </div>
          </div>

          {master.aboutMe && (
            <section className="staff-profile-section">
              <h4 className="staff-profile-section__title">О себе</h4>
              <p className="staff-profile-section__text">{master.aboutMe}</p>
            </section>
          )}

          <div className="staff-profile-grid">
            <section className="staff-profile-section">
              <h4 className="staff-profile-section__title">Где ведёт приём</h4>
              <p className="staff-profile-section__text">{addressLine}</p>
            </section>
            <section className="staff-profile-section">
              <h4 className="staff-profile-section__title">Расписание</h4>
              <p className="staff-profile-section__text">{scheduleText}</p>
            </section>
          </div>

          {master.services && master.services.length > 0 && (
            <section className="staff-profile-section">
              <h4 className="staff-profile-section__title">Услуги и цены</h4>
              <ul className="staff-profile-services">
                {master.services.map((s) => (
                  <li key={s.id} className="staff-profile-service">
                    <span className="staff-profile-service__name">{s.name}</span>
                    <span className="staff-profile-service__price">{s.price} {s.currencySymbol}</span>
                    {s.duration ? <span className="staff-profile-service__duration">{s.duration} мин</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {educationsFiltered.length > 0 && (
            <section className="staff-profile-section">
              <h4 className="staff-profile-section__title">Образование</h4>
              <ul className="staff-profile-list">
                {educationsFiltered.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </section>
          )}

          <div className="staff-profile-modal__actions">
            <button
              type="button"
              className="btn btn--primary btn--large staff-profile-modal__book"
              onClick={() => onBook(master.id)}
            >
              <i className="fas fa-calendar-alt" aria-hidden />
              Записаться на приём
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
