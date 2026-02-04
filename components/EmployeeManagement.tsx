import React, { useState } from 'react';
import { Employee } from '../types';

interface EmployeeManagementProps {
  employees: Employee[];
  onAddEmployee: (employee: Employee) => void;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ employees, onAddEmployee }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        name,
        email,
        department: '',
        status: 'active',
        joinDate: new Date().toISOString(),
      };
      onAddEmployee(newEmployee);
      setName('');
      setEmail('');
    }
  };

  return (
    <div className="employee-management">
      <h2>Gerenciamento de Funcionários</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Adicionar Funcionário</button>
      </form>

      <div className="employee-list">
        <h3>Funcionários</h3>
        {employees.map((emp) => (
          <div key={emp.id} className="employee-item">
            <p><strong>{emp.name}</strong></p>
            <p>{emp.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeManagement;
