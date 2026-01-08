import Image from 'next/image';
import styles from './TeamMemberCard.module.css';

interface TeamMemberCardProps {
  imageUrl: string;
  name: string;
  role: string;
}

const TeamMemberCard = ({ imageUrl, name, role }: TeamMemberCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl}
          alt={`Foto de ${name}`}
          width={150}
          height={150}
          className={styles.profileImage}
        />
      </div>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.role}>{role}</p>
    </div>
  );
};

export default TeamMemberCard;