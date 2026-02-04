
import React, { useState, useEffect } from 'react';
import Logo from './components/Logo';
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import AttendanceLog from './components/AttendanceLog';
import AIInsights from './components/AIInsights';
import DataManagement from './components/DataManagement';
import { Employee, TimeEntry, AttendanceStatus, User } from './types';
import { getCloudData } from './utils/syncService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'log' | 'ai' | 'settings'>('dashboard');
  const [cloudId, setCloudId] = useState<string | null>(() => localStorage.getItem('centralux_cloud_id'));
  const [isLoading, setIsLoading] = useState(false);
  
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('centralux_users');
    if (saved) return JSON.parse(saved);
    return [{ id: 'master', username: 'Brshrek', password: 'Jesus321*', isAdmin: true }];
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [entries, setEntries] = useState<TimeEntry[]>([]);

  // Load data logic
  useEffect(() => {
    const loadInitialData = async () => {
      const params = new URLSearchParams(window.location.search);
      const urlCloudId = params.get('id');
      const finalId = urlCloudId || cloudId;

      if (finalId) {
        setIsLoading(true);
        const cloudData = await getCloudData(finalId);
        if (cloudData) {
          setEmployees(cloudData.employees || []);
          setEntries(cloudData.entries || []);
          if (urlCloudId) {
            setCloudId(urlCloudId);
            localStorage.setItem('centralux_cloud_id', urlCloudId);
          }
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
      }

      // Local fallback
      const savedEmps = localStorage.getItem('centralux_employees');
      const savedEntries = localStorage.getItem('centralux_entries');
      if (savedEmps) {
        setEmployees(JSON.parse(savedEmps));
        setEntries(savedEntries ? JSON.parse(savedEntries) : []);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    localStorage.setItem('centralux_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('centralux_employees', JSON.stringify(employees));
    localStorage.setItem('centralux_entries', JSON.stringify(entries));
  }, [employees, entries]);

  const handleAddEmployee = (emp: Omit<Employee, 'id'>) => {
    setEmployees(prev => [...prev, { ...emp, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const handleRemoveEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  const handleAddEntry = (entry: Omit<TimeEntry, 'id'>) => {
    setEntries(prev => [...prev, { ...entry, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm("Deseja excluir este registro?")) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleImportData = (newEmployees: Employee[], newEntries: TimeEntry[]) => {
    setEmployees(newEmployees);
    setEntries(newEntries);
    setActiveTab('dashboard');
  };

  const handleAddUser = (user: Omit<User, 'id'>) => {
    setUsers(prev => [...prev, { ...user, id: Math.random().toString(36).substr(2, 9) }]);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans">
      {isLoading && (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-4"></div>
          <p className="text-sky-400 font-black uppercase tracking-widest text-xs">Sincronizando Nuvem CentraLux...</p>
        </div>
      )}

      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
            {['dashboard', 'log', 'employees', 'ai', 'settings'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-sky-500 text-white led-glow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {tab === 'dashboard' ? 'Dashboard' : tab === 'log' ? 'Ponto' : tab === 'employees' ? 'Equipe' : tab === 'ai' ? 'Insights IA' : 'Sistema'}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {cloudId && (
              <div className="hidden sm:flex bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black text-emerald-500 uppercase">Nuvem Ativa</span>
              </div>
            )}
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-sky-400">
              CL
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <Dashboard employees={employees} entries={entries} />}
        {activeTab === 'employees' && <EmployeeManagement employees={employees} onAdd={handleAddEmployee} onRemove={handleRemoveEmployee} />}
        {activeTab === 'log' && <AttendanceLog employees={employees} entries={entries} onAddEntry={handleAddEntry} onDeleteEntry={handleDeleteEntry} />}
        {activeTab === 'ai' && <AIInsights employees={employees} entries={entries} />}
        {activeTab === 'settings' && (
          <DataManagement 
            employees={employees} entries={entries} onImport={handleImportData} 
            users={users} currentUser={{ id: 'master', username: 'Admin', password: '', isAdmin: true }} onAddUser={handleAddUser}
            cloudId={cloudId} onSetCloudId={(id) => { setCloudId(id); localStorage.setItem('centralux_cloud_id', id); }}
          />
        )}
      </main>
    </div>
  );
};

export default App;
