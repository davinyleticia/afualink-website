import TeamMemberCard from '@/components/molecules/TeamMemberCard/TeamMemberCard';
import styles from './TeamSection.module.css';

// Dados da equipe. Coloque as imagens na pasta /public/team
const team = [
    { name: "Dáviny Letícia Vidal", role: "Engenheira de Software", img: "/img/leticia.jpeg" },
    { name: "Cléo Almeida", role: "Design Institucional", img: "/img/cleo.png" },
    { name: "Daniele Junior", role: "Engenheira de Software", img: "https://avatars.githubusercontent.com/DaniDJunior" }
  ];
const TeamSection = () => {
  return (
  <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-[#003366] text-3xl font-bold mb-16">Nossa Equipe de Especialistas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full bg-slate-100 mb-6 overflow-hidden border-4 border-slate-50 shadow-lg">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-[#003366] text-xl">{member.name}</h4>
                <p className="text-[#f37021] font-medium text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
  );
};

export default TeamSection;