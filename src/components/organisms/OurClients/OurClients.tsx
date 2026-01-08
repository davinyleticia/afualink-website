import Image from 'next/image';
import styles from './OurClients.module.css';

// Em um projeto real, estes dados viriam de uma API
const clients = [
  { name: 'Reprograma', logo: '/logos/reprograma.svg', width: 150, height: 50 },
  { name: 'Filir', logo: '/logos/logo-fuirdiversos.jpeg', width: 100, height: 50 },
  { name: 'ST Advogados', logo: '/logos/st.svg', width: 120, height: 50 },

];

const OurClients = () => {
  return (<>
    <section className={styles.section}>
      <div className={styles.container}>
        <div className="text-center">
 <h2 className="text-[#003366] text-3xl md:text-4xl font-bold mb-4 py-3">
            Nosso Clientes
          </h2>
          <div className="w-24 h-1 bg-[#f37021] mx-auto mb-10"></div>
      </div>
        <div className={styles.description}>
          <p>
            Temos orgulho de colaborar com uma variedade de clientes, desde startups inovadoras até grandes corporações. Nossa abordagem personalizada garante que cada solução seja adaptada às necessidades específicas de cada cliente, promovendo crescimento e sucesso mútuo.
          </p>
        </div>
      </div>
    </section>
{/* Seção Clientes */}
      <section className="py-16 bg-slate-50 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-12">Nossos Clientes</h2>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {clients.map((client) => (
              <div key={client.name} className="flex justify-center items-center">
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
    </>
  );
};

export default OurClients;