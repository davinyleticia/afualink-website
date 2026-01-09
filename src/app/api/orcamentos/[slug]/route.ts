// src/app/api/orcamentos/[slug]/route.ts
import { NextResponse } from 'next/server';

const orcamentosDB: Record<string, any> = {
  'projeto-biolink-2026': {
    titulo: "Implementação Visitela Biolink Premium",
    cliente: "Academia Fitness Total",
    descricao: "Configuração de vitrine digital personalizada com suporte prioritário.",
    itens: [
      { serviço: "Licença Visitela Pro (Anual)", valor: "R$ 590,00" },
      { serviço: "Configuração e Design", valor: "R$ 500,00" },
    ],
    total: "R$ 1.090,00",
    validade: "25 de Janeiro de 2026"
  }
};

export async function GET(
  request: Request,
  context: { params: { slug: string } } // Alterado para context
) {
  // Em versões recentes, pode ser necessário aguardar o params
  const params = await context.params; 
  const slug = params.slug;
  
  const orcamento = orcamentosDB[slug];

  if (!orcamento) {
    return NextResponse.json(
      { error: `Orçamento '${slug}' não encontrado` }, 
      { status: 404 }
    );
  }

  return NextResponse.json(orcamento);
}