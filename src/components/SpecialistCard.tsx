import Image from 'next/image';

interface SpecialistCardProps {
    avatar: string;
    name: string;
    title: string;
    rating: number;
}

const SpecialistCard = ({ avatar, name, title, rating }: SpecialistCardProps) => (
    <div className="specialist-preview">
        <div className="specialist-avatar">
            <Image src={avatar} alt="Специалист" width={60} height={60} className="mascot-icon" />
        </div>
        <h4>{name}</h4>
        <p>{title}</p>
        <div className="rating">
            <span>{rating.toFixed(1)}</span>
            <div className="stars">⭐⭐⭐⭐⭐</div>
        </div>
    </div>
);

export default SpecialistCard;
