
import React, { useState } from 'react';
import { Employee } from '../types';

interface EmployeeManagementProps {
  employees: Employee[];
  onAdd: (emp: Omit<Employee, 'id'>) => void;
  onRemove: (id: string) => void;
  readOnly?: boolean;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ employees, onAdd, onRemove, readOnly = false }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', department: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...formData, startDate: new Date().toISOString() });
    setFormData({ name: '', role: '', department: '' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold uppercase tracking-tighter italic">Equipe CentraLux</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded-lg font-bold uppercase text-xs tracking-widest transition-colors shadow-lg shadow-sky-500/10"
        >
          {isAdding ? 'CANCELAR' : '+ NOVO FUNCIONÁRIO'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-sky-500/30 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4">
          <input 
            required
            placeholder="Nome Completo"
            className="bg-slate-800 border border-slate-700 p-2 rounded-lg outline-none focus:border-sky-500 text-white"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <input 
            required
            placeholder="Cargo"
            className="bg-slate-800 border border-slate-700 p-2 rounded-lg outline-none focus:border-sky-500 text-white"
            value={formData.role}
            onChange={e => setFormData({...formData, role: e.target.value})}
          />
          <input 
            required
            placeholder="Departamento"
            className="bg-slate-800 border border-slate-700 p-2 rounded-lg outline-none focus:border-sky-500 text-white"
            value={formData.department}
            onChange={e => setFormData({...formData, department: e.target.value})}
          />
          <button type="submit" className="md:col-span-3 bg-sky-600 hover:bg-sky-500 py-2 rounded-lg font-black uppercase tracking-widest text-white">
            CONFIRMAR CADASTRO
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map(emp => (
          <div key={emp.id} className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex justify-between items-center group hover:border-sky-500/30 transition-all">
            <div>
              <h3 className="font-bold text-slate-100">{emp.name}</h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{emp.role} • {emp.department}</p>
            </div>
            <button 
              onClick={() => onRemove(emp.id)}
              className="text-slate-600 hover:text-rose-500 p-2 transition-colors opacity-0 group-hover:opacity-100"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
        {employees.length === 0 && (
          <p className="text-slate-600 italic col-span-full text-center py-12 text-sm">Nenhum funcionário cadastrado na equipe.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;
