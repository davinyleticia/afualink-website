import { useState } from 'react';

// URL base do seu servidor Flask na Vercel
const API_BASE_URL = 'https://serverless-tau-green.vercel.app/api/customer-service';

export type AtendimentoData = {
  // Tipagem para Certificados
  name?: string;
  number?: string;
  issue_date?: string;
  file_path?: string;
  // Tipagem para validação rápida
  result?: string;
  user?: string;
  // Tipagem para Invoices/Financeiro
  due_date?: string;
  amount?: number;
  status?: string;
  type_doc?: string;
};

export const useAtendimento = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AtendimentoData[] | AtendimentoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 1. Abrir Novo Ticket (Autenticado)
  const openTicket = async (ticketData: { ra: string; password: string; title: string; category: string; description: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData), // Agora envia RA e Password junto
      });
      
      const result = await response.json();

      if (response.ok) {
        return true;
      } else {
        setError(result.error || "Erro ao criar ticket.");
        return false;
      }
    } catch (err) {
      setError("Erro de conexão com o servidor.");
      return false;
    } finally {
      setLoading(false);
    }
  };



  // 3. Enviar Resposta em Ticket Existente
  const sendReply = async (ra: string, pass: string, ticketId: number, content: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ra, password: pass, ticket_id: ticketId, content }),
      });
      return response.ok;
    } catch (err) {
      setError("Erro ao enviar mensagem.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 2. Buscar Listas (Certificados, Invoices, Documentos)
  // servico pode ser: 'certificates/list_certificates', 'invoices/list_invoices', etc.
  const fetchData = async (ra: string, pass: string, servico: string) => {
    setLoading(true);
    setData(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${servico}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ra: ra, password: pass }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Erro nas credenciais");
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (error: any) {
      setError(error.message || "Erro ao buscar dados.");
      alert(error.message || "Erro ao buscar dados.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 3. Validação de Certificado (Pública - Sem senha)
  const validateCertificate = async (ra: string, code: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/certificates/validation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ra: ra, code_c: code }),
      });
      
      const result = await response.json();
      setData(result);
      return result;
    } catch (error) {
      setError("Erro ao validar certificado.");
      alert("Erro ao validar certificado.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchData, openTicket, validateCertificate, data, loading, error };
};

export default useAtendimento;