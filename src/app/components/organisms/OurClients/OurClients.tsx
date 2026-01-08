import Image from 'next/image';
import styles from './OurClients.module.css';

// Em um projeto real, estes dados viriam de uma API
const clients = [
  { name: 'Reprograma', logo: '/logos/reprograma-logo.svg', width: 150, height: 50 },
  { name: 'Trava Tech', logo: '/logos/trava-tech-logo.svg', width: 150, height: 50 },
  { name: 'Filir', logo: '/logos/filir-logo.svg', width: 100, height: 50 },
  // Adicione os outros logos aqui
];

const OurClients = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Nossos Clientes</h2>
        <div className={styles.logoGrid}>
          {clients.map((client) => (
            <div key={client.name} className={styles.logoWrapper}>
              <Image
                src={client.logo}
                alt={`${client.name} Logo`}
                width={client.width}
                height={client.height}
                style={{ objectFit: 'contain' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurClients;