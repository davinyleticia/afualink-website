import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/orcamento/', // Bloqueia a indexação de qualquer link de orçamento
        '/api/',       // Bloqueia rotas de API
      ],
    },
    sitemap: 'https://www.afulink.com.br/sitemap.xml',
  };
}