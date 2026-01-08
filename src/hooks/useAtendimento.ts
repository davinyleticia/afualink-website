import { useState } from 'react';

export type AtendimentoData = {
  status: string;
  id?: number;
  titulo?: string;
  nome?: string;
  descricao?: string;
  data?: string;
};

export const useAtendimento = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AtendimentoData | null>(null);
  // Função para abrir novo ticket
  const openTicket = async (ticketData: { email: string; titulo: string; setor: string; descricao: string }) => {
    setLoading(true);
    try {
      const response = await fetch('https://api.afulink.com.br/v1/tickets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      });
      
      if (response.status === 200) {
        alert("Ticket aberto com sucesso!");
        return true;
      } else {
        const err = await response.json();
        alert(err.message || "E-mail não cadastrado em nossa base.");
        return false;
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar dados (Documentos ou Lista de Tickets)
  const fetchData = async (id: string, pass: string, servico: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.afulink.com.br/v1/${servico}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identification: id, password: pass }),
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      alert("Erro ao buscar dados.");
    } finally {
      setLoading(false);
    }
  };

  return { fetchData, openTicket, data, loading };
};