import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.afulink.com.br';

  // Páginas Estáticas principais
  const staticPages = [
    '',
    '/sobre',
    '/atendimento',
    '/contato',
    '/produtos',
    '/carreira',
    '/privacidade',
    '/termos',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8, // Home tem prioridade máxima
  }));

  // Se você quiser indexar os produtos dinamicamente:
  // const produtos = ['visitela', 'arquivme'].map((slug) => ({
  //   url: `${baseUrl}/produtos/${slug}`,
  //   lastModified: new Date(),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.7,
  // }));

  return [...staticPages];
}