import React from 'react';
import { Employee, TimeEntry } from '../types';

interface DataManagementProps {
  employees: Employee[];
  entries: TimeEntry[];
  onExport: () => void;
}

const DataManagement: React.FC<DataManagementProps> = ({ employees, entries, onExport }) => {
  return (
    <div className="data-management">
      <h2>Gerenciamento de Dados</h2>
      
      <div className="data-stats">
        <div className="stat">
          <h3>Funcionários</h3>
          <p>{employees.length}</p>
        </div>
        <div className="stat">
          <h3>Registros de Ponto</h3>
          <p>{entries.length}</p>
        </div>
      </div>

      <div className="actions">
        <button onClick={onExport}>Exportar Dados</button>
        <button>Importar Dados</button>
        <button>Backup</button>
      </div>
    </div>
  );
};

export default DataManagement;
