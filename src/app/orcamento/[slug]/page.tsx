'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './Orcamento.module.css';

interface OrcamentoData {
    cliente: string;
    descricao: string;
    validade: string;
    total: string;
    itens: { serviço: string; valor: string }[];
}

const OrcamentoPage = () => {
    const params = useParams();
    const [data, setData] = useState<OrcamentoData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrcamento = async () => {
            try {
                const res = await fetch(`/api/orcamentos/${params.slug}`);
                if (!res.ok) throw new Error('Orçamento não encontrado no sistema.');

                const json = await res.json();
                setData(json);
            } catch (err: unknown) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (params.slug) fetchOrcamento();
    }, [params.slug]);

    if (loading) return <div className={styles.statusMsg}>Carregando dados do orçamento...</div>;
    if (error) return (
        <main className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.statusMsg}>Nenhum dado disponível para este orçamento.
                </div>
            </div>
        </main>);
    return (
        <main className={styles.wrapper}>
            <div className={styles.container}>
                {/* Adicionei uma classe extra aqui para garantir a seleção no CSS */}
                <header className={`${styles.header} proposal-header`}>
                    <div>
                        <h1 className="text-[#003366] font-black text-2xl uppercase tracking-tighter">Afulink</h1>
                        <p className="text-[#f37021] text-[10px] font-bold tracking-widest uppercase">Consultoria Tech</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                        <p><strong>Proposta:</strong> #{params.slug}</p>
                        <p><strong>Validade:</strong> {data?.validade}</p>
                    </div>
                </header>

                {/* Informações do Cliente */}
                <section className="my-10">
                    <h2 className="text-gray-400 text-xs uppercase font-bold mb-2">Cliente:</h2>
                    <h3 className="text-[#003366] text-2xl font-bold">{data?.cliente}</h3>
                    <p className="text-gray-600 mt-4 leading-relaxed">{data?.descricao}</p>
                </section>

                {/* Tabela de Investimento */}
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Descrição do Serviço</th>
                            <th className="text-right">Investimento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.itens.map((item, index) => (
                            <tr key={index}>
                                <td>{item.serviço}</td>
                                <td className="text-right font-bold text-[#003366]">{item.valor}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="text-[#f37021]">
                            <td className="font-bold pt-6 text-lg">Total da Proposta</td>
                            <td className="text-right font-black text-2xl pt-6">{data?.total}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* Rodapé do Documento */}
                <div className={styles.footerOrcamento}>
                    <p className="text-[10px] text-gray-400 max-w-sm">
                        Esta proposta é confidencial e destinada exclusivamente ao cliente citado.
                        Pagamentos via PIX ou Boleto Bancário conforme contrato de prestação de serviços.
                    </p>
                    <button
                        onClick={() => window.print()}
                        className={styles.btnPrint}
                    >
                        Salvar em PDF
                    </button>
                </div>
            </div>
        </main>
    );
};

export default OrcamentoPage;