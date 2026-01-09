// src/app/api/orcamentos/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface Orcamento {
  titulo: string;
  cliente: string;
  descricao: string;
  validade: string;
  total: string;
  itens: { serviço: string; valor: string }[];
}


const orcamentosDB: Record<string, Orcamento> = {
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
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> } // Tipagem como Promise
) {
  // Aguarda a resolução dos parâmetros
  const { slug } = await params; 
  
  const orcamento = orcamentosDB[slug];

  if (!orcamento) {
    return NextResponse.json(
      { error: `Orçamento '${slug}' não encontrado` }, 
      { status: 404 }
    );
  }

  return NextResponse.json(orcamento);
}