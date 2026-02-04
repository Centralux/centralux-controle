
import React, { useState, useMemo } from 'react';
import { Employee, TimeEntry, AttendanceStatus } from '../types';
import { calculateBalance, minutesToFormatted } from '../utils/timeCalculator';

interface AttendanceLogProps {
  employees: Employee[];
  onAddEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  onDeleteEntry: (id: string) => void;
  entries: TimeEntry[];
  readOnly?: boolean;
}

const AttendanceLog: React.FC<AttendanceLogProps> = ({ employees, onAddEntry, onDeleteEntry, entries, readOnly = false }) => {
  const [selectedEmp, setSelectedEmp] = useState('');
  const [arrivalTime, setArrivalTime] = useState('08:30');
  const [overtimeAmount, setOvertimeAmount] = useState('60'); // Minutes for explicit overtime
  const [status, setStatus] = useState<AttendanceStatus>(AttendanceStatus.PRESENT);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterEmp, setFilterEmp] = useState('all');

  const handleRegister = () => {
    if (!selectedEmp) return;

    let balance = 0;
    let overtime = 0;

    if (status === AttendanceStatus.OVERTIME) {
      balance = 0;
      overtime = parseInt(overtimeAmount) || 0;
    } else {
      balance = calculateBalance(status, status === AttendanceStatus.PRESENT ? arrivalTime : null);
      overtime = 0;
    }

    onAddEntry({
      employeeId: selectedEmp,
      date,
      arrivalTime: status === AttendanceStatus.PRESENT ? arrivalTime : null,
      status,
      balanceMinutes: balance,
      overtimeMinutes: overtime
    });

    // Reset some values but keep employee for multiple entries
    if (status === AttendanceStatus.OVERTIME) setOvertimeAmount('60');
  };

  // Calculate Running Balance for the filtered list
  const displayEntries = useMemo(() => {
    let filtered = [...entries];
    if (filterEmp !== 'all') {
      filtered = filtered.filter(e => e.employeeId === filterEmp);
    }
    
    // Sort by date to calculate running balance correctly
    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [entries, filterEmp]);

  // Map to get running balances per index
  const entriesWithRunningBalances = useMemo(() => {
    let currentBankBalance = 0;
    let currentOvertimeBalance = 0;
    return displayEntries.map(entry => {
      currentBankBalance += entry.balanceMinutes;
      currentOvertimeBalance += (entry.overtimeMinutes || 0);
      return { ...entry, runningBankBalance: currentBankBalance, runningOvertimeBalance: currentOvertimeBalance };
    });
  }, [displayEntries]);

  return (
    <div className="space-y-8">
      {/* Registration Form */}
      <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <svg className="w-32 h-32 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
        
        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-8 border-l-4 border-sky-500 pl-4 italic">Novo Registro de Ponto</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
          <div className="flex flex-col gap-2">
            <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Data do Ponto</label>
            <input 
              type="date"
              style={{ colorScheme: 'light' }}
              className="bg-slate-800/50 border border-slate-700 p-3 rounded-xl outline-none text-white focus:border-sky-500 transition-colors"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Funcionário</label>
            <select 
              className="bg-slate-800/50 border border-slate-700 p-3 rounded-xl outline-none text-white focus:border-sky-500 transition-colors"
              value={selectedEmp}
              onChange={e => setSelectedEmp(e.target.value)}
            >
              <option value="">Selecione...</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Ocorrência</label>
            <select 
              className="bg-slate-800/50 border border-slate-700 p-3 rounded-xl outline-none text-white focus:border-sky-500 transition-colors"
              value={status}
              onChange={e => setStatus(e.target.value as AttendanceStatus)}
            >
              <option value={AttendanceStatus.PRESENT}>No Horário / Atraso / Extra Banco</option>
              <option value={AttendanceStatus.OVERTIME}>Hora Extra Especial (Separada)</option>
              <option value={AttendanceStatus.ABSENT}>Falta</option>
              <option value={AttendanceStatus.JUSTIFIED_ABSENCE}>Falta Justificada</option>
            </select>
          </div>

          {status === AttendanceStatus.PRESENT && (
            <div className="flex flex-col gap-2">
              <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Hora de Chegada</label>
              <input 
                type="time"
                style={{ colorScheme: 'light' }}
                className="bg-slate-800/50 border border-slate-700 p-3 rounded-xl outline-none text-white focus:border-sky-500 transition-colors"
                value={arrivalTime}
                onChange={e => setArrivalTime(e.target.value)}
              />
            </div>
          )}

          {status === AttendanceStatus.OVERTIME && (
            <div className="flex flex-col gap-2">
              <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Minutos Extras</label>
              <input 
                type="number"
                min="0"
                className="bg-slate-800/50 border border-slate-700 p-3 rounded-xl outline-none text-white focus:border-sky-500 transition-colors"
                value={overtimeAmount}
                onChange={e => setOvertimeAmount(e.target.value)}
              />
            </div>
          )}

          <button 
            onClick={handleRegister}
            disabled={!selectedEmp}
            className="bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-600 text-white p-3 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-sky-500/10 active:scale-95"
          >
            REGISTRAR
          </button>
        </div>
      </div>

      {/* Filter and History */}
      <div className="bg-slate-900/40 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
           <div>
             <h3 className="font-bold text-white uppercase text-sm tracking-widest">Histórico Detalhado</h3>
             <p className="text-slate-500 text-[10px] uppercase font-bold mt-1 tracking-tighter">Extrato de compensação e banco de horas</p>
           </div>
           
           <div className="flex items-center gap-3">
             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Filtrar por:</label>
             <select 
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 p-2 rounded-lg outline-none"
                value={filterEmp}
                onChange={e => setFilterEmp(e.target.value)}
             >
                <option value="all">Todos os Funcionários</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
             </select>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/50 text-slate-500 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-6 py-4">Ação</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Colaborador</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Banco de Horas</th>
                <th className="px-6 py-4">H. Extra</th>
                <th className="px-6 py-4 text-right">Saldo Acumulado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {[...entriesWithRunningBalances].reverse().map(entry => {
                const emp = employees.find(e => e.id === entry.employeeId);
                return (
                  <tr key={entry.id} className="hover:bg-sky-400/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => onDeleteEntry(entry.id)}
                        className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
                        title="Excluir Registro"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-400 text-xs">{entry.date.split('-').reverse().join('/')}</td>
                    <td className="px-6 py-4 font-bold text-slate-200">{emp?.name || 'Inativo'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                        entry.status === AttendanceStatus.PRESENT ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        entry.status === AttendanceStatus.OVERTIME ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                        entry.status === AttendanceStatus.ABSENT ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {entry.status === AttendanceStatus.OVERTIME ? 'H. EXTRA' : entry.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 font-mono font-bold text-xs ${entry.balanceMinutes > 0 ? 'text-emerald-400' : entry.balanceMinutes < 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                      {entry.balanceMinutes === 0 ? '--' : minutesToFormatted(entry.balanceMinutes)}
                    </td>
                    <td className={`px-6 py-4 font-mono font-bold text-xs ${entry.overtimeMinutes > 0 ? 'text-sky-400' : 'text-slate-500'}`}>
                      {entry.overtimeMinutes > 0 ? minutesToFormatted(entry.overtimeMinutes) : '--'}
                    </td>
                    <td className={`px-6 py-4 font-mono font-black text-right ${entry.runningBankBalance >= 0 ? 'text-emerald-400 led-text-glow' : 'text-rose-400'}`}>
                      {minutesToFormatted(entry.runningBankBalance)}
                    </td>
                  </tr>
                );
              })}
              {entriesWithRunningBalances.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-600 font-medium italic">Nenhum registro encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceLog;
