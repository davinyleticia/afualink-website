import styles from './AboutSection.module.css';

const AboutSection = () => {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <h2 className={styles.heading}>
          Somos um escritório inovador, com muita criatividade e foco em resultados.
        </h2>
        <p className={styles.text}>
          A Afulink nasceu da inconformidade de sua fundadora com os desperdícios e ineficiências observados na gestão de projetos em empresas de diversos segmentos e tamanhos. Nossa missão é transformar a maneira como os negócios operam, garantindo maior eficiência, produtividade e retorno sobre investimento (ROI) através de soluções tecnológicas inovadoras. Diagnosticamos sua infraestrutura tecnológica e indicamos caminhos para a transformação digital, eliminando gargalos e impulsionando sua empresa rumo ao futuro.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;