import React, { useState } from 'react';
import { TimeEntry, Employee } from '../types';

interface AIInsightsProps {
  employees: Employee[];
  entries: TimeEntry[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ employees, entries }) => {
  const [insights, setInsights] = useState<string>('');

  const generateInsights = () => {
    const totalEmployees = employees.length;
    const totalEntries = entries.length;
    const avgEntriesPerEmployee = totalEmployees > 0 ? (totalEntries / totalEmployees).toFixed(2) : 0;

    const insight = `
      Análise de Dados:
      - Total de Funcionários: ${totalEmployees}
      - Total de Registros: ${totalEntries}
      - Média de Registros por Funcionário: ${avgEntriesPerEmployee}
    `;
    setInsights(insight);
  };

  return (
    <div className="ai-insights">
      <h2>Insights com IA</h2>
      <button onClick={generateInsights}>Gerar Análise</button>
      {insights && (
        <div className="insights-result">
          <pre>{insights}</pre>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
