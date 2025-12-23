import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface SpecialistCardProps {
    avatar: string;
    name: string;
    title: string;
    rating: number;
    id?: string;
    experience?: number;
    numberOfClients?: number;
}

const SpecialistCard = ({ avatar, name, title, rating, id, experience, numberOfClients }: SpecialistCardProps) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    
    // Проверяем, является ли аватар внешним изображением
    const isExternalImage = avatar && avatar.includes('img.booka.kg');
    
    const getInitials = (name: string) => {
        const words = name.trim().split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        } else if (words.length === 1) {
            return words[0][0].toUpperCase();
        }
        return 'П';
    };

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

    const cardContent = (
        <>
            <div className="specialist-photo-preview">
                {avatar && !imageError ? (
                    <div className="image-container">
                        {imageLoading && (
                            <div className="image-loader">
                                <div className="loader-spinner"></div>
                            </div>
                        )}
                        {isExternalImage ? (
                            <Image 
                                src={avatar} 
                                alt={name} 
                                width={80} 
                                height={80} 
                                className={`specialist-avatar-preview ${imageLoading ? 'loading' : 'loaded'}`}
                                onLoad={() => setImageLoading(false)}
                                onError={() => {
                                    setImageError(true);
                                    setImageLoading(false);
                                }}
                                style={{ borderRadius: '50%', objectFit: 'cover' }}
                                unoptimized
                            />
                        ) : (
                            <Image 
                                src={avatar} 
                                alt={name} 
                                width={80} 
                                height={80} 
                                className={`specialist-avatar-preview ${imageLoading ? 'loading' : 'loaded'}`}
                                onLoad={() => setImageLoading(false)}
                                onError={() => {
                                    setImageError(true);
                                    setImageLoading(false);
                                }}
                            />
                        )}
                    </div>
                ) : (
                    <div className="specialist-avatar-initials-preview">
                        {getInitials(name)}
                    </div>
                )}
            </div>
            <div className="specialist-info-preview">
                <h4>{name}</h4>
                <p className="specialist-title-preview">{title}</p>
                <div className="rating-preview">
                    <div className="stars-preview">
                        {renderStars(rating || 5)}
                    </div>
                    <span className="rating-text-preview">
                        {(rating || 5).toFixed(1)}
                        {numberOfClients && ` (${numberOfClients}+ клиентов)`}
                        {!numberOfClients && ' (50+ отзывов)'}
                    </span>
                </div>
                {experience && (
                    <div className="specialist-experience-preview">
                        <i className="fas fa-briefcase"></i>
                        <span>Опыт: {experience} лет</span>
                    </div>
                )}
            </div>
        </>
    );

    if (id) {
        return (
            <Link href={`/staff?psychologist=${id}`} className="specialist-preview specialist-preview--link">
                {cardContent}
            </Link>
        );
    }

    return (
        <div className="specialist-preview">
            {cardContent}
        </div>
    );
};

export default SpecialistCard;
