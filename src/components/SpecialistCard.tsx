import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { config } from '@/config/env';
import { SESSION_FORMAT } from '@/constants/staffContent';

interface SpecialistCardProps {
  avatar: string;
  name: string;
  title: string;
  rating?: number;
  /** Адрес профиля; без него карточка не кликается */
  href?: string;
  experience?: number;
  experienceLabel?: string;
  numberOfClients?: number;
  /** Цена, например "От 1500 с" */
  priceFrom?: string;
  /** Формат приёма, например "Онлайн" */
  location?: string;
  /** Подход: КПТ, Гештальт, ЭФТ и т.д. — показывается бейджем на фото */
  approach?: string;
}

const SpecialistCard = ({
  avatar,
  name,
  title,
  rating = 5,
  href,
  experience,
  experienceLabel,
  numberOfClients,
  priceFrom = 'От 1500 с',
  location = SESSION_FORMAT,
  approach,
}: SpecialistCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const isExternalImage = avatar && avatar.includes(config.imageHost);

  const getInitials = (nameStr: string) => {
    const words = nameStr.trim().split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    if (words.length === 1) return words[0][0].toUpperCase();
    return 'П';
  };

  const cardContent = (
    <>
      <div className="specialist-card-alter__photo">
        {imageLoading && (
          <div className="specialist-card-alter__photo-loader">
            <div className="loader-spinner"></div>
          </div>
        )}
        {avatar && !imageError ? (
          isExternalImage ? (
            <Image
              src={avatar}
              alt={name}
              fill
              className={`specialist-card-alter__img ${imageLoading ? 'loading' : 'loaded'}`}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              sizes="(max-width: 768px) 100vw, 360px"
              unoptimized
            />
          ) : (
            <Image
              src={avatar}
              alt={name}
              fill
              className={`specialist-card-alter__img ${imageLoading ? 'loading' : 'loaded'}`}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              sizes="(max-width: 768px) 100vw, 360px"
            />
          )
        ) : (
          <div className="specialist-card-alter__initials">{getInitials(name)}</div>
        )}
        <div className="specialist-card-alter__photo-overlay" />
        {approach && (
          <span className="specialist-card-alter__approach">{approach}</span>
        )}
        <div className="specialist-card-alter__photo-caption">
          <h3 className="specialist-card-alter__name">{name}</h3>
          <p className="specialist-card-alter__title">{title}</p>
          {(experienceLabel || experience != null || (numberOfClients != null && numberOfClients > 0)) && (
            <p className="specialist-card-alter__meta">
              {experienceLabel || (experience != null ? `Опыт ${experience} лет` : null)}
              {(experienceLabel || experience != null) && numberOfClients != null && numberOfClients > 0 && ' • '}
              {numberOfClients != null && numberOfClients > 0 && `${numberOfClients}+ клиентов`}
            </p>
          )}
          {rating > 0 && (
            <div className="specialist-card-alter__rating">
              <i className="fas fa-star" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
      <div className="specialist-card-alter__details">
        <div className="specialist-card-alter__row">
          <span className="specialist-card-alter__label">Стоимость консультации</span>
          <span className="specialist-card-alter__value">{priceFrom}</span>
        </div>
        <div className="specialist-card-alter__row">
          <span className="specialist-card-alter__label">Формат приёма</span>
          <span className="specialist-card-alter__value">{location}</span>
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="specialist-card-alter specialist-card-alter--link">
        {cardContent}
      </Link>
    );
  }

  return <div className="specialist-card-alter">{cardContent}</div>;
};

export default SpecialistCard;
