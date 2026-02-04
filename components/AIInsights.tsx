
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Employee, TimeEntry } from '../types';
import { minutesToFormatted } from '../utils/timeCalculator';

interface AIInsightsProps {
  employees: Employee[];
  entries: TimeEntry[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ employees, entries }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const dataString = employees.map(emp => {
        const empEntries = entries.filter(e => e.employeeId === emp.id);
        const totalBal = empEntries.reduce((a, b) => a + b.balanceMinutes, 0);
        return `${emp.name} (${emp.role}): Saldo total de ${minutesToFormatted(totalBal)}.`;
      }).join('\n');

      const prompt = `Como um consultor de RH analítico para a CentraLux (especialista em LED), analise os seguintes dados de ponto dos funcionários e forneça um relatório executivo curto. 
      Identifique padrões de pontualidade, possíveis problemas de banco de horas (quem está com muito saldo negativo ou positivo) e dê 3 sugestões de melhoria.
      Dados:
      ${dataString}
      
      Formate a resposta em Markdown com títulos elegantes.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setInsight(response.text || "Não foi possível gerar insights no momento.");
    } catch (error) {
      console.error(error);
      setInsight("Erro ao conectar com a Inteligência Artificial. Verifique sua chave de API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-sky-500/20 rounded-full flex items-center justify-center mb-4 border border-sky-500/30">
          <svg className="w-8 h-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Relatório de Inteligência CentraLux</h2>
        <p className="text-slate-400 max-w-md mb-6">
          Utilize nossa IA para analisar o desempenho da equipe, prever tendências de atraso e otimizar a escala de trabalho.
        </p>
        <button 
          onClick={generateInsights}
          disabled={loading || employees.length === 0}
          className="bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-600 px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-sky-500/20 flex items-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Analisando Dados...
            </>
          ) : 'Gerar Insight Gerencial'}
        </button>
      </div>

      {insight && (
        <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl prose prose-invert max-w-none animate-in slide-in-from-bottom-4 duration-700">
           <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
              <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
              <h3 className="text-sky-400 font-bold uppercase tracking-widest text-sm m-0">Análise Concluída</h3>
           </div>
           <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
             {insight}
           </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
