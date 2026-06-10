'use client'
import { useEffect, useState } from 'react';
import api from '../services/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function Estatisticas() {
  const [dados, setDados] = useState<any>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    api.get('/dashboard/estatisticas')
      .then(res => {
        setDados(res.data.data);
      })
      .catch(err => {
        if (err.response && err.response.status === 403) {
          setErro('Acesso negado. Apenas administradores podem ver as estatísticas.');
        } else {
          setErro('Erro ao carregar os dados do painel.');
        }
        console.error(err);
      });
  }, []);

  if (erro) return <div className="p-8 text-red-500 font-bold bg-red-50 min-h-screen flex items-center justify-center">{erro}</div>;
  if (!dados || !mounted) return <div className="p-8 text-slate-500 font-bold min-h-screen flex items-center justify-center">Carregando métricas...</div>;

  const { geral, top_tecnicos, categorias, sla, prioridades } = dados;

  const dataGrafico = (categorias || []).map((cat: any) => ({
    name: cat.categoria,
    "Em Aberto": cat.abertos,
    "Resolvidos": Math.max(0, cat.total - cat.abertos),
  }));

  const catCor: any = {
    'Rede': 'bg-purple-500',
    'Infraestrutura': 'bg-cyan-500',
    'Acesso': 'bg-green-500',
  };

  const card = "bg-white dark:bg-slate-900 p-3 md:p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col";

  // Removido o cálculo de inativos

  return (
    <div className="p-3 md:p-4 bg-slate-50 dark:bg-slate-950 h-full flex flex-col overflow-hidden">
      <h2 className="text-lg md:text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-3">Estatísticas do Sistema</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2">

        {/* CARD 1: STATUS GERAL */}
        <div className={card}>
          <h3 className="text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest">Status dos Chamados</h3>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[10px] md:text-xs font-bold mb-1">
                <span className="text-slate-600 dark:text-slate-300">RESOLVIDOS</span>
                <span className="text-green-600 dark:text-green-400">{geral.resolvidos}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 md:h-4 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full transition-all duration-1000" style={{ width: `${geral.perc_resolvidos}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] md:text-xs font-bold mb-1">
                <span className="text-slate-600 dark:text-slate-300">EM ABERTO</span>
                <span className="text-blue-600 dark:text-blue-400">{geral.abertos}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 md:h-4 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${geral.total > 0 ? (geral.abertos / geral.total) * 100 : 0}%` }}></div>
              </div>
            </div>



            {geral.sem_tecnico > 0 && (
              <div className="mt-2 flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 px-3 py-2 rounded-lg">
                <span className="text-[10px] font-bold">⚠️ {geral.sem_tecnico} chamado{geral.sem_tecnico > 1 ? 's' : ''} sem técnico</span>
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: TOP TÉCNICOS */}
        <div className={card}>
          <h3 className="text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest">Top Técnicos (Performance)</h3>
          <div className="space-y-2 overflow-y-auto max-h-28 pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {top_tecnicos.map((tech: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <div className="bg-slate-800 dark:bg-slate-700 text-white text-[9px] font-bold p-1.5 rounded w-12 text-center">
                  #{tech.id}
                </div>
                <div className="flex-1">
                  <div className="text-[10px] md:text-xs font-bold text-slate-700 dark:text-slate-200 uppercase truncate">{tech.nome}</div>
                  <div className="text-[9px] md:text-[10px] text-slate-400">{tech.resolvidos} chamados finalizados</div>
                </div>
              </div>
            ))}
            {top_tecnicos.length === 0 && (
              <p className="text-[10px] md:text-xs text-slate-400 italic">Nenhum chamado finalizado por um técnico ativo ainda.</p>
            )}
          </div>
        </div>

        {/* CARD 3: SAÚDE DO SLA */}
        <div className={card}>
          <h3 className="text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest">Saúde do SLA (Ativos)</h3>
          <div className="grid grid-cols-3 gap-2 flex-1">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-2 flex flex-col justify-center items-center text-center shadow-sm">
              <span className="text-green-600 dark:text-green-400 text-[9px] font-bold uppercase mb-1">No Prazo</span>
              <span className="text-2xl md:text-3xl font-black text-green-700 dark:text-green-300">{sla?.ok || 0}</span>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-2 flex flex-col justify-center items-center text-center shadow-sm">
              <span className="text-orange-600 dark:text-orange-400 text-[9px] font-bold uppercase mb-1">Alerta</span>
              <span className="text-2xl md:text-3xl font-black text-orange-700 dark:text-orange-300">{sla?.alerta || 0}</span>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2 flex flex-col justify-center items-center text-center shadow-sm">
              <span className="text-red-600 dark:text-red-400 text-[9px] font-bold uppercase mb-1">Vencido</span>
              <span className="text-2xl md:text-3xl font-black text-red-700 dark:text-red-300">{sla?.vencido || 0}</span>
            </div>
          </div>
        </div>

        {/* CARD 4: EFICIÊNCIA */}
        <div className={card}>
          <h3 className="text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Taxa de Eficiência</h3>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white leading-none">{geral.perc_resolvidos}%</span>
            <span className="text-[10px] md:text-xs font-bold text-slate-400 mb-1">de resolução</span>
          </div>
          <p className="text-[9px] md:text-[10px] text-slate-400 leading-relaxed mt-auto">
            Métrica baseada na relação entre chamados totais (ativos) e concluídos (Fechados).
          </p>
        </div>

        {/* CARD 5: POR PRIORIDADE E CATEGORIA */}
        <div className={`${card} md:col-span-2`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start flex-1">
            
            {/* Prioridades à esquerda */}
            <div className="flex flex-col h-full w-full">
              <h3 className="text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Abertos por Prioridade</h3>
              <div className="space-y-3">
                {prioridades && prioridades.length > 0 ? prioridades.map((p: any, i: number) => {
                  const cores: any = {
                    'Baixa': 'bg-blue-500',
                    'Media': 'bg-orange-500',
                    'Alta': 'bg-red-500',
                    'Muito Alta': 'bg-red-700',
                    'Critica': 'bg-red-900'
                  };
                  return (
                    <div key={i} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${cores[p.prioridade] || 'bg-slate-400'}`}></div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">{p.prioridade}</span>
                      </div>
                      <span className="text-xs font-black text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-1 rounded shadow-sm border border-slate-200 dark:border-slate-700">
                        {p.abertos}
                      </span>
                    </div>
                  );
                }) : (
                  <p className="text-[10px] md:text-xs text-slate-400 italic">Nenhum chamado em aberto com prioridade classificada.</p>
                )}
              </div>
            </div>

            {/* Gráfico do Recharts à direita (Categorias) */}
            <div className="flex flex-col h-full w-full mt-2 lg:mt-0">
              <h3 className="text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Chamados por Categoria</h3>
              <div className="h-40 md:h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataGrafico} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(51, 65, 85, 0.5)',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '11px',
                    }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend verticalAlign="top" height={32} iconType="circle" iconSize={6} wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="Em Aberto" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Em Aberto" />
                  <Bar dataKey="Resolvidos" fill="#10b981" radius={[4, 4, 0, 0]} name="Resolvidos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}