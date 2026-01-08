import SolutionCard from '@/app/components/molecules/NavLinks/SolutionCard/SolutionCard';
import styles from './Solutions.module.css';

// Em um projeto real, estes dados poderiam vir de uma API
const solutionsData = [
  {
    title: 'Falta de direcionamento digital',
    description: 'Diagnosticamos sua infraestrutura tecnológica e indicamos soluções para a transformação digital.'
  },
  {
    title: 'Baixa eficiência operacional',
    description: 'Implementamos Inteligência Artificial para automatizar processos e aumentar a produtividade.'
  },
  {
    title: 'Dificuldade de adaptação ao digital',
    description: 'Treinamos sua equipe para atuar com inovação e tecnologia.'
  },
  {
    title: 'Experiência do usuário insatisfatória',
    description: 'Melhoramos a usabilidade e o design dos seus produtos e serviços para torná-los mais intuitivos e acessíveis.'
  },
  {
    title: 'Falta de inovação nos processos empresariais',
    description: 'Desenvolvemos estratégias para incorporar inovação e manter sua empresa competitiva.'
  }
];

const Solutions = () => {
  return (
    <section className={styles.solutionsSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>O que resolvemos:</h2>
        <div className={styles.grid}>
          {solutionsData.map((solution, index) => (
            <SolutionCard 
              key={index} 
              title={solution.title} 
              description={solution.description} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solutions;