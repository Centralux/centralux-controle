import React from 'react';
import { Employee, TimeEntry } from '../types';

interface DashboardProps {
  employees: Employee[];
  entries: TimeEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ employees, entries }) => {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats">
        <div className="stat-card">
          <h3>Total de Funcionários</h3>
          <p>{employees.length}</p>
        </div>
        <div className="stat-card">
          <h3>Registros de Ponto</h3>
          <p>{entries.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
