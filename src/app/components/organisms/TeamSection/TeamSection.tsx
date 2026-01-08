import TeamMemberCard from '@/app/components/molecules/TeamMemberCard/TeamMemberCard';
import styles from './TeamSection.module.css';

// Dados da equipe. Coloque as imagens na pasta /public/team
const teamData = [
  {
    name: 'Dáviny Letícia Vidal',
    role: 'Engenheira de software,\nPalestrante, Professora',
    imageUrl: '/team/daviny.png',
  },
  {
    name: 'Cléo Almeida',
    role: 'Design Institucional',
    imageUrl: '/team/cleo.png',
  },
  {
    name: 'Daniele Junior',
    role: 'Engenheira de Software',
    imageUrl: '/team/daniele.png',
  },
];

const TeamSection = () => {
  return (
    <section className={styles.teamSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Nossa Equipe de Especialistas</h2>
        <div className={styles.grid}>
          {teamData.map((member) => (
            <TeamMemberCard
              key={member.name}
              name={member.name}
              role={member.role}
              imageUrl={member.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;