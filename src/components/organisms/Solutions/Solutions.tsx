import styles from './Solutions.module.css';

const problems = [
  {
    title: "Falta de direcionamento digital",
    description: "Diagnosticamos sua infraestrutura tecnológica e indicamos soluções para a transformação digital."
  },
  {
    title: "Baixa eficiência operacional",
    description: "Implementamos Inteligência Artificial para automatizar processos e aumentar a produtividade."
  },
  {
    title: "Dificuldade de adaptação ao digital",
    description: "Treinamos sua equipe para atuar com inovação e tecnologia."
  },
  {
    title: "Experiência do usuário insatisfatória",
    description: "Melhoramos a usabilidade e o design dos seus produtos e serviços para torná-los mais intuitivos."
  },
  {
    title: "Falta de inovação nos processos empresariais",
    description: "Desenvolvemos estratégias para incorporar inovação e manter sua empresa competitiva."
  }
];

export const Solutions = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-[#003366] text-2xl font-bold mb-10">O que resolvemos:</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((item, index) => (
            <div key={index} className={styles.problemCard}>
              <h3 className={styles.problemTitle}>{item.title}</h3>
              <p className={styles.problemDescription}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};