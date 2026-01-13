// constants/products.ts
export const productsData = {
  'biolink': {
    title: "Visitela Biolink",
    tagline: "Sua vitrine digital em um único link.",
    description: "Transforme sua bio do Instagram em uma ferramenta de vendas poderosa.",
    features: ["Links ilimitados", "Personalização de cores", "Analytics avançado"],
    color: "#f37021",
    faq: [
    { q: "Como fica o url do meu biolink?", a: "visite.la/seunome" },
    { q: "Posso ter ilimitados links?", a: "Sim, não há limite para a quantidade de links que você pode adicionar." },
    { q: "O painel de controle é fácil de usar?", a: "Sim, nosso painel é intuitivo e fácil de navegar." }
    ],
    modules: [],
    gallery: [
    { url: '/img/visitela.svg', alt: 'Interface mobile Visitela' },
  ],

  },
  'cms': {
    title: "Visitela CMS",
    tagline: "Gestão de conteúdo sem complicações.",
    description: "Controle total sobre o conteúdo do seu site com uma interface intuitiva.",
    features: ["Editor Online", "Otimização SEO", "Painel Administrativo"],
    color: "#003366",
    faq: [ 
      { q: "O CMS é adequado para iniciantes?", a: "Sim, nosso CMS foi projetado para ser fácil de usar, mesmo para quem não tem experiência técnica." },
      { q: "Posso integrar meu CMS com outras ferramentas?", a: "Sim, oferecemos várias integrações com ferramentas populares de marketing e análise." }
    ],
    modules: [],
    gallery: [],
  },
  'arquivme': {
    title: "Arquivme Drive Local NAS",
    tagline: "Seu armazenamento, sua privacidade.",
    description: "Armazene e gerencie seus dados localmente com segurança total.",
    features: ["Acesso remoto", "Backup automático", "Acesso via web"],
    color: "#28a745",
    faq: [
      { q: "O Arquivme é compatível com quais sistemas operacionais?", a: "Ele é compatível com Windows, macOS e Linux." },
      { q: "Posso expandir o armazenamento depois?", a: "Sim, o sistema suporta expansão via discos adicionais." }
    ],
    modules: [],
    gallery: [
    { url: '/images/products/biolink-1.png', alt: 'Interface mobile Visitela' },
    { url: '/images/products/biolink-2.png', alt: 'Painel de analytics' },
  ],

  },
  'treinamento': {
    title: "Treinamento B2B",
    tagline: "Capacitação para o sucesso empresarial.",
    description: "Programas de treinamento personalizados para elevar a performance da sua equipe.",
    features: ["Workshops interativos", "Material exclusivo", "Certificação Afulink"],
    color: "#6f42c1",
    modules: [
      {
        title: "Curso: Fundamentos Digitais para Empresas",
        content: [
          "Introdução ao marketing digital",
          "Ferramentas essenciais para negócios online",
          "Estratégias de presença digital"
        ]
      },
      
    ],
    faq: [
      { q: "O treinamento é presencial?", a: "Oferecemos modalidades tanto presenciais quanto remotas ao vivo." },
      { q: "Tem certificado?", a: "Sim, todos os participantes recebem certificação Afulink." }
    ],
    gallery: []
  },
  'consultoria': {
    title: "Consultoria",
    tagline: "Transformação digital sob medida.",
    description: "Soluções estratégicas para impulsionar a inovação na sua empresa.",
    features: ["Análise de mercado", "Planejamento estratégico", "Implementação tecnológica"],
    color: "#fd7e14",
    faq: [
      { q: "Como funciona a consultoria?", a: "Realizamos um diagnóstico completo e desenvolvemos um plano personalizado." },
      { q: "Qual o prazo médio?", a: "O prazo varia conforme o escopo, mas geralmente entre 3 a 6 meses." }
    ],
    modules: [],
    gallery: []

  }
};