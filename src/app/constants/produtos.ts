import { url } from "inspector/promises";
import { text } from "stream/consumers";

// constants/products.ts
export const productsData = {
  'biolink': {
    type: 'biolink',
    title: "Visitela Biolink",
    tagline: "Venha se aconchegar no nosso servidor e tenha uma experiência única.",
    description: "Se junta ao universo visitela, com o seu: nome, comércio, banda, influencer e partilhe com quem quiser.",
    features: ["Links ilimitados", "Personalização de cores", "Analytics avançado"],
    color: "#f37021",
    faq: [
      { q: "Como fica o url do meu biolink?", a: "visite.la/seunome" },
      { q: "Posso ter ilimitados links?", a: "Sim, não há limite para a quantidade de links que você pode adicionar." },
      { q: "O painel de controle é fácil de usar?", a: "Sim, nosso painel é intuitivo e fácil de navegar." }
    ],
    modules: [],
    gallery: [
      {
        url: '/img/visitela.svg',
        alt: 'Interface desktop Visitela',
        widthImg: "30%",
        title: "RP1",
        text: "Raspberry Pi 5 is built using the RP1 controller, a package containing silicon designed in-house at Raspberry Pi.\nUSB 3 has more total bandwidth, for much faster transfer speeds.\n\nCamera and DSI display connectors are interchangeable, so you can have one of each, or two the same."
      },
      {
        url: "/img/tela-start11.svg",
        alt: "Processador",
        widthImg: "60%",
        title: "More than twice as fast and infinitely smoother",
        text: "Raspberry Pi 5 features the Broadcom BCM2712 quad-core Arm Cortex-A76 processor @ 2.4GHz, making it up to three times faster than the previous generation.\n\nWith RAM variants up to 16GB, this is the fastest, smoothest Raspberry Pi experience yet."
      },
    ],
    banner: "/img/-img.svg", alt: "Banner do Visitela Biolink",
    imgPrincipal: "/img/pc-start.svg", altPrincipal: "Imagem principal do Visitela Biolink", widthImgPrincipal: "370%",
    login: 'https://biolink.visite.la/',
  },
  'cms': {
    type: 'cms',
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
    gallery: [
      {
        url: '/img/visitela.svg',
        alt: 'Interface desktop Visitela',
        widthImg: "30%",
        title: "RP1",
        text: "Raspberry Pi 5 is built using the RP1 controller, a package containing silicon designed in-house at Raspberry Pi.\nUSB 3 has more total bandwidth, for much faster transfer speeds.\n\nCamera and DSI display connectors are interchangeable, so you can have one of each, or two the same."
      },
      {
        url: "/img/tela-start11.svg",
        alt: "Processador",
        widthImg: "60%",
        title: "More than twice as fast and infinitely smoother",
        text: "Raspberry Pi 5 features the Broadcom BCM2712 quad-core Arm Cortex-A76 processor @ 2.4GHz, making it up to three times faster than the previous generation.\n\nWith RAM variants up to 16GB, this is the fastest, smoothest Raspberry Pi experience yet."
      },
      {
        url: "/img/pc-start.svg",
        alt: "PCI Express",
        widthImg: "60%",
        title: "All aboard the PCI express",
        text: "The addition of Raspberry Pi’s PCI express lane allows you to connect an M.2 SSD to your Raspberry Pi, giving you speedy data transfer and super-fast boot."
      }
    ],

    banner: "",
    imgPrincipal: "/img/cms.png", altPrincipal: " Imagem principal do Visitela CMS", widthImgPrincipal: "370%",
    login: 'https://cms.visite.la/',
  },
  'arquivme': {
    type: 'arquivme',  
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
      {
        url: '/img/visitela.svg',
        alt: 'Interface desktop Visitela',
        widthImg: "30%",
        title: "RP1",
        text: "Raspberry Pi 5 is built using the RP1 controller, a package containing silicon designed in-house at Raspberry Pi.\nUSB 3 has more total bandwidth, for much faster transfer speeds.\n\nCamera and DSI display connectors are interchangeable, so you can have one of each, or two the same."
      },
      {
        url: "/img/tela-start11.svg",
        alt: "Processador",
        widthImg: "60%",
        title: "More than twice as fast and infinitely smoother",
        text: "Raspberry Pi 5 features the Broadcom BCM2712 quad-core Arm Cortex-A76 processor @ 2.4GHz, making it up to three times faster than the previous generation.\n\nWith RAM variants up to 16GB, this is the fastest, smoothest Raspberry Pi experience yet."
      },
      {
        url: "/img/pc-start.svg",
        alt: "PCI Express",
        widthImg: "60%",
        title: "All aboard the PCI express",
        text: "The addition of Raspberry Pi’s PCI express lane allows you to connect an M.2 SSD to your Raspberry Pi, giving you speedy data transfer and super-fast boot."
      }
    ],
    banner: "",
    imgPrincipal: "/img/nas-arquivme.png", altPrincipal: "NAS", widthImgPrincipal: "370%",
    login: '',

  },
  'treinamento': {
    type: 'treinamento',
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
    banner: "",
    faq: [
      { q: "O treinamento é presencial?", a: "Oferecemos modalidades tanto presenciais quanto remotas ao vivo." },
      { q: "Tem certificado?", a: "Sim, todos os participantes recebem certificação Afulink." }
    ],
    gallery: [
      {
        url: "/img/visitela.svg",
        alt: "Interface desktop Visitela",
        widthImg: "30%",
        title: "RP1",
        text: "Raspberry Pi 5 is built using the RP1 controller, a package containing silicon designed in-house at Raspberry Pi.\nUSB 3 has more total bandwidth, for much faster transfer speeds.\n\nCamera and DSI display connectors are interchangeable, so you can have one of each, or two the same."
      },
      {
        url: "/img/tela-start11.svg",
        alt: "Processador",
        widthImg: "60%",
        title: "More than twice as fast and infinitely smoother",
        text: "Raspberry Pi 5 features the Broadcom BCM2712 quad-core Arm Cortex-A76 processor @ 2.4GHz, making it up to three times faster than the previous generation.\n\nWith RAM variants up to 16GB, this is the fastest, smoothest Raspberry Pi experience yet."
      },
      {
        url: "/img/pc-start.svg",
        alt: "PCI Express",
        widthImg: "60%",
        title: "All aboard the PCI express",
        text: "The addition of Raspberry Pi’s PCI express lane allows you to connect an M.2 SSD to your Raspberry Pi, giving you speedy data transfer and super-fast boot."
      }
    ],
    imgPrincipal: "/img/it-training.png", altPrincipal: "Treinamento IT", widthImgPrincipal: "370%",
    login: '',
  },
  'consultoria': {
    type: 'consultoria',
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
    gallery: [
      {
        url: "/img/consult-1.webp",
        alt: "Interface desktop Visitela",
        widthImg: "60%",
        title: "Consultoria",
        imageIndex: 0,
        text: "Definição dos requisitos e especificações técnicas do produto.\nDefinição da arquitetura de software do projeto.\nEscolha do sistema operacional (Linux, Android, RTOS, etc).\nEscolha e integração de pacotes e bibliotecas de código aberto.\nSeleção e configuração das ferramentas de desenvolvimento.\nRevisão de código e controle de qualidade.\nLevantamento de conformidade com licenças de código aberto.\nLevantamento de falhas de segurança e pentest de produtos eletrônicos."      },
      {
        url: "/img/consult-2.webp",
        alt: "Processador",
        widthImg: "60%",
        imageIndex: 1,
        title: "Desenvolvimento",
        text: "Desenvolvimento de firmware (C, C++ e Assembly).\nSoftware com sistemas operacionais de tempo real (FreeRTOS, Zephyr, etc).\nDesenvolvimento de device drivers para ARM, PPC, MIPS e x86.\nPorte de aplicações e sistemas operacionais para diferentes plataformas e arquiteturas.\nDesenvolvimento e customização de distribuições Linux (Buildroot, Yocto Project).\nDesenvolvimento de device drivers para o kernel Linux.\nDesenvolvimento de BSP (Board Support Package) para diferentes plataformas de hardware.\nConfiguração de ambiente de desenvolvimento para Linux embarcado."

      },
    ],
    banner: "",
    imgPrincipal: "/img/consultoria.png", altPrincipal: "Consultoria", widthImgPrincipal: "370%",
    login: '',
  }
};