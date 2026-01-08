import styles from './SolutionCard.module.css';

interface SolutionCardProps {
  title: string;
  description: string;
}

const SolutionCard = ({ title, description }: SolutionCardProps) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <ul className={styles.descriptionList}>
        <li>{description}</li>
      </ul>
    </div>
  );
};

export default SolutionCard;