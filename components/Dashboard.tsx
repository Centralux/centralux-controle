
import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Employee, TimeEntry, AttendanceStatus } from '../types';
import { minutesToFormatted } from '../utils/timeCalculator';

interface DashboardProps {
  employees: Employee[];
  entries: TimeEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ employees, entries }) => {
  const [dateFilter, setDateFilter] = useState<string>('all'); // 'all' or 'YYYY-MM-DD'

  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const formattedToday = now.toLocaleDateString('pt-BR');
    
    // Calculate start of current week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Calculate start of current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const summary = employees.map(emp => {
      const empEntries = entries.filter(e => e.employeeId === emp.id);
      
      // Filto Acumulado: Se houver filtro, pega tudo ATÉ a data. Se não, pega TUDO.
      const entriesUntilFilter = dateFilter === 'all' 
        ? empEntries 
        : empEntries.filter(e => e.date <= dateFilter);

      const weeklyEntries = empEntries.filter(e => new Date(e.date + 'T00:00:00') >= startOfWeek);
      const monthlyEntries = empEntries.filter(e => new Date(e.date + 'T00:00:00') >= startOfMonth);
      
      const displayDate = dateFilter === 'all' ? todayStr : dateFilter;
      const displayFormattedDate = dateFilter === 'all' ? formattedToday : displayDate.split('-').reverse().join('/');
      
      const dayEntries = empEntries.filter(e => e.date === displayDate);

      const presentEntry = dayEntries.find(e => e.status === AttendanceStatus.PRESENT);
      const overtimeOnlyEntry = dayEntries.find(e => e.status === AttendanceStatus.OVERTIME);
      
      let arrivalDisplay = 'S/REGISTRO';
      if (presentEntry) {
        arrivalDisplay = presentEntry.arrivalTime || presentEntry.status;
      } else if (overtimeOnlyEntry) {
        arrivalDisplay = 'SÓ EXTRA';
      } else if (dayEntries.length > 0) {
        arrivalDisplay = dayEntries[0].status;
      }

      const dayBalance = dayEntries.reduce((acc, curr) => acc + curr.balanceMinutes, 0);
      const dayOvertime = dayEntries.reduce((acc, curr) => acc + (curr.overtimeMinutes || 0), 0);

      return {
        id: emp.id,
        name: emp.name.split(' ')[0],
        fullName: emp.name,
        role: emp.role,
        // Acumulado até a data do filtro (ou hoje se 'all')
        totalBalance: entriesUntilFilter.reduce((acc, curr) => acc + curr.balanceMinutes, 0),
        totalOvertime: entriesUntilFilter.reduce((acc, curr) => acc + (curr.overtimeMinutes || 0), 0),
        
        weeklyBalance: weeklyEntries.reduce((acc, curr) => acc + curr.balanceMinutes, 0),
        monthlyBalance: monthlyEntries.reduce((acc, curr) => acc + curr.balanceMinutes, 0),
        monthlyOvertime: monthlyEntries.reduce((acc, curr) => acc + (curr.overtimeMinutes || 0), 0),
        
        arrivalDisplay,
        displayFormattedDate,
        dayBalance,
        dayOvertime,
        hasRecord: dayEntries.length > 0,
      };
    }).sort((a, b) => b.totalBalance - a.totalBalance);

    const filteredEntriesForStatus = dateFilter === 'all' 
      ? entries 
      : entries.filter(e => e.date === dateFilter);

    const statusData = [
      { name: 'Presente', value: filteredEntriesForStatus.filter(e => e.status === AttendanceStatus.PRESENT).length, color: '#38bdf8' },
      { name: 'Falta', value: filteredEntriesForStatus.filter(e => e.status === AttendanceStatus.ABSENT).length, color: '#f43f5e' },
      { name: 'Justificada', value: filteredEntriesForStatus.filter(e => e.status === AttendanceStatus.JUSTIFIED_ABSENCE).length, color: '#fbbf24' },
      { name: 'H. Extra', value: filteredEntriesForStatus.filter(e => e.status === AttendanceStatus.OVERTIME).length, color: '#818cf8' },
    ];

    return { summary, statusData, formattedToday, isFiltered: dateFilter !== 'all' };
  }, [employees, entries, dateFilter]);

  const totalDisplayBank = stats.summary.reduce((acc, curr) => acc + curr.totalBalance, 0);
  const totalDisplayOvertime = stats.summary.reduce((acc, curr) => acc + curr.totalOvertime, 0);

  return (
    <div className="space-y-6">
      {/* Date Filter Bar */}
      <div className="bg-slate-900/60 border border-sky-500/20 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-sky-500/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-500/30">
            <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Filtro de Análise</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Consulte a eficiência diária da equipe</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button 
            onClick={() => setDateFilter('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${!stats.isFiltered ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Limpar Filtro
          </button>
          <div className="w-px h-4 bg-slate-800 mx-1"></div>
          <input 
            type="date"
            style={{ colorScheme: 'light' }}
            className={`bg-white/10 text-xs font-bold uppercase outline-none px-3 py-1.5 rounded-lg transition-all border ${stats.isFiltered ? 'text-white border-sky-500/50 bg-sky-500/20' : 'text-slate-300 border-slate-700 hover:border-slate-600'}`}
            value={dateFilter === 'all' ? '' : dateFilter}
            onChange={(e) => setDateFilter(e.target.value || 'all')}
          />
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Colaboradores', value: employees.length, color: 'sky' },
          { 
            label: !stats.isFiltered ? 'Saldo Geral Banco' : 'Banco Acumulado (até a data)', 
            value: minutesToFormatted(totalDisplayBank), 
            color: totalDisplayBank >= 0 ? 'emerald' : 'rose' 
          },
          { 
            label: !stats.isFiltered ? 'Extra Especial Total' : 'Extra Acumulado (até a data)', 
            value: minutesToFormatted(totalDisplayOvertime), 
            color: 'sky' 
          },
          { 
            label: !stats.isFiltered ? 'Faltas Acumuladas' : 'Faltas no Dia', 
            value: (stats.isFiltered ? entries.filter(e => e.date === dateFilter) : entries).filter(e => e.status === AttendanceStatus.ABSENT).length, 
            color: 'rose' 
          }
        ].map((item, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group transition-all hover:border-slate-700">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{item.label}</p>
            <h3 className={`text-2xl font-black mt-2 tracking-tighter ${item.color === 'emerald' ? 'text-emerald-400' : item.color === 'rose' ? 'text-rose-400' : 'text-sky-400'}`}>
              {item.value}
            </h3>
            <div className={`absolute bottom-0 left-0 h-1 bg-${item.color}-500 transition-all duration-500 group-hover:w-full w-0 opacity-30`}></div>
          </div>
        ))}
      </div>

      {/* Main Stats Table */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 bg-slate-950/20 flex justify-between items-center">
          <h4 className="text-sm font-black text-white uppercase tracking-widest border-l-4 border-sky-500 pl-4">Extrato de Eficiência Liang Solution</h4>
          <div className="flex items-center gap-4">
            {!stats.isFiltered ? (
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-500 uppercase block tracking-widest">Data de Referência</span>
                <span className="text-xs font-black text-sky-400">{stats.formattedToday}</span>
              </div>
            ) : (
              <div className="bg-sky-500/10 border border-sky-500/20 px-4 py-2 rounded-xl flex items-center gap-2 shadow-inner">
                <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(14,165,233,0.8)]"></span>
                <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">FILTRO: {dateFilter.split('-').reverse().join('/')}</span>
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/40 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-800/50">
              <tr>
                <th className="px-6 py-4">Colaborador</th>
                <th className="px-6 py-4 text-center">Ref. Data</th>
                <th className="px-6 py-4 text-center text-sky-400">Entrada</th>
                <th className="px-6 py-4 text-center text-sky-400">Extra (Ref. Dia)</th>
                <th className="px-6 py-4 text-center text-emerald-400">Saldo Banco (Dia)</th>
                <th className="px-6 py-4 text-center">Extra (Mês Atual)</th>
                <th className="px-6 py-4 text-right">Acumulado Total*</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {stats.summary.map(emp => (
                <tr key={emp.id} className="hover:bg-sky-400/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-200">{emp.fullName}</div>
                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">{emp.role}</div>
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    <span className="font-mono text-[11px] text-slate-400 font-bold">
                      {emp.displayFormattedDate}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className={`font-mono font-black text-xs px-3 py-1.5 rounded-lg border ${
                      emp.arrivalDisplay === 'S/REGISTRO' 
                        ? 'text-slate-600 border-slate-800/50 bg-slate-900/30' 
                        : 'text-sky-400 border-sky-500/20 bg-sky-500/5 led-text-glow'
                    }`}>
                      {emp.arrivalDisplay}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    {emp.dayOvertime > 0 ? (
                      <span className="font-mono font-black text-xs text-sky-400 bg-sky-500/10 px-2 py-1 rounded border border-sky-500/20 led-text-glow">
                        {minutesToFormatted(emp.dayOvertime)}
                      </span>
                    ) : (
                      <span className="text-slate-700 text-[10px] font-bold">--</span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    {!emp.hasRecord ? (
                      <span className="text-slate-700 text-[10px] font-bold italic">--</span>
                    ) : (
                      <span className={`font-mono font-black text-sm ${emp.dayBalance > 0 ? 'text-emerald-400' : emp.dayBalance < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                        {minutesToFormatted(emp.dayBalance)}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className={`font-mono font-bold text-sm text-sky-400/80`}>
                      {minutesToFormatted(emp.monthlyOvertime)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`font-mono font-black ${emp.totalBalance >= 0 ? 'text-sky-400 led-text-glow' : 'text-rose-500'}`}>
                      {minutesToFormatted(emp.totalBalance)}
                    </div>
                  </td>
                </tr>
              ))}
              {stats.summary.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-600 italic font-medium">Nenhum colaborador cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-950/40 text-[9px] text-slate-600 font-bold uppercase tracking-widest text-center">
          * Valores acumulados consideram todos os registros até a data selecionada no filtro.
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">Rendimento Acumulado Liang Solution</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.summary}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                />
                <Bar dataKey="totalBalance" radius={[4, 4, 0, 0]}>
                  {stats.summary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.totalBalance >= 0 ? '#10b981' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">
            Composição Operacional {stats.isFiltered ? 'no Dia' : 'Geral'}
          </h4>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {stats.statusData.map(d => (
              <div key={d.name} className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400">
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                  {d.name}
                </span>
                <span className="text-white">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
